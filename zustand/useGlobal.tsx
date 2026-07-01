"use client";
import { create } from "zustand";

type Store = {
  isRecording: boolean;
  isRecordingOn: boolean;
  isTranscription: boolean;
  audioUrl: string | null;
  isAudioBlob: Blob | null;
  transcription: string;

  startRecording: () => void;
  stopRecording: () => void;
  startTranscription: () => void;
  stopTranscription: () => void;
  setAudioUrl: (url: string) => void;
  setTranscription: (text: string) => void;
  setIsAudioBlob: (blob: Blob | null) => void;
  setIsRecordingOn: () => void;
  clearIsRecordingOn: () => void;
  clearAudioUrl: () => void;
};

const useGlobal = create<Store>((set) => ({
  isRecording: false,
  isRecordingOn: false,
  isTranscription: false,
  audioUrl: null,
  isAudioBlob: null,
  transcription:
    typeof window !== "undefined"
      ? localStorage.getItem("transcriptionDraft") || ""
      : "",

  startRecording: () => set({ isRecording: true }),
  stopRecording: () => set({ isRecording: false }),
  startTranscription: () => set({ isTranscription: true }),
  stopTranscription: () => set({ isTranscription: false }),
  setAudioUrl: (url) => set({ audioUrl: url }),
  setTranscription: (text) =>
    set(() => {
      localStorage.setItem("transcriptionDraft", text);
      return { transcription: text };
    }),
  setIsAudioBlob: (blob) => set({ isAudioBlob: blob }),
  setIsRecordingOn: () => set({ isRecordingOn: true }),
  clearIsRecordingOn: () => set({ isRecordingOn: false }),
  clearAudioUrl: () => set({ audioUrl: null }),
}));

export default useGlobal;
