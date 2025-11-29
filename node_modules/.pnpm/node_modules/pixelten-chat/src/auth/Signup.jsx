// Signup.jsx
import { createSignal } from "solid-js";
import { auth, googleProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

export default function Signup(props) {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");

  const signupEmail = async () => {
    await createUserWithEmailAndPassword(auth, email(), password());
    props.onAuthSuccess();
  };

  const signupGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    props.onAuthSuccess();
  };

  return (
    <div class="flex flex-col gap-4 w-80 mx-auto mt-20 text-white">
      <h1 class="text-2xl font-bold">Create your account</h1>

      <input
        placeholder="Email"
        class="p-2 bg-[#2b2d31] rounded"
        onInput={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        class="p-2 bg-[#2b2d31] rounded"
        onInput={(e) => setPassword(e.target.value)}
      />

      <button class="bg-[#5865f2] p-2 rounded" onClick={signupEmail}>
        Sign Up
      </button>

      <button class="bg-[#4285F4] p-2 rounded" onClick={signupGoogle}>
        Continue with Google
      </button>

      <button class="opacity-60" onClick={props.switchToLogin}>
        Already have an account?
      </button>
    </div>
  );
}
