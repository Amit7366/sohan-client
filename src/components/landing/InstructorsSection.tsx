"use client";

import { Reveal, Tilt3D } from "./Reveal";
import type { LandingProfile } from "@/lib/types";

export function InstructorsSection({
  data,
}: {
  data: LandingProfile["instructors"];
}) {
  const people = data.people || [];
  return (
    <section
      id="instructors"
      className="overflow-hidden bg-w-bg px-5 py-[var(--w-section-pad)] md:px-8 [perspective:1500px]"
    >
      <div className="mx-auto max-w-7xl">
        <Reveal
          intensity="bold"
          from="depth"
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <h2 className="font-display max-w-md text-3xl font-semibold tracking-tight text-w-ink sm:text-4xl md:text-5xl">
            {data.title}
          </h2>
          <p className="max-w-md text-[15px] leading-relaxed text-w-muted md:text-right">
            {data.subtitle}
          </p>
        </Reveal>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {people.map((person, i) => (
            <Reveal
              key={person._id ?? person.name}
              intensity="bold"
              from={i === 0 ? "left" : i === 2 ? "right" : "depth"}
            >
              <Tilt3D max={11} className="rounded-[28px]">
                <article className="group relative overflow-hidden rounded-[28px] shadow-[0_30px_70px_-30px_rgba(0,0,0,0.45)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={person.imageUrl}
                    alt={person.name}
                    className="aspect-[3/4] w-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-5 pt-16 text-white">
                    <h3 className="font-display text-xl font-semibold">
                      {person.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/75">{person.role}</p>
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
