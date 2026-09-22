"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { LandingProfile } from "@/lib/types";
import { ContactPageView } from "@/components/landing/ContactPage";
import { LandingNav } from "@/components/landing/LandingNav";
import { ScrollProgress } from "@/components/landing/ScrollProgress";

export default function ContactRoutePage() {
  const [profile, setProfile] = useState<LandingProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api<{ profile: LandingProfile }>("/portfolio/active")
      .then((d) => setProfile(d.profile))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-w-dark text-white">
        Loading…
      </main>
    );
  }

  const menus = profile?.menus.filter((m) => m.visible) ?? [];

  return (
    <main className="bg-w-bg">
      <ScrollProgress />
      <LandingNav
        brandName={profile?.site.brandName || "Jenny"}
        logoUrl={profile?.site.logoUrl}
        menus={menus}
        contactLabel={profile?.hero.contactLabel || "Contact Me"}
        contactHref="/contact"
        overlay
      />
      {profile ? (
        <ContactPageView profile={profile} />
      ) : (
        <div className="flex min-h-screen items-center justify-center px-6 text-center text-w-muted">
          {error || "Contact page is not available yet."}
        </div>
      )}
    </main>
  );
}
