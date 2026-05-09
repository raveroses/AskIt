"use client";
import { useRef, useState } from "react";
type ChatType = {
  userChat: string;
  isOnFocus: boolean;
  isDragging: boolean;
  document_upload: File | null;
};
const useChat = () => {
  const [textInput, setTextInput] = useState<ChatType>(() => {
    try {
      const saved = localStorage.getItem("draft");
      if (saved) return JSON.parse(saved);
    } catch {
      console.log("error");
    }
    return {
      userChat: "",
      isOnFocus: false,
      document_upload: null,
      isDragging: false,
    };
  });

  const [documentUrl, setDocumentUrl] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const handleTextOnchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = target.scrollHeight > 200 ? "250px" : "auto";

    setTextInput((prev) => ({ ...prev, [target.name]: target.value }));
  };

  // {
  //   userChat: "",
  //   isOnFocus: false,
  //   document_upload: null,
  //   isDragging: false,
  // }

  const onInputFocus = (focused: boolean) => {
    setTextInput((prev) => ({
      ...prev,
      isOnFocus: focused,
    }));
  };

  const handleFile = (incoming: File | null) => {
    if (!incoming) return;

    setTextInput((prev) => ({
      ...prev,
      document_upload: incoming,
    }));

    const urlExtraction = URL.createObjectURL(incoming);
    setDocumentUrl(urlExtraction);
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
