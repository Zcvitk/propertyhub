import Link from "next/link";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80";

export default function PropertyCard({ property }) {
  const {
    id,
    title,
    description,
    image,
    images,
    location,
    price,
    averageRating,
    reviewsCount,
  } = property;

  const imageSrc = images?.length > 0 ? images[0] : image || FALLBACK_IMAGE;

  const badgeLabel = averageRating
    ? Number(averageRating) >= 4.8
      ? "Top rated"
      : `${reviewsCount ?? 0} review${reviewsCount === 1 ? "" : "s"}`
    : "New";

  return (
    <Link href={`/properties/${id}`} className="block h-full cursor-pointer">
      <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-800 bg-gray-900 shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-yellow-400/40">
        <div className="relative h-56 overflow-hidden rounded-t-2xl bg-gray-950">
          <img
            src={imageSrc}
            alt={title}
            className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>

        <div className="flex h-full flex-col p-5">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-lg font-semibold text-gray-100">
                {title}
              </h2>
              <p className="mt-1 truncate text-sm text-gray-400">{location}</p>
            </div>

            {averageRating ? (
              <div className="shrink-0 rounded-full border border-gray-700 px-3 py-1 text-sm font-medium text-yellow-400">
                {averageRating} ★
              </div>
            ) : (
              <div className="shrink-0 rounded-full border border-gray-800 px-3 py-1 text-xs text-gray-500">
                New
              </div>
            )}
          </div>

          <div className="mb-3 flex items-center gap-2">
            <span className="truncate rounded-full border border-gray-700 bg-gray-800/60 px-2.5 py-1 text-xs text-gray-300">
              {badgeLabel}
            </span>
          </div>

          <p className="truncate text-sm leading-6 text-gray-400">
            {description || "No description provided."}
          </p>

          <div className="mt-auto flex items-end justify-between gap-3 pt-4">
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold text-yellow-300">
                ${price}
                <span className="ml-1 text-sm font-normal text-gray-400">
                  / night
                </span>
              </p>
            </div>

            {averageRating ? (
              <p className="shrink-0 truncate text-sm text-gray-400">
                {reviewsCount} review{reviewsCount === 1 ? "" : "s"}
              </p>
            ) : (
              <p className="shrink-0 truncate text-sm text-gray-500">
                No ratings yet
              </p>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
