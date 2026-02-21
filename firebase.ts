
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyASouCKzjcBKJyoE6sH0r0YSi8hkpB9-iU",
  authDomain: "sandhya-c56ad.firebaseapp.com",
  databaseURL: "https://sandhya-c56ad-default-rtdb.firebaseio.com",
  projectId: "sandhya-c56ad",
  storageBucket: "sandhya-c56ad.firebasestorage.app",
  messagingSenderId: "448005938737",
  appId: "1:448005938737:web:64ded3e3345411ac487f10",
  measurementId: "G-BWSLRTYZC7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getDatabase(app);
export const storage = getStorage(app);

export default app;
