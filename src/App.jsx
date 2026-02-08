import { useState } from "react";
import { supabase } from "./lib/supabase";

export default function App() {
  const [email, setEmail] = useState("admin@gh.com");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Login gagal: " + error.message);
      console.log(error);
    } else {
      alert("Login sukses 🔥");
      console.log("DATA LOGIN:", data);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert("Logout sukses 👋");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-[400px]">
        <h1 className="text-2xl font-bold mb-5 text-blue-900">
          Login Dulu Atuh 
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col gap-3">
          <input
            type="email"
            className="border p-3 rounded"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            className="border p-3 rounded"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-900 text-white py-3 rounded font-semibold hover:bg-blue-800"
          >
            Login
          </button>
        </form>

        <button
          onClick={handleLogout}
          className="mt-4 w-full bg-red-600 text-white py-3 rounded font-semibold hover:bg-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
