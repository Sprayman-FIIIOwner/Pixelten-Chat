import { createSignal, onMount } from "solid-js";
import { auth, db } from "../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function ProfileEditor(props) {
  const [profile, setProfile] = createSignal(null);
  const [saving, setSaving] = createSignal(false);

  onMount(async () => {
    const ref = doc(db, "users", auth.currentUser.uid);
    const snap = await getDoc(ref);
    setProfile(snap.data());
  });

  async function save() {
    setSaving(true);
    const ref = doc(db, "users", auth.currentUser.uid);

    await updateDoc(ref, {
      displayName: profile().displayName,
      bio: profile().bio,
      status: profile().status
    });

    setSaving(false);
    props.onClose();
  }

  if (!profile()) return <div class="p-6">Loading…</div>;

  return (
    <div class="p-6 bg-[#1b1c1d] w-full h-full">
      <h2 class="text-xl mb-4">Edit Profile</h2>

      <div class="mb-4">
        <label>Name:</label>
        <input
          class="bg-[#111] p-2 rounded w-full"
          value={profile().displayName}
          onInput={(e) =>
            setProfile({ ...profile(), displayName: e.target.value })
          }
        />
      </div>

      <div class="mb-4">
        <label>Status:</label>
        <select
          class="bg-[#111] p-2 rounded w-full"
          value={profile().status}
          onInput={(e) =>
            setProfile({ ...profile(), status: e.target.value })
          }
        >
          <option value="online">Online</option>
          <option value="idle">Idle</option>
          <option value="busy">Busy</option>
        </select>
      </div>

      <div class="mb-4">
        <label>Bio:</label>
        <textarea
          class="bg-[#111] p-2 rounded w-full"
          value={profile().bio}
          onInput={(e) =>
            setProfile({ ...profile(), bio: e.target.value })
          }
        />
      </div>

      <button
        class="mt-4 bg-blue-600 px-4 py-2 rounded"
        disabled={saving()}
        onClick={save}
      >
        {saving() ? "Saving…" : "Save"}
      </button>
    </div>
  );
}
