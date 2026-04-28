import PropertiesClient from "./PropertiesClient";

export default function PropertiesPage({ searchParams }) {
  const sort = searchParams?.sort ?? "newest";
  return <PropertiesClient initialSort={sort} />;
}
