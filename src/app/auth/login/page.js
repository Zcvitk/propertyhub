"use client";

import { supabase } from "@/lib/supabase";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      return;
    }
    const next = searchParams.get("next") || "/";
    router.push(next);
    router.refresh?.();
  }

  <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-[#f5f5f5] px-4">
    <div className="w-full max-w-md rounded-2xl border border-[#e7e7e7] bg-white p-8 shadow-sm">
      <div className="mb-8">
        <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-[#c9a227]">
          PropertyHub
        </p>
        <h1 className="text-3xl font-semibold text-[#111111]">Welcome back</h1>
        <p className="mt-2 text-sm text-gray-500">
          Sign in to access your bookings and properties.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#2d2d2d]">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#2d2d2d]">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition"
          />
        </div>

        <button className="w-full rounded-xl bg-[#111111] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#222222]">
          Login
        </button>
      </form>

      {message && <p className="mt-4 text-sm text-red-600">{message}</p>}
    </div>
  </div>;
  return (
    <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-gray-900 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-700 bg-gray-800 p-8 shadow-2xl">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-yellow-500">
            PropertyHub
          </p>
          <h1 className="text-3xl font-semibold text-gray-100">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-400">
            Sign in to access your bookings and properties.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30 focus:border-yellow-500 transition"
            />
          </div>

          <button className="w-full rounded-xl bg-yellow-500 px-4 py-3 text-sm font-semibold text-black hover:bg-yellow-400 transition shadow-md">
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
      </div>
    </div>
  );
}
