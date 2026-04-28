"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import PropertyList from "@/components/properties/PropertyList";
import SortDropdown from "@/lib/ui/SortDropdown";
import { getProperties } from "@/lib/apiProperties";
import { getAllReviews } from "@/lib/apiReviews";

export default function PropertiesClient({ initialSort = "newest" }) {
  const searchParams = useSearchParams();
  const sortFromUrl = searchParams.get("sort") ?? initialSort;

  const [properties, setProperties] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setStatus("loading");
      setError("");

      try {
        const [propertyData, reviewData] = await Promise.all([
          getProperties(sortFromUrl),
          getAllReviews(),
        ]);

        const propertiesWithRatings = propertyData.map((property) => {
          const propertyReviews = reviewData.filter(
            (review) => review.property_id === property.id,
          );

          const reviewsCount = propertyReviews.length;

          const averageRating =
            reviewsCount > 0
              ? (
                  propertyReviews.reduce(
                    (sum, review) => sum + review.rating,
                    0,
                  ) / reviewsCount
                ).toFixed(1)
              : null;

          return {
            ...property,
            averageRating,
            reviewsCount,
          };
        });

        if (sortFromUrl === "rating-desc") {
          propertiesWithRatings.sort(
            (a, b) =>
              (Number(b.averageRating) || 0) - (Number(a.averageRating) || 0),
          );
        }

        setProperties(propertiesWithRatings);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setError(err.message);
      }
    }

    load();
  }, [sortFromUrl]);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">List of properties</h1>
        <SortDropdown />
      </div>

      {status === "loading" && <p>Loading...</p>}
      {status === "error" && <p className="text-sm text-red-600">{error}</p>}
      {status === "ready" && <PropertyList properties={properties} />}
    </div>
  );
}
