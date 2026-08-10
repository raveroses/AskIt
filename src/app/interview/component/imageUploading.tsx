"use client";
import {
  AudioLines,
  CircleStop,
  LayersPlus,
  Mic,
  PanelRight,
  SendHorizontal,
  // SquareStop,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import useGlobal from "../../../../zustand/useGlobal";
import { useRecorder } from "../../../../zustand/useRecorder";
import { useEffect, useRef, useState } from "react";
import useChat from "../../../../zustand/useChat";
import useText from "../../../../zustand/useText";
import AudioMessage from "./audioMessage";
import ReactMarkdown from "react-markdown";
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

import dynamic from "next/dynamic";
import useChatStore from "../../../../zustand/useChatStore";

const PdfPreview = dynamic(() => import("./PdfPreview"), {
  ssr: false,
  loading: () => <></>,
});
// import { Document, Page } from "react-pdf";

export default function ImageUploading() {
  const { audioUrl, isTranscription, isRecording } = useGlobal();
  const {
    startVoiceNote,
    stopVoiceNote,
    initSpeechRecognition,
    stopInitSpeechRecognition,
    canvasRef,
    fullTime,

  } = useRecorder();

  const {
    handleTextOnchange,
    uploadingFile,
    chats,
    onInputFocus,
    handleInputChange,
    handleDragLeave,
    handleDragOver,
    openFilePicker,
    handleDrop,
    inputRef,
    document,
    onRemove,
    handleSendMessage,
    createNewChat,
    isLoading,
  } = useChat();

  const { inputText, interimTranscript } = useText();

  const { currentChatId, setChats, setCurrentChatId } = useChatStore();


  const handleId = (id: number) => {
    if (currentChatId !== id) {
      setChats((prev) =>
        prev.filter(
          (chat) => chat.chatId !== currentChatId || chat.perChat.length > 0
        )
      );
    }
    setCurrentChatId(id)
  }

  const toggleRef = useRef<null | HTMLDivElement>(null);
  const [openTab, setOpenTab] = useState<boolean>(false);

  const handleTabOpen = () => {
    console.log("Opening my menu...");
    setOpenTab(true);
  };
  useEffect(() => {
    if (!openTab) return;

    const handleCloseTab = (event: MouseEvent) => {
      if (
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setOpenTab(false);
      }
    };

    window.addEventListener("mousedown", handleCloseTab);

    return () => {
      window.removeEventListener("mousedown", handleCloseTab);
    };
  }, [openTab]);

  console.log("toggleRef", toggleRef);

  useEffect(() => {
    console.log(openTab);
  }, [openTab]);

  console.log("chat", chats);

  const bottomRef = useRef<HTMLDivElement>(null);

  const meassagesChecker = chats.find((chat) => chat.chatId === currentChatId)?.perChat
  console.log("messagesChecker", meassagesChecker);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [meassagesChecker, isLoading]);



  return (
    <section className="w-full h-auto flex justify-between relative">
      <div className="md:block hidden">
        <motion.div
          initial={{
            x: "-200vw",
          }}
          animate={{
            x: 1,
          }}
          transition={{
            duration: 1,
          }}
          // className="chat hidden md:w-[20%] w-[40%] min-h-screen md:p-10 p-3 md:flex flex-col gap-10 bg-linear-to-br from-black to-blue-950 md:static absolute left-0 z-10 "
          className="chat fixed left-0 top-20 z-10 flex h-screen w-[40%] flex-col gap-6 overflow-y-auto bg-linear-to-br from-black to-blue-950 p-3 md:w-[20%] md:gap-8 md:p-8"

        >

          <button className="w-full rounded-lg bg-logo-color px-4 py-3 text-left font-semibold text-black transition hover:brightness-110" onClick={createNewChat}>
            + New chat
          </button>
          <h1 className="text-logo-color md:text-xl text-md font-bold">
            Chat History
          </h1>
          <ul className="history list-none overflow-hidden flex flex-col gap-2">
            {chats.map((history, index) =>
              <motion.li
                initial={{ backgroundImage: "none" }}
                whileHover={{
                  backgroundImage: "linear-gradient(to right, #000000, #4b5563)",
                }}
                transition={{ duration: 0.6 }}
                className={`cursor-pointer rounded-lg border px-3 py-3 text-sm text-white transition md:text-md ${history.chatId === currentChatId
                  ? "border-logo-color bg-white/10"
                  : "border-transparent hover:bg-white/10"
                  }`}
                key={index}
                onClick={() => handleId(history.chatId)}
              >
                {history.chatTitle || "Untitled chat"}
              </motion.li>

            )}
          </ul>
        </motion.div>
      </div>

      <div className="save flex min-h-screen w-full flex-col gap-3 bg-linear-to-br from-black to-blue-950 px-3 pb-36 pt-28 md:w-[80%] md:px-16 md:pb-36 md:pt-24 lg:px-24">
        <div
          className={`flex flex-col justify-center items-center gap-3 opacity-30 ${uploadingFile.isDragging ? "opacity-30" : "opacity-100"} ${isTranscription || isRecording ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
        >
          <h1 className="text-logo-color md:text-3xl text-2xl font-bold">
            Upload your CV to begin
          </h1>
          <h3 className="text-md  text-center font-semibold">
            Our AI will tailor interview questions based on your experience
          </h3>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={openFilePicker}
            className="flex w-full cursor-pointer flex-col items-center gap-5 rounded-2xl border border-dotted border-logo-color p-6 md:w-150 md:p-10"
          >
            <Upload />
            <input
              type="file"
              name="document_upload"
              id="document_upload"
              ref={inputRef}
              onChange={handleInputChange}
              className="hidden"
              accept=".pdf, .doc, .docx, application/pdf, application/msword, application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            />

            <h4 className="text-md font-semibold">Drag & drop your CV here</h4>
            <i className="text-sm">PDF, DOCX supported · or click to browse</i>
          </div>
        </div>
        <AnimatePresence>
          <motion.div
            initial={{
              x: "-200vw",
            }}
            animate={{
              x: 0,
            }}
            transition={{
              duration: 1,
            }}
            exit={{
              x: "-200vw",
            }}
            className="flex flex-col items-center justify-center gap-4 py-8 md:gap-8 md:py-16 lg:py-20"
          >
            <Image
              src="/images/cyber-face.png"
              width={200}
              height={200}
              priority
              alt="ai-image"
              className="rounded-full md:block hidden "
            />

            <h1 className="p-2 text-center text-xl font-bold md:px-16 md:p-5 md:text-4xl lg:px-24">
              Do you want to start your{" "}
              <span className="text-logo-color">interview Journey </span> today
              ?
            </h1>
          </motion.div>
        </AnimatePresence>

        <ul className="chatarea flex w-full flex-col gap-4 mb-8 md:mb-40">
          {currentChatId !== null && chats.find((chat) => chat.chatId === currentChatId)?.perChat.map((message, index) => (
            <li
              key={`${message.role}-${index}`}
              className={`flex w-full ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`min-w-0 max-w-[90%] overflow-hidden rounded-2xl p-2 text-white wrap-break-words md:max-w-[70%] md:p-4 ${message.role === "user"
                  ? "bg-blue-600"
                  : "bg-gray-800"
                  }`}
              >


                {message.text && message.role === "model" ? <MessageScrollerProvider autoScroll>
                  <MessageScroller><ReactMarkdown>{message.text}</ReactMarkdown></MessageScroller>
                </MessageScrollerProvider> : <ReactMarkdown>{message.text}</ReactMarkdown>}


                {message.documentPdfUrl && (
                  <div
                    className={`flex w-full max-w-56 items-center gap-2 rounded-xl p-2 transition md:w-70 md:max-w-none md:gap-3 md:p-4 ${message.role === "user"
                      ? "bg-blue-700 hover:bg-blue-600"
                      : "bg-white/10 hover:bg-white/20"
                      }`}
                    onClick={() => window.open(message.documentPdfUrl, "_blank")}
                  >
                    <div className="rounded-lg bg-amber-500 p-2 text-lg text-white md:p-3 md:text-2xl">
                      📄
                    </div>
                    <div className="flex flex-col">
                      <p className="w-28 truncate text-sm font-semibold text-white md:w-40">
                        {uploadingFile?.document_upload?.name || "document.pdf"}
                      </p>
                      <p className="text-white/50 text-xs">PDF Document</p>
                    </div>
                    <div className="ml-auto text-lg text-white/50">›</div>
                  </div>
                )}

                {message.audioBase64 && (
                  <AudioMessage
                    base64={message.audioBase64}
                    mimeType={message.audioMimeType}
                    waveform={(message as any).waveform}
                  />
                )}
              </div>

              <div ref={bottomRef}></div>
            </li>

          ))}
          {isLoading &&
            chats.find((chat) => chat.chatId === currentChatId)?.perChat.at(-1)?.role !== "model" && (
              <li className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-gray-800 px-4 py-3 text-sm text-white/80">
                  <span>Thinking</span>
                  <span className="animate-pulse">...</span>
                </div>
              </li>
            )}
        </ul>

        <div
          className={`messagesender fixed bottom-2 left-2 right-2 z-20 flex w-auto flex-col gap-2 rounded-2xl border border-white/10 bg-blue-950/95 px-3 py-3 shadow-2xl backdrop-blur md:bottom-5 md:left-[30%] md:right-auto md:w-[60%] md:px-4`}
        >
          {document.url ? (
            <PdfPreview documentUrl={document.url} onRemove={onRemove} />
          ) : (
            <textarea
              value={inputText + interimTranscript}
              disabled={isLoading}
              className="min-h-10 max-h-32 w-full resize-none overflow-y-auto border-none bg-transparent px-1 py-2 text-white outline-none placeholder:text-white/40"
              placeholder="Ask me anything ..."
              onChange={handleTextOnchange}
              onFocus={() => onInputFocus(true)}
              onBlur={() => onInputFocus(false)}
            ></textarea>
          )}



          <div className="flex justify-between gap-3 items-center">

            <div className={`upload cursor-pointer ${isTranscription || isRecording ? "opacity-50 pointer-events-none" : "cursor-pointer"}`} onClick={openFilePicker}>
              <Upload />
            </div>

            {isRecording && <div className="text-2xl ">{fullTime}</div>}

            <div className="flex items-center gap-2">
              <div className={`transcription rounded-full bg-gray-500 p-2 cursor-pointer
              ${isRecording
                  ? "opacity-50 pointer-events-none"
                  : "cursor-pointer"
                }`}
              >
                {!isTranscription ? <Mic onClick={initSpeechRecognition} /> :
                  <CircleStop onClick={stopInitSpeechRecognition} />}   </div>


              <div
                className={`recording rounded-full bg-logo-color p-2 ${isTranscription
                  ? "opacity-50 pointer-events-none"
                  : "cursor-pointer"
                  }`}
              >
                {!isRecording ? <AudioLines onClick={startVoiceNote} /> :
                  <SendHorizontal onClick={stopVoiceNote} />}
              </div>


              {!isRecording &&

                <div
                  className={`rounded-full bg-gray-500 p-2 ${isLoading
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                    }`}
                  onClick={() => {
                    if (!isLoading) {
                      void handleSendMessage();
                    }
                  }}
                >
                  <SendHorizontal />
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <div className="px-3 absolute left-0 top-30 md:hidden block" onClick={(e) => {
        e.stopPropagation();
        handleTabOpen();
      }} >
        <PanelRight />
      </div>

      <motion.div
        initial={{
          x: "-200vw",
        }}
        animate={{
          x: 1,
        }}
        transition={{
          duration: 1,
        }}
        // className="chat hidden md:w-[20%] w-[40%] min-h-screen md:p-10 p-3 md:flex flex-col gap-10 bg-linear-to-br from-black to-blue-950 md:static absolute left-0 z-10 "
        className={`chat h-screen w-[85%] max-w-sm px-4 py-10 md:hidden ${openTab ? "flex" : "hidden"} flex-col gap-5 bg-linear-to-br from-black to-blue-950 fixed left-0 top-0 z-60 overflow-y-auto shadow `}
        ref={toggleRef}

      >

        <div className="flex items-center gap-3 pt-20" onClick={createNewChat}>
          <div className="text-[11px]">
            <LayersPlus />
          </div>
          <h1 className="text-sm" >
            New Chat
          </h1>
        </div>
        <h1 className="text-logo-color text-md font-bold">
          Chat History
        </h1>
        <ul className="history list-none overflow-hidden flex flex-col gap-2">
          {chats.map((history, index) =>
            <motion.li
              initial={{ backgroundImage: "none" }}
              whileHover={{
                backgroundImage: "linear-gradient(to right, #000000, #4b5563)",
              }}
              transition={{ duration: 0.6 }}
              className={`cursor-pointer rounded-lg border px-3 py-3 text-sm text-white transition ${history.chatId === currentChatId
                ? "border-logo-color bg-white/10"
                : "border-transparent hover:bg-white/10"
                }`}
              key={index}
              onClick={() => handleId(history.chatId)}
            >
              {history.chatTitle || "Untitled chat"}
            </motion.li>

          )}
        </ul>
      </motion.div>
    </section >
  );
}






