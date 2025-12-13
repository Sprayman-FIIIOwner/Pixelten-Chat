// src/App.jsx
import { createSignal, Show, onMount } from "solid-js";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

import Sidebar from "./components/sidebar";
import ChatArea from "./components/ChatArea";
import Login from "./auth/Login";
import Signup from "./auth/Signup";
import DatabaseSelector from "./setup/DatabaseSelector";
import ProfileEditor from "./components/ProfileEditor";
import ServerSettings from "./components/ServerSettings";
import InputBar from "./components/InputBar";

export default function App() {
  const [mode, setMode] = createSignal("login");
  const [user, setUser] = createSignal(null);
  const [database, setDatabase] = createSignal(null);
  const [userProfile, setUserProfile] = createSignal(null);
  const [showServerSettings, setShowServerSettings] = createSignal(false);
  const openServerSettings = () => setShowServerSettings(true);
  const closeServerSettings = () => setShowServerSettings(false);
  const [content, setContent] = createSignal("");
  const [replyTo, setReplyTo] = createSignal(null);

  const [activeServer, setActiveServer] = createSignal({
    id: "pixelten-hq",
    name: "Pixelten HQ",
  });
  const [activeChannel, setActiveChannel] = createSignal("general");
  const [editingProfile, setEditingProfile] = createSignal(false);

  async function ensureUserDoc(u) {
    const ref = doc(db, "users", u.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        displayName: u.email.split("@")[0],
        username: "User",
        avatarUrl: "/images/user.png",
        status: "online",
        bio: "",
        database: "firestore",
        createdAt: Date.now(),
      });
    }

    const fresh = await getDoc(ref);
    return fresh.data();
  }

  onMount(() => {
    onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setUserProfile(null);
        setDatabase(null);
        return;
      }

      setUser(u);

      // Ensure user doc exists + load profile
      const data = await ensureUserDoc(u);
      setUserProfile(data);

      // Database selector
      setDatabase(data.database || null);
    });
  });

  return (
    <div class="h-screen bg-[#1e1f22] text-white">

      {/* LOGIN / SIGNUP */}
      <Show when={!user()}>
        <div class="flex justify-center items-center h-full">
          {mode() === "login" ? (
            <Login switchToSignup={() => setMode("signup")} />
          ) : (
            <Signup switchToLogin={() => setMode("login")} />
          )}
        </div>
      </Show>

      {/* DATABASE SELECTOR */}
      <Show when={user() && !database()}>
        <DatabaseSelector onChoose={() => window.location.reload()} />
      </Show>

      {/* MAIN APP */}
      <Show when={user() && database()}>
        <div class="flex h-full">

          <Sidebar
            activeServer={activeServer}
            setActiveServer={setActiveServer}
            activeChannel={activeChannel}
            setActiveChannel={setActiveChannel}
            userProfile={userProfile}
            openProfileEditor={() => setEditingProfile(true)}
            openServerSettings={openServerSettings}
          />

          <ChatArea
            server={activeServer}
            channel={activeChannel}
            user={user}
            setReplyTo={setReplyTo}
          />
          <InputBar
            content={content}
            setContent={setContent}
            replyTo={replyTo}
            setReplyTo={setReplyTo}
            onSend={sendMessage}
          />
          <Show when={editingProfile()}>
            <ProfileEditor
              user={user}
              userProfile={userProfile}
              close={() => setEditingProfile(false)}
            />
          </Show>


        </div>
      </Show>
      <Show when={showServerSettings()}>
        <ServerSettings 
          server={currentServer()} 
          close={closeServerSettings} 
        />
      </Show>
    </div>
    
  );
}
