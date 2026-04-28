import EditBookingClient from "./EditBookingClient";

export default async function EditBookingPage({ params }) {
  const { id } = await params;

  return <EditBookingClient id={id} />;
}
