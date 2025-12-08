// src/components/ServerCreationModal.jsx
import { createSignal } from "solid-js";
import { ref as sRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { storage, db, serverTimestamp } from "../firebase";
import { addLocalServer } from "../lib/localServers";

export default function ServerCreationModal(props) {
  const [name, setName] = createSignal("");
  const [file, setFile] = createSignal(null);
  const [localOnly, setLocalOnly] = createSignal(false);
  const [loading, setLoading] = createSignal(false);
  const currentUser = props.user; // pass in auth user or object

  async function handleSubmit(e) {
    e.preventDefault();
    if (!name().trim()) {
      alert("Please provide a server name.");
      return;
    }
    setLoading(true);

    try {
      if (localOnly()) {
        // convert file to data URL (if provided)
        let dataUrl = null;
        if (file()) {
          dataUrl = await readFileAsDataUrl(file());
        }
        const server = {
          id: `local-${Date.now()}`,
          name: name(),
          iconDataUrl: dataUrl,
          memberCount: 1,
          ownerId: (currentUser && currentUser.uid) || "local-user",
          createdAt: Date.now(),
          localOnly: true
        };
        addLocalServer(server);
        props.onCreated && props.onCreated(server);
      } else {
        // remote: upload to storage then create server doc
        let iconUrl = null;
        if (file()) {
          const blob = file();
          const remoteRef = sRef(storage, `server_icons/${Date.now()}_${blob.name}`);
          const snap = await uploadBytes(remoteRef, blob);
          iconUrl = await getDownloadURL(snap.ref);
        }

        // create Firestore server document
        const docRef = await addDoc(collection(db, "servers"), {
          name: name(),
          iconUrl: iconUrl || null,
          memberCount: 1,
          ownerId: (currentUser && currentUser.uid) || null,
          createdAt: serverTimestamp(),
          localOnly: false
        });

        const serverDoc = {
          id: docRef.id,
          name: name(),
          iconUrl,
          memberCount: 1,
          ownerId: (currentUser && currentUser.uid) || null,
          createdAt: new Date().toISOString(),
          localOnly: false
        };
        props.onCreated && props.onCreated(serverDoc);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create server: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  function readFileAsDataUrl(f) {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = rej;
      reader.readAsDataURL(f);
    });
  }

  return (
    <div class="p-4 bg-[#282c34] rounded shadow-lg w-80">
      <h3 class="font-bold mb-2">Create server</h3>
      <form onSubmit={handleSubmit}>
        <label class="block text-sm">Name</label>
        <input value={name()} onInput={e => setName(e.target.value)} class="w-full p-2 my-2 rounded bg-[#1f2225]" />

        <label class="block text-sm">Icon (optional)</label>
        <input type="file" onInput={e => setFile(e.target.files[0])} class="w-full my-2" />

        <label class="flex items-center gap-2 text-sm my-2">
          <input type="checkbox" checked={localOnly()} onChange={e => setLocalOnly(e.target.checked)} />
          Local-only (stores on this device)
        </label>

        <div class="flex justify-end gap-2 mt-4">
          <button type="button" onClick={props.onClose} class="px-3 py-1 rounded bg-gray-600">Cancel</button>
          <button type="submit" class="px-3 py-1 rounded bg-blue-600" disabled={loading()}>
            {loading() ? "Creating..." : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}
