// src/components/ChatArea.jsx
import { createSignal, createEffect, onCleanup, For, Show } from "solid-js";
import { db, serverTimestamp } from "../firebase";
import { collection, query, orderBy, onSnapshot, addDoc, doc, getDoc } from "firebase/firestore";
import MessageBubble from "./MessageBubble";
import { auth } from "../firebase";

export default function ChatArea(props) {
  const { server, channel } = props; // server is a signal; channel is a signal
  const [messages, setMessages] = createSignal([]);
  const [content, setContent] = createSignal("");
  const [replyTo, setReplyTo] = createSignal(null);
  const [userProfile, setUserProfile] = createSignal(null);

  let unsub = null;

  async function trackUserProfile() {
    if (!auth.currentUser) return;
    const uDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
    setUserProfile(uDoc.exists() ? uDoc.data() : { displayName: auth.currentUser.email, avatarUrl: null });
  }
  trackUserProfile();

  createEffect(() => {
    if (unsub) { unsub(); unsub = null; }
    const s = server();
    const c = channel();
    if (!s || !c) {
      setMessages([]);
      return;
    }

    const q = query(collection(db, `servers/${s.id}/channels/${c}/messages`), orderBy("createdAt", "asc"));
    unsub = onSnapshot(q, async snap => {
      const arr = [];
      const ids = [];
      snap.forEach(d => {
        const data = d.data();
        data.id = d.id;
        arr.push(data);
        ids.push(data.replyTo);
      });

      // fetch reply previews in batch (simple approach)
      const previews = {};
      for (const rid of ids.filter(Boolean)) {
        if (previews[rid]) continue;
        const docRef = doc(db, `servers/${s.id}/channels/${c}/messages`, rid);
        const r = await getDoc(docRef);
        if (r.exists()) previews[rid] = r.data();
      }
      // attach preview
      arr.forEach(m => { if (m.replyTo) m.replyPreview = previews[m.replyTo]; });

      setMessages(arr);
    });
  });

  onCleanup(() => { if (unsub) unsub(); });

  async function sendMessage() {
    if (!content().trim() || !server() || !channel()) return;
    const m = {
      author: { uid: auth.currentUser.uid, displayName: userProfile()?.displayName || auth.currentUser.email, avatarUrl: userProfile()?.avatarUrl || null },
      content: content(),
      createdAt: serverTimestamp(),
      reactions: {},
      replyTo: replyTo()?.id || null
    };
    await addDoc(collection(db, `servers/${server().id}/channels/${channel()}/messages`), m);
    setContent("");
    setReplyTo(null);
  }

  return (
    <div class="flex-1 flex flex-col">
      setReplyTo={setReplyTo}
    </div>
  );
}
