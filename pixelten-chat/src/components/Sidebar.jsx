// src/components/Sidebar.jsx
import { For, createSignal, createEffect } from "solid-js";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

export default function Sidebar(props) {
  const { activeServer, setActiveServer, activeChannel, setActiveChannel } = props;

  const [servers, setServers] = createSignal([]);
  const [collapsed, setCollapsed] = createSignal(false);
  const [me, setMe] = createSignal(null);

  // Load servers (local or remote)
  createEffect(() => {
    setServers([
      {
        id: "pixelten",
        name: "Pixelten HQ",
        iconUrl: "/images/serverbuttonopen.png",
        channels: ["general", "dev", "memes"]
      }
    ]);
  });

  // Listen for auth
  onAuthStateChanged(auth, (user) => {
    setMe(user);
  });

  return (
    <div
      class={`h-full bg-[#2b2d31] flex flex-col justify-between overflow-hidden transition-all duration-200 ${
        collapsed() ? "w-16" : "w-64"
      }`}
    >
      <div
        class={`h-full bg-[#2b2d31] flex flex-col justify-between overflow-hidden transition-all duration-200 ${
          collapsed() ? "w-16" : "w-64"
        }`}
        style="outline: 2px solid red;"
      >

      {/* --- TOP SECTION (Collapse + Server List) --- */}
      <div class="flex flex-col gap-1 px-2 overflow-y-auto flex-1">

        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed())}
          class="m-3 w-10 h-10 rounded-full bg-[#1f6feb] flex items-center justify-center"
        >
          ≡
        </button>

        {/* Server List */}
        <div class="flex flex-col gap-1 px-2">
          <For each={servers()}>
            {(s) => (
              <button
                class={`flex items-center gap-2 p-2 rounded hover:bg-[#313338] transition ${
                  activeServer()?.id === s.id ? "bg-[#313338]" : ""
                }`}
                onClick={() => {
                  setActiveServer(s);
                  setActiveChannel(s.channels[0]);
                }}
              >
                <img
                  src={s.iconUrl}
                  class="w-10 h-10 rounded object-cover shrink-0"
                  
                />

                {!collapsed() && (
                  <div class="flex flex-col text-left">
                    <span class="font-semibold">{s.name}</span>
                    <span class="text-xs text-gray-400">
                      {s.channels.length} channels
                    </span>
                  </div>
                )}
              </button>
            )}
          </For>
        </div>
      </div>

      {/* --- BOTTOM SECTION --- */}
      <div class="flex flex-col gap-4 p-3 border-t border-[#202225] shrink-0">
        {/* Server Menu Toggle Button (always visible, fixed at bottom) */}
        <button class="w-full p-2 bg-[#3a3b3f] rounded hover:bg-[#4a4c50]">
          {collapsed() ? (
            <img
              src="/images/serverbuttonopen.png"
              class="w-8 h-8 mx-auto object-cover shrink-0" 
              
            />
          ) : (
            <div class="flex items-center gap-2">
              <img
                src="/images/serverbuttonopen.png"
                class="w-8 h-8 object-cover shrink-0"
                
              />
              <span class="text-sm">Server Menu</span>
            </div>
          )}
        </button>

        {/* USER INFO */}
        <div class="flex items-center gap-2">
          <img
            src={me()?.photoURL || "/default-avatar.png"}
            class="w-10 h-10 rounded-full object-cover shrink-0"
            
          />
          {!collapsed() && (
            <div>
              <div class="font-semibold text-sm">
                {me()?.displayName || me()?.email}
              </div>
              <div class="text-xs text-gray-400">Online</div>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
  );
}
