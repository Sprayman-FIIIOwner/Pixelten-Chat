import { createSignal } from "solid-js";
import { auth, storage, db, serverTimestamp } from "../firebase";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

export default function ProfileEditor(props) {
  const { user, onClose } = props;
  const [displayName, setDisplayName] = createSignal(user()?.displayName || "");
  const [username, setUsername] = createSignal(user()?.username || "");
  const [bio, setBio] = createSignal(user()?.bio || "");
  const [avatarFile, setAvatarFile] = createSignal(null);
  const [saving, setSaving] = createSignal(false);

  async function handleSave() {
    setSaving(true);
    let avatarUrl = user()?.avatarUrl || null;

    if (avatarFile()) {
      const file = avatarFile();
      const sRef = storageRef(storage, `avatars/${auth.currentUser.uid}/${Date.now()}_${file.name}`);
      const uploadTask = await uploadBytesResumable(sRef, file);
      avatarUrl = await getDownloadURL(uploadTask.ref);
    }

    await setDoc(doc(db, "users", auth.currentUser.uid), {
      displayName: displayName(),
      username: username(),
      bio: bio(),
      avatarUrl,
      updatedAt: serverTimestamp()
    }, { merge: true });

    setSaving(false);
    onClose?.();
  }

  return (
    <div class="p-4 bg-[#111214] rounded shadow">
      <label>Display name</label>
      <input value={displayName()} onInput={e => setDisplayName(e.target.value)} class="w-full p-2" />
      <label>Username</label>
      <input value={username()} onInput={e => setUsername(e.target.value)} class="w-full p-2" />
      <label>Bio</label>
      <textarea value={bio()} onInput={e => setBio(e.target.value)} class="w-full p-2" />
      <label>Avatar</label>
      <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
      <div class="mt-3">
        <button class="px-4 py-2 bg-blue-600 rounded" disabled={saving()} onClick={handleSave}>
          {saving() ? "Saving..." : "Save"}
        </button>
        <button class="ml-2 px-4 py-2 bg-gray-700 rounded" onClick={() => onClose?.()}>
          Cancel
        </button>
      </div>
    </div>
  );
}