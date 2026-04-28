"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { deleteProperty, getPropertyById } from "@/lib/apiProperties";
import { getReviewsForProperty } from "@/lib/apiReviews";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

export default function PropertyDetailClient({ id }) {
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [userId, setUserId] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    async function load() {
      setStatus("loading");
      setError("");

      const numericId = Number(id);
      if (!Number.isFinite(numericId)) {
        setStatus("error");
        setError(`Invalid property id: ${String(id)}`);
        return;
      }

      const { data: userData } = await supabase.auth.getUser();
      setUserId(userData.user?.id ?? null);

      try {
        const [propertyData, reviewData] = await Promise.all([
          getPropertyById(numericId),
          getReviewsForProperty(numericId),
        ]);

        setProperty(propertyData);
        setReviews(reviewData);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setError(err.message);
      }
    }

    load();
  }, [id]);

  const isOwner = property?.owner_id === userId;

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return null;

    const avg =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;

    return avg.toFixed(1);
  }, [reviews]);

  const galleryImages = useMemo(() => {
    if (!property) return [];

    if (property.images?.length > 0) return property.images;
    if (property.image) return [property.image];

    return [FALLBACK_IMAGE];
  }, [property]);

  async function handleDelete() {
    if (!property) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this property?",
    );

    if (!confirmed) return;

    setIsDeleting(true);
    setError("");

    try {
      await deleteProperty(property.id);
      router.push("/properties");
    } catch (err) {
      setError(err.message);
      setIsDeleting(false);
    }
  }

  if (status === "loading") {
    return <p className="text-sm text-gray-400">Loading property...</p>;
  }

  if (status === "error") {
    return <p className="text-sm text-red-400">{error}</p>;
  }

  const primaryImage = galleryImages[0];
  const secondaryImages = galleryImages.slice(1, 30);

  const selectedIndex = selectedImage
    ? galleryImages.findIndex((image) => image === selectedImage)
    : -1;

  function showPreviousImage() {
    if (selectedIndex === -1) return;

    const previousIndex =
      selectedIndex === 0 ? galleryImages.length - 1 : selectedIndex - 1;

    setSelectedImage(galleryImages[previousIndex]);
  }

  function showNextImage() {
    if (selectedIndex === -1) return;

    const nextIndex =
      selectedIndex === galleryImages.length - 1 ? 0 : selectedIndex + 1;

    setSelectedImage(galleryImages[nextIndex]);
  }

  return (
    <div className="mx-auto max-w-7xl">
      {/* Top section */}
      <section className="mb-8">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-2 text-sm uppercase tracking-[0.2em] text-yellow-400">
              Property details
            </p>

            <h1 className="text-3xl font-semibold text-gray-100 md:text-4xl">
              {property.title}
            </h1>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-400 md:text-base">
              <span>{property.location}</span>

              <span className="text-gray-600">•</span>

              {averageRating ? (
                <span className="text-yellow-300">
                  {averageRating} ★
                  <span className="ml-2 text-gray-400">
                    ({reviews.length} review{reviews.length === 1 ? "" : "s"})
                  </span>
                </span>
              ) : (
                <span>No ratings yet</span>
              )}
            </div>
          </div>

          <button
            onClick={() => router.push("/properties")}
            className="rounded-xl border border-gray-700 px-4 py-2 text-sm text-gray-200 transition hover:bg-gray-800 hover:text-white"
          >
            Back to properties
          </button>
        </div>

        {/* Hero image */}
        <div
          className="cursor-pointer overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 shadow-xl"
          onClick={() => setSelectedImage(primaryImage)}
        >
          <div className="relative h-[260px] md:h-[380px]">
            <img
              src={primaryImage}
              alt={property.title}
              className="h-full w-full object-cover object-center transition duration-300 hover:scale-105"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
          </div>
        </div>

        {/* Small gallery */}
        {secondaryImages.length > 0 && (
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {secondaryImages.map((url, index) => (
              <div
                key={index}
                className="cursor-pointer overflow-hidden rounded-2xl border border-gray-800 bg-gray-950"
                onClick={() => setSelectedImage(url)}
              >
                <img
                  src={url}
                  alt={`${property.title} image ${index + 2}`}
                  className="h-32 w-full object-cover object-center transition duration-300 hover:scale-105"
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Main content */}
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left column */}
        <div className="space-y-8">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-lg md:p-8">
            <h2 className="mb-4 text-2xl font-semibold text-gray-100">
              About this property
            </h2>

            <p className="text-base leading-8 text-gray-300 md:text-lg">
              {property.description || "No description provided yet."}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
              <p className="text-sm text-gray-400">Price</p>
              <p className="mt-2 text-3xl font-semibold text-yellow-300">
                ${property.price}
                <span className="ml-2 text-base font-normal text-gray-400">
                  / night
                </span>
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
              <p className="text-sm text-gray-400">Rating</p>
              <p className="mt-2 text-3xl font-semibold text-yellow-300">
                {averageRating ? `${averageRating} ★` : "New"}
              </p>
            </div>

            <div className="rounded-2xl border border-gray-800 bg-gray-900 p-5 shadow-lg">
              <p className="text-sm text-gray-400">Reviews</p>
              <p className="mt-2 text-3xl font-semibold text-gray-100">
                {reviews.length}
              </p>
            </div>
          </div>

          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-6 shadow-lg md:p-8">
            <div className="mb-6 flex items-center justify-between gap-4">
              <h2 className="text-2xl font-semibold text-gray-100">Reviews</h2>

              {reviews.length > 0 && (
                <span className="rounded-full border border-gray-700 bg-gray-800/60 px-3 py-1 text-sm text-gray-300">
                  {reviews.length} review{reviews.length === 1 ? "" : "s"}
                </span>
              )}
            </div>

            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-700 bg-gray-950/60 p-6 text-sm text-gray-400">
                No reviews yet. The first guest review will appear here.
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="rounded-2xl border border-gray-800 bg-gray-950/60 p-5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-300">
                          {review.rating} ★
                        </span>
                      </div>

                      <p className="text-sm text-gray-500">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </div>

                    <p className="mt-4 text-sm leading-7 text-gray-300 md:text-base">
                      {review.comment || "No written comment."}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right column */}
        <aside className="lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-3xl border border-gray-800 bg-gray-900 p-7 shadow-xl">
            <p className="text-sm uppercase tracking-[0.18em] text-gray-400">
              {isOwner ? "Owner actions" : "Booking"}
            </p>

            <div className="mt-4">
              <p className="text-3xl font-semibold text-yellow-300">
                ${property.price}
                <span className="ml-2 text-base font-normal text-gray-400">
                  / night
                </span>
              </p>

              <p className="mt-2 text-sm text-gray-400">
                {averageRating
                  ? `${averageRating} ★ · ${reviews.length} review${reviews.length === 1 ? "" : "s"}`
                  : "No ratings yet"}
              </p>
            </div>

            <div className="my-6 h-px bg-gray-800" />

            {isOwner ? (
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/properties/${property.id}/edit`)}
                  className="w-full rounded-xl border border-gray-700 px-4 py-3 text-sm font-medium text-gray-200 transition hover:bg-gray-800 hover:text-white"
                >
                  Edit property
                </button>

                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="w-full rounded-xl bg-red-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-red-500 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete property"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/properties/${property.id}/book`)}
                  className="w-full rounded-xl bg-yellow-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-yellow-400"
                >
                  Reserve now
                </button>

                <p className="text-sm leading-6 text-gray-400">
                  You will choose dates and confirm your booking on the next
                  screen.
                </p>
              </div>
            )}
          </div>
        </aside>
      </section>

      {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setSelectedImage(null)}
        >
          {/* LEFT ARROW */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showPreviousImage();
            }}
            className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-xl text-white transition hover:bg-black/80"
          >
            ‹
          </button>

          {/* RIGHT ARROW */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              showNextImage();
            }}
            className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 px-4 py-3 text-xl text-white transition hover:bg-black/80"
          >
            ›
          </button>

          {/* IMAGE CONTAINER */}
          <div
            className="relative max-h-[90vh] max-w-6xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedImage(null)}
              className="absolute right-3 top-3 z-10 rounded-full bg-black/60 px-3 py-1 text-sm text-white transition hover:bg-black/80"
            >
              ✕
            </button>

            <img
              src={selectedImage}
              alt={property.title}
              className="max-h-[90vh] max-w-full rounded-2xl object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
