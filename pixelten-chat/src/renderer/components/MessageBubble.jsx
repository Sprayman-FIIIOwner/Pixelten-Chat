// src/components/MessageBubble.jsx
import { createSignal } from "solid-js";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";

function hasReact(reactionsMap, emoji, uid) {
  return (reactionsMap?.[emoji] || []).includes(uid);
}

export default function MessageBubble(props) {
  const { msg, onReply } = props;
  const [localMsg, setLocalMsg] = createSignal(msg);

  const emojis = ["👍", "❤️", "😂", "😮", "😢"];

  async function toggleReact(emoji) {
    const uid = auth.currentUser.uid;
    const mDoc = doc(db, `servers/${msg.serverId}/channels/${msg.channelId}/messages`, msg.id);
    const has = hasReact(localMsg().reactions, emoji, uid);
    // optimistic UI
    if (has) {
      const copy = {...localMsg()};
      copy.reactions = {...copy.reactions};
      copy.reactions[emoji] = copy.reactions[emoji].filter(x => x !== uid);
      setLocalMsg(copy);
      await updateDoc(mDoc, { [`reactions.${emoji}`]: arrayRemove(uid) }).catch(()=>{});
    } else {
      const copy = {...localMsg()};
      copy.reactions = {...copy.reactions, [emoji]: [...(copy.reactions?.[emoji]||[]), uid]};
      setLocalMsg(copy);
      await updateDoc(mDoc, { [`reactions.${emoji}`]: arrayUnion(uid) }).catch(()=>{});
    }
  }

  return (
    <div class="p-2 rounded mb-2">
      <div class="flex items-center gap-2">
        <img src={msg.author.avatarUrl || "/default-avatar.png"} class="w-8 h-8 rounded-full" />
        <div>
          <div class="font-semibold">{msg.author.displayName}</div>
          <div class="text-sm text-gray-400">{new Date(msg.createdAt?.seconds ? msg.createdAt.seconds*1000 : msg.createdAt).toLocaleString()}</div>
        </div>
      </div>

      <div class="mt-2 ml-10">
        {msg.replyTo && <div class="mb-1 p-2 bg-[#1b1c1d] rounded">Replying to: <b>{msg.replyPreview?.author?.displayName}</b> — {msg.replyPreview?.content?.slice(0,80)}</div>}
        <div>{msg.content}</div>

        <div class="mt-2 flex gap-2 items-center">
          <For each={emojis}>{(e)=>
            <button class={`px-2 py-1 rounded ${hasReact(localMsg().reactions, e, auth.currentUser.uid) ? "bg-blue-600" : "bg-[#222]"}`}
              onClick={() => toggleReact(e)}>
              {e} <span class="ml-1 text-xs">{(localMsg().reactions?.[e] || []).length || ""}</span>
            </button>
          }</For>

          <button class="ml-4 text-sm text-gray-300" onClick={() => onReply(msg)}>Reply</button>
        </div>
      </div>
    </div>
  );
}
