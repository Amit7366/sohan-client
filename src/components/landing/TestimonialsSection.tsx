"use client";

import { useReducedMotion } from "framer-motion";
import type { LandingProfile, Review } from "@/lib/types";

export function TestimonialsSection({
  data,
}: {
  data: LandingProfile["testimonials"];
}) {
  const reviews = data.reviews || [];
  const reduceMotion = useReducedMotion();

  const eyebrow = data.eyebrow || "- Clients Testimonials";
  const titleMain = data.titleMain || "Testimonials that";
  const titleAccent = data.titleAccent || data.title || "Speaks to My Results";

  if (!reviews.length) return null;

  const topRow = padRow(
    reviews.filter((_, i) => i % 2 === 0),
    reviews
  );
  const bottomRow = padRow(
    reviews.filter((_, i) => i % 2 === 1),
    reviews
  );

  return (
    <section
      id="testimonials"
      className="relative overflow-x-clip bg-w-surface px-5 py-[var(--w-section-pad)] md:px-8"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-20 z-0 flex justify-center overflow-visible sm:top-24 md:top-28"
      >
        <p
          className="whitespace-nowrap font-display text-[2.75rem] leading-none font-bold tracking-tight sm:text-[4rem] md:text-[5rem] lg:text-[6rem]"
          style={{
            color: "var(--testimonial-watermark, rgba(40, 20, 35, 0.08))",
          }}
        >
          {titleMain} {titleAccent}
        </p>
      </div>

      <div className="relative z-[1] mx-auto max-w-5xl text-center">
        <p className="text-sm font-medium tracking-wide text-w-muted">{eyebrow}</p>
        <h2 className="font-display mt-2 text-3xl font-bold tracking-tight text-w-ink sm:text-4xl md:text-[2.75rem]">
          {titleMain}
          <br />
          <span className="text-w-pink">{titleAccent}</span>
        </h2>
      </div>

      {reduceMotion ? (
        <div className="relative z-[1] mx-auto mt-8 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {reviews.map((review, i) => (
            <ReviewCard key={review._id ?? `${review.name}-${i}`} review={review} />
          ))}
        </div>
      ) : (
        <div className="relative z-[1] mt-8 space-y-4">
          <MarqueeRow items={topRow} direction="left" />
          <MarqueeRow items={bottomRow} direction="right" />
        </div>
      )}
    </section>
  );
}

function padRow(preferred: Review[], fallback: Review[]): Review[] {
  const source = preferred.length ? preferred : fallback;
  if (!source.length) return [];
  const out = [...source];
  let i = 0;
  while (out.length < 4) {
    const item = source[i % source.length];
    out.push({
      ...item,
      _id: `${item._id ?? item.name}-pad-${out.length}`,
    });
    i += 1;
  }
  return out;
}

function MarqueeRow({
  items,
  direction,
}: {
  items: Review[];
  direction: "left" | "right";
}) {
  const loop = [...items, ...items];
  const trackClass =
    direction === "left" ? "marquee-track-left" : "marquee-track-right";

  return (
    <div className="marquee-row overflow-hidden">
      <div className={`flex w-max gap-4 ${trackClass}`}>
        {loop.map((review, i) => (
          <ReviewCard
            key={`${review._id ?? review.name}-${i}`}
            review={review}
          />
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const rating = review.rating || "5.0";

  return (
    <article className="flex w-[min(82vw,18.5rem)] shrink-0 gap-3 rounded-[22px] bg-[#f3f3f3] p-3.5 shadow-sm sm:w-[19.5rem] sm:gap-4 sm:p-4 dark:bg-w-card">
      <div className="relative h-24 w-16 shrink-0 sm:h-[6.5rem] sm:w-[4.5rem]">
        <div className="h-full w-full overflow-hidden rounded-[999px] bg-white p-1.5 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={review.avatarUrl}
            alt={review.name}
            className="h-full w-full rounded-[999px] object-cover object-center grayscale"
          />
        </div>
        <span className="absolute -top-1 -left-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#c8f560] font-display text-lg leading-none text-w-ink shadow-sm">
          “
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="flex gap-0.5 text-[#f5a623]" aria-label={`${rating} stars`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden
              >
                <path d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.4l1.1-6.5L2.6 9.3l6.5-.9L12 2.5z" />
              </svg>
            ))}
          </span>
          <span className="text-sm font-semibold text-w-ink">{rating}</span>
        </div>

        <p className="mt-2 line-clamp-3 text-[13px] leading-relaxed text-w-muted sm:text-sm">
          {review.body}
        </p>

        <div className="mt-3">
          <p className="truncate text-sm font-bold text-w-ink">{review.name}</p>
          <p className="truncate text-xs text-w-muted">{review.role}</p>
        </div>
      </div>
    </article>
  );
}
