"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";
import type { LandingProfile, PricingPlan } from "@/lib/types";

export function PricingSection({
  data,
}: {
  data?: LandingProfile["pricing"];
}) {
  const plans = data?.plans || [];
  if (!plans.length) return null;

  const title = data?.title || "My Rates";
  const subtitle =
    data?.subtitle ||
    "Transparent pricing for all massage therapy sessions. Choose the duration that best fits your needs.";
  const eyebrow = data?.eyebrow || "- Session Rates";
  const ctaLabel = data?.ctaLabel || "Book Now";
  const ctaHref = data?.ctaHref || "/contact";

  return (
    <section
      id="pricing"
      className="relative overflow-hidden bg-w-surface px-5 py-[var(--w-section-pad)] md:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(236,72,153,0.12),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(244,114,182,0.12),_transparent_55%)]"
      />
      <div className="relative mx-auto max-w-7xl">
        <Reveal intensity="bold" from="depth" className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium tracking-wide text-w-muted">{eyebrow}</p>
          <h2 className="font-display mt-2 text-3xl font-semibold tracking-tight text-w-ink sm:text-4xl md:text-5xl">
            {title}
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-w-muted">{subtitle}</p>
        </Reveal>

        <div className="mt-12 grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {plans.map((plan, i) => (
            <Reveal
              key={plan._id ?? plan.name}
              delay={i * 0.07}
              intensity="medium"
              from={i === 0 ? "left" : i === plans.length - 1 ? "right" : "up"}
              className="h-full"
            >
              <PlanCard plan={plan} ctaLabel={ctaLabel} ctaHref={ctaHref} />
            </Reveal>
          ))}
        </div>

        {data?.note ? (
          <p className="mx-auto mt-10 max-w-xl text-center text-sm text-w-muted">
            {data.note}
          </p>
        ) : null}
      </div>
    </section>
  );
}

function PlanCard({
  plan,
  ctaLabel,
  ctaHref,
}: {
  plan: PricingPlan;
  ctaLabel: string;
  ctaHref: string;
}) {
  const featured = Boolean(plan.featured || plan.badge);
  const { symbol, amount } = splitPrice(plan.price, plan.currency);

  return (
    <article
      className={`relative flex h-full flex-col overflow-hidden rounded-[28px] p-6 transition duration-300 sm:p-7 ${
        featured
          ? "bg-gradient-to-b from-pink-500 to-rose-500 text-white shadow-[0_28px_60px_-24px_rgba(236,72,153,0.65)] ring-1 ring-white/20 lg:-translate-y-2"
          : "bg-w-bg text-w-ink shadow-[0_20px_50px_-28px_rgba(157,23,77,0.35)] ring-1 ring-w-line hover:-translate-y-1 hover:shadow-[0_24px_56px_-24px_rgba(236,72,153,0.35)]"
      }`}
    >
      {plan.badge ? (
        <span
          className={`absolute right-5 top-5 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
            featured ? "bg-white/20 text-white" : "bg-w-pink text-white"
          }`}
        >
          {plan.badge}
        </span>
      ) : null}

      <p className={`font-display text-xl font-semibold sm:text-2xl ${featured ? "text-white" : "text-w-ink"}`}>
        {plan.name}
      </p>
      <p className={`mt-1 text-sm ${featured ? "text-white/80" : "text-w-muted"}`}>
        {plan.tagline}
      </p>

      <div className="mt-6 flex items-end gap-0.5">
        <span className={`font-display mb-2 text-lg font-medium ${featured ? "text-white/80" : "text-w-muted"}`}>
          {symbol}
        </span>
        <span className="font-display text-5xl font-semibold tracking-tight leading-none">
          {amount}
        </span>
      </div>

      <div
        className={`mt-6 h-px ${featured ? "bg-white/20" : "bg-w-line"}`}
      />

      <ul className="mt-6 flex flex-1 flex-col gap-3">
        {(plan.features || []).map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm leading-relaxed">
            <span
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                featured ? "bg-white/20 text-white" : "bg-w-pink/15 text-w-pink"
              }`}
            >
              <CheckIcon />
            </span>
            <span className={featured ? "text-white/90" : "text-w-muted"}>{feature}</span>
          </li>
        ))}
      </ul>

      <Link
        href={ctaHref}
        className={`mt-8 inline-flex h-12 w-full items-center justify-center rounded-full text-sm font-semibold transition ${
          featured
            ? "bg-white text-w-pink-deep shadow-md hover:brightness-95"
            : "bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-500/25 hover:brightness-110"
        }`}
      >
        {ctaLabel}
      </Link>
    </article>
  );
}

function splitPrice(price: string, currency = "$") {
  const amount = price.replace(/[^0-9]/g, "") || price;
  const symbol = price.trim().startsWith("$") ? "$" : currency || "$";
  return { symbol, amount };
}

function CheckIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
