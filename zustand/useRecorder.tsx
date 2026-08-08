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

  const {
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
    getHistory, // 👈 pulled in from useWaveform
    canvasRef,
    secondCanvasRef,
    currentTime,
    setCurrentTime,
    duration,
    setDuration,
    playBack,
  } = useWaveform();

  const { handleSendMessage } = useChat();

  const getSpeechRecognition = () => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  };

  const initSpeechRecognition = async () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
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
        setInputText((prev) => prev + finalChunk);
      }
      setInterimTranscript(interim);
    };

    recognition.start();
    startTranscription();
  };

  const startVoiceNote = async () => {
    // Guard against double-start (e.g. duplicate onClick handlers)
    if (mediaRecorderRef.current?.state === "recording") return;

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

      // Snapshot the loudness history NOW, before it's lost/reset
      const waveform = getHistory();

      setIsAudioBlob(blob);
      void handleSendMessage(blob, waveform); // 👈 pass waveform through
    };

    recorder.start();
    startRecording();
    setIsRecordingOn();

    await setup(stream);

    startTimeRef.current = Date.now();
    intervalRef.current = setInterval(() => {
      const elapse = Date.now() - startTimeRef.current;
      const minutes = Math.floor(elapse / 60000);
      const seconds = Math.floor((elapse % 60000) / 1000);
      setFullTime(`${minutes}:${seconds.toString().padStart(2, "0")}`);
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