import BookPropertyClient from "./BookPropertyClient";

export default async function BookPropertyPage({ params }) {
  const { id } = await params;
  return <BookPropertyClient id={id} />;
}
