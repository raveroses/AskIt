"use client";
import { useRef, useState } from "react";
type ChatType = {
  userChat: string;
  isOnFocus: boolean;
  isDragging: boolean;
  document_upload: File | null;
};
const useChat = () => {
  const [textInput, setTextInput] = useState<ChatType>({
    userChat: "",
    isOnFocus: false,
    document_upload: null,
    isDragging: false,
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const handleTextOnchange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const target = e.target;
    target.style.height = "auto";
    target.style.height = target.scrollHeight > 200 ? "250px" : "auto";

    setTextInput((prev) => ({ ...prev, [target.name]: target.value }));
  };

  const onInputFocus = (focused: boolean) => {
    setTextInput((prev) => ({
      ...prev,
      isOnFocus: focused,
    }));
  };

  // const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  const handleFile = (incoming: File | null) => {
    if (!incoming) return;

    setTextInput((prev) => ({
      ...prev,
      document_upload: incoming,
    }));
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
    
  };
};

export default useChat;
