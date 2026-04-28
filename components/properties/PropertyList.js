import PropertyCard from "./PropertyCard";

export default function PropertyList({ properties }) {
  return (
    <div
      className="grid 
      grid-cols-1 
      sm:grid-cols-2 
      lg:grid-cols-3 
      xl:grid-cols-4 
      gap-6"
    >
      {properties.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
