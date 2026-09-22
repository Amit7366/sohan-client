"use client";

import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useRef } from "react";
import { FloatDepth, Reveal, Tilt3D } from "./Reveal";
import type { LandingProfile } from "@/lib/types";

export function SustainabilityCta({
  data,
}: {
  data: LandingProfile["sustainability"];
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22 });
  const y = useTransform(smooth, [0, 1], ["-18%", "18%"]);
  const scale = useTransform(smooth, [0, 1], [1.2, 1.05]);
  const rotate = useTransform(smooth, [0, 1], [2, -2]);
  const contentY = useTransform(smooth, [0, 1], [60, -40]);
  const contentOpacity = useTransform(smooth, [0.15, 0.4, 0.75], [0.4, 1, 0.85]);
  const stats = data.stats || [];

  return (
    <section
      ref={ref}
      className="relative min-h-[75vh] overflow-hidden text-white md:min-h-[85vh] [perspective:1400px]"
    >
      <motion.div
        style={reduce ? undefined : { y, scale, rotateZ: rotate }}
        className="absolute inset-[-10%] will-change-transform"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={data.imageUrl} alt="" className="h-full w-full object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-br from-rose-950/70 via-pink-900/55 to-fuchsia-900/45" />

      <motion.div
        style={reduce ? undefined : { y: contentY, opacity: contentOpacity }}
        className="relative mx-auto flex min-h-[75vh] max-w-7xl flex-col justify-center px-5 py-20 md:min-h-[85vh] md:px-8"
      >
        <Reveal intensity="bold" from="depth">
          <p className="text-xs font-semibold tracking-[0.28em] text-white/70 uppercase">
            {data.eyebrow}
          </p>
          <h2 className="font-display mt-4 max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            {data.title}
          </h2>
          <Link href={data.ctaHref || "/register"} className="btn-pink mt-8">
            {data.ctaLabel}
            <span className="btn-pink-dot">→</span>
          </Link>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-4">
          {stats.map((st, i) => (
            <FloatDepth key={st._id ?? i} range={40 + i * 10} rotate={8}>
              <Tilt3D max={14}>
                <div className="glass max-w-[240px] rounded-3xl p-4 shadow-2xl">
                  <p className="text-2xl font-semibold">{st.value}</p>
                  <p className="mt-1 text-sm text-white/75">{st.label}</p>
                </div>
              </Tilt3D>
            </FloatDepth>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
