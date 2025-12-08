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
      <div class="p-4 border-b border-[#202225] font-bold text-lg">
        {server() ? `${server().name} @ ${channel()}` : "Select a server"}
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-2">
        <For each={messages()}>
          {(m) => <MessageBubble msg={m} onReply={(msg) => setReplyTo(msg)} />}
        </For>
      </div>

      <div class="p-4 border-t border-[#202225] flex gap-2 items-center">
        <Show when={replyTo()}>
          <div class="px-3 py-2 bg-[#151515] rounded flex-1">
            Replying to <b>{replyTo().author.displayName}</b>: <span class="ml-2">{replyTo().content.slice(0,80)}</span>
            <button class="ml-3 text-sm" onClick={() => setReplyTo(null)}>Cancel</button>
          </div>
        </Show>

        <input class="flex-1 bg-[#111] text-white p-2 rounded outline-none" placeholder="Type a message..." value={content()} onInput={(e)=>setContent(e.target.value)} />
        <button class="px-4 py-2 bg-blue-600 rounded" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}
