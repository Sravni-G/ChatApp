import { doc, getDoc } from "firebase/firestore";
import { create } from "zustand";
import { db } from "./firebase";

export const Userstore = create((set) => ({
  user: null,
  isLoading: true,
  fetchUserInfo: async (uid) => {
    if (!uid) {
      set({ user: null, isLoading: false });
    }
    try {
      const docRef = doc(db, "users", uid);
      const docsnap = await getDoc(docRef);
      if (docsnap.exists()) {
        set({ user: docsnap.data(), isLoading: false });
      } else {
        set({ user: null, isLoading: false });
      }
    } catch (err) {
      console.log(err.code);
    }
  },
}));
