import { db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export async function ensureUserDoc(user) {
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: user.displayName || user.email.split("@")[0],
      avatarUrl: null,
      status: "online",
      database: "firestore",   // default choice
      createdAt: Date.now()
    });
  }
}
