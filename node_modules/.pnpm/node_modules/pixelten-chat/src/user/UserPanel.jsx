import { createSignal, onMount } from "solid-js";
import { auth, db } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

export default function UserPanel() {
  const [profile, setProfile] = createSignal(null);

  onMount(() => {
    const uid = auth.currentUser.uid;

    return onSnapshot(doc(db, "users", uid), (snap) => {
      setProfile(snap.data());
    });
  });

  return (
    <div class="flex items-center gap-3 mb-4 p-3 bg-[#2b2d31] rounded">
      <img
        src={profile()?.avatarURL || "/default-avatar.png"}
        class="w-10 h-10 rounded-full"
      />
      <div>
        <div class="font-bold">{profile()?.username || "User"}</div>
        <div class="text-xs opacity-60">{profile()?.status || "online"}</div>
      </div>
    </div>
  );
}
