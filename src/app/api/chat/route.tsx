import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  const { messages = [], documentBase64 } = await request.json();

  console.log("message", messages, "document", Boolean(documentBase64));

  const contents = [
    ...(documentBase64
      ? [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: "application/pdf",
                  data: documentBase64,
                },
              },
            ],
          },
        ]
      : []),
    ...messages.map((msg: any) => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
  ];

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents,
  });

  return Response.json({
    result: response.text,
  });
}
