"use client";
import { useRef, useState } from "react";
import useGlobal from "./useSecondGlobal";
import { useWaveform } from "./useWaveform";

export const useRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);
  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [fullTime, setFullTime] = useState<string>("");
  const {
    setAudioUrl,
    setTranscription,
    startRecording,
    stopRecording,
    startTranscription,
    stopTranscription,
  } = useGlobal();

  const { setup, stop, canvasRef } = useWaveform();

  // const SpeechRecognition = new SpeechRecognition()
  const getSpeechRecognition = () => {
    if (typeof window === "undefined") return null;
    return window.SpeechRecognition || window.webkitSpeechRecognition;
  };

  const initSpeechRecognition = () => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    if (recognition !== null) {
      recognition.onresult = (event) => {
        let text = "";
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript + " ";
        }
        setTranscription(text);
      };
      recognition.start();
      startTranscription();
    }

    setup();
  };

  const startVoiceNote = async () => {
    chunksRef.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    streamRef.current = stream;
    const recorder = new MediaRecorder(stream);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);
    };

    recorder.start();
    startRecording();
    setup();

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
  };
};
