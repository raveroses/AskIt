import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import useChat from "../../zustand/useChat";

const apiKeyStorage = process.env.API_KEY;
//inputText is the input text
console.log("apikey", apiKeyStorage);

const ai = new GoogleGenAI({ apiKey: apiKeyStorage });
export function POST() {
  const {textInput} = useChat();

  const aiConversation = async () => {
    const contents = [
      { text: "Ask me question based on my uploaded CV" },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: Buffer.from(
            fs.readFileSync(`${textInput.document_upload}`),
          ).toString("base64"),
        },
      },
    ];

    // const interaction = await ai.interactions.create({
    //   model: "gemini-3-flash-preview",
    //   input: [
    //     { type: "user_input", content: [{ type: "text", text: "Hello" }] },
    //     {
    //       type: "model_output",
    //       content: [
    //         { type: "text", text: "Hi there! How can I help you today?" },
    //       ],
    //     },
    //     {
    //       type: "user_input",
    //       content: [{ type: "text", text: "What is the capital of France?" }],
    //     },
    //   ],
    // });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
    });
    console.log(response.text);
  };
}
