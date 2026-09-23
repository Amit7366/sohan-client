"use client";

import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";
import type { MenuItem } from "@/lib/types";

export function LandingNav({
  brandName = "Jenny",
  logoUrl,
  menus = [],
  contactLabel = "Contact Me",
  contactHref = "/contact",
  overlay = false,
}: {
  brandName?: string;
  logoUrl?: string;
  menus?: MenuItem[];
  contactLabel?: string;
  contactHref?: string;
  overlay?: boolean;
}) {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const nav = menus.length
    ? menus
    : [
        { label: "Home", href: "#home", order: 0, visible: true },
        { label: "Services", href: "#classes", order: 1, visible: true },
        { label: "About", href: "#about", order: 2, visible: true },
        { label: "Projects", href: "#pricing", order: 3, visible: true },
        { label: "Testimonials", href: "#testimonials", order: 4, visible: true },
      ];

  const onDark = overlay && !scrolled;
  const ink = onDark ? "text-white" : "text-w-ink";
  const muted = onDark ? "text-white/80" : "text-w-muted";

  function resolveHref(href: string) {
    if (!href) return "/";
    if (href.startsWith("#")) return pathname === "/" ? href : `/${href}`;
    return href;
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-w-line/80 bg-w-surface/90 py-3 shadow-sm backdrop-blur-xl"
          : "bg-transparent py-5"
      }`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-4 sm:gap-3 sm:px-5 md:px-8 lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        <NavLink
          href={pathname === "/" ? "#home" : "/"}
          className={`flex min-w-0 items-center gap-2 justify-self-start ${ink}`}
        >
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="" className="h-9 w-9 rounded-lg object-cover" />
          ) : (
            <span className="relative flex h-9 w-9 items-center justify-center">
              <span className="absolute inset-0 rotate-12 rounded-lg bg-w-pink" />
              <span className="absolute inset-1 -rotate-6 rounded-md bg-w-peach" />
              <span className="relative font-display text-sm font-bold text-white">
                {(brandName || "J").charAt(0)}
              </span>
            </span>
          )}
          <span className="truncate text-[15px] font-semibold tracking-tight sm:text-[17px]">
            {brandName}
          </span>
        </NavLink>

        <div className="flex justify-center">
          <NavLink
            href={contactHref || "/contact"}
            className="inline-flex whitespace-nowrap rounded-full bg-w-pink px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-pink-500/25 transition hover:brightness-110 sm:px-5 sm:py-2.5 sm:text-sm lg:hidden"
          >
            {contactLabel}
          </NavLink>
          <nav className={`hidden items-center justify-center gap-7 text-[14px] font-medium ${muted} lg:flex`}>
            {nav.map((item, i) => (
              <NavLink
                key={`${item.href}-${item.label}`}
                href={resolveHref(item.href)}
                className={`transition hover:text-w-pink ${
                  i === 0 && pathname === "/" ? "text-w-pink" : ""
                }`}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle theme"
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition hover:border-w-pink hover:text-w-pink ${
              onDark
                ? "border-white/30 text-white"
                : "border-w-line text-w-ink"
            }`}
          >
            {theme === "light" ? <MoonIcon /> : <SunIcon />}
          </button>

          <NavLink
            href={contactHref || "/contact"}
            className="hidden rounded-full bg-w-pink px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-500/25 transition hover:brightness-110 lg:inline-flex"
          >
            {contactLabel}
          </NavLink>
          {user ? (
            <Link
              href="/dashboard"
              className={`hidden rounded-full px-5 py-2.5 text-sm font-semibold lg:inline-flex ${
                onDark
                  ? "border border-white/40 text-white"
                  : "border border-w-line text-w-ink"
              }`}
            >
              Dashboard
            </Link>
          ) : null}

          <button
            type="button"
            className={`flex h-10 w-10 items-center justify-center rounded-full border lg:hidden ${
              onDark
                ? "border-white/30 text-white"
                : "border-w-line text-w-ink"
            }`}
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            <span className="text-lg leading-none">{open ? "×" : "☰"}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="mx-5 mt-3 rounded-2xl border border-w-line bg-w-surface p-4 shadow-lg lg:hidden">
          <div className="flex flex-col gap-1 text-w-ink">
            {nav.map((item) => (
              <NavLink
                key={`${item.href}-${item.label}`}
                href={resolveHref(item.href)}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm hover:bg-w-card hover:text-w-pink"
              >
                {item.label}
              </NavLink>
            ))}
            {user ? (
              <Link
                href="/dashboard"
                onClick={() => setOpen(false)}
                className="rounded-full border border-w-line px-4 py-2.5 text-center text-sm font-semibold"
              >
                Dashboard
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  className,
  children,
  onClick,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  const internal = href.startsWith("/") && !href.startsWith("//");
  if (internal) {
    return (
      <Link href={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M21 14.5A8.5 8.5 0 119.5 3 7 7 0 0021 14.5z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}
