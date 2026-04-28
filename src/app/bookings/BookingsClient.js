"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  deleteBooking,
  getBookingsForGuest,
  getBookingsForOwner,
} from "@/lib/apiBookings";
import { createReview, getReviewsByGuest } from "@/lib/apiReviews";

export default function BookingsClient() {
  const router = useRouter();

  const [guestBookings, setGuestBookings] = useState([]);
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [reviewRatings, setReviewRatings] = useState({});
  const [reviewComments, setReviewComments] = useState({});
  const [reviewSavingId, setReviewSavingId] = useState(null);
  const [guestReviews, setGuestReviews] = useState([]);

  async function reloadBookings(userId) {
    const [guestData, ownerData, reviewData] = await Promise.all([
      getBookingsForGuest(userId),
      getBookingsForOwner(userId),
      getReviewsByGuest(userId),
    ]);

    setGuestBookings(guestData);
    setOwnerBookings(ownerData);
    setGuestReviews(reviewData);
  }

  function getReviewForBooking(bookingId) {
    return guestReviews.find((review) => review.booking_id === bookingId);
  }

  function hasStayEnded(endDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const checkoutDate = new Date(endDate);
    checkoutDate.setHours(0, 0, 0, 0);

    return checkoutDate < today;
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this booking?",
    );
    if (!confirmed) return;

    setError("");

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        router.push("/auth/login?next=/bookings");
        return;
      }

      await deleteBooking(id);
      await reloadBookings(userData.user.id);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleReviewSubmit(booking) {
    setError("");

    const existingReview = getReviewForBooking(booking.id);
    if (existingReview) {
      setError("You already reviewed this booking.");
      return;
    }

    if (!hasStayEnded(booking.end_date)) {
      setError("You can review a stay only after checkout date.");
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/auth/login?next=/bookings");
        return;
      }

      const rating = Number(reviewRatings[booking.id] ?? 0);
      const comment = reviewComments[booking.id]?.trim() ?? "";

      if (rating < 1 || rating > 5) {
        setError("Please select a rating from 1 to 5.");
        return;
      }

      setReviewSavingId(booking.id);

      await createReview({
        property_id: booking.property_id,
        booking_id: booking.id,
        guest_id: userData.user.id,
        rating,
        comment,
      });

      setReviewRatings((prev) => ({ ...prev, [booking.id]: 0 }));
      setReviewComments((prev) => ({ ...prev, [booking.id]: "" }));

      await reloadBookings(userData.user.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setReviewSavingId(null);
    }
  }

  useEffect(() => {
    async function load() {
      setStatus("loading");
      setError("");

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/auth/login?next=/bookings");
        return;
      }

      try {
        await reloadBookings(userData.user.id);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setError(err.message);
      }
    }

    load();
  }, [router]);

  if (status === "loading") {
    return <p className="text-sm text-gray-400">Loading...</p>;
  }

  if (status === "error") {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  const hasGuestBookings = guestBookings.length > 0;
  const hasOwnerBookings = ownerBookings.length > 0;

  if (!hasGuestBookings && !hasOwnerBookings) {
    return (
      <div className="space-y-3">
        <h1 className="text-3xl font-semibold text-gray-100">Bookings</h1>
        <p className="text-sm text-gray-400">
          You have no bookings or reservations yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <p className="mt-2 text-xl text-gray-400">
          Manage bookings you made and reservations on your properties.
        </p>
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      {hasGuestBookings && (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-100">
              My bookings
            </h2>

            <p className="text-sm text-gray-400 py-2">
              Bookings you made as a guest.
            </p>
          </div>

          <div className="space-y-4">
            {guestBookings.map((booking) => {
              const property = booking.properties;
              const existingReview = getReviewForBooking(booking.id);
              const canReview = hasStayEnded(booking.end_date);

              return (
                <div
                  key={`guest-${booking.id}`}
                  className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg"
                >
                  <div className="flex gap-4">
                    {property?.image && (
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-28 w-40 rounded-lg object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-100">
                        {property?.title ?? "Property"}
                      </h3>

                      <p className="text-sm text-gray-400">
                        {property?.location}
                      </p>

                      <div className="mt-3 space-y-1 text-sm text-gray-300">
                        <p>
                          <span className="font-medium">Start:</span>{" "}
                          {booking.start_date}
                        </p>
                        <p>
                          <span className="font-medium">End:</span>{" "}
                          {booking.end_date}
                        </p>
                        <p>
                          <span className="font-medium">Total price:</span> $
                          {booking.total_price}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() =>
                        router.push(`/bookings/${booking.id}/edit`)
                      }
                      className="rounded-xl border border-gray-700 px-4 py-2 text-sm font-medium text-gray-200 transition hover:bg-gray-800 hover:text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="rounded-xl border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-500"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="mt-5 rounded-2xl border border-gray-800 bg-gray-950 p-5">
                    {existingReview ? (
                      <p className="mb-3 text-sm font-medium text-gray-200">
                        Rated
                      </p>
                    ) : canReview ? (
                      <p className="mb-3 text-sm font-medium text-gray-200">
                        Rate this stay
                      </p>
                    ) : (
                      <p className="mb-3 text-sm font-medium text-gray-200">
                        Review unavailable
                      </p>
                    )}

                    {existingReview ? (
                      <div className="space-y-2">
                        <p className="font-medium text-yellow-400">
                          {existingReview.rating} ★
                        </p>

                        <p className="text-sm text-gray-300">
                          {existingReview.comment || "No written comment."}
                        </p>

                        <p className="text-xs text-gray-500">
                          Review submitted on{" "}
                          {new Date(
                            existingReview.created_at,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    ) : canReview ? (
                      <>
                        <div className="mb-4 flex gap-1 text-2xl">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() =>
                                setReviewRatings((prev) => ({
                                  ...prev,
                                  [booking.id]: star,
                                }))
                              }
                              className={
                                star <= (reviewRatings[booking.id] ?? 0)
                                  ? "text-yellow-400"
                                  : "text-gray-600"
                              }
                            >
                              ★
                            </button>
                          ))}
                        </div>

                        <textarea
                          value={reviewComments[booking.id] ?? ""}
                          onChange={(e) =>
                            setReviewComments((prev) => ({
                              ...prev,
                              [booking.id]: e.target.value,
                            }))
                          }
                          placeholder="Write a short review (optional)"
                          className="min-h-[100px] w-full rounded-xl border border-gray-700 bg-gray-900 px-4 py-3 text-sm text-gray-200 placeholder-gray-500 transition focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500"
                        />

                        <button
                          type="button"
                          onClick={() => handleReviewSubmit(booking)}
                          disabled={reviewSavingId === booking.id}
                          className="mt-4 rounded-xl bg-yellow-500 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-400 disabled:opacity-50"
                        >
                          {reviewSavingId === booking.id
                            ? "Saving review..."
                            : "Submit review"}
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400">
                        You can leave a review once this stay has ended.
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {hasOwnerBookings && (
        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-100">
              Reservations for my properties
            </h2>
            <p className="text-sm text-gray-400 py-2">
              Bookings guests made on properties you own.
            </p>
          </div>

          <div className="space-y-4">
            {ownerBookings.map((booking) => {
              const property = booking.properties;

              return (
                <div
                  key={`owner-${booking.id}`}
                  className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg"
                >
                  <div className="flex gap-4">
                    {property?.image && (
                      <img
                        src={property.image}
                        alt={property.title}
                        className="h-28 w-40 rounded-lg object-cover"
                      />
                    )}

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-100">
                        {property?.title ?? "Property"}
                      </h3>

                      <p className="text-sm text-gray-400">
                        {property?.location}
                      </p>

                      <div className="mt-3 space-y-1 text-sm text-gray-300">
                        <p>
                          <span className="font-medium">Guest:</span>{" "}
                          {booking.guest
                            ? `${booking.guest.first_name} ${booking.guest.last_name}`
                            : booking.guest_id}
                        </p>
                        <p>
                          <span className="font-medium">Start:</span>{" "}
                          {booking.start_date}
                        </p>
                        <p>
                          <span className="font-medium">End:</span>{" "}
                          {booking.end_date}
                        </p>
                        <p>
                          <span className="font-medium">Total price:</span> $
                          {booking.total_price}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
