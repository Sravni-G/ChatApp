import { create } from "zustand";

export const Chatstore = create((set) => ({
  chatId: null,
  chatlistuser: null,
  changeChat: (chatId, chatlistuser) => {
    set({ chatId, chatlistuser });
  },
}));
