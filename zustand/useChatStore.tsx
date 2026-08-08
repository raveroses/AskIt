import { create } from "zustand";

type ChatTurn = {
    role: "user" | "model";
    text: string;
    audioBase64?: string;
    documentBase64?: string;
    isAudioUrl?: string | null;
    documentPdfUrl?: string;
};

type Chat = {
    chatId: number;
    chatTitle: string;
    perChat: ChatTurn[];
};

type ChatStore = {
    chats: Chat[];
    currentChatId: number | null;
    setChats: (updater: (prev: Chat[]) => Chat[]) => void;
    setCurrentChatId: (id: number | null) => void;
};



const useChatStore = create<ChatStore>((set) => ({
    chats: [], // same on server and client, always
    currentChatId: null,
    setChats: (updater) => set((state) => ({ chats: updater(state.chats) })),
    setCurrentChatId: (id) => set({ currentChatId: id }),
}));

export default useChatStore;
