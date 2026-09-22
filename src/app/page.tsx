"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { LandingProfile } from "@/lib/types";
import { isSectionVisible } from "@/lib/types";
import { LandingNav } from "@/components/landing/LandingNav";
import { HeroSection } from "@/components/landing/HeroSection";
import { JourneySection } from "@/components/landing/JourneySection";
import { AboutSection } from "@/components/landing/AboutSection";
import { SustainabilityCta } from "@/components/landing/SustainabilityCta";
import { InstructorsSection } from "@/components/landing/InstructorsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FaqSection } from "@/components/landing/FaqSection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { FooterSection } from "@/components/landing/FooterSection";
import { ScrollProgress } from "@/components/landing/ScrollProgress";

export default function HomePage() {
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

  if (!profile) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center bg-w-bg px-6 text-center text-w-ink">
        <ScrollProgress />
        <LandingNav brandName="Jenny" menus={[]} />
        <h1 className="font-display mt-20 text-4xl md:text-6xl">Jenny</h1>
        <p className="mt-4 max-w-md text-w-muted">
          {error || "No active profile yet. Activate one in the admin dashboard."}
        </p>
      </main>
    );
  }

  return (
    <main className="bg-w-bg text-w-ink">
      <ScrollProgress />
      <LandingNav
        brandName={profile.site.brandName}
        logoUrl={profile.site.logoUrl}
        menus={profile.menus.filter((m) => m.visible)}
        contactLabel={profile.hero.contactLabel || "Contact Me"}
        contactHref={profile.hero.contactHref || "/contact"}
      />
      {isSectionVisible(profile.sectionVisibility, "hero") && (
        <HeroSection data={profile.hero} brandName={profile.site.brandName} />
      )}
      {isSectionVisible(profile.sectionVisibility, "journey") && (
        <JourneySection data={profile.journey} />
      )}
      {isSectionVisible(profile.sectionVisibility, "about") && (
        <AboutSection data={profile.about} brandName={profile.site.brandName} />
      )}
      {isSectionVisible(profile.sectionVisibility, "sustainability") && (
        <SustainabilityCta data={profile.sustainability} />
      )}
      {isSectionVisible(profile.sectionVisibility, "instructors") && (
        <InstructorsSection data={profile.instructors} />
      )}
      {isSectionVisible(profile.sectionVisibility, "pricing") && (
        <PricingSection data={profile.pricing} />
      )}
      {isSectionVisible(profile.sectionVisibility, "faq") && (
        <FaqSection data={profile.faq} />
      )}
      {isSectionVisible(profile.sectionVisibility, "testimonials") && (
        <TestimonialsSection data={profile.testimonials} />
      )}
      {isSectionVisible(profile.sectionVisibility, "footer") && (
        <FooterSection data={profile.footer} contact={profile.contact} />
      )}
    </main>
  );
}
