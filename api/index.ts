import express from "express";
import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

let groqClient: Groq | null = null;
const getGroq = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is missing");
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/chat", async (req, res) => {
  const { messages, model: requestedModel = "meta-llama/llama-4-scout-17b-16e-instruct" } = req.body;

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    const apiKey = process.env.HUGGINGFACE_API_KEY;
    const model = requestedModel;

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
  } catch (error: any) {
    console.error("AI API Error:", error);
    const errorMsg = error?.message || "AI processing failed";
    if (!res.headersSent) {
      res.status(500).json({ error: errorMsg });
    } else {
      res.write(`data: ${JSON.stringify({ error: errorMsg })}\n\n`);
      res.end();
    }
  }
});

export default app;
