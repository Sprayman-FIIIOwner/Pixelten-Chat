// src/auth/Login.jsx
import { createSignal } from "solid-js";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login(props) {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");

  const login = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email(), password());
      props.onAuthSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div class="w-full flex items-center justify-center bg-[#1e1f22]">
      <form onSubmit={login} class="bg-[#2b2d31] p-6 rounded w-80">
        <h1 class="text-xl font-bold mb-4 text-center">Login</h1>

        <input
          class="w-full mb-3 p-2 bg-[#1e1f22] rounded"
          type="email"
          placeholder="Email"
          value={email()}
          onInput={(e) => setEmail(e.target.value)}
        />
        <input
          class="w-full mb-3 p-2 bg-[#1e1f22] rounded"
          type="password"
          placeholder="Password"
          value={password()}
          onInput={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          class="w-full bg-[#5865f2] py-2 rounded hover:bg-[#4752c4]"
        >
          Login
        </button>

        <p class="text-red-400 text-sm mt-2">{error()}</p>

        <button
          type="button"
          class="mt-4 w-full text-sm opacity-70 hover:opacity-100"
          onClick={props.switchToSignup}
        >
          Create an account
        </button>
      </form>
    </div>
  );
}
