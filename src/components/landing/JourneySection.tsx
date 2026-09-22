"use client";

import { Reveal, Tilt3D } from "./Reveal";
import type { LandingProfile } from "@/lib/types";

export function JourneySection({ data }: { data: LandingProfile["journey"] }) {
  const cards = data.cards || [];
  return (
    <section
      id="classes"
      className="relative overflow-hidden bg-w-bg px-5 py-[var(--w-section-pad)] md:px-8 [perspective:1600px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(0,0,0,0.04),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(255,255,255,0.04),_transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl">
        <Reveal intensity="bold" from="depth">
          <h2 className="font-display text-center text-3xl font-semibold tracking-tight text-w-ink sm:text-4xl md:text-5xl">
            {data.sectionTitle}
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3 md:gap-7">
          {cards.map((item, i) => (
            <Reveal
              key={item._id ?? item.title + i}
              delay={i * 0.08}
              intensity="bold"
              from={i === 0 ? "left" : i === 2 ? "right" : "depth"}
              className="h-full"
            >
              <Tilt3D max={12} className="h-full rounded-[28px]">
                <article className="group flex h-full flex-col overflow-hidden rounded-[28px] bg-w-surface shadow-[0_24px_60px_-28px_rgba(0,0,0,0.4)] ring-1 ring-w-line transition duration-500">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="font-display text-xl font-semibold text-w-ink">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-[15px] leading-relaxed text-w-muted">
                      {item.text}
                    </p>
                  </div>
                </article>
              </Tilt3D>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
