"use client";
import { create } from "zustand";

type Store = {
  isRecording: boolean;
  isTranscription: boolean;
  audioUrl: string | null;
  transcription: string;

  startRecording: () => void;
  stopRecording: () => void;
  startTranscription: () => void;
  stopTranscription: () => void;
  setAudioUrl: (url: string) => void;
  setTranscription: (text: string) => void;
};

const useGlobal = create<Store>((set) => ({
  isRecording: false,
  isTranscription: false,
  audioUrl: null,
  transcription: "",

  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),
  startTranscription: () => set({ isTranscription: true }),
  stopTranscription: () => set({ isTranscription: false }),
  setAudioUrl: (url) => set({ audioUrl: url }),
  setTranscription: (text) => set({ transcription: text }),
}));

export default useGlobal;
