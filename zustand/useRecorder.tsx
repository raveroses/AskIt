import { useRef } from "react";
import useGlobal from "./useSecondGlobal";
import { useWaveform } from "./useWaveform";

export const useRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const { setAudioUrl, setTranscription, startRecording, stopRecording } =
    useGlobal();

  const { setup } = useWaveform();

  const initSpeechRecognition = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let text = "";

      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript + " ";
      }

      setTranscription(text);
    };

    recognitionRef.current = recognition;

    setup();
  };

  const startVoiceNote = async () => {
    chunksRef.current = [];

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

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

    // initSpeechRecognition();
    recognitionRef.current?.start();
  };

  const stopVoiceNote = () => {
    mediaRecorderRef.current?.stop();
    stopRecording();
  };

  const stopInitSpeechRecognition = () => {
    recognitionRef.current?.stop();
    stopRecording();
  };

  return {
    startVoiceNote,
    stopVoiceNote,
    initSpeechRecognition,
    stopInitSpeechRecognition,
  };
};
