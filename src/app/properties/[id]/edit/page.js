import EditPropertyClient from "./EditPropertyClient";

export default async function EditPropertyPage({ params }) {
  const { id } = await params;
  return <EditPropertyClient id={id} />;
}
