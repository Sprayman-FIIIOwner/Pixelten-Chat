// src/components/InputBar.jsx
export default function InputBar(props) {
  const { value, onInput, onSend } = props;

  return (
    <div class="p-4 border-t border-[#202225] flex gap-2 items-center">
      <input
        class="flex-1 bg-[#313338] text-white p-3 rounded outline-none"
        placeholder="Type a message..."
        value={value}
        onInput={(e) => onInput(e.target.value)}
      />
      <button class="bg-[#5865f2] px-4 py-2 rounded" onClick={() => onSend()}>
        Send
      </button>
    </div>
  );
}
