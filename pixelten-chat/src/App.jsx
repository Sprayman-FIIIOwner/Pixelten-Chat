// src/App.jsx
import { createSignal, Show, onMount } from "solid-js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import Sidebar from "./components/Sidebar";
import ChatArea from "./components/ChatArea";
import Login from "./auth/Login"; // optional, your auth components
import Signup from "./auth/Signup";
import DatabaseSelector from "./setup/DatabaseSelector";

export default function App() {
  const [mode, setMode] = createSignal("login"); // login | signup
  const [user, setUser] = createSignal(null);
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

      // load user metadata (example)
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          setDatabase(snap.data().database || null);
        } else {
          setDatabase(null);
        }
      } catch (e) {
        console.error(e);
      }
    });
  });

  return (
    <div class="h-screen bg-[#1e1f22] text-white flex">
      <Show when={!user()}>
        {mode() === "login" ? (
          <Login switchToSignup={() => setMode("signup")} />
        ) : (
          <Signup switchToLogin={() => setMode("login")} />
        )}
      </Show>

      <Show when={user() && !database()}>
        <DatabaseSelector onChoose={() => window.location.reload()} />
      </Show>

      <Show when={user() && database()}>
        <Sidebar
          activeServer={activeServer}
          setActiveServer={setActiveServer}
          activeChannel={activeChannel}
          setActiveChannel={setActiveChannel}
        />
        <ChatArea server={activeServer} channel={activeChannel} user={user} />
      </Show>

      {/* Optionally: if you want the app to run even if not logged, toggle above */}
    </div>
  );
}
