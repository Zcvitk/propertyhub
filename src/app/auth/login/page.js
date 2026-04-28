"use client";

import { Suspense, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
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
    router.refresh();
  }

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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-gray-600 bg-gray-900 px-4 py-3 text-sm text-gray-100 placeholder-gray-500 transition focus:border-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/30"
            />
          </div>

          <button className="w-full rounded-xl bg-yellow-500 px-4 py-3 text-sm font-semibold text-black shadow-md transition hover:bg-yellow-400">
            Login
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-red-400">{message}</p>}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<p className="text-sm text-gray-400">Loading...</p>}>
      <LoginForm />
    </Suspense>
  );
}
