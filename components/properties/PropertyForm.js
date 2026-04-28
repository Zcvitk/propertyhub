"use client";

import { useState } from "react";
import Dropzone from "@/components/Dropzone";

export default function PropertyForm({
  initialValues,
  onSubmit,
  submitLabel = "Save",
  isSaving = false,
}) {
  const [title, setTitle] = useState(initialValues.title ?? "");
  const [location, setLocation] = useState(initialValues.location ?? "");
  const [price, setPrice] = useState(initialValues.price ?? "");
  const [description, setDescription] = useState(
    initialValues.description ?? "",
  );

  const [imageUrls, setImageUrls] = useState(
    initialValues.images ?? (initialValues.image ? [initialValues.image] : []),
  );
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    const payload = {
      title: title.trim(),
      location: location.trim(),
      price: Number(price),
      description: description.trim(),

      image: imageUrls[0] ?? "",
      images: imageUrls,
    };

    if (!payload.title) return setError("Title is required.");
    if (!payload.location) return setError("Location is required.");
    if (!Number.isFinite(payload.price))
      return setError("Price must be a number.");
    if (!payload.description) return setError("Description is required.");

    if (imageUrls.length === 0)
      return setError("At least one image is required.");

    console.log("imageUrls before submit:", imageUrls);
    console.log("payload before submit:", payload);
    onSubmit(payload);
  }

  function handleSetMain(clickedIndex) {
    setImageUrls((prev) => {
      const selected = prev[clickedIndex];

      const rest = prev.filter((_, i) => i !== clickedIndex);

      return [selected, ...rest];
    });
  }
  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="space-y-1">
        <label className="text-sm font-medium">Title</label>
        <input
          className="w-full rounded-md border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Location</label>
        <input
          className="w-full rounded-md border px-3 py-2"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-sm font-medium">Price</label>
          <input
            className="w-full rounded-md border px-3 py-2"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Property Images</label>
        <Dropzone
          onUpload={(urls) => setImageUrls((prev) => [...prev, ...urls])}
        />
        <p className="text-sm text-gray-500">
          Uploaded image count: {imageUrls.length}
        </p>
      </div>

      {imageUrls.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {imageUrls.map((url, index) => (
            <div key={index} className="relative">
              <img
                src={url}
                alt={`Property image ${index + 1}`}
                onClick={() => handleSetMain(index)}
                className={`h-24 w-full cursor-pointer rounded-md object-cover ${
                  index === 0 ? "ring-2 ring-yellow-500" : ""
                }`}
              />

              <button
                type="button"
                onClick={() =>
                  setImageUrls((prev) => prev.filter((_, i) => i !== index))
                }
                className="absolute top-1 right-1 rounded bg-black/70 px-2 py-1 text-xs text-white hover:bg-black"
              >
                ✕
              </button>

              {index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-yellow-500 px-2 py-1 text-xs font-medium text-black">
                  Main
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="space-y-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          className="min-h-[120px] w-full rounded-md border px-3 py-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <button
        disabled={isSaving}
        className="rounded-md bg-black px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {isSaving ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}
