"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getPropertyById } from "@/lib/apiProperties";
import {
  createBooking,
  findOverlappingBookings,
  getBookingsForProperty,
} from "@/lib/apiBookings";
import BookingForm from "@/components/bookings/BookingForm";

export default function BookPropertyClient({ id }) {
  const router = useRouter();
  const numericId = Number(id);

  const [property, setProperty] = useState(null);
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [bookedRanges, setBookedRanges] = useState([]);

  useEffect(() => {
    async function load() {
      setStatus("loading");
      setError("");

      if (!Number.isFinite(numericId)) {
        setStatus("error");
        setError(`Invalid property id: ${String(id)}`);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push(`/auth/login?next=/properties/${numericId}/book`);
        return;
      }

      setUserId(userData.user.id);

      try {
        const [propertyData, bookingData] = await Promise.all([
          getPropertyById(numericId),
          getBookingsForProperty(numericId),
        ]);

        setProperty(propertyData);
        setBookedRanges(bookingData);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setError(err.message);
      }
    }

    load();
  }, [id, numericId, router]);

  const isOwner = property?.owner_id === userId;

  async function handleCreateBooking(payload) {
    setError("");
    setIsSaving(true);

    try {
      const conflicts = await findOverlappingBookings({
        propertyId: property.id,
        startDate: payload.start_date,
        endDate: payload.end_date,
      });

      if (conflicts.length > 0) {
        setError("These dates are already booked.");
        setIsSaving(false);
        return;
      }

      await createBooking({
        property_id: property.id,
        guest_id: userId,
        ...payload,
      });

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
        <h1 className="text-2xl font-bold">Book {property.title}</h1>
        <p className="text-sm text-gray-500">{property.location}</p>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <BookingForm
        initialValues={{ startDate: "", endDate: "" }}
        price={property.price}
        onSaveBooking={handleCreateBooking}
        submitLabel="Confirm booking"
        isSaving={isSaving}
        isOwner={isOwner}
        bookedRanges={bookedRanges}
      />
    </div>
  );
}
