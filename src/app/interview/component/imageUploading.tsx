"use client";
import {
  AudioLines,
  CircleStop,
  Mic,
  PanelRight,
  SendHorizontal,
  SquareStop,
  Upload,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import useGlobal from "../../../../zustand/useSecondGlobal";
import { useRecorder } from "../../../../zustand/useRecorder";
import { useRef, useState } from "react";
import useIsMobile from "../../../../hooks/useIsMobile";

export default function ImageUploading() {
  const { audioUrl, transcription, isTranscription, isRecording } = useGlobal();
  const {
    startVoiceNote,
    stopVoiceNote,
    initSpeechRecognition,
    stopInitSpeechRecognition,
    canvasRef,
    fullTime,
  } = useRecorder();

  const { isMobile } = useIsMobile();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

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
        <div className="w-90 flex items-center gap-5 justify-center md:text-md text-sm text-center bg-linear-to-r from-black to-blue-950 py-3 rounded-3xl mx-auto">
          <div>Choose your interview mode</div>
          <select
            // value={interviewMode}
            // onChange={onInterviewMode}
            className="cursor-pointer border-none outline-none"
          >
            <option className="border-none outline-none cursor-pointer bg-transparent">
              🎤 Audio
            </option>
            <option className="border-none outline-none cursor-pointer">
              💬 Text
            </option>
          </select>
        </div>

        <div className="flex flex-col justify-center items-center gap-3 ">
          <h1 className="text-logo-color md:text-3xl text-2xl font-bold">
            Upload your CV to begin
          </h1>
          <h3 className="text-md  text-center font-semibold">
            Our AI will tailor interview questions based on your experience
          </h3>

          <div className="flex flex-col gap-5 items-center border border-dotted border-logo-color rounded-2xl w-150 p-10 cursor-pointer ">
            <Upload />
            <input type="file" name="" id="" />
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
              className="rounded-full"
            />

            <h1 className="md:text-4xl text-xl  font-bold md:px-40 p-5 text-center">
              Do you want to start your{" "}
              <span className="text-logo-color">interview Journey </span> today
              ?
            </h1>
          </motion.div>
        </AnimatePresence>

        <ul className="chatarea flex flex-col gap-10 w-full">
          {/* User Message (right) */}
          <li
            className={` flex justify-end items-end ml-auto ${audioUrl ? " bg-[#1e2d45] px-4 py-2 rounded-2xl md:max-w-[40%] " : " w-full md:max-w-[70%] max-w-full bg-blue-600 text-white p-3 rounded-lg"} `}
          >
            {audioUrl ? (
              <span className="flex items-center">
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={() =>
                    setCurrentTime(audioRef.current?.currentTime || 0)
                  }
                  onLoadedMetadata={() =>
                    setDuration(audioRef.current?.duration || 0)
                  }
                  onEnded={() => setIsPlaying(false)}
                />
                <button
                  onClick={togglePlay}
                  className="text-amber-400 shrink-0"
                >
                  {isPlaying ? (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <rect x="6" y="4" width="4" height="16" rx="1" />
                      <rect x="14" y="4" width="4" height="16" rx="1" />
                    </svg>
                  ) : (
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                </button>
                <canvas
                  ref={canvasRef}
                  width={isMobile ? 450 : 320}
                  height={40}
                  className="w-full h-10 block rounded"
                />
                <span className="text-xs text-slate-400 shrink-0 font-mono">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </span>
            ) : (
              <span>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Repudiandae accusamus illo maiores sunt non expedita cum nemo
                praesentium iusto obcaecati numquam natus, corporis iste
                voluptate sapiente, velit tempore at eius.
              </span>
            )}

            {/* </div> */}
          </li>

          <li className="flex w-full justify-start items-start gap-3 md:max-w-[70%] max-w-full">
            {/* <div className="flex items-start gap-3 md:max-w-[70%] max-w-full"> */}
            <Image
              alt="ai-image"
              src="/images/cyber-face.png"
              width={40}
              height={40}
              priority
              className="rounded-full md:block hidden"
            />

            <span className="bg-gray-800 text-white p-3 rounded-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. At sint
              voluptatem provident reprehenderit quis voluptatum expedita
              recusandae repudiandae doloremque laborum libero minus est
              suscipit nesciunt alias ullam, ipsum sequi quas.
            </span>
            {/* </div> */}
          </li>
        </ul>

        <div
          className="messagesender bg-blue-950 rounded-xl py-3 md:w-[60%] w-full md:h-auto
         flex flex-col gap-0 fixed md:bottom-5 bottom-2 md:left-[30%] left-0 right-0 px-3  "
        >
          <textarea
            value={transcription}
            className="border-none outline-none resize-none w-full h-auto "
            placeholder="Ask me anything ..."
            // onChange={onQuestionChange}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height =
                target.scrollHeight > 200 ? "250px" : "auto";
              console.log(target.scrollHeight);
            }}
          ></textarea>

          <div>
            <canvas
              ref={canvasRef}
              width={800} // 👈 actual pixel buffer size
              height={40} // 👈 actual pixel buffer size
              className="w-full h-5 block rounded-lg"
            />
          </div>
          <div className="flex justify-between gap-3 items-center">
            {!isRecording && (
              <div className="upload cursor-pointer">
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
      </div>
    </section>
    // <>
    //   Lorem ipsum dolor sit amet consectetur adipisicing elit. Placeat hic
    //   reprehenderit ea eum omnis, delectus ullam debitis unde consequatur.
    //   Accusantium illum quos rem eum at ipsam deserunt repellat perspiciatis
    //   nihil.
    // </>
  );
}
// shadow-[6px_0px_0px_0px_rgba(0,0,0,0.2)]
