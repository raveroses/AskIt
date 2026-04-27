import { useRef } from "react";
import useGlobal from "./useSecondGlobal";
import { useWaveform } from "./useWaveform";

export const useRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recognitionRef = useRef<any>(null);

  const {
    setAudioUrl,
    setTranscription,
    startRecording,
    stopRecording,
    startTranscription,
    stopTranscription,
  } = useGlobal();

  const { setup } = useWaveform();

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;

  const initSpeechRecognition = () => {

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
    if (recognition !== null) {
      console.log("I want to stop");
      recognition.stop();
      stopTranscription();
    }
  };

  return {
    startVoiceNote,
    stopVoiceNote,
    initSpeechRecognition,
    stopInitSpeechRecognition,
  };
};
