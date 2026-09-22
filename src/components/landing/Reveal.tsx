"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionProps,
} from "framer-motion";
import {
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  intensity?: "soft" | "medium" | "bold";
  from?: "up" | "left" | "right" | "depth";
} & MotionProps;

const presets = {
  soft: { y: 40, scale: 0.97, rotateX: 6, z: -40 },
  medium: { y: 72, scale: 0.92, rotateX: 14, z: -80 },
  bold: { y: 110, scale: 0.86, rotateX: 22, z: -140 },
};

export function Reveal({
  children,
  className,
  delay = 0,
  intensity = "medium",
  from = "up",
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const p = presets[intensity];

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 22,
    mass: 0.35,
  });

  const y = useTransform(smooth, [0, 1], [p.y, 0]);
  const opacity = useTransform(smooth, [0, 0.35, 1], [0, 0.55, 1]);
  const scale = useTransform(smooth, [0, 1], [p.scale, 1]);
  const rotateX = useTransform(smooth, [0, 1], [from === "depth" ? p.rotateX : p.rotateX * 0.65, 0]);
  const rotateY = useTransform(
    smooth,
    [0, 1],
    [from === "left" ? -18 : from === "right" ? 18 : 0, 0]
  );
  const x = useTransform(
    smooth,
    [0, 1],
    [from === "left" ? -64 : from === "right" ? 64 : 0, 0]
  );
  const filter = useTransform(smooth, [0, 1], ["blur(6px)", "blur(0px)"]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y,
        x,
        opacity,
        scale,
        rotateX,
        rotateY,
        filter,
        transformPerspective: 1400,
        transformStyle: "preserve-3d",
        willChange: "transform, opacity, filter",
      }}
      transition={{ delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Mouse-tracked 3D tilt card for engagement */
export function Tilt3D({
  children,
  className,
  max = 14,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [max, -max]), {
    stiffness: 180,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-max, max]), {
    stiffness: 180,
    damping: 18,
  });
  const glareX = useTransform(mx, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(my, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), transparent 55%)`;

  function onMove(e: MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className ?? ""}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
      }}
    >
      <div style={{ transform: "translateZ(28px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-soft-light"
        style={{ background: glare, opacity: 0.55 }}
      />
    </motion.div>
  );
}

/** Continuous scroll-linked float / depth */
export function FloatDepth({
  children,
  className,
  range = 80,
  rotate = 8,
}: {
  children: ReactNode;
  className?: string;
  range?: number;
  rotate?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [rotate, -rotate]);
  const rotateZ = useTransform(scrollYProgress, [0, 1], [-rotate * 0.35, rotate * 0.35]);

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        y,
        rotateX,
        rotateZ,
        transformPerspective: 1200,
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </motion.div>
  );
}
