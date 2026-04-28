"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PropertyForm from "@/components/properties/PropertyForm";
import { supabase } from "@/lib/supabase";
import { createProperty } from "@/lib/apiProperties";

export default function NewPropertyClient() {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(payload) {
    setIsSaving(true);
    setError("");

    // 1) Must be logged in (RLS needs auth.uid())
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError) {
      setError(userError.message);
      setIsSaving(false);
      return;
    }

    if (!userData.user) {
      router.push("/auth/login");
      return;
    }

    try {
      // 2) Insert with owner_id (required for your ownership model)
      const created = await createProperty({
        ...payload,
        owner_id: userData.user.id,
      });

      // 3) Go to the newly created property page
      router.push(`/properties/${created.id}`);
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add new property</h1>
        <p className="text-sm text-gray-500">
          Fill out the details below and save.
        </p>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <PropertyForm
        initialValues={{}}
        onSubmit={handleCreate}
        submitLabel="Create property"
        isSaving={isSaving}
      />
    </div>
  );
}
