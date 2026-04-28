"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  findOverlappingBookings,
  getBookingById,
  updateBooking,
} from "@/lib/apiBookings";
import BookingForm from "@/components/bookings/BookingForm";

export default function EditBookingClient({ id }) {
  const router = useRouter();
  const numericId = Number(id);

  const [existingBooking, setExistingBooking] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setStatus("loading");
      setError("");

      if (!Number.isFinite(numericId)) {
        setStatus("error");
        setError(`Invalid booking id: ${String(id)}`);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push(`/auth/login?next=/bookings/${numericId}/edit`);
        return;
      }

      try {
        const data = await getBookingById(numericId);

        if (data.guest_id !== userData.user.id) {
          setStatus("error");
          setError("You are not allowed to edit this booking.");
          return;
        }

        setExistingBooking(data);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setError(err.message);
      }
    }

    load();
  }, [id, numericId, router]);

  async function handleUpdateBooking(payload) {
    setError("");
    setIsSaving(true);

    try {
      const conflicts = await findOverlappingBookings({
        propertyId: existingBooking.property_id,
        startDate: payload.start_date,
        endDate: payload.end_date,
        ignoreBookingId: numericId,
      });

      if (conflicts.length > 0) {
        setError("These dates are already booked.");
        setIsSaving(false);
        return;
      }

      await updateBooking(numericId, payload);
      router.push("/bookings");
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  }

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error") {
    return <p className="text-sm text-red-600">{error}</p>;
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Edit booking for {existingBooking.properties?.title}
        </h1>
        <p className="text-sm text-gray-500">
          {existingBooking.properties?.location}
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <BookingForm
        initialValues={{
          startDate: existingBooking.start_date,
          endDate: existingBooking.end_date,
        }}
        price={existingBooking.properties?.price}
        onSaveBooking={handleUpdateBooking}
        submitLabel="Save changes"
        isSaving={isSaving}
      />
    </div>
  );
}
