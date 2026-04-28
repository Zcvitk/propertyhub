import { Suspense } from "react";
import PropertiesClient from "./PropertiesClient";

export default function PropertiesPage() {
  return (
    <Suspense fallback={<p className="text-sm text-gray-400">Loading...</p>}>
      <PropertiesClient />
    </Suspense>
  );
}
