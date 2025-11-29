// DatabaseSelector.jsx
import { db, auth } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function DatabaseSelector(props) {
  const chooseDB = async (dbChoice) => {
    await setDoc(
      doc(db, "users", auth.currentUser.uid),
      { database: dbChoice },
      { merge: true }
    );

    props.onChoose();
  };

  return (
    <div class="text-white w-full h-full flex items-center justify-center">
      <div class="bg-[#2b2d31] p-6 rounded-lg space-y-4 w-96 text-center">

        <h1 class="text-xl font-bold">Choose your database</h1>
        <p class="opacity-60 text-sm">You can change this later.</p>

        <button class="w-full bg-[#5865f2] p-2 rounded" onClick={() => chooseDB("firestore")}>
          Firestore
        </button>

        <button class="w-full bg-[#3d9c7c] p-2 rounded" onClick={() => chooseDB("supabase")}>
          Supabase
        </button>

        <button class="w-full bg-[#4c8cbf] p-2 rounded" onClick={() => chooseDB("mongodb")}>
          MongoDB Atlas
        </button>
      </div>
    </div>
  );
}
