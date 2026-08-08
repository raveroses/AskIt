"use client";

import { useEffect, useRef, useState } from "react";
import useText from "./useText";
import useGlobal from "./useGlobal";
import useChatStore from "./useChatStore";

type ChatType = {
  // userChat: string;
  isOnFocus: boolean;
  isDragging: boolean;
  document_upload: File | null;
};

type ChatTurn = {
  role: "user" | "model";
  text: string;
  audioBase64?: string;
  documentBase64?: string;
  isAudioUrl?: string | null;
  documentPdfUrl?: string;
  waveform?: number[]; // 👈 add this
};

type Chat = {
  chatId: number;
  chatTitle: string;
  perChat: ChatTurn[];
};

const useChat = () => {
  const { setInputText, inputText, setInterimTranscript } = useText();
  const { isAudioBlob, isRecordingOn, clearAudioUrl } = useGlobal();
  const { chats, setChats, currentChatId, setCurrentChatId } = useChatStore();
  const hasMountedChats = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("chatDraft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setChats(() => parsed);
          setCurrentChatId(parsed.at(-1)?.chatId ?? null);
        }
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  const [uploadingFile, setUploadingFile] = useState<ChatType>({
    isOnFocus: false,
    document_upload: null,
    isDragging: false
  });


  const [document, setDocument] = useState({ base64: "", url: "" });

  useEffect(() => {
    try {
      const documentgetter = localStorage.getItem("docs");
      if (documentgetter) {
        const parsed = JSON.parse(documentgetter);
        if (parsed && typeof parsed === "object") {
          setDocument(parsed);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onRemove = () => {
    setDocument({ base64: "", url: "" });
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
      localStorage.setItem("draft", target.value);
    }
  };
  useEffect(() => {
    const saved = localStorage.getItem("draft");

    if (saved) {
      setInputText(saved);
    }
  }, []);
  const handleIsValidation = (blob?: Blob): boolean => {
    const hasAudioBlob = blob instanceof Blob || isAudioBlob instanceof Blob;
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

  // Backend only needs the array of turns (text/audio/document per message),
  // not the whole chat object (chatId/chatTitle are frontend-only concerns).
  const aiConversation = async (perChat: ChatTurn[]) => {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: perChat,
      }),
    });

    if (!response.ok) {
      throw new Error("AI request failed");
    }

    return response.json();
  };

  // Returns the newly created chat so callers can use it immediately,
  // instead of relying on state that hasn't updated yet.
  const createNewChat = (): Chat => {
    // If the current chat exists and has no messages yet, just reuse it
    const existingEmptyChat = chats.find(
      (chat) => chat.chatId === currentChatId && chat.perChat.length === 0
    );

    if (existingEmptyChat) {
      return existingEmptyChat;
    }

    const chat: Chat = {
      chatId: Date.now(),
      chatTitle: "",
      perChat: [],
    };

    setCurrentChatId(chat.chatId);
    setChats((prev) => [...prev, chat]);

    return chat;
  };

  const handleSendMessage = async (audioBlob?: Blob, waveform?: number[]) => {
    if (!handleIsValidation(audioBlob)) {
      alert("Please input something");
      return;
    }

    const currentChat =
      chats.find((chat) => chat.chatId === currentChatId) ?? createNewChat();

    const blobToSend = audioBlob ?? isAudioBlob;
    const hasAudioBlob = blobToSend instanceof Blob;
    const audioUrls = audioBlob ? URL.createObjectURL(audioBlob) : null;

    if (!navigator.onLine) {
      alert("You're offline. Please check your internet connection.");
      return;
    }

    const userMessage: ChatTurn = {
      role: "user",
      text: inputText,
      audioBase64: hasAudioBlob ? await blobToBase64(blobToSend) : undefined,
      documentBase64: document.base64 || undefined,
      isAudioUrl: audioUrls,
      documentPdfUrl: document.url,
      waveform,
    };

    const updatedConversation = {
      ...currentChat,
      chatTitle: currentChat.chatTitle || inputText.slice(0, 20),
      perChat: [...currentChat.perChat, userMessage],
    };

    setChats((prev) =>
      prev.map((chat) =>
        chat.chatId === currentChat.chatId ? updatedConversation : chat
      )
    );

    const messageText = inputText;
    setInputText("");
    setDocument({ base64: "", url: "" });


    try {
      const data = await aiConversation(updatedConversation.perChat);

      const aiMessage: ChatTurn = { role: "model", text: data.result };

      const shouldGenerateTitle = !currentChat.chatTitle && !messageText.trim() && hasAudioBlob;


      setChats((prev) =>
        prev.map((chat) =>
          chat.chatId === currentChat.chatId
            ? {
              ...chat,
              chatTitle: shouldGenerateTitle
                ? aiMessage.text.slice(0, 20)
                : chat.chatTitle,
              perChat: [...chat.perChat, aiMessage]
            }
            : chat
        )
      );

      setInterimTranscript("");
      clearAudioUrl();
      localStorage.removeItem("draft");
    } catch (error) {
      if (error instanceof TypeError) {
        alert("Network error — please check your internet connection.");
      } else {
        alert("Something went wrong. Please try again.");
      }
      console.error("handleSendMessage failed", error);
    }
  };

  const onInputFocus = (focused: boolean) => {
    setUploadingFile((prev) => ({
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

      setDocument({
        base64: base64,
        url: dataUrl,
      });
    };

    reader.readAsDataURL(incoming);
  };

  const openFilePicker = () => inputRef.current?.click();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0] ?? null);
    e.target.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadingFile((prev) => ({
      ...prev,
      isDragging: true,
    }));
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.stopPropagation();
    setUploadingFile((prev) => ({
      ...prev,
      isDragging: false,
    }));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setUploadingFile((prev) => ({
      ...prev,
      isDragging: false,
    }));

    handleFile(e.dataTransfer.files[0]);
  };

  useEffect(() => {
    if (!hasMountedChats.current) {
      hasMountedChats.current = true;
      return;
    }
    localStorage.setItem("chatDraft", JSON.stringify(chats));
  }, [chats]);

    useEffect(() => {
    const saved = localStorage.getItem("chatDraft");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setChats(() => parsed);
          setCurrentChatId(parsed.at(-1)?.chatId ?? null);
        }
      } catch {
        // ignore corrupt data
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("draft", inputText);
  }, [inputText]);



  const checker = chats.find((chat) => chat.chatId === currentChatId)

  console.log(checker);
  console.log("W CHATS", chats);


  return {
    uploadingFile,
    chats,
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
    createNewChat,
  };
};

export default useChat;
