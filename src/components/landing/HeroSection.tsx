"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { LandingProfile } from "@/lib/types";

export function HeroSection({
  data,
  brandName,
}: {
  data: LandingProfile["hero"];
  brandName?: string;
}) {
  const reduce = useReducedMotion();
  const name =
    data.highlightName || brandName || data.title.split(",")[0]?.replace(/^I['']?m\s+/i, "").trim() || "Jenny";
  const role = data.role || "Product Designer";
  const eyebrow = data.eyebrow || "- Hello";
  const clientsCount = data.clientsCount || data.trust?.rating || "450+";
  const clientsLabel = data.clientsLabel || data.trust?.label || "Happy Clients";
  const avatars = data.trust?.avatars || [];
  const badge = (data.badgeText || "HIRE ME").toUpperCase();
  const badgeRing = Array.from({ length: 3 }, () => badge).join(" • ") + " • ";

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-w-bg pt-28 pb-16 text-w-ink md:pt-32 md:pb-20"
    >
      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        {/* Greeting + headline */}
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="relative z-20 text-center"
        >
          <p className="text-sm font-medium tracking-wide text-w-muted md:text-base">
            {eyebrow}
          </p>
          <h1 className="font-display mt-3 text-[2rem] leading-[1.15] font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-[4rem]">
            I&apos;m{" "}
            <span className="relative inline-block text-w-pink">
              {name}
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-w-pink md:-bottom-1.5 md:h-1"
              />
            </span>
            , {role}
          </h1>
        </motion.div>

        {/* Portrait stage */}
        <div className="relative mx-auto mt-8 flex max-w-3xl flex-col items-center md:mt-10">
          {/* Decorative tilted panels */}
          <BackdropCard
            imageUrl={data.cardLeftUrl}
            className="top-[18%] left-[8%] h-[58%] w-[42%] -rotate-[14deg] shadow-xl shadow-pink-500/25 md:left-[12%]"
            overlayClassName="bg-w-pink/75"
          />
          <BackdropCard
            imageUrl={data.cardRightUrl}
            className="top-[22%] right-[6%] h-[54%] w-[40%] rotate-[10deg] md:right-[10%]"
            overlayClassName="bg-w-peach/80 dark:bg-w-card/80"
          />

          {/* Hire Me badge */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.7, rotate: -20 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute top-2 right-0 z-30 sm:top-6 sm:right-4 md:right-8"
          >
            <div className="relative flex h-[88px] w-[88px] items-center justify-center sm:h-[104px] sm:w-[104px]">
              <div className="hire-badge absolute inset-0 rounded-full bg-w-ink shadow-lg">
                <svg viewBox="0 0 100 100" className="h-full w-full">
                  <defs>
                    <path
                      id="hireCircle"
                      d="M 50,50 m -36,0 a 36,36 0 1,1 72,0 a 36,36 0 1,1 -72,0"
                    />
                  </defs>
                  <text className="fill-white text-[9.5px] font-semibold tracking-[0.18em] uppercase">
                    <textPath href="#hireCircle" startOffset="0%">
                      {badgeRing}
                    </textPath>
                  </text>
                </svg>
              </div>
              <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-w-pink text-white shadow-md sm:h-10 sm:w-10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M7 17L17 7M17 7H9M17 7v8"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </motion.div>

          {/* Portrait */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[340px] sm:max-w-[400px] md:max-w-[460px]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.imageUrl}
              alt={name}
              className="relative z-10 mx-auto h-auto w-full object-contain object-bottom drop-shadow-[0_30px_50px_rgba(190,24,93,0.25)] [mask-image:linear-gradient(to_bottom,black_88%,transparent_100%)]"
            />
          </motion.div>

          {/* Happy clients — bottom left (no card bg) */}
          <motion.div
            initial={reduce ? false : { opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.7 }}
            className="absolute bottom-28 left-0 z-20 sm:bottom-32 sm:left-2 md:left-0"
          >
            <p className="font-display text-[1.75rem] leading-none font-bold tracking-tight text-w-ink sm:text-[2rem]">
              {clientsCount}
            </p>
            <p className="mt-1 text-sm leading-snug text-w-muted">{clientsLabel}</p>
            <div className="mt-3 flex items-center -space-x-2.5">
              {avatars.slice(0, 4).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={src}
                  src={src}
                  alt=""
                  style={{ zIndex: i + 1 }}
                  className="relative h-9 w-9 rounded-full border-[2.5px] border-white object-cover grayscale dark:border-w-bg sm:h-10 sm:w-10"
                />
              ))}
              <span
                style={{ zIndex: 5 }}
                className="relative flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] border-white bg-[#ececec] text-lg font-medium leading-none text-w-pink dark:border-w-bg dark:bg-w-card sm:h-10 sm:w-10"
              >
                +
              </span>
            </div>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.7 }}
            className="relative z-20 mt-6 flex flex-wrap items-center justify-center gap-3 sm:mt-8"
          >
            <Link
              href={data.ctaHref || "#classes"}
              className="inline-flex items-center gap-3 rounded-full bg-w-pink py-2.5 pr-2 pl-6 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition hover:brightness-110"
            >
              {data.ctaLabel || "Portfolio"}
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-w-peach text-w-ink">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </Link>
            <Link
              href={data.secondaryCtaHref || "/contact"}
              className="inline-flex items-center rounded-full border border-w-ink bg-w-surface px-7 py-3 text-sm font-semibold text-w-ink transition hover:border-w-pink hover:text-w-pink dark:border-w-ink"
            >
              {data.secondaryCtaLabel || "Hire Me"}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function BackdropCard({
  imageUrl,
  className,
  overlayClassName,
}: {
  imageUrl?: string;
  className: string;
  overlayClassName: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute overflow-hidden rounded-[2rem] md:rounded-[2.5rem] ${className}`}
    >
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={imageUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : null}
      <div className={`absolute inset-0 ${overlayClassName}`} />
    </div>
  );
}
