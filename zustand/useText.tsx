"use client";

import { create } from "zustand";
type InputUpdater = string | ((prev: string) => string);

type Store = {
  inputText: string;
  interimTranscript: string;
  setInputText: (value: InputUpdater) => void;
  setInterimTranscript: (value: string) => void;
};

const useText = create<Store>((set) => ({
  inputText: "",
  interimTranscript: "",
  setInputText: (value) =>
    set((state) => ({
      inputText:
        typeof value === "function"
          ? (value as (prev: string) => string)(state.inputText)
          : value,
    })),

  setInterimTranscript: (value) => {
    set({
      interimTranscript: value,
    });
  },
}));




// export default useText;
// import { GoogleGenAI } from "@google/genai";
// import * as fs from "node:fs";

// const ai = new GoogleGenAI({});

// async function main() {
//     const pdfData = fs.readFileSync("path/to/document.pdf", {
//         encoding: "base64"
//     });

//     const interaction = await ai.interactions.create({
//         model: "gemini-3.5-flash",
//         input: [
//             { type: "text", text: "Summarize this document" },
//             {
//                 type: "document",
//                 data: pdfData,
//                 mime_type: "application/pdf"
//             }
//         ]
//     });
//     console.log(interaction.output_text);
// }

// main();


// import {GoogleGenAI} from '@google/genai';

// const ai = new GoogleGenAI({});
// const interaction = await ai.interactions.create({
//     model: 'gemini-3-flash-preview',
//     input: [
//         { type: 'user_input', content: [{ type: 'text', text: 'Hello' }] },
//         { type: 'model_output', content: [{ type: 'text', text: 'Hi there! How can I help you today?' }] },
//         { type: 'user_input', content: [{ type: 'text', text: 'What is the capital of France?' }] }
//     ]
// });
// console.log(interaction.output_text);


// const messages = [
//   {
//     role: "user",
//     parts: [{ text: "Here is my CV" }],
//   },
//   {
//     role: "model",
//     parts: [{ text: "I analyzed your CV..." }],
//   },
//   {
//     role: "user",
//     parts: [{ text: "Ask me React interview questions" }],
//   },
// ];