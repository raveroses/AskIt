"use client";
import {
  AudioLines,
  CircleStop,
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

import dynamic from "next/dynamic";

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
    secondCanvasRef,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    playBack,
  } = useRecorder();

  const {
    handleTextOnchange,
    textInput,
    messages,
    onInputFocus,
    handleInputChange,
    handleDragLeave,
    handleDragOver,
    openFilePicker,
    handleDrop,
    inputRef,
    documentUrl,
    onRemove,
    handleSendMessage,
  } = useChat();

  const { inputText, interimTranscript } = useText();

  useEffect(() => {
    if (audioUrl && duration > 0) {
      playBack();
    }
  }, [audioUrl, currentTime, duration, playBack]);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <section className="w-full h-auto flex md:justify-between">
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
        className="chat hidden md:w-[20%] w-[40%] h-screen md:p-10 p-3 md:flex flex-col gap-10 bg-linear-to-br from-black to-blue-950 md:static absolute left-0 z-10 "
      >
        <h1 className="text-logo-color md:text-xl text-md font-bold">
          Chat History
        </h1>

        <ul className="history list-none overflow-hidden flex flex-col gap-2">
          <motion.li
            initial={{ backgroundImage: "none" }}
            whileHover={{
              backgroundImage: "linear-gradient(to right, #000000, #4b5563)",
            }}
            transition={{ duration: 0.6 }}
            className="py-3  rounded shadow cursor-pointer text-white md:text-md text-sm "
          >
            Arisegadget
          </motion.li>
          <motion.li
            initial={{ backgroundImage: "none" }}
            whileHover={{
              backgroundImage: "linear-gradient(to right, #000000, #4b5563)",
            }}
            transition={{ duration: 0.6 }}
            className="py-3  rounded shadow cursor-pointer text-white"
          >
            Arisegadget
          </motion.li>
          <motion.li
            initial={{ backgroundImage: "none" }}
            whileHover={{
              backgroundImage: "linear-gradient(to right, #000000, #4b5563)",
            }}
            transition={{ duration: 0.6 }}
            className="py-3  rounded shadow cursor-pointer text-white"
          >
            Arisegadget
          </motion.li>
        </ul>
      </motion.div>
      <div className="px-3 hidden">
        <PanelRight />
      </div>
      <div className="save md:w-[80%] w-full h-auto bg-linear-to-br from-black to-blue-950 py-20 md:px-50 px-5 flex flex-col gap-3 relative">
        <div
          className={`flex flex-col justify-center items-center gap-3 opacity-30 ${textInput.isDragging ? "opacity-30" : "opacity-100"}`}
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
            className="flex flex-col gap-5 items-center border border-dotted border-logo-color rounded-2xl w-150 p-10 cursor-pointer "
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

        <ul className="chatarea flex flex-col gap-6 w-full">
          {messages.map((message, index) => (
            <li
              key={`${message.role}-${index}`}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] p-4 rounded-2xl text-white break-words ${
                  message.role === "user"
                    ? "bg-blue-600 text-right"
                    : "bg-gray-800 text-left"
                }`}
              >
                {message.text}
              </div>
            </li>
          ))}

          {textInput?.document_upload?.name && (
            <li>
              <div
                className="flex items-center gap-3 bg-white/10 rounded-xl p-4 w-70 cursor-pointer hover:bg-white/20 transition"
                onClick={() => window.open(documentUrl, "_blank")}
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

                {/* Arrow */}
                <div className="ml-auto text-white/50 text-lg">›</div>
              </div>
            </li>
          )}
        </ul>

        <div
          className={`messagesender bg-blue-950 rounded-xl py-3 md:w-[60%] w-full md:h-auto
         flex  gap-0 fixed md:bottom-5 bottom-2 md:left-[30%] left-0 right-0 px-3  ${inputText ? "justify-between items-center" : "flex-col"}`}
        >
          {documentUrl ? (
            <PdfPreview documentUrl={documentUrl} onRemove={onRemove} />
          ) : (
            <textarea
              // value={inputText}
              value={inputText + interimTranscript}
              className="border-none outline-none resize-none w-full h-auto "
              placeholder="Ask me anything ..."
              onChange={handleTextOnchange}
              onFocus={() => onInputFocus(true)}
              onBlur={() => onInputFocus(false)}
            ></textarea>
          )}

          <div className={`${inputText ? "hidden" : "block"}`}>
            <canvas
              ref={canvasRef}
              width={800}
              height={40}
              className={`w-full rounded-lg  ${isRecording || isTranscription ? "block" : "hidden"}`}
            />

            <div className="flex justify-between gap-3 items-center">
              {!isRecording && (
                <div className="upload cursor-pointer" onClick={openFilePicker}>
                  <Upload />
                </div>
              )}
              {isRecording && <div className="text-2xl ">{fullTime}</div>}

              <div className="flex items-center gap-2">
                {!isRecording && (
                  <>
                    {!isTranscription ? (
                      <div
                        className="record-text rounded-full bg-gray-500 p-2 cursor-pointer"
                        onClick={initSpeechRecognition}
                      >
                        <Mic />
                      </div>
                    ) : (
                      <div
                        className="record-text rounded-full bg-gray-500 p-2 cursor-pointer"
                        onClick={stopInitSpeechRecognition}
                      >
                        <CircleStop />
                      </div>
                    )}
                  </>
                )}

                {!isRecording ? (
                  <div className="record rounded-full bg-logo-color p-2 cursor-pointer">
                    <AudioLines onClick={startVoiceNote} />
                  </div>
                ) : (
                  <div className="record rounded-full bg-gray-500 p-2 cursor-pointer">
                    <SendHorizontal onClick={stopVoiceNote} />
                  </div>
                )}
                {!isRecording && (
                  <div className="rounded-full bg-gray-500 p-2 cursor-pointer">
                    <SendHorizontal />
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className={`rounded-full bg-gray-500 p-2 cursor-pointer ${inputText || interimTranscript ? "block" : "hidden"}`}
            onClick={handleSendMessage}
          >
            <SendHorizontal />
          </div>
        </div>
      </div>
    </section>
  );
}
