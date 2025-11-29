// src/seedDemo.js
import { db } from "./firebase";
import { doc, setDoc, collection } from "firebase/firestore";

export async function seedDemo() {
  const serverRef = doc(db, "servers", "pixelten");
  await setDoc(serverRef, { id: "pixelten", name: "Pixelten HQ", createdAt: new Date() });
  const channels = ["general","dev","memes"];
  for (const ch of channels) {
    await setDoc(doc(db, `servers/pixelten/channels`, ch), { id: ch, name: ch });
  }
}
