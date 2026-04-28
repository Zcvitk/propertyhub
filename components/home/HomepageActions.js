"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function HomepageActions() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setIsLoggedIn(!!user);
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      {!isLoggedIn && (
        <>
          <a
            href="/auth/login"
            className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-medium text-gray-200 transition hover:bg-gray-800 hover:text-white"
          >
            Login
          </a>

          <a
            href="/auth/register"
            className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-medium text-gray-200 transition hover:bg-gray-800 hover:text-white"
          >
            Register
          </a>
        </>
      )}

      {isLoggedIn && (
        <>
          <a
            href="/dashboard"
            className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
          >
            Go to dashboard
          </a>

          <a
            href="/properties"
            className="rounded-xl border border-gray-700 px-5 py-3 text-sm font-medium text-gray-200 transition hover:bg-gray-800 hover:text-white"
          >
            View properties
          </a>
        </>
      )}
    </div>
  );
}
