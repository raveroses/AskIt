"use client";

import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";
import { useRef, useState } from "react";
import useText from "./useText";

// const apiKeyStorage = process.env.API_KEY;

// const ai = new GoogleGenAI({ apiKey: apiKeyStorage });
// //inputText is the input text
// console.log("apikey", apiKeyStorage);
type ChatType = {
  userChat: string;
  isOnFocus: boolean;
  isDragging: boolean;
  document_upload: File | null;
};

const useChat = () => {
  const { setInputText } = useText();
  const [textInput, setTextInput] = useState<ChatType>(() => {
    try {
      const saved = localStorage.getItem("inputdraft");
      if (saved) return JSON.parse(saved);
    } catch {
      console.log("error");
    }
    return {
      // userChat: "",
      isOnFocus: false,
      document_upload: null,
      isDragging: false,
    };
  });

  const  [documentBase64,setDocumentBase64]=useState("")

  const [documentUrl, setDocumentUrl] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const handleTextOnchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "0px";

    const height = Math.min(target.scrollHeight, 250);

    target.style.height = `${height}px`;

    setInputText(target.value);
    localStorage.setItem("draft", target.value);
  };

  const onInputFocus = (focused: boolean) => {
    setTextInput((prev) => ({
      ...prev,
      isOnFocus: focused,
    }));
  };

  const handleFile = (incoming: File | null) => {
    if (!incoming) return;

    const reader = new FileReader();

    reader.onload = function (event) {
      const result = event.target?.result;

      if (typeof result !== "string") return; // ✅ narrows type, handles null/ArrayBuffer

    const base64 = result.split(",")[1];  // for Gemini API
    const dataUrl = result;               // for UI preview (full string)

    setDocumentBase64(base64);  // send this to Gemini
    setDocumentUrl(dataUrl);   
    };

    reader.readAsDataURL(incoming);
  };

  const openFilePicker = () => inputRef.current.click();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files[0]);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTextInput((prev) => ({
      ...prev,
      isDragging: true,
    }));
  };
  const handleDragLeave = (e) => {
    e.stopPropagation();
    setTextInput((prev) => ({
      ...prev,
      isDragging: false,
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setTextInput((prev) => ({
      ...prev,
      isDragging: false,
    }));

    handleFile(e.dataTransfer.files[0]);
  };

  // const aiConversation = async () => {
  //   const contents = [
  //     { text: "Ask me question based on my uploaded CV" },
  //     {
  //       inlineData: {
  //         mimeType: "application/pdf",
  //         data: Buffer.from(
  //           fs.readFileSync(`${textInput.document_upload}`),
  //         ).toString("base64"),
  //       },
  //     },
  //   ];

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

  //   const response = await ai.models.generateContent({
  //     model: "gemini-3.5-flash",
  //     contents: contents,
  //   });
  //   console.log(response.text);
  // };

  return {
    textInput,
    handleTextOnchange,
    onInputFocus,
    handleFile,
    handleDragLeave,
    handleDragOver,
    openFilePicker,
    handleDrop,
    inputRef,
    handleInputChange,
    documentUrl,
  };
};

export default useChat;
