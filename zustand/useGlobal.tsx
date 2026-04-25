"use client";
import { create } from "zustand";
import { Record } from "@/app/components/types";
let recognition: SpeechRecognition | null = null;

if (typeof window !== "undefined") {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
}
let mediaRecorder: MediaRecorder | null = null;
const chunks: Blob[] = [];

const useGlobal = create<Record>((set, get) => ({
  interviewMode: "audio",
  isTranscriptionOn: false,
  isRecording: false,
  audioUrl: null,
  transcription: "",

  onInterviewMode: (event) => {
    const { value } = event.target;
    set({ interviewMode: value });
    console.log(value);
  },

  onVoiceRecord: () => {
    // const currentInterviewMode = get().interviewMode.slice(2).toLowerCase();

    if (!navigator.mediaDevices) {
      console.log("Browser does not support audio");
      return;
    }
    const constraints = { audio: true };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      mediaRecorder = new MediaRecorder(stream);

      mediaRecorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        set({ audioUrl });
      };
      mediaRecorder.start();
      set({ isRecording: true });

      console.log("Recording started");
    });
  },

  onStopVoiceRecording: () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      set({ isRecording: false });
      console.log("Recording stopped");
    }
  },

  onVoiceTranscriptRecord: () => {
    if (recognition !== null) {
      recognition.start();

      recognition.onresult = (event) => {
        let fullTranscript = "";

        for (let i = 0; i < event.results.length; i++) {
          for (let t = 0; t < event.results[i].length; t++) {
            fullTranscript += event.results[i][t].transcript + " ";
          }
        }

        set({ transcription: fullTranscript });
        set({ isTranscriptionOn: true });
      };
    }
  },
  onStopVoiceTranscriptRecording: () => {
    if (recognition !== null) {
      recognition.stop();
      recognition.onresult = null;
    }
    set({ isTranscriptionOn: false });
  },


  onQuestionChange: (event) => {
    const { value } = event.target;
    set({ transcription: value });
  },
}));

export default useGlobal;

//   const increment = useCountStore((state) => state.increment)
