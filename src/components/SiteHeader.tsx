"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-6 py-5 md:px-10">
      <Link href="/" className="font-display text-xl tracking-tight text-white md:text-2xl">
        Portfolio
      </Link>
      <nav className="flex items-center gap-4 text-sm text-white/90">
        {user ? (
          <>
            <Link href="/dashboard" className="hover:text-accent-soft">
              Dashboard
            </Link>
            <button
              type="button"
              onClick={logout}
              className="rounded-md border border-white/30 px-3 py-1.5 hover:bg-white/10"
            >
              Log out
            </button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:text-accent-soft">
              Log in
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-accent px-3 py-1.5 text-white hover:bg-teal-600"
            >
              Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
