import { createSignal } from "solid-js";
import { auth, db, storage } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


export default function ProfileEditor(props) {
  const uid = auth.currentUser.uid;

  const [username, setUsername] = createSignal("");
  const [status, setStatus] = createSignal("online");
  const [avatarFile, setAvatarFile] = createSignal(null);

  const uploadAvatar = async () => {
    if (!avatarFile()) return null;
    const storageRef = ref(storage, `avatars/${uid}.png`);
    await uploadBytes(storageRef, avatarFile());
    return await getDownloadURL(storageRef);
  };

  const saveProfile = async () => {
    let avatarURL = await uploadAvatar();

    await updateDoc(doc(db, "users", uid), {
      username: username() || "User",
      status: status(),
      ...(avatarURL && { avatarURL }),
    });

    props.onClose();
  };

  return (
    <div class="absolute inset-0 bg-black/40 flex items-center justify-center">
      <div class="bg-[#2b2d31] p-6 rounded w-80">
        <h1 class="text-xl mb-4 font-bold">Edit Profile</h1>

        <input
          type="text"
          placeholder="Username"
          class="w-full p-2 mb-3 rounded bg-[#1e1f22]"
          value={username()}
          onInput={(e) => setUsername(e.target.value)}
        />

        <select
          class="w-full p-2 mb-3 rounded bg-[#1e1f22]"
          value={status()}
          onInput={(e) => setStatus(e.target.value)}
        >
          <option value="online">Online</option>
          <option value="busy">Busy</option>
          <option value="away">Away</option>
        </select>

        <input
          type="file"
          class="w-full mb-3"
          onInput={(e) => setAvatarFile(e.target.files[0])}
        />

        <button
          class="w-full bg-[#5865f2] py-2 rounded hover:bg-[#4752c4]"
          onClick={saveProfile}
        >
          Save
        </button>

        <button
          class="mt-2 w-full text-sm opacity-60 hover:opacity-100"
          onClick={props.onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
