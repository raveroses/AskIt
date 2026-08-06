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

  // const [textInput, setTextInput] = useState<ChatType>(() => {
  //   try {
  //     const saved = localStorage.getItem("draft");
  //     if (saved) return JSON.parse(saved);
  //   } catch {
  //     console.log("error");
  //   }
  //   return {
  //     isOnFocus: false,
  //     document_upload: null,
  //     isDragging: false,
  //   };
  // });

  const [textInput, setTextInput] = useState<ChatType>({
    isOnFocus: false,
    document_upload: null,
    isDragging: false
  });

  useEffect(() => {
    const saved = localStorage.getItem("draft");

    if (saved) {
      setTextInput(JSON.parse(saved));
    }
  }, []);
  const [document, setDocument] = useState(() => {
    try {
      const documentgetter = localStorage.getItem("docs");
      if (!documentgetter) {
        return { base64: "", url: "" };
      }
      const parsed = JSON.parse(documentgetter);
      return parsed && typeof parsed === "object"
        ? parsed
        : { base64: "", url: "" };
    } catch (error) {
      console.log(error);
      return { base64: "", url: "" };
    }
  });

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
        chat.chatId === currentChat.chatId ? updatedConversation : chat // ✅ use currentChat.chatId, not the stale currentChatId
      )
    );

    try {
      const data = await aiConversation(updatedConversation.perChat);

      const aiMessage: ChatTurn = { role: "model", text: data.result };

      // const checkAudioIfComesBeforeTitle = userMessage.audioBase64 && !updatedConversation.chatTitle
      const shouldGenerateTitle = !currentChat.chatTitle && !inputText.trim() && hasAudioBlob;


      setChats((prev) =>
        prev.map((chat) =>
          chat.chatId === currentChat.chatId // ✅ same fix here
            ? {
              ...chat,
              // chatTitle: checkAudioIfComesBeforeTitle ? aiMessage.text.slice(0, 20) : "",
              chatTitle: shouldGenerateTitle
                ? aiMessage.text.slice(0, 20)
                : chat.chatTitle,
              perChat: [...chat.perChat, aiMessage]
            }
            : chat
        )
      );

      setInputText("");
      setInterimTranscript("");
      setDocument({ url: "" });
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
    setTextInput((prev) => ({
      ...prev,
      isDragging: true,
    }));
  };

  const handleDragLeave = (e: React.DragEvent) => {
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

  useEffect(() => {
    localStorage.setItem("chatDraft", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    localStorage.setItem("draft", inputText);
  }, [inputText]);



  const checker = chats.find((chat) => chat.chatId === currentChatId)

  console.log(checker);
  console.log("W CHATS", chats);


  return {
    textInput,
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
