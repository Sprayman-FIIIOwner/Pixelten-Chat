import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function ensureUserDoc(uid, email) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);

  if (!snap.exists()) {
    await setDoc(ref, {
      displayName: email.split("@")[0],
      avatarUrl: "/images/user.png",
      status: "online",
      bio: "",
      database: "firestore",
      createdAt: Date.now(),
    });
  }
}
