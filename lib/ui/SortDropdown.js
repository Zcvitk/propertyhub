"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "name-asc", label: "Name (A → Z)" },
  { value: "name-desc", label: "Name (Z → A)" },
  { value: "price-asc", label: "Price (low → high)" },
  { value: "price-desc", label: "Price (high → low)" },
  { value: "rating-desc", label: "Rating (high → low)" },
];

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") ?? "newest";

  function handleChange(e) {
    const nextSort = e.target.value;

    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", nextSort);

    router.push(`${pathname}?${params.toString()}`);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm text-gray-400">
        Sort by
      </label>

      <div className="relative">
        <select
          id="sort"
          value={currentSort}
          onChange={handleChange}
          className="appearance-none rounded-xl border border-gray-700 bg-gray-900 px-4 py-2 pr-10 text-sm text-gray-100 shadow-sm outline-none transition focus:border-yellow-400"
        >
          {OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400">
          ▼
        </span>
      </div>
    </div>
  );
}
