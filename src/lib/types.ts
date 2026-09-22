export interface MenuItem {
  _id?: string;
  label: string;
  href: string;
  order: number;
  visible: boolean;
}

export interface JourneyCard {
  _id?: string;
  title: string;
  text: string;
  imageUrl: string;
  order: number;
}

export interface Benefit {
  _id?: string;
  title: string;
  text: string;
  color: string;
  order: number;
}

export interface Instructor {
  _id?: string;
  name: string;
  role: string;
  imageUrl: string;
  order: number;
}

export interface FaqItem {
  _id?: string;
  q: string;
  a: string;
  order: number;
}

export interface Review {
  _id?: string;
  title: string;
  body: string;
  name: string;
  role: string;
  avatarUrl: string;
  rating?: string;
  order: number;
}

export interface StatItem {
  _id?: string;
  value: string;
  label: string;
  order: number;
}

export interface SocialLink {
  _id?: string;
  label: string;
  href: string;
}

export interface PricingPlan {
  _id?: string;
  name: string;
  tagline: string;
  price: string;
  currency?: string;
  badge?: string;
  featured?: boolean;
  features: string[];
  order: number;
}

export type SectionVisibilityKey =
  | "hero"
  | "journey"
  | "about"
  | "sustainability"
  | "instructors"
  | "pricing"
  | "faq"
  | "testimonials"
  | "footer";

export type SectionVisibility = Record<SectionVisibilityKey, boolean>;

export const SECTION_VISIBILITY_META: {
  key: SectionVisibilityKey;
  label: string;
}[] = [
  { key: "hero", label: "Hero" },
  { key: "journey", label: "Journey" },
  { key: "about", label: "About" },
  { key: "sustainability", label: "Sustainability" },
  { key: "instructors", label: "Instructors" },
  { key: "pricing", label: "Rates" },
  { key: "faq", label: "FAQ" },
  { key: "testimonials", label: "Testimonials" },
  { key: "footer", label: "Footer" },
];

export function defaultSectionVisibility(
  value?: Partial<SectionVisibility> | null
): SectionVisibility {
  return {
    hero: value?.hero !== false,
    journey: value?.journey !== false,
    about: value?.about !== false,
    sustainability: value?.sustainability !== false,
    instructors: value?.instructors !== false,
    pricing: value?.pricing !== false,
    faq: value?.faq !== false,
    testimonials: value?.testimonials !== false,
    footer: value?.footer !== false,
  };
}

export function isSectionVisible(
  value: Partial<SectionVisibility> | undefined,
  key: SectionVisibilityKey
): boolean {
  return value?.[key] !== false;
}

export interface LandingProfile {
  id: string;
  name: string;
  slug: string;
  isActive: boolean;
  site: { brandName: string; logoUrl: string };
  sectionVisibility?: SectionVisibility;
  menus: MenuItem[];
  hero: {
    eyebrow: string;
    title: string;
    highlightName?: string;
    role?: string;
    ctaLabel: string;
    ctaHref: string;
    secondaryCtaLabel?: string;
    secondaryCtaHref?: string;
    contactLabel?: string;
    contactHref?: string;
    badgeText?: string;
    clientsCount?: string;
    clientsLabel?: string;
    imageUrl: string;
    cardLeftUrl?: string;
    cardRightUrl?: string;
    tags: string[];
    trust: { label: string; rating: string; avatars: string[] };
  };
  journey: { sectionTitle: string; cards: JourneyCard[] };
  about: {
    title: string;
    imageUrl: string;
    playLabel: string;
    benefits: Benefit[];
    verticalName?: string;
    yearsCount?: string;
    yearsLabel?: string;
    eyebrow?: string;
    titleWho?: string;
    titleName?: string;
    description?: string;
    stats?: StatItem[];
    ctaLabel?: string;
    ctaHref?: string;
    signature?: string;
  };
  sustainability: {
    eyebrow: string;
    title: string;
    ctaLabel: string;
    ctaHref: string;
    imageUrl: string;
    stats: StatItem[];
  };
  instructors: {
    title: string;
    subtitle: string;
    people: Instructor[];
  };
  pricing?: {
    eyebrow?: string;
    title: string;
    subtitle: string;
    ctaLabel: string;
    ctaHref: string;
    note?: string;
    plans: PricingPlan[];
  };
  faq: {
    title: string;
    helpTitle: string;
    helpCta: string;
    helpCtaHref: string;
    imageUrl: string;
    items: FaqItem[];
  };
  testimonials: {
    title: string;
    viewAllLabel: string;
    eyebrow?: string;
    titleMain?: string;
    titleAccent?: string;
    reviews: Review[];
  };
  footer: {
    ctaTitle: string;
    ctaLabel: string;
    ctaHref: string;
    imageUrl: string;
    newsletterLabel: string;
    contacts: string[];
    resources: string[];
    explore: string[];
    social: SocialLink[];
  };
  contact?: {
    title: string;
    subtitle: string;
    bannerUrl: string;
    introTitle: string;
    introText: string;
    officeLabel?: string;
    office?: string;
    emailLabel: string;
    email: string;
    phoneLabel?: string;
    phone?: string;
    phoneAlt?: string;
    socialTitle?: string;
    formTitle?: string;
    submitLabel?: string;
    telegramLabel?: string;
    telegramHandle?: string;
    telegramUrl?: string;
    telegramQrUrl?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export type UserRole = "user" | "superadmin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActiveProfile: boolean;
}
