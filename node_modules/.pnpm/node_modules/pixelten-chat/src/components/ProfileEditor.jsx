// src/components/ProfileEditor.jsx
import { createSignal } from "solid-js";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function ProfileEditor(props) {
  const { user, userProfile, close } = props;

  const [displayName, setDisplayName] = createSignal(userProfile().displayName);
  const [username, setUsername] = createSignal(userProfile().username);
  const [status, setStatus] = createSignal(userProfile().status);
  const [bio, setBio] = createSignal(userProfile().bio);

  async function save() {
    const ref = doc(db, "users", user().uid);

    await updateDoc(ref, {
      displayName: displayName(),
      username: username(),
      status: status(),
      bio: bio(),
    });

    close();
  }

  return (
    <div class="fixed inset-0 bg-black/60 flex justify-center items-center">
      <div class="bg-[#2b2d31] p-6 rounded-lg w-96">
        <h2 class="text-lg font-bold mb-4">Edit Profile</h2>

        <label class="text-sm">Display Name</label>
        <input
          class="w-full p-2 bg-[#1e1f22] mt-1 mb-3 rounded"
          value={displayName()}
          onInput={(e) => setDisplayName(e.target.value)}
        />

        <label class="text-sm">Username</label>
        <input
          class="w-full p-2 bg-[#1e1f22] mt-1 mb-3 rounded"
          value={username()}
          onInput={(e) => setUsername(e.target.value)}
        />

        <label class="text-sm">Status</label>
        <select
          class="w-full p-2 bg-[#1e1f22] mt-1 mb-3 rounded"
          value={status()}
          onInput={(e) => setStatus(e.target.value)}
        >
          <option value="online">Online</option>
          <option value="away">Away</option>
          <option value="busy">Do Not Disturb</option>
          <option value="offline">Offline</option>
        </select>

        <label class="text-sm">Bio</label>
        <textarea
          class="w-full p-2 bg-[#1e1f22] mt-1 mb-3 rounded"
          rows="3"
          value={bio()}
          onInput={(e) => setBio(e.target.value)}
        />

        <div class="flex justify-end gap-3 mt-4">
          <button onClick={close} class="px-4 py-2 bg-[#3a3b3f] rounded">
            Cancel
          </button>
          <button onClick={save} class="px-4 py-2 bg-blue-600 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
