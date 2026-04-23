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
  interviewMode: "",
  isRecording: false,
  audioUrl: null,
  transcription: "",

  onInterviewMode: (mode) => {
    set({ interviewMode: mode });
  },

  onRecord: () => {
    // recognition.lang="en_US"
    // console.log("Ready to receive a color command.");

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

    if (recognition !== null) {
      recognition.start();

      recognition.onresult = (event) => {
        let fullTranscript = "";

        for (let i = 0; i < event.results.length; i++) {
          for (let t = 0; t < event.results[i].length; t++) {
            // ✅ t++
            fullTranscript += event.results[i][t].transcript + " ";
          }
        }

        set({ transcription: fullTranscript });
      };
    }
  },

  onStopRecording: () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      set({ isRecording: false });
      console.log("Recording stopped");
    }
  },


onQuestionChange:(event)=>{
  const {name,value}= event.target;
  set({transcription: [name]:value})

}
}));

export default useGlobal;

//   const increment = useCountStore((state) => state.increment)
