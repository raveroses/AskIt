"use client";
import { useRef, useState } from "react";
import useGlobal from "./useGlobal";
import { useWaveform } from "./useWaveform";
import useText from "./useText";
import useChat from "./useChat";

export const useRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [fullTime, setFullTime] = useState<string>("");
  // const [finalTranscript, setFinalTranscript] = useState("");
  // const [interimTranscript, setInterimTranscript] = useState("");
  const {
    setAudioUrl,
    // setTranscription,
    setIsRecordingOn,
    clearIsRecordingOn,
    clearAudioUrl,
    startRecording,
    stopRecording,
    startTranscription,
    stopTranscription,
    setIsAudioBlob,
  } = useGlobal();

  const { setInputText, setInterimTranscript } = useText();
  const {
    setup,
    stop,
    canvasRef,
    secondCanvasRef,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    playBack,
  } = useWaveform();

  const { handleSendMessage } = useChat();
  // const SpeechRecognition = new SpeechRecognition()
  const getSpeechRecognition = () => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  };

  const initSpeechRecognition = async () => {
    const SpeechRecognition = getSpeechRecognition();

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let interim = "";
      let finalChunk = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;

        if (event.results[i].isFinal) {
          finalChunk += transcript + " ";
        } else {
          interim += transcript;
        }
      }

      if (finalChunk) {
        setInputText((prev) => {
          const updated = prev + finalChunk;

          localStorage.setItem("draft", updated);

          return updated;
        });
      }

      setInterimTranscript(interim);

      if (typeof window !== "undefined") {
        localStorage.setItem("draft", interim);
      }
    };

    recognition.start();

    startTranscription();

    await new Promise((resolve) => requestAnimationFrame(resolve));

    await setup(stream);
  };

  const startVoiceNote = async () => {
    chunksRef.current = [];
    clearAudioUrl();

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    streamRef.current = stream;
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      // const url = URL.createObjectURL(blob);

      // setAudioUrl(url);
      setIsAudioBlob(blob);
      console.log("real blob checker", blob);

      void handleSendMessage(blob);
    };

    recorder.start();
    startRecording();
    setIsRecordingOn();

    await new Promise((resolve) => requestAnimationFrame(resolve));

    await setup(stream);

    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      const elapse = Date.now() - startTimeRef.current;

      const minutes = Math.floor(elapse / 60000);
      const seconds = Math.floor((elapse % 60000) / 1000);
      const formattedSeconds = seconds.toString().padStart(2, "0");
      setFullTime(`${minutes}:${formattedSeconds}`);
    }, 1000);
  };

  const stopVoiceNote = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    mediaRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    stopRecording();
    clearIsRecordingOn();
    stop();
  };

  const stopInitSpeechRecognition = () => {
    recognitionRef.current?.stop();
    stopTranscription();
    stop();
  };

  return {
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
  };
};
