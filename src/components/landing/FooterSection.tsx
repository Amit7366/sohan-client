"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "./Reveal";
import type { LandingProfile } from "@/lib/types";

export function FooterSection({
  data,
  contact,
}: {
  data: LandingProfile["footer"];
  contact?: LandingProfile["contact"];
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setDone(true);
  }

  return (
    <footer id="contact" className="bg-w-dark text-white">
      <section ref={ref} className="relative overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 scale-110">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.imageUrl}
            alt=""
            className="h-full w-full object-cover opacity-70"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-rose-950/80 via-pink-900/60 to-fuchsia-800/45" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-8 px-5 py-24 md:flex-row md:items-center md:px-8 md:py-28">
          <Reveal>
            <h2 className="font-display max-w-xl text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
              {data.ctaTitle}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link href={data.ctaHref || "/register"} className="btn-pink">
              {data.ctaLabel}
              <span className="btn-pink-dot">→</span>
            </Link>
          </Reveal>
        </div>
      </section>

      <div className="border-t border-white/10 px-5 py-14 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.2fr_1.35fr_1fr_1fr]">
          <div>
            <p className="text-sm text-white/70">{data.newsletterLabel}</p>
            <form
              onSubmit={onSubmit}
              className="mt-4 flex items-center gap-2 rounded-full bg-white/10 p-1.5 ring-1 ring-white/15"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/45"
              />
              <button
                type="submit"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-black"
                aria-label="Subscribe"
              >
                →
              </button>
            </form>
            {done && (
              <p className="mt-2 text-xs text-emerald-300">
                Thanks — you&apos;re on the list.
              </p>
            )}
            <div className="mt-6 flex gap-3">
              {(data.social || []).map((s) => (
                <a
                  key={s._id ?? s.label}
                  href={s.href || "#"}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-semibold text-white/80 ring-1 ring-white/15 hover:bg-white/20"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          <FooterContacts contact={contact} />
          <FooterCol title="Resources" links={data.resources || []} />
          <FooterCol title="Explore" links={data.explore || []} />
        </div>

        <p className="mx-auto mt-14 max-w-7xl border-t border-white/10 pt-6 text-center text-xs text-white/45">
          © {new Date().getFullYear()} Wellness Studio. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

function FooterContacts({ contact }: { contact?: LandingProfile["contact"] }) {
  const email = contact?.email || "hello@wellness.studio";
  const telegramUrl = resolveTelegramUrl(contact?.telegramUrl, contact?.telegramHandle);
  const telegramHandle =
    contact?.telegramHandle ||
    (telegramUrl ? telegramUrl.replace("https://t.me/", "@") : "@telegram");
  const qrUrl =
    contact?.telegramQrUrl ||
    (telegramUrl
      ? `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=${encodeURIComponent(telegramUrl)}`
      : "");

  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wide text-white">Contacts</h3>
      <div className="mt-4 space-y-5">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/45">
            {contact?.emailLabel || "Email Us"}
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-1 block text-sm text-white/80 hover:text-w-pink"
          >
            {email}
          </a>
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-white/45">
            {contact?.telegramLabel || "Telegram"}
          </p>
          <p className="mt-1 text-sm text-white/80">{telegramHandle}</p>
          {qrUrl ? (
            <div className="mt-3 inline-block rounded-xl bg-white p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="Telegram QR code"
                className="h-24 w-24 object-contain"
              />
            </div>
          ) : null}
          {telegramUrl ? (
            <a
              href={telegramUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 block text-sm font-medium text-w-pink hover:underline"
            >
              Open Telegram
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold tracking-wide text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-white/65">
        {links.map((l) => (
          <li key={l}>
            <span>{l}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function resolveTelegramUrl(url?: string, handle?: string) {
  if (url) return url;
  if (!handle) return "";
  const clean = handle.replace(/^@/, "").trim();
  return clean ? `https://t.me/${clean}` : "";
}
