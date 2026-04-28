"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getBookingsForGuest, getBookingsForOwner } from "@/lib/apiBookings";
import { getPropertiesByOwner } from "@/lib/apiProperties";
import Dropzone from "@/components/Dropzone";

export default function DashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState({
    properties: 0,
    guestBookings: 0,
    ownerReservations: 0,
  });
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      setStatus("loading");
      setError("");

      try {
        const { data: userData } = await supabase.auth.getUser();

        if (!userData.user) {
          router.push("/auth/login?next=/dashboard");
          return;
        }

        const userId = userData.user.id;

        const [properties, guestBookings, ownerReservations] =
          await Promise.all([
            getPropertiesByOwner(userId),
            getBookingsForGuest(userId),
            getBookingsForOwner(userId),
          ]);

        setStats({
          properties: properties.length,
          guestBookings: guestBookings.length,
          ownerReservations: ownerReservations.length,
        });

        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setError(err.message);
      }
    }

    loadDashboard();
  }, [router]);

  if (status === "loading") return <p>Loading dashboard...</p>;
  if (status === "error") {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-yellow-500">
          PropertyHub
        </p>
        <h1 className="mt-1 text-3xl font-semibold text-gray-100">
          Welcome back
        </h1>
        <p className="mt-2 text-gray-400">
          Manage your properties, bookings, and reservations in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
          <p className="text-sm text-gray-400">My Properties</p>
          <p className="mt-2 text-3xl font-semibold text-yellow-400">
            {stats.properties}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
          <p className="text-sm text-gray-400">My Bookings</p>
          <p className="mt-2 text-3xl font-semibold text-yellow-400">
            {stats.guestBookings}
          </p>
        </div>

        <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
          <p className="text-sm text-gray-400">Reservations</p>
          <p className="mt-2 text-3xl font-semibold text-yellow-400">
            {stats.ownerReservations}
          </p>
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => router.push("/properties/new")}
          className="rounded-xl bg-yellow-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
        >
          Add property
        </button>

        <button
          onClick={() => router.push("/bookings")}
          className="rounded-xl border border-gray-700 px-5 py-3 text-sm text-gray-200 transition hover:bg-gray-800"
        >
          View bookings
        </button>
      </div>

      <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6">
        <h2 className="mb-3 text-lg font-semibold text-gray-100">
          What you can do here
        </h2>

        <ul className="space-y-2 text-sm text-gray-400">
          <li>• Add and manage your properties</li>
          <li>• Track bookings you made</li>
          <li>• See reservations from guests</li>
        </ul>
      </div>
    </div>
  );
}
