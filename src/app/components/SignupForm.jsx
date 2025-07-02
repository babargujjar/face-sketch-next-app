"use client";
import { useState } from "react";
import { toast, Toaster } from "sonner";
import { signUp } from "../lib/auth";
import { useRouter } from "next/navigation";

export default function SignupForm({ switchToLogin }) {
    const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    username: "",
    phone: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    const { data, error } = await signUp(form);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Signup successful! Check your email.");
      console.log('data', data)

      if (data?.session?.access_token) {
        const token = data.session.access_token;
        document.cookie = `authToken=${token}; path=/;`;
        router.push("/");
        setForm({
          email: "",
          password: "",
          username: "",
          phone: "",
        });
      } else {
        toast.info("Please verify your email before logging in.");
      }
      
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-md shadow-lg rounded-2xl p-8 transition-all">
      <h1 className="text-3xl font-bold text-indigo-700 text-center mb-2">
        Face Sketch App
      </h1>
      <p className="text-center text-gray-700 mb-6">
        Register to access your sketch dashboard.
      </p>

      <form onSubmit={handleSignup} className="space-y-4">
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          required
          placeholder="Username"
          className="inputcss text-black"
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          required
          placeholder="Phone"
          className="inputcss text-black"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="inputcss text-black"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Password"
          className="inputcss text-black"
        />
        <button
          type="submit"
          className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Sign Up
        </button>
      </form>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
        <button
          onClick={switchToLogin}
          className="w-full cursor-pointer bg-white hover:bg-gray-100 text-indigo-600 font-medium py-2 rounded-lg border border-indigo-300 shadow-sm transition"
        >
          Login
        </button>
      </div>
      <Toaster position="top-right" richColors />
    </div>
  );
}
