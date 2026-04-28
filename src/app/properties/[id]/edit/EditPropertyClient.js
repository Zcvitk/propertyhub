"use client";

import PropertyForm from "@/components/properties/PropertyForm";
import { getPropertyById, updateProperty } from "@/lib/apiProperties";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EditPropertyClient({ id }) {
  const router = useRouter();

  const [property, setProperty] = useState(null);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
      if (!userData.user) {
        router.push("/auth/login");
        return;
      }

      try {
        const data = await getPropertyById(numericId);

        if (data.owner_id !== userData.user.id) {
          setStatus("error");
          setError("You are not allowed to edit this property");
          return;
        }

        setProperty(data);
        setStatus("ready");
      } catch (err) {
        setStatus("error");
        setError(err.message);
      }
    }

    load();
  }, [id, router]);

  async function handleUpdate(payload) {
    setIsSaving(true);
    setError("");

    const numericId = Number(id);

    try {
      const updated = await updateProperty(numericId, payload);
      router.push(`/properties/${updated.id}`);
    } catch (err) {
      setError(err.message);
      setIsSaving(false);
    }
  }

  if (status === "loading") return <p>Loading...</p>;
  if (status === "error")
    return <p className="text-sm text-red-600">{error}</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Edit property</h1>
        <p className="text-sm text-gray-500">
          Update the property details below.
        </p>
      </div>

      <PropertyForm
        initialValues={property}
        onSubmit={handleUpdate}
        submitLabel="Save changes"
        isSaving={isSaving}
      />
    </div>
  );
}
