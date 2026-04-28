import { supabase } from "@/lib/supabase";

const SORT_MAP = {
  "name-asc": { column: "title", ascending: true },
  "name-desc": { column: "title", ascending: false },

  "price-asc": { column: "price", ascending: true },
  "price-desc": { column: "price", ascending: false },

  newest: { column: "created_at", ascending: false },
  oldest: { column: "created_at", ascending: true },
};

export async function getProperties(sort = "newest") {
  const sortOption = SORT_MAP[sort] ?? SORT_MAP["newest"];

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order(sortOption.column, { ascending: sortOption.ascending });

  if (error) {
    console.error(error);
    throw new Error("Failed to fetch properties...");
  }
  return data;
}

export async function getPropertyById(id) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase getPropertyById error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });

    throw new Error(error.message || "Property not found");
  }

  return data;
}

export async function createProperty(newProperty) {
  const { data, error } = await supabase
    .from("properties")
    .insert([newProperty])
    .select()
    .single();

  if (error) {
    console.error("createProperty", error.message);
    throw new Error(error.message || "Can't create property");
  }
  return data;
}

export async function updateProperty(id, updates) {
  const { data, error } = await supabase
    .from("properties")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("updateProperty", error.message);
    throw new Error(error.message || "Can't update property");
  }
  return data;
}

export async function deleteProperty(id) {
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) {
    console.error("deleteProperty", error.message);
    throw new Error(error.message || "Can't delete property");
  }
}

export async function getPropertiesByOwner(ownerId) {
  const { data, error } = await supabase
    .from("properties")
    .select("id")
    .eq("owner_id", ownerId);

  if (error) {
    console.error("getPropertiesByOwner", error.message);
    throw new Error(error.message || "Can't fetch owner properties");
  }

  return data;
}

export async function getHomepageCarouselProperties(limit = 5, poolSize = 12) {
  const { data, error } = await supabase
    .from("properties")
    .select("id, title, image")
    .not("image", "is", null)
    .limit(poolSize);

  if (error) {
    console.error(error.message);
    throw new Error(error.message);
  }

  const shuffled = [...(data || [])].sort(() => Math.random() - 0.5);

  return shuffled.slice(0, limit);
}
