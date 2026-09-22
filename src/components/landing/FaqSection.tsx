"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FloatDepth, Reveal, Tilt3D } from "./Reveal";
import type { LandingProfile } from "@/lib/types";

export function FaqSection({ data }: { data: LandingProfile["faq"] }) {
  const [open, setOpen] = useState(0);
  const items = data.items || [];

  return (
    <section className="overflow-hidden bg-w-surface px-5 py-[var(--w-section-pad)] md:px-8 [perspective:1400px]">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-2 lg:gap-14">
        <Reveal intensity="bold" from="left" className="relative">
          <FloatDepth range={42} rotate={6}>
            <Tilt3D max={9} className="rounded-[32px]">
              <div className="relative overflow-hidden rounded-[32px] shadow-[0_40px_80px_-30px_rgba(0,0,0,0.4)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.imageUrl}
                  alt=""
                  className="aspect-square w-full object-cover lg:aspect-[4/5]"
                />
                <div className="absolute inset-x-4 bottom-4 rounded-3xl bg-rose-950/85 p-5 text-white backdrop-blur-md sm:inset-x-6 sm:bottom-6 sm:p-6">
                  <p className="font-display text-xl font-semibold sm:text-2xl">
                    {data.helpTitle}
                  </p>
                  <Link
                    href={data.helpCtaHref || "/register"}
                    className="mt-4 inline-flex rounded-full bg-gradient-to-r from-pink-400 to-rose-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-pink-500/30"
                  >
                    {data.helpCta}
                  </Link>
                </div>
              </div>
            </Tilt3D>
          </FloatDepth>
        </Reveal>

        <Reveal intensity="bold" from="right">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-w-ink sm:text-4xl">
            {data.title}
          </h2>
          <div className="mt-8 divide-y divide-w-line border-t border-w-line">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item._id ?? item.q} className="py-4">
                  <button
                    type="button"
                    className="flex w-full items-center justify-between gap-4 text-left"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                  >
                    <span className="text-base font-semibold text-w-ink sm:text-lg">
                      {item.q}
                    </span>
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-w-card text-lg text-w-ink">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.p
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.28 }}
                        className="overflow-hidden text-[15px] leading-relaxed text-w-muted"
                      >
                        <span className="mt-3 block pb-1">{item.a}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
