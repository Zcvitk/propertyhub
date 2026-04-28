"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function Sidebar() {
  const pathname = usePathname();

  const linkClass = (path) =>
    `flex items-center gap-2 rounded-xl px-4 py-3 transition ${
      pathname === path || pathname.startsWith(path + "/")
        ? "bg-gray-800 text-yellow-400"
        : "text-gray-300 hover:bg-gray-800 hover:text-yellow-400"
    }`;

  return (
    <aside className="hidden md:flex min-h-screen w-72 flex-col border-r border-gray-800 bg-gray-950 px-4 py-6">
      <div className="mb-8 flex h-24 items-center px-2">
        <Link href="/dashboard" className="flex items-center">
          <div className="flex h-20 md:h-28 items-center justify-center">
            <Image
              src="/logo-new.png"
              alt="PropertyHub"
              width={320}
              height={88}
              className="h-28 w-auto origin-center mix-blend-lighten"
              priority
            />
          </div>
        </Link>
      </div>

      <nav className="flex flex-col gap-2 text-sm">
        <Link href="/" className={linkClass("/")}>
          <span className="text-base leading-none">🏠</span>
          Homepage
        </Link>

        <Link href="/dashboard" className={linkClass("/dashboard")}>
          <span className="text-base leading-none">📊</span>
          Dashboard
        </Link>

        <Link href="/properties" className={linkClass("/properties")}>
          <span className="text-base leading-none">🏡</span>
          Properties
        </Link>

        <Link href="/bookings" className={linkClass("/bookings")}>
          <span className="text-base leading-none">📅</span>
          Bookings
        </Link>
      </nav>
    </aside>
  );
}
