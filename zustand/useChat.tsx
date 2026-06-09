"use client";

import { useRef, useState } from "react";
import useText from "./useText";

type ChatType = {
  userChat: string;
  // isOnFocus: boolean;
  isDragging: boolean;
  document_upload: File | null;
};
type Message = {
  role: "user" | "model";
  text: string;
};

const useChat = () => {
  const { setInputText, inputText } = useText();
  const [textInput, setTextInput] = useState<ChatType>(() => {
    try {
      const saved = localStorage.getItem("draft");
      if (saved) return JSON.parse(saved);
    } catch {
      console.log("error");
    }
    return {
      // userChat: "",
      // isOnFocus: false,
      document_upload: null,
      isDragging: false,
    };
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "user",
      text: `
      You are a professional interviewer.
      Read my CV and conduct an interview.
      Ask one question at a time.
    `,
    },
  ]);
  const [documentBase64, setDocumentBase64] = useState("");

  const [documentUrl, setDocumentUrl] = useState("");

  const onRemove = () => {
    setDocumentBase64("");
    setDocumentUrl("");
  };

  const inputRef = useRef<HTMLInputElement>(null);

  const handleTextOnchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;

    target.style.height = "0px";
    const height = Math.min(target.scrollHeight, 250);
    target.style.height = `${height}px`;
    setInputText(target.value);

    if (typeof window !== "undefined") {
      // ✅ SSR safe
      localStorage.setItem("draft", target.value);
    }
  };

  const handleIsValidation = (): boolean => {
    return !!inputText.trim();
  };

  const aiConversation = async (updatedMessages: Message[]) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages,
        documentBase64,
      }),
    });

    if (!response.ok) {
      console.error("AI request failed", response.status, response.statusText);
      return;
    }

    const data = await response.json();

    setMessages((prev) => [
      ...prev,
      {
        role: "model",
        text: data.result || "",
      },
    ]);
  };
  console.log(messages);

  const handleSendMessage = async () => {
    if (!handleIsValidation()) {
      alert("Please input something");
      return;
    }

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        text: inputText,
      },
    ];

    setMessages(updatedMessages);

    await aiConversation(updatedMessages);

    setInputText("");
    localStorage.removeItem("draft");
  };
  const onInputFocus = (focused: boolean) => {
    setTextInput((prev) => ({
      ...prev,
      isOnFocus: focused,
    }));
  };

  const handleFile = (incoming: File | null) => {
    if (!incoming) return;

    const docType = incoming.type;

    if (docType !== "application/pdf") {
      alert("only PDF is allowed");
      return;
    }
    const reader = new FileReader();

    reader.onload = function (event) {
      const result = event.target?.result;

      if (typeof result !== "string") return;
      const base64 = result.split(",")[1];
      const dataUrl = result;

      setDocumentBase64(base64);
      setDocumentUrl(dataUrl);
    };

    reader.readAsDataURL(incoming);
  };

  const openFilePicker = () => inputRef.current.click();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
    e.target.value = "";
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
  return {
    textInput,
    messages,
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
    onRemove,
    handleSendMessage,
  };
};

export default useChat;
