"use client";

import { create } from "zustand";
type InputUpdater = string | ((prev: string) => string);

type Store = {
  inputText: string;
  interimTranscript: string;
  setInputText: (value: InputUpdater) => void;
  setInterimTranscript: (value: string) => void;
};

const useText = create<Store>((set) => ({
  inputText: "",
  interimTranscript: "",
  setInputText: (value) =>
    set((state) => ({
      inputText:
        typeof value === "function"
          ? (value as (prev: string) => string)(state.inputText)
          : value,
    })),

  setInterimTranscript: (value) => {
    set({
      interimTranscript: value,
    });
  },
}));

export default useText;
