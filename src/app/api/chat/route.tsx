import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const { messages = [] } = await request.json();

    console.log("MESSAGES:", messages);
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "Missing GEMINI_API_KEY" },
        { status: 500 },
      );
    }

    const contents = messages.flatMap((msg) => {
      const parts: any[] = [];

      if (msg.text) {
        parts.push({ text: msg.text });
      }

      if (msg.documentBase64) {
        parts.push({
          inlineData: {
            mimeType: "application/pdf",
            data: msg.documentBase64,
          },
        });
      }

      if (msg.audioBase64) {
        parts.push({
          text: "The attached audio is the user speaking. Please respond to the content of the audio, not just describe the recording.",
        });
        parts.push({
          inlineData: {
            mimeType: "audio/webm",
            data: msg.audioBase64,
          },
        });
      }

      return [
        {
          role: msg.role,
          parts,
        },
      ];
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents,
    });

    return Response.json({
      result: response.text,
    });
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    );
  }
}
