"use client";

import Link from "next/link";
import { Great_Vibes } from "next/font/google";
import type { LandingProfile } from "@/lib/types";

const signatureFont = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
});

export function AboutSection({
  data,
  brandName,
}: {
  data: LandingProfile["about"];
  brandName?: string;
}) {
  const verticalName =
    data.verticalName || brandName || "Jenny Alexander";
  const yearsCount = data.yearsCount || "18";
  const yearsLabel = data.yearsLabel || "Years of Experience";
  const eyebrow = data.eyebrow || "About Me";
  const titleWho = data.titleWho || "Who is";
  const titleName =
    data.titleName || `${brandName || "Jenny Alexander"}?`;
  const description =
    data.description ||
    data.title ||
    "A creative product designer focused on building beautiful, usable experiences.";
  const stats =
    data.stats?.length
      ? data.stats
      : [
          { value: "600+", label: "Project Completed", order: 0 },
          { value: "50+", label: "Industry Covered", order: 1 },
        ];
  const ctaLabel = data.ctaLabel || data.playLabel || "Download CV";
  const ctaHref = data.ctaHref || "#contact";
  const signature = data.signature || verticalName;

  return (
    <section
      id="about"
      className="relative overflow-x-clip bg-w-surface px-5 py-[var(--w-section-pad)] md:px-8"
    >
      <div className="relative mx-auto grid max-w-6xl items-stretch gap-10 lg:grid-cols-[minmax(260px,380px)_1fr] lg:gap-14 xl:gap-16">
        {/* Left experience panel — image + overlay + text */}
        <div className="relative min-h-[320px] overflow-hidden rounded-tr-[2.5rem] rounded-bl-[2.5rem] bg-w-pink text-white shadow-xl shadow-pink-500/25 sm:min-h-[380px] lg:min-h-[440px]">
          {data.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.imageUrl}
              alt=""
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
          ) : null}
          <div
            className="absolute inset-0 bg-gradient-to-br from-pink-500/80 via-rose-600/75 to-rose-950/70"
            aria-hidden
          />

          <div className="absolute inset-y-0 left-0 z-10 flex w-12 items-center justify-center sm:w-14">
            <span className="font-display -rotate-90 text-[11px] font-semibold tracking-[0.32em] whitespace-nowrap uppercase sm:text-xs">
              {verticalName}
            </span>
          </div>

          <div className="relative z-10 flex h-full min-h-[320px] flex-col items-center justify-center px-8 py-16 pl-14 sm:min-h-[380px] sm:pl-16 lg:min-h-[440px]">
            <p className="font-display text-[6.5rem] leading-none font-bold tracking-tight drop-shadow-md sm:text-[7.5rem] lg:text-[8.5rem]">
              {yearsCount}
            </p>
            <p className="mt-2 text-center text-sm font-medium tracking-wide drop-shadow sm:text-base">
              {yearsLabel}
            </p>
          </div>
        </div>

        {/* Right content */}
        <div className="relative flex flex-col justify-center pt-2 lg:pt-6">
          {/* Watermark */}
          <p
            aria-hidden
            className="pointer-events-none absolute -top-2 right-0 font-display text-[clamp(2.5rem,8vw,5.5rem)] leading-none font-bold tracking-tight select-none"
            style={{ color: "var(--testimonial-watermark, rgba(40,20,35,0.08))" }}
          >
            About Me
          </p>

          <div className="relative z-[1]">
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-w-pink" aria-hidden />
              <p className="text-sm font-medium text-w-ink">{eyebrow}</p>
            </div>

            <h2 className="font-display mt-4 text-3xl font-bold tracking-tight text-w-ink sm:text-4xl md:text-[2.75rem]">
              {titleWho}{" "}
              <span className="text-w-pink">{titleName}</span>
            </h2>

            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-w-muted sm:text-base">
              {description}
            </p>

            <div className="mt-8 grid max-w-md grid-cols-2 gap-6">
              {stats.slice(0, 2).map((s) => (
                <div key={s.label + s.value}>
                  <p className="font-display text-3xl font-bold tracking-tight text-w-ink sm:text-4xl">
                    {s.value}
                  </p>
                  <p className="mt-1 text-sm text-w-muted">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-5 sm:gap-8">
              <Link
                href={ctaHref}
                className="inline-flex items-stretch overflow-hidden rounded-full shadow-md transition hover:brightness-[1.03]"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-w-ink text-white sm:h-[52px] sm:w-[52px]">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M5 12h14M13 6l6 6-6 6"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="-ml-3 flex items-center rounded-full bg-[#c8f560] py-3 pr-6 pl-7 text-sm font-semibold text-w-ink">
                  {ctaLabel}
                </span>
              </Link>

              <p
                className={`${signatureFont.className} text-3xl text-w-ink sm:text-4xl`}
              >
                {signature}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
