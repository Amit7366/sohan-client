"use client";

import type { LandingProfile } from "@/lib/types";

const FALLBACK_BANNER =
  "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1800&q=80";

export function ContactPageView({
  profile,
}: {
  profile: LandingProfile;
}) {
  const c = profile.contact;
  const brand = profile.site.brandName || "Jenny";
  const title = c?.title || "Contact us";
  const subtitle =
    c?.subtitle ||
    `${brand} is ready to provide the right solution according to your needs`;
  const bannerUrl = c?.bannerUrl || FALLBACK_BANNER;
  const email = c?.email || "hello@wellness.studio";
  const telegramUrl = resolveTelegramUrl(c?.telegramUrl, c?.telegramHandle);
  const telegramHandle =
    c?.telegramHandle || (telegramUrl ? telegramUrl.replace("https://t.me/", "@") : "@telegram");
  const qrUrl =
    c?.telegramQrUrl ||
    (telegramUrl
      ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=10&data=${encodeURIComponent(telegramUrl)}`
      : "");

  return (
    <div className="min-h-screen bg-w-bg">
      <section className="relative isolate overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={bannerUrl}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-[70%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-rose-950/80 via-pink-900/65 to-fuchsia-800/50" />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 bg-w-bg md:h-24"
          style={{ clipPath: "polygon(0 100%, 0 72%, 100% 0, 100% 100%)" }}
        />
        <div className="relative mx-auto flex min-h-[240px] max-w-3xl flex-col items-center justify-center px-5 pb-20 pt-28 text-center text-white sm:min-h-[280px] md:min-h-[340px] md:pb-28 md:pt-32">
          <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/90 sm:text-base">
            {subtitle}
          </p>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-16 max-w-[980px] px-4 pb-16 sm:-mt-20 sm:px-6 md:-mt-24 md:pb-24">
        <div className="overflow-hidden rounded-[28px] bg-w-surface shadow-[0_24px_80px_-24px_rgba(236,72,153,0.4)]">
          <div className="grid md:grid-cols-2">
            <aside className="bg-w-card px-6 py-8 sm:px-10 sm:py-12 md:px-12">
              <h2 className="font-display text-2xl font-semibold text-w-pink sm:text-[28px]">
                {c?.introTitle || "Get in touch"}
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-relaxed text-w-muted">
                {c?.introText ||
                  "The fastest way to reach me is email or Telegram. Scan the code or tap a link to start a chat."}
              </p>

              <div className="mt-8 flex gap-3">
                <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-w-pink text-white shadow-md shadow-pink-500/25">
                  <MailIcon />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-w-ink">
                    {c?.emailLabel || "Email Us"}
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="block text-sm leading-relaxed text-w-muted hover:text-w-pink"
                  >
                    {email}
                  </a>
                </div>
              </div>
            </aside>

            <div className="flex flex-col items-center bg-w-surface px-6 py-8 text-center sm:px-10 sm:py-12 md:px-12">
              <h2 className="font-display text-2xl font-semibold text-w-pink sm:text-[28px]">
                {c?.telegramLabel || "Telegram"}
              </h2>
              <p className="mt-2 text-sm text-w-muted">Scan to chat on Telegram</p>

              {qrUrl ? (
                <div className="mt-6 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-w-line">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={qrUrl}
                    alt="Telegram QR code"
                    className="h-44 w-44 object-contain sm:h-52 sm:w-52"
                  />
                </div>
              ) : null}

              <p className="mt-4 text-sm font-semibold text-w-ink">{telegramHandle}</p>

              {telegramUrl ? (
                <a
                  href={telegramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-rose-500 px-6 text-sm font-semibold text-white shadow-md shadow-pink-500/25 transition hover:brightness-110"
                >
                  Open Telegram
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function resolveTelegramUrl(url?: string, handle?: string) {
  if (url) return url;
  if (!handle) return "";
  const clean = handle.replace(/^@/, "").trim();
  return clean ? `https://t.me/${clean}` : "";
}

function MailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20 4H4a2 2 0 00-2 2v12a2 2 0 002 2h16a2 2 0 002-2V6a2 2 0 00-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
    </svg>
  );
}
