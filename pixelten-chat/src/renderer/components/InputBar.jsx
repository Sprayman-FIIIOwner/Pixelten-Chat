// src/components/InputBar.jsx
import { createSignal, Show } from "solid-js";

export default function InputBar(props) {
  const { content, setContent, replyTo, setReplyTo, onSend } = props;
  const [rows, setRows] = createSignal(1);

  function autoResize(e) {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  function insertFormatting(startTag, endTag = startTag) {
    const value = content();
    const selectionStart = inputRef.selectionStart;
    const selectionEnd = inputRef.selectionEnd;
    const before = value.substring(0, selectionStart);
    const selected = value.substring(selectionStart, selectionEnd);
    const after = value.substring(selectionEnd);
    setContent(before + startTag + selected + endTag + after);
  }

  let inputRef;

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (content().trim()) onSend();
    }
  }

  return (
    <div class="p-4 border-t border-[#202225] bg-[#1e1f22] flex flex-col gap-2">

      <Show when={replyTo()}>
        <div class="bg-[#151515] p-2 rounded flex justify-between items-center">
          <div>
            Replying to <b>{replyTo().author.displayName}</b>
            <div class="text-sm opacity-70">{replyTo().content.slice(0, 120)}</div>
          </div>
          <button class="text-sm" onClick={() => setReplyTo(null)}>Cancel</button>
        </div>
      </Show>

      {/* Toolbar */}
      <div class="flex gap-2">
        <button class="bg-[#2b2d31] px-2 py-1 rounded" onClick={() => insertFormatting("**")}>B</button>
        <button class="bg-[#2b2d31] px-2 py-1 rounded" onClick={() => insertFormatting("*")}>I</button>
        <button class="bg-[#2b2d31] px-2 py-1 rounded" onClick={() => insertFormatting("__")}>U</button>
      </div>

      {/* Editor */}
      <textarea
        ref={inputRef}
        rows={rows()}
        value={content()}
        onInput={(e) => { setContent(e.target.value); autoResize(e); }}
        onKeyDown={handleKey}
        placeholder="Type a message..."
        class="bg-[#111] text-white p-3 rounded resize-none overflow-hidden outline-none w-full"
      />

      <div class="flex justify-end">
        <button
          class="px-4 py-2 bg-blue-600 rounded"
          onClick={onSend}
        >
          Send
        </button>
      </div>
    </div>
  );
}
