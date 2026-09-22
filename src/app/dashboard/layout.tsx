"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import {
  IconClose,
  IconExternal,
  IconLogout,
  IconMenu,
  IconMoon,
  IconProfiles,
  IconReviews,
  IconSun,
} from "@/components/dashboard/icons";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

const NAV = [
  {
    href: "/dashboard",
    label: "Profiles",
    icon: IconProfiles,
    match: (path: string) =>
      path === "/dashboard" || path.startsWith("/dashboard/profiles"),
  },
  {
    href: "/dashboard/reviews",
    label: "Reviews",
    icon: IconReviews,
    match: (path: string) => path.startsWith("/dashboard/reviews"),
  },
] as const;

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.replace("/login");
  }, [loading, user, router]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  if (loading || !user) {
    return (
      <main className="dash flex min-h-screen items-center justify-center text-sm text-[var(--dash-muted)]">
        Loading workspace…
      </main>
    );
  }

  if (user.role !== "superadmin") {
    return (
      <main className="dash flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <h1 className="font-display text-2xl">Admin only</h1>
        <p className="max-w-md text-sm text-[var(--dash-muted)]">
          The content workspace is available to superadmin accounts only.
        </p>
        <Link href="/" className="text-sm underline">
          Back to site
        </Link>
      </main>
    );
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="dash min-h-screen">
      {open && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-30 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-[var(--dash-line)] bg-[var(--dash-sidebar)] transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--dash-ink)] text-xs font-semibold text-[var(--dash-bg)]">
              CMS
            </span>
            <span className="font-display text-base font-semibold tracking-tight">
              Workspace
            </span>
          </Link>
          <button
            type="button"
            className="rounded-md p-1.5 text-[var(--dash-muted)] hover:bg-[var(--dash-hover)] md:hidden"
            onClick={() => setOpen(false)}
            aria-label="Close sidebar"
          >
            <IconClose />
          </button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          <p className="px-3 pb-2 text-[11px] font-semibold tracking-[0.14em] text-[var(--dash-muted)] uppercase">
            Content
          </p>
          {NAV.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[var(--dash-ink)] text-[var(--dash-bg)]"
                    : "text-[var(--dash-ink)] hover:bg-[var(--dash-hover)]"
                }`}
              >
                <Icon />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[var(--dash-line)] p-3">
          <Link
            href="/"
            className="mb-1 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-[var(--dash-muted)] hover:bg-[var(--dash-hover)] hover:text-[var(--dash-ink)]"
          >
            <IconExternal />
            View site
          </Link>
          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm text-[var(--dash-muted)] hover:bg-[var(--dash-hover)] hover:text-[var(--dash-ink)]"
          >
            <IconLogout />
            Log out
          </button>
        </div>
      </aside>

      <div className="md:pl-[248px]">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-[var(--dash-line)] bg-[var(--dash-bg)]/90 px-4 backdrop-blur md:px-8">
          <button
            type="button"
            className="rounded-md border border-[var(--dash-line)] p-2 md:hidden"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <IconMenu />
          </button>
          <p className="hidden text-sm text-[var(--dash-muted)] md:block">
            Super admin
          </p>
          <div className="ml-auto flex items-center gap-2">
            <button
              type="button"
              onClick={toggle}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-[var(--dash-line)] bg-[var(--dash-surface)] px-3 text-sm"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <IconSun /> : <IconMoon />}
              <span className="hidden sm:inline">
                {theme === "dark" ? "Light" : "Dark"}
              </span>
            </button>
            <div className="flex items-center gap-2 rounded-lg border border-[var(--dash-line)] bg-[var(--dash-surface)] py-1 pr-3 pl-1">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--dash-ink)] text-[11px] font-semibold text-[var(--dash-bg)]">
                {initials || "SA"}
              </span>
              <span className="hidden max-w-[180px] truncate text-sm sm:block">
                {user.email}
              </span>
            </div>
          </div>
        </header>
        <main className="px-4 py-6 md:px-8 md:py-8">{children}</main>
      </div>
    </div>
  );
}
