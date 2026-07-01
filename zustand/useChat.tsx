"use client";

import { useEffect, useRef, useState } from "react";
import useText from "./useText";
import useGlobal from "./useGlobal";

type ChatType = {
  userChat: string;
  // isOnFocus: boolean;
  isDragging: boolean;
  document_upload: File | null;
};
type Message = {
  role: "user" | "model";
  text: string;
  audioBase64?: string;
  documentBase64?: string;

  isAudioUrl?: string;
  documentPdfUrl?: string;
};
const useChat = () => {
  const { setInputText, inputText, setInterimTranscript } = useText();
  const { isAudioBlob, isRecordingOn, audioUrl, clearAudioUrl } = useGlobal();

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
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const getMessage = localStorage.getItem("chatDraft");
      if (!getMessage) {
        return [];
      }

      const parsed = JSON.parse(getMessage);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.log(e.message);
      return [];
    }
  });

  const [document, setDocument] = useState(() => {
    try {
      const documentgetter = localStorage.getItem("docs");
      if (!documentgetter) {
        return {
          base64: "",
          url: "",
        };
      }

      const parsed = JSON.parse(documentgetter);
      return parsed && typeof parsed === "object"
        ? parsed
        : {
            base64: "",
            url: "",
          };
    } catch (error) {
      console.log(error.message);
      return {
        base64: "",
        url: "",
      };
    }
  });

  const onRemove = () => {
    setDocument({
      base64: "",
      url: "",
    });

    localStorage.removeItem("docs");
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

  const handleIsValidation = (blob?: Blob): boolean => {
    const hasAudioBlob = blob instanceof Blob || isAudioBlob instanceof Blob;
    console.log(
      "isEithertrue",
      !!inputText.trim() || !!document.url || !!isRecordingOn || hasAudioBlob,
    );

    return (
      !!inputText.trim() || !!document.url || !!isRecordingOn || hasAudioBlob
    );
  };

  const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        const result = reader.result as string;

        resolve(result.split(",")[1]);
      };

      reader.onerror = reject;

      reader.readAsDataURL(blob);
    });
  };

  const aiConversation = async (updatedMessages: Message[]) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: updatedMessages,
      }),
    });

    if (!response.ok) {
      throw new Error("AI request failed");
    }

    return response.json();
  };

  const handleSendMessage = async (audioBlob?: Blob) => {
    if (!handleIsValidation(audioBlob)) {
      alert("Please input something");
      return;
    }

    const blobToSend = audioBlob ?? isAudioBlob;
    const hasAudioBlob = blobToSend instanceof Blob;
    const audioUrls = audioBlob ? URL.createObjectURL(audioBlob) : null;
    console.log("audioUrlsss", audioUrls);

    const updatedMessages: Message[] = [
      ...messages,
      {
        role: "user",
        text: inputText.trim(),
        audioBase64: hasAudioBlob ? await blobToBase64(blobToSend) : undefined,
        documentBase64: document.base64 || undefined,

        isAudioUrl: audioUrls,
        documentPdfUrl: document.url,
      },
    ];

    console.log(
      JSON.stringify(updatedMessages[updatedMessages.length - 1], null, 2),
    );

    setMessages(updatedMessages);

    try {
      const data = await aiConversation(updatedMessages);

      const finalMessages = [
        ...updatedMessages,
        {
          role: "model" as const,
          text: data.result,
        },
      ];

      setMessages(finalMessages);
      setInputText("");
      setInterimTranscript("");
      setDocument({
        url: "",
      });
      clearAudioUrl();
      localStorage.removeItem("draft");
      localStorage.setItem("chatDraft", JSON.stringify(finalMessages));
    } catch (error) {
      console.error("handleSendMessage failed", error);
    }
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
      console.log(base64);

      setDocument({
        base64: base64,
        url: dataUrl,
      });
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

  console.log("Document", document);
  console.log("message", messages);
  console.log("audiourl", audioUrl);

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
    document,
    onRemove,
    handleSendMessage,
  };
};

export default useChat;
