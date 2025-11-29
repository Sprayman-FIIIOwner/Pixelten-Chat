export default function UserSettings(props) {
  const user = props.user || { id: "", name: "" };

  async function save(e) {
    e.preventDefault();
    const name = e.target.name.value;
    const res = await fetch("http://localhost:3001/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, id: user.id }),
    });
    const updated = await res.json();
    props.onUpdate && props.onUpdate(updated);
    props.onClose && props.onClose();
  }

  return (
    <div class="w-80 bg-[#0f0f0f] p-4 border-l border-[#202225]">
      <h3 class="font-bold mb-2">User Settings</h3>
      <form onSubmit={save} class="flex flex-col gap-2">
        <label class="text-xs opacity-60">Display name</label>
        <input name="name" defaultValue={user.name} class="bg-[#202225] p-2 rounded outline-none" />
        <div class="flex gap-2 mt-2">
          <button class="bg-[#5865f2] px-3 py-1 rounded" type="submit">Save</button>
          <button class="px-3 py-1 rounded bg-[#313338]" type="button" onClick={() => props.onClose && props.onClose()}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
