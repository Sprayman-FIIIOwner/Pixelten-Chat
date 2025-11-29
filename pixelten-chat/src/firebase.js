// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, serverTimestamp } from "firebase/firestore";
import { getDatabase, ref as rdbRef, onDisconnect, set as rdbSet } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAR5EY3YwpJG0r9-v1sriUjDboy7_0KvxU",
  authDomain: "pixchatdb.firebaseapp.com",
  projectId: "pixchatdb",
  storageBucket: "pixchatdb.firebasestorage.app",
  messagingSenderId: "47700995179",
  appId: "1:47700995179:web:e470ca69e11332b43d952e"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rdb = getDatabase(app);
export const storage = getStorage(app);
export { serverTimestamp, rdbRef, onDisconnect, rdbSet };
export const googleProvider = new (await import("firebase/auth")).GoogleAuthProvider();