import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

async function testTTS() {
  console.log("Testing Google Cloud TTS with GEMINI_API_KEY...");
  
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`;
  
  const body = {
    input: { text: "Hello, this is a test." },
    voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
    audioConfig: { audioEncoding: "MP3" }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log("✅ API Success! Received audio content.");
      console.log("Base64 preview:", data.audioContent.substring(0, 50) + "...");
    } else {
      console.error("❌ API Error:", data.error?.message || "Unknown error");
      if (data.error?.status === "PERMISSION_DENIED") {
        console.log("Tip: The API key is valid but 'Cloud Text-to-Speech API' might not be enabled in the Google Cloud Console.");
      }
    }
  } catch (error) {
    console.error("❌ Fetch Error:", error);
  }
}

testTTS();
