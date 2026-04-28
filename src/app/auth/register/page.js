"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: "http://localhost:3000/auth/callback",
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Check your email to confirm your account.");
  }

  <div>
    <h1>Register</h1>
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button>Register</button>
    </form>

    {message && <p className="mt-4 text-sm">{message}</p>}
  </div>;
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-8 shadow-2xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-yellow-500">
            PropertyHub
          </p>
          <h1 className="text-3xl font-semibold text-gray-100">
            Create account
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Register to start booking stays and managing properties.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 transition focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 transition focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-yellow-500 px-4 py-3 text-sm font-semibold text-black shadow-md transition hover:bg-yellow-400"
          >
            Register
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
      </div>
    </div>
  );
}
