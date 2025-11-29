// src/presence.js
import { rdb, rdbRef, onDisconnect, rdbSet } from "./firebase";
import { auth } from "./firebase";

export function startPresence() {
  if (!auth.currentUser) return;
  const uid = auth.currentUser.uid;
  const ref = rdbRef(rdb, `presence/${uid}`);
  // set online
  rdbSet(ref, { state: "online", lastSeen: Date.now() });
  // on disconnect set offline with timestamp
  onDisconnect(ref).set({ state: "offline", lastSeen: Date.now() });
}
