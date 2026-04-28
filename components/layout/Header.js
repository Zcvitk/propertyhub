"use client";

import { usePathname } from "next/navigation";
import AuthButtons from "@/components/auth/AuthButtons";

export default function Header() {
  const pathname = usePathname();

  const routeTitles = {
    "/": "Homepage",
    "/dashboard": "Dashboard",
    "/properties": "Properties",
    "/bookings": "Bookings",
    "/auth/login": "Login",
    "/auth/register": "Register",
  };

  const title =
    routeTitles[pathname] ||
    (pathname.startsWith("/properties/") ? "Property Details" : "Page");

  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center py-4 md:justify-between border-b border-gray-800 bg-gray-950 px-4 sm:px-6">
      <div>
        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-yellow-500">
          PropertyHub
        </p>
        <h1 className="text-2xl font-semibold text-gray-100">{title}</h1>
      </div>

      <AuthButtons />
    </header>
  );
}
