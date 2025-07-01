"use client";
import { useState } from "react";
import { login } from "../lib/auth";
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";

export default function LoginForm({ switchToSignup }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const {data, error } = await login(email, password);
    if (error) {
      toast.error(error.message || "Login failed");
    } else {
      toast.success("Login successful!");
      const token = data.session.access_token;
      document.cookie = `authToken=${token}; path=/;`;

      router.push("/");
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-8 transition-all">
      <h1 className="text-3xl font-bold text-indigo-700 text-center mb-2">
        Face Sketch App
      </h1>
      <p className="text-center text-gray-700 mb-6">
        Login to access your sketch dashboard.
      </p>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          type="email"
          placeholder="Email"
          className="inputcss text-black"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="Password"
          className="inputcss text-black"
        />

        <button
          type="submit"
          className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Login
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 mb-2">Don't have an account?</p>
        <button
          onClick={switchToSignup}
          className="w-full cursor-pointer bg-white hover:bg-gray-100 text-indigo-600 font-medium py-2 rounded-lg border border-indigo-300 shadow-sm transition"
        >
          Sign Up
        </button>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
