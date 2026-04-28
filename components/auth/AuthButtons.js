"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const [user, setUser] = useState(undefined);
  const router = useRouter();

  useEffect(() => {
    let isMounted = true;

    async function loadUser() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (!isMounted) return;

      if (error) {
        console.error("getSession error:", error.message);
        setUser(null);
        return;
      }

      setUser(session?.user ?? null);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
    router.refresh();
  }

  if (user === undefined) {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  if (!user) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href="/auth/login"
          className="rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-800 hover:text-white"
        >
          Login
        </Link>

        <Link
          href="/auth/register"
          className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-black shadow-md transition hover:bg-yellow-400"
        >
          Register
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <Link
        href="/properties/new"
        className="rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-black shadow-md transition hover:bg-yellow-400"
      >
        Add property
      </Link>

      <Link
        href="/bookings"
        className="rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-800 hover:text-white"
      >
        Bookings
      </Link>

      <span className="break-all max-w-full text-sm text-gray-400">
        {user.email}
      </span>

      <button
        onClick={handleLogout}
        className="rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-800 hover:text-white"
      >
        Logout
      </button>
    </div>
  );
}
