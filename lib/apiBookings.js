import { supabase } from "@/lib/supabase";

export async function createBooking(newBooking) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([newBooking])
    .select()
    .single();

  if (error) {
    console.error("createBooking", error.message);
    throw new Error(error.message || "Can't create booking");
  }

  return data;
}

export async function getBookingsForGuest(guestId) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `*, properties (
      id,
      title,
      location,
      image,
      price,
      owner_id)`,
    )
    .eq("guest_id", guestId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getBookingsForGuest", error.message);
    throw new Error(error.message || "Can't fetch guest bookings");
  }
  return data;
}

export async function getBookingsForOwner(ownerId) {
  const { data: ownerProperties, error: propertiesError } = await supabase
    .from("properties")
    .select("id")
    .eq("owner_id", ownerId);

  if (propertiesError) {
    console.error(
      "getBookingsForOwner properties step",
      propertiesError.message,
    );
    throw new Error(propertiesError.message || "Can't fetch owner properties");
  }

  if (!ownerProperties || ownerProperties.length === 0) {
    return [];
  }

  const propertyIds = ownerProperties.map((property) => property.id);

  const { data, error } = await supabase
    .from("bookings")
    .select(
      `*, properties (
        id,
        title,
        location,
        image,
        price,
        owner_id
      ),
      guest:profiles (
      first_name,
      last_name
    )
  `,
    )
    .in("property_id", propertyIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getBookingsForOwner bookings step", error.message);
    throw new Error(error.message || "Can't fetch owner bookings");
  }

  return data;
}
export async function getBookingById(id) {
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `*, properties (
      id,
      title,
      location,
      image,
      price)`,
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("getBookingById", error.message);
    throw new Error(error.message || "Can't fetch booking");
  }
  return data;
}

export async function updateBooking(id, updates) {
  const { data, error } = await supabase
    .from("bookings")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateBooking", error.message);
    throw new Error(error.message || "Can't update booking");
  }
  return data;
}

export async function deleteBooking(id) {
  const { error } = await supabase.from("bookings").delete().eq("id", id);

  if (error) {
    console.error("deleteBooking", error.message);
    throw new Error(error.message || "Can't delete booking");
  }
}

export async function findOverlappingBookings({
  propertyId,
  startDate,
  endDate,
  ignoreBookingId,
}) {
  let query = supabase
    .from("bookings")
    .select("id, start_date, end_date, property_id")
    .eq("property_id", propertyId)
    .lt("start_date", endDate)
    .gt("end_date", startDate);

  if (ignoreBookingId) {
    query = query.neq("id", ignoreBookingId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getConflictingBookings", error.message);
    throw new Error(error.message || "Can't check booking availability");
  }
  return data;
}

export async function getBookingsForProperty(propertyId) {
  const { data, error } = await supabase
    .from("bookings")
    .select("id, start_date, end_date, property_id")
    .eq("property_id", propertyId)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("getBookingsForProperty", error.message);
    throw new Error(error.message || "Can't fetch property bookings");
  }

  return data;
}
