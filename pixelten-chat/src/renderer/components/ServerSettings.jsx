import { createSignal, onMount } from "solid-js";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ServerSettings(props) {
  const { server, close } = props;

  const [name, setName] = createSignal(server?.name || "");
  const [icon, setIcon] = createSignal(server?.icon || "");

  const save = async () => {
    try {
      await updateDoc(doc(db, "servers", server.id), {
        name: name(),
        icon: icon()
      });
      close();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div class="absolute inset-0 bg-[#1e1f22] text-white p-6 flex flex-col gap-4">
      <h1 class="text-xl font-bold">Server Settings</h1>

      <label class="flex flex-col">
        <span class="mb-1">Server Name</span>
        <input
          value={name()}
          onInput={(e) => setName(e.target.value)}
          class="bg-[#111] p-2 rounded"
        />
      </label>

      <label class="flex flex-col">
        <span class="mb-1">Server Icon URL</span>
        <input
          value={icon()}
          onInput={(e) => setIcon(e.target.value)}
          class="bg-[#111] p-2 rounded"
        />
      </label>

      <div class="flex gap-2 mt-4">
        <button
          class="px-4 py-2 bg-[#3a3b3f] rounded"
          onClick={close}
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 bg-blue-600 rounded"
          onClick={save}
        >
          Save
        </button>
      </div>
    </div>
  );
}
