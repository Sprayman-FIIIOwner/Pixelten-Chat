import { auth, db } from "./firebase";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

export function setupPresence() {
  window.addEventListener("focus", () => setStatus("online"));
  window.addEventListener("blur", () => setStatus("idle"));

  setStatus("online");

  async function setStatus(status) {
    const u = auth.currentUser;
    if (!u) return;

    await updateDoc(doc(db, "users", u.uid), {
      status,
      lastActive: serverTimestamp(),
    });
  }
}
