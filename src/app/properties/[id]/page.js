import PropertyDetailClient from "./PropertyDetailClient";

export default async function PropertyDetailPage({ params }) {
  const { id } = await params; // ✅ unwrap params (Next 16 requirement)
  return <PropertyDetailClient id={id} />;
}
