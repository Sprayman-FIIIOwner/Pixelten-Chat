// src/lib/localServers.js
const LOCAL_KEY = "pixelten_local_servers";

export function loadLocalServers() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error("Failed to parse local servers:", e);
    return [];
  }
}

export function saveLocalServers(servers) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(servers));
}

export function addLocalServer(server) {
  const list = loadLocalServers();
  list.push(server);
  saveLocalServers(list);
  return server;
}

export function clearLocalServers() {
  localStorage.removeItem(LOCAL_KEY);
}
