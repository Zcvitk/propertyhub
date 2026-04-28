import { supabase } from "./supabase";

export async function createReview(newReview) {
  const { data, error } = await supabase
    .from("reviews")
    .insert([newReview])
    .select()
    .single();

  if (error) {
    console.error("createReview", error.message);
    throw new Error(error.message || "Can't create review");
  }
  return data;
}

export async function getReviewsForProperty(propertyId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("property_id", propertyId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getReviewsForProperty", error.message);
    throw new Error(error.message || "Can't fetch reviews");
  }
  return data;
}

export async function getAllReviews() {
  const { data, error } = await supabase
    .from("reviews")
    .select("property_id, rating");

  if (error) {
    console.error("getAllReviews", error.message);
    throw new Error(error.message || "Can't fetch reviews");
  }

  return data;
}

export async function getReviewByBookingId(bookingId) {
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("booking_id", bookingId)
    .maybeSingle();

  if (error) {
    console.error("getReviewByBookingId", error.message);
    throw new Error(error.message || "Can't fetch review");
  }

  return data;
}

export async function getReviewsByGuest(guestId) {
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, booking_id, property_id, guest_id, rating, comment, created_at",
    )
    .eq("guest_id", guestId);

  if (error) {
    console.error("getReviewsByGuest", error.message);
    throw new Error(error.message || "Can't fetch guest reviews");
  }

  return data;
}
