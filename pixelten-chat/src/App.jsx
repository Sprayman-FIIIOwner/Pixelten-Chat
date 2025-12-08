// src/App.jsx
import { createSignal, Show, onMount } from "solid-js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { ensureUserDoc } from "./ensureUserDoc"

import Sidebar from "./components/sidebar";
import ChatArea from "./components/ChatArea";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import DatabaseSelector from "./setup/DatabaseSelector";
import ProfileEditor from "./user/ProfileEditor";

export default function App() {
  const [mode, setMode] = createSignal("login"); // login | signup
  const [user, setUser] = createSignal(null);
  const [showProfileEditor, setShowProfileEditor] = createSignal(false);
  const [database, setDatabase] = createSignal(null);

  const [activeServer, setActiveServer] = createSignal({
    id: "pixelten-hq",
    name: "Pixelten HQ",
  });
  const [activeChannel, setActiveChannel] = createSignal("general");

  onMount(() => {
    onAuthStateChanged(auth, async (u) => {
        if (!u) {
          setUser(null);
          return;
        }
        setUser(u);
      
        await ensureUserDoc(u.uid, u.email);
      
        const userSnap = await getDoc(doc(db, "users", u.uid));
        setDatabase(userSnap.data().database);
      });
  });

  return (
    // make the app root a flex container so children layout reliably
    <div class="h-screen bg-[#1e1f22] text-white flex">
      <Show when={!user()}>
        <div class="flex justify-center items-center h-full w-full">
          {mode() === "login" ? (
            <Login switchToSignup={() => setMode("signup")} />
          ) : (
            <Signup switchToLogin={() => setMode("login")} />
          )}
        </div>
      </Show>

      <Show when={user() && !database()}>
        <div class="flex justify-center items-center h-full w-full">
          <DatabaseSelector onChoose={() => window.location.reload()} />
        </div>
      </Show>

      <Show when={user() && database()}>
        {/* Direct children of the root flex: Sidebar + ChatArea */}
        <Sidebar
          activeServer={activeServer}
          setActiveServer={setActiveServer}
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
          openProfileEditor={() => setShowProfileEditor(true)}
        />
        <ChatArea server={activeServer} channel={activeChannel} user={user} />
      </Show>

      <Show when={showProfileEditor()}>
        <ProfileEditor onClose={() => setShowProfileEditor(false)} />
      </Show>
    </div>
  );
}
