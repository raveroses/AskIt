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
    textInput,
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
    createNewChat
  } = useChat();

  const { inputText, interimTranscript } = useText();

  const { currentChatId, setCurrentChatId } = useChatStore()


  const handleId = (id: number) => {
    setCurrentChatId(id)
  }

  const toggleRef = useRef<null | HTMLDivElement>(null)
  const [openTab, setOpenTab] = useState<boolean>(false)

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

  console.log("openTab", openTab);

  console.log("toggleRef", toggleRef)

  useEffect(() => {
    console.log(openTab);
  }, [openTab]);

  console.log("chat", chats);

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
          className="chat md:w-[20%] w-[40%] h-screen md:p-10 p-3 md:flex flex-col gap-10 bg-linear-to-br from-black to-blue-950 fixed left-0 top-20 z-10 overflow-y-auto"

        >

          <h1 className="text-white bg-amber-600 p-3 cursor-pointer" onClick={createNewChat}>New chat</h1>
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
                className="py-3  rounded shadow cursor-pointer text-white md:text-md text-sm "
                key={index}
                onClick={() => handleId(history.chatId)}
              >
                {history.chatTitle}
              </motion.li>

            )}
          </ul>
        </motion.div>
      </div>

      <div className="save md:w-[80%] w-full h-auto bg-linear-to-br from-black to-blue-950 md:pt-30 pt-50 md:px-50 px-5 flex flex-col gap-3 ">
        <div
          className={`flex flex-col justify-center items-center gap-3 opacity-30 ${textInput.isDragging ? "opacity-30" : "opacity-100"} ${isTranscription || isRecording ? "opacity-50 pointer-events-none" : "cursor-pointer"}`}
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
            className="flex flex-col gap-5 items-center border border-dotted border-logo-color rounded-2xl md:w-150 w-full p-10 cursor-pointer "
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
            className="flex flex-col justify-center items-center  gap-10 py-30"
          >
            <Image
              src="/images/cyber-face.png"
              width={200}
              height={200}
              priority
              alt="ai-image"
              className="rounded-full md:block hidden "
            />

            <h1 className="md:text-4xl text-xl  font-bold md:px-40 p-5 text-center">
              Do you want to start your{" "}
              <span className="text-logo-color">interview Journey </span> today
              ?
            </h1>
          </motion.div>
        </AnimatePresence>

        <ul className="chatarea flex flex-col gap-6 w-full mb-40">
          {currentChatId !== null && chats.find((chat) => chat.chatId === currentChatId)?.perChat.map((message, index) => (
            <li
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`md:max-w-[70%] max-w-[90%] md:p-4 p-3 rounded-2xl text-white wrap-break-words ${message.role === "user"
                  ? "bg-blue-600 text-right"
                  : "bg-gray-800 text-left"
                  }`}
              >


                {message.text && <ReactMarkdown>{message.text}</ReactMarkdown>}


                {message.documentPdfUrl && (
                  <div
                    className={`flex items-center gap-3 rounded-xl p-4 w-70 cursor-pointer transition ${message.role === "user"
                      ? "bg-blue-700 hover:bg-blue-600"
                      : "bg-white/10 hover:bg-white/20"
                      }`}
                    onClick={() => window.open(message.documentPdfUrl, "_blank")}
                  >
                    <div className="bg-amber-500 rounded-lg p-3 text-white text-2xl">
                      📄
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white font-semibold text-sm truncate w-40">
                        {textInput?.document_upload?.name || "document.pdf"}
                      </p>
                      <p className="text-white/50 text-xs">PDF Document</p>
                    </div>
                    <div className="ml-auto text-white/50 text-lg">›</div>
                  </div>
                )}

                {message.audioBase64 && (
                  <AudioMessage base64={message.audioBase64} waveform={(message as any).waveform} />
                )}
              </div>
            </li>
          ))}
        </ul>

        <div
          className={`messagesender bg-blue-950 rounded-xl py-3 md:w-[60%] w-full md:h-auto
         flex gap-0 flex-col fixed md:bottom-5 bottom-2 md:left-[30%] left-0 right-0 px-3  `}
        >
          {document.url ? (
            <PdfPreview documentUrl={document.url} onRemove={onRemove} />
          ) : (
            <textarea
              value={inputText + interimTranscript}
              className="border-none outline-none resize-none w-full h-auto "
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
                <div className="rounded-full bg-gray-500 p-2 cursor-pointer">
                  <SendHorizontal onClick={() => handleSendMessage()} />
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
        className={`chat w-[40%] h-screen px-3 py-10 md:hidden ${openTab ? "flex" : "hidden"} flex-col gap-5 bg-linear-to-br from-black to-blue-950 fixed left-0 top-0 z-60 overflow-y-auto shadow `}
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
              className="py-1 rounded shadow cursor-pointer text-white text-sm "
              key={index}
              onClick={() => handleId(history.chatId)}
            >
              {history.chatTitle}
            </motion.li>

          )}
        </ul>
      </motion.div>
    </section >
  );
}

