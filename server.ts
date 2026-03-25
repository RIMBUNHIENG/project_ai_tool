// Triggering reload
import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let groqClient: Groq | null = null;
const getGroq = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is missing");
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/chat", async (req, res) => {
    const { messages, model: requestedModel = "meta-llama/llama-4-scout-17b-16e-instruct", language = "en" } = req.body;

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    try {
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      const model = requestedModel; // Use the specified model

      if (!apiKey) {
        // Fallback to Groq if HF key is missing
        const groq = getGroq();
        const completion = await groq.chat.completions.create({
          messages,
          model: requestedModel,
          stream: true,
        });

        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content || "";
          if (content) {
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }
      } else {
        // Hugging Face OpenAI-compatible API
        const response = await fetch(
          `https://router.huggingface.co/v1/chat/completions`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model,
              messages,
              stream: true,
              max_tokens: 2048
            })
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Hugging Face API error: ${errorText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (reader) {
          let buffer = "";
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.trim() === "") continue;
              if (line.startsWith('data: ')) {
                const dataStr = line.slice(6).trim();
                if (dataStr === '[DONE]') break;

                try {
                  const data = JSON.parse(dataStr);
                  const content = data.choices?.[0]?.delta?.content || "";
                  if (content) {
                    res.write(`data: ${JSON.stringify({ content })}\n\n`);
                  }
                } catch (e) {
                  // Ignore parse errors
                }
              }
            }
          }
        }
      }
      res.write("data: [DONE]\n\n");
      res.end();
    } catch (error) {
      console.error("AI API Error:", error);
      const errorMsg = error instanceof Error ? error.message : "AI processing failed";
      if (!res.headersSent) {
        res.status(500).json({ error: errorMsg });
      } else {
        res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
        res.end();
      }
    }
  });

  app.post("/api/tts", async (req, res) => {
    const { text, language = "en" } = req.body;
    if (!text) return res.status(400).json({ error: "Text is required" });

    console.log(`TTS Request: "${text.substring(0, 30)}..." lang=${language}`);

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      const langCode = language === "km" ? "km-KH" : "en-US";
      
      // Attempt Official Google Cloud TTS first
      const officialUrl = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;
      const officialBody = {
        input: { text },
        voice: { languageCode: langCode, ssmlGender: "NEUTRAL" },
        audioConfig: { audioEncoding: "MP3" }
      };

      try {
        const response = await fetch(officialUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(officialBody)
        });

        if (response.ok) {
          const data = await response.json();
          console.log("TTS Official Success");
          return res.json({ audioContent: data.audioContent });
        } else {
          const errData = await response.json();
          console.warn("TTS Official Failed:", errData.error?.message || response.statusText);
        }
      } catch (officialErr) {
        console.warn("TTS Official Fetch Error:", officialErr);
      }

      // Fallback to reliable Google Translate TTS engine (returns binary)
      console.log("TTS Error, falling back to Google Translate engine...");
      
      // Google Translate TTS has a limit of ~200 characters per request
      const safeText = text.substring(0, 200);
      const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(safeText)}&tl=${language === "km" ? "km" : "en"}&client=tw-ob`;
      
      const fallbackResponse = await fetch(fallbackUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
      });

      if (!fallbackResponse.ok) {
        throw new Error(`TTS fallback failed with status ${fallbackResponse.status}`);
      }

      const buffer = await fallbackResponse.arrayBuffer();
      const base64 = Buffer.from(buffer).toString("base64");
      console.log("TTS Fallback Success, base64 length:", base64.length);
      res.json({ audioContent: base64 });

    } catch (error) {
      console.error("TTS Endpoint Error:", error);
      res.status(500).json({ error: "Speech synthesis failed" });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
