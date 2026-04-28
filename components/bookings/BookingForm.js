"use client";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { useMemo, useState } from "react";

export default function BookingForm({
  initialValues,
  price,
  onSaveBooking,
  submitLabel = "Save",
  isSaving = false,
  isOwner = false,
  bookedRanges = [],
}) {
  const [startDate, setStartDate] = useState(initialValues.startDate ?? "");
  const [endDate, setEndDate] = useState(initialValues.endDate ?? "");
  const [error, setError] = useState("");

  function formatDate(date) {
    if (!date) return "";
    return date.toLocaleDateString("en-CA"); // always YYYY-MM-DD
  }

  function startOfToday() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  }

  const today = startOfToday();

  const disabledRanges = bookedRanges.map((b) => ({
    from: new Date(b.start_date),
    to: new Date(b.end_date),
  }));

  const disabledDays = [{ before: today }, ...disabledRanges];

  const nights = useMemo(() => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);

    const diffMs = end - start;
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    return diffDays > 0 ? diffDays : 0;
  }, [startDate, endDate]);

  const totalPrice = useMemo(() => {
    if (!price || nights <= 0) return 0;
    return nights * Number(price);
  }, [price, nights]);

  function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!startDate) return setError("Start date is required.");
    if (!endDate) return setError("End date is required.");
    if (nights <= 0) return setError("End date must be after start date.");
    if (isOwner) return setError("You cannot book your own property.");

    onSaveBooking({
      start_date: startDate,
      end_date: endDate,
      total_price: totalPrice,
    });
  }

  return (
    <div>
      {isOwner && (
        <p className="mb-4 text-sm text-red-600">
          You cannot book your own property.
        </p>
      )}

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-3">
          <label className="text-sm font-medium">Select dates</label>
          <DayPicker
            mode="range"
            numberOfMonths={2}
            pagedNavigation
            excludeDisabled
            min={1}
            selected={{
              from: startDate ? new Date(startDate) : undefined,
              to: endDate ? new Date(endDate) : undefined,
            }}
            onSelect={(range) => {
              setError("");
              if (!range) {
                setStartDate("");
                setEndDate("");
                return;
              }

              setStartDate(formatDate(range.from));
              setEndDate(formatDate(range.to));
            }}
            disabled={disabledDays}
            modifiers={{
              booked: disabledRanges,
              today: today,
            }}
            modifiersClassNames={{
              booked: "bg-red-200 text-red-800",
              today: "ring-2 ring-blue-500 font-bold",
            }}
            className="mx-auto"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md border p-3">
            <p className="text-gray-500">Check-in</p>
            <p className="font-medium">{startDate || "Not selected"}</p>
          </div>
          <div className="rounded-md border p-3">
            <p className="text-gray-500">Check-out</p>
            <p className="font-medium">{endDate || "Not selected"}</p>
          </div>
        </div>

        <div className="rounded-md border p-4 text-sm space-y-1">
          <p>
            <span className="font-medium">Price per night:</span> ${price}
          </p>
          <p>
            <span className="font-medium">Nights:</span> {nights}
          </p>
          <p className="pt-2 border-t font-semibold">Total: ${totalPrice}</p>
        </div>

        <button
          type="submit"
          disabled={isSaving || isOwner}
          className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
        >
          {isSaving ? "Saving..." : submitLabel}
        </button>
      </form>
    </div>
  );
}
