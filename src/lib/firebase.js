// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6x27rlMZhfuRFfTgW_07p68D4bv0gbvg",
  authDomain: "react-chat-app-cbe90.firebaseapp.com",
  projectId: "react-chat-app-cbe90",
  storageBucket: "react-chat-app-cbe90.appspot.com",
  messagingSenderId: "918608895601",
  appId: "1:918608895601:web:861fbd8395f60a8b7e05d0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
