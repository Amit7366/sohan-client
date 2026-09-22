"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Field, ImageField } from "@/components/dashboard/FormFields";
import { IconGrip, IconTrash } from "@/components/dashboard/icons";
import { api } from "@/lib/api";
import type { LandingProfile, PricingPlan, SectionVisibilityKey } from "@/lib/types";
import {
  defaultSectionVisibility,
  isSectionVisible,
  SECTION_VISIBILITY_META,
} from "@/lib/types";

const SECTIONS = [
  "General",
  "Menus",
  "Hero",
  "Journey",
  "About",
  "Sustainability",
  "Instructors",
  "Rates",
  "FAQ",
  "Testimonials",
  "Footer",
  "Contact",
] as const;

const SECTION_TO_VISIBILITY_KEY: Partial<Record<(typeof SECTIONS)[number], SectionVisibilityKey>> = {
  Hero: "hero",
  Journey: "journey",
  About: "about",
  Sustainability: "sustainability",
  Instructors: "instructors",
  Rates: "pricing",
  FAQ: "faq",
  Testimonials: "testimonials",
  Footer: "footer",
};

type Section = (typeof SECTIONS)[number];

export default function ProfileEditorPage() {
  const params = useParams();
  const id = params.id as string;
  const [profile, setProfile] = useState<LandingProfile | null>(null);
  const [section, setSection] = useState<Section>("General");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const data = await api<{ profile: LandingProfile }>(`/admin/profiles/${id}`);
    setProfile(data.profile);
  }, [id]);

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, [load]);

  async function save(patch: Partial<LandingProfile>) {
    if (!profile) return;
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const data = await api<{ profile: LandingProfile }>(
        `/admin/profiles/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify(patch),
        }
      );
      setProfile(data.profile);
      setMessage("Saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function toggleVisibility(key: SectionVisibilityKey, visible: boolean) {
    if (!profile) return;
    const next = { ...defaultSectionVisibility(profile.sectionVisibility), [key]: visible };
    setProfile({ ...profile, sectionVisibility: next });
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const data = await api<{ profile: LandingProfile }>(
        `/admin/profiles/${id}`,
        {
          method: "PATCH",
          body: JSON.stringify({ sectionVisibility: next }),
        }
      );
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              sectionVisibility: defaultSectionVisibility(
                data.profile.sectionVisibility
              ),
            }
          : data.profile
      );
      setMessage(visible ? "Section visible on landing" : "Section hidden from landing");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
      setProfile({ ...profile, sectionVisibility: profile.sectionVisibility });
    } finally {
      setSaving(false);
    }
  }

  if (!profile && !error) {
    return <p className="text-w-muted">Loading profile…</p>;
  }
  if (!profile) {
    return <p className="text-red-600">{error}</p>;
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/dashboard" className="text-sm text-w-muted hover:underline">
            ← Profiles
          </Link>
          <h1 className="font-display mt-1 text-3xl font-semibold">{profile.name}</h1>
          <p className="text-sm text-w-muted">
            {profile.isActive ? "Live on landing" : "Inactive"} · /{profile.slug}
          </p>
        </div>
        {message && <p className="text-sm text-emerald-700">{message}</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {SECTIONS.map((s) => {
          const visKey = SECTION_TO_VISIBILITY_KEY[s];
          const hidden =
            visKey !== undefined &&
            !isSectionVisible(profile.sectionVisibility, visKey);
          return (
            <button
              key={s}
              type="button"
              onClick={() => setSection(s)}
              className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-medium ${
                section === s
                  ? "bg-w-ink text-w-bg"
                  : "border border-w-line bg-w-surface text-w-ink"
              } ${hidden && section !== s ? "opacity-50" : ""}`}
            >
              {s}
              {hidden ? (
                <span className="ml-1 text-[10px] font-semibold uppercase tracking-wide">
                  off
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      <div className="mt-6 rounded-2xl border border-w-line bg-w-surface p-5 md:p-6">
        {SECTION_TO_VISIBILITY_KEY[section] ? (
          <div className="mb-6">
            <VisibilitySwitch
              label={`Show ${section} on landing page`}
              description="Turn this off to hide the section from the public landing page. Content is kept."
              checked={isSectionVisible(
                profile.sectionVisibility,
                SECTION_TO_VISIBILITY_KEY[section]!
              )}
              disabled={saving}
              onChange={(visible) =>
                toggleVisibility(SECTION_TO_VISIBILITY_KEY[section]!, visible)
              }
            />
          </div>
        ) : null}
        {section === "General" && (
          <GeneralEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
            onToggleVisibility={toggleVisibility}
          />
        )}
        {section === "Menus" && (
          <MenusEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
          />
        )}
        {section === "Hero" && (
          <HeroEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
          />
        )}
        {section === "Journey" && (
          <JourneyEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
          />
        )}
        {section === "About" && (
          <AboutEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
          />
        )}
        {section === "Sustainability" && (
          <SustainabilityEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
          />
        )}
        {section === "Instructors" && (
          <InstructorsEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
          />
        )}
        {section === "Rates" && (
          <PricingEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
          />
        )}
        {section === "FAQ" && (
          <FaqEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
          />
        )}
        {section === "Testimonials" && (
          <TestimonialsEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
          />
        )}
        {section === "Footer" && (
          <FooterEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
          />
        )}
        {section === "Contact" && (
          <ContactEditor
            profile={profile}
            setProfile={setProfile}
            save={save}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}

type EditorProps = {
  profile: LandingProfile;
  setProfile: (p: LandingProfile) => void;
  save: (patch: Partial<LandingProfile>) => Promise<void>;
  saving: boolean;
  onToggleVisibility?: (key: SectionVisibilityKey, visible: boolean) => void;
};

function VisibilitySwitch({
  label,
  description,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (visible: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-w-line bg-w-bg px-4 py-3">
      <div>
        <p className="text-sm font-medium text-w-ink">{label}</p>
        {description ? (
          <p className="mt-0.5 text-xs text-w-muted">{description}</p>
        ) : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${
          checked ? "bg-w-ink" : "bg-neutral-300 dark:bg-neutral-700"
        } disabled:opacity-50`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full shadow transition ${
            checked ? "left-5 bg-w-bg" : "left-0.5 bg-white"
          }`}
        />
      </button>
    </div>
  );
}

function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <button
      type="button"
      disabled={saving}
      onClick={onSave}
      className="mt-6 rounded-lg bg-w-ink px-4 py-2.5 text-sm font-semibold text-w-bg disabled:opacity-50"
    >
      {saving ? "Saving…" : "Save section"}
    </button>
  );
}

function GeneralEditor({
  profile,
  setProfile,
  save,
  saving,
  onToggleVisibility,
}: EditorProps) {
  const visibility = defaultSectionVisibility(profile.sectionVisibility);
  return (
    <div className="space-y-4">
      <Field
        label="Profile name"
        value={profile.name}
        onChange={(v) => setProfile({ ...profile, name: v })}
      />
      <Field
        label="Slug"
        value={profile.slug}
        onChange={(v) => setProfile({ ...profile, slug: v })}
      />
      <Field
        label="Brand name"
        value={profile.site.brandName}
        onChange={(v) =>
          setProfile({ ...profile, site: { ...profile.site, brandName: v } })
        }
      />
      <ImageField
        label="Logo URL"
        value={profile.site.logoUrl}
        onChange={(v) =>
          setProfile({ ...profile, site: { ...profile.site, logoUrl: v } })
        }
      />
      <div className="space-y-3 pt-2">
        <div>
          <h2 className="text-sm font-semibold text-w-ink">Landing section visibility</h2>
          <p className="mt-1 text-xs text-w-muted">
            Hidden sections stay saved here but will not appear on the public landing page.
          </p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          {SECTION_VISIBILITY_META.map(({ key, label }) => (
            <VisibilitySwitch
              key={key}
              label={label}
              checked={visibility[key]}
              disabled={saving}
              onChange={(visible) => onToggleVisibility?.(key, visible)}
            />
          ))}
        </div>
      </div>
      <SaveBar
        saving={saving}
        onSave={() =>
          save({
            name: profile.name,
            slug: profile.slug,
            site: profile.site,
          })
        }
      />
    </div>
  );
}

function withMenuOrder(menus: LandingProfile["menus"]) {
  return menus.map((item, index) => ({ ...item, order: index }));
}

function MenusEditor({ profile, setProfile, save, saving }: EditorProps) {
  const menus = profile.menus;
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  function commit(next: LandingProfile["menus"]) {
    setProfile({ ...profile, menus: withMenuOrder(next) });
  }

  function update(i: number, patch: Partial<(typeof menus)[0]>) {
    commit(menus.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function move(from: number, to: number) {
    if (from === to || from < 0 || to < 0 || from >= menus.length || to >= menus.length) return;
    const next = [...menus];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    commit(next);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-w-muted">
        Drag a row by the handle to set the navigation order. Save the section to publish it.
      </p>
      <ul className="space-y-2">
        {menus.map((item, i) => {
          const active = dragIndex === i;
          const over = overIndex === i && dragIndex !== null && dragIndex !== i;
          return (
            <li
              key={item._id ?? `${item.label}-${i}`}
              onDragOver={(e) => {
                e.preventDefault();
                if (overIndex !== i) setOverIndex(i);
              }}
              onDrop={(e) => {
                e.preventDefault();
                const from = Number(e.dataTransfer.getData("text/plain"));
                if (!Number.isNaN(from)) move(from, i);
                setDragIndex(null);
                setOverIndex(null);
              }}
              className={`rounded-xl border bg-w-surface transition ${
                over ? "border-w-ink" : "border-w-line"
              } ${active ? "opacity-50" : ""}`}
            >
              <div className="flex items-start gap-3 p-3 sm:items-center">
                <button
                  type="button"
                  draggable
                  aria-label={`Drag ${item.label || "menu item"}`}
                  title="Drag to reorder"
                  onDragStart={(e) => {
                    e.dataTransfer.effectAllowed = "move";
                    e.dataTransfer.setData("text/plain", String(i));
                    setDragIndex(i);
                  }}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                  className="mt-1 flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-lg border border-w-line text-w-muted hover:bg-w-bg active:cursor-grabbing sm:mt-0"
                >
                  <IconGrip />
                </button>
                <span className="mt-2 w-6 shrink-0 text-center text-xs font-semibold tabular-nums text-w-muted sm:mt-0">
                  {i + 1}
                </span>
                <div className="grid min-w-0 flex-1 gap-3 sm:grid-cols-2">
                  <Field
                    label="Label"
                    value={item.label}
                    onChange={(v) => update(i, { label: v })}
                  />
                  <Field
                    label="Href"
                    value={item.href}
                    onChange={(v) => update(i, { href: v })}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-w-line px-3 py-2">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={item.visible}
                    onChange={(e) => update(i, { visible: e.target.checked })}
                  />
                  Visible in navigation
                </label>
                <button
                  type="button"
                  aria-label={`Remove ${item.label || "menu item"}`}
                  onClick={() => commit(menus.filter((_, idx) => idx !== i))}
                  className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-red-600 hover:bg-w-bg"
                >
                  <IconTrash />
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      {menus.length === 0 && (
        <p className="rounded-xl border border-dashed border-w-line px-4 py-8 text-center text-sm text-w-muted">
          No menu items yet.
        </p>
      )}
      <button
        type="button"
        className="text-sm font-semibold underline"
        onClick={() =>
          commit([
            ...menus,
            {
              label: "New",
              href: "#",
              order: menus.length,
              visible: true,
            },
          ])
        }
      >
        + Add menu item
      </button>
      <SaveBar saving={saving} onSave={() => save({ menus: withMenuOrder(profile.menus) })} />
    </div>
  );
}

function HeroEditor({ profile, setProfile, save, saving }: EditorProps) {
  const h = profile.hero;
  function setHero(patch: Partial<typeof h>) {
    setProfile({ ...profile, hero: { ...h, ...patch } });
  }
  return (
    <div className="space-y-4">
      <Field label="Eyebrow (e.g. - Hello)" value={h.eyebrow} onChange={(v) => setHero({ eyebrow: v })} />
      <Field
        label="Highlight name (underlined pink)"
        value={h.highlightName || ""}
        onChange={(v) => setHero({ highlightName: v })}
      />
      <Field
        label="Role (e.g. Product Designer)"
        value={h.role || ""}
        onChange={(v) => setHero({ role: v })}
      />
      <Field label="Full title (fallback)" value={h.title} onChange={(v) => setHero({ title: v })} />
      <ImageField label="Portrait image" value={h.imageUrl} onChange={(v) => setHero({ imageUrl: v })} />
      <ImageField
        label="Left backdrop card image"
        value={h.cardLeftUrl || ""}
        onChange={(v) => setHero({ cardLeftUrl: v })}
      />
      <ImageField
        label="Right backdrop card image"
        value={h.cardRightUrl || ""}
        onChange={(v) => setHero({ cardRightUrl: v })}
      />
      <Field label="Primary CTA" value={h.ctaLabel} onChange={(v) => setHero({ ctaLabel: v })} />
      <Field label="Primary CTA href" value={h.ctaHref} onChange={(v) => setHero({ ctaHref: v })} />
      <Field
        label="Secondary CTA"
        value={h.secondaryCtaLabel || ""}
        onChange={(v) => setHero({ secondaryCtaLabel: v })}
      />
      <Field
        label="Secondary CTA href"
        value={h.secondaryCtaHref || ""}
        onChange={(v) => setHero({ secondaryCtaHref: v })}
      />
      <Field
        label="Nav contact button"
        value={h.contactLabel || ""}
        onChange={(v) => setHero({ contactLabel: v })}
      />
      <Field
        label="Nav contact href"
        value={h.contactHref || ""}
        onChange={(v) => setHero({ contactHref: v })}
      />
      <Field
        label="Badge text"
        value={h.badgeText || ""}
        onChange={(v) => setHero({ badgeText: v })}
      />
      <Field
        label="Clients count"
        value={h.clientsCount || h.trust.rating}
        onChange={(v) => setHero({ clientsCount: v })}
      />
      <Field
        label="Clients label"
        value={h.clientsLabel || h.trust.label}
        onChange={(v) => setHero({ clientsLabel: v })}
      />
      <Field
        label="Avatar URLs (comma separated)"
        value={(h.trust.avatars || []).join(", ")}
        onChange={(v) =>
          setHero({
            trust: {
              ...h.trust,
              avatars: v.split(",").map((t) => t.trim()).filter(Boolean),
            },
          })
        }
      />
      <SaveBar saving={saving} onSave={() => save({ hero: profile.hero })} />
    </div>
  );
}

function JourneyEditor({ profile, setProfile, save, saving }: EditorProps) {
  const cards = profile.journey.cards;
  function update(i: number, patch: Partial<(typeof cards)[0]>) {
    const next = cards.map((c, idx) => (idx === i ? { ...c, ...patch } : c));
    setProfile({
      ...profile,
      journey: { ...profile.journey, cards: next },
    });
  }
  return (
    <div className="space-y-4">
      <Field
        label="Section title"
        value={profile.journey.sectionTitle}
        onChange={(v) =>
          setProfile({
            ...profile,
            journey: { ...profile.journey, sectionTitle: v },
          })
        }
      />
      {cards.map((c, i) => (
        <div key={c._id ?? i} className="space-y-3 rounded-xl border border-w-line p-4">
          <Field label="Title" value={c.title} onChange={(v) => update(i, { title: v })} />
          <Field label="Text" value={c.text} onChange={(v) => update(i, { text: v })} textarea />
          <ImageField
            label="Image"
            value={c.imageUrl}
            onChange={(v) => update(i, { imageUrl: v })}
          />
          <Field
            label="Order"
            value={String(c.order)}
            onChange={(v) => update(i, { order: Number(v) || 0 })}
          />
          <button
            type="button"
            className="text-sm text-red-600"
            onClick={() =>
              setProfile({
                ...profile,
                journey: {
                  ...profile.journey,
                  cards: cards.filter((_, idx) => idx !== i),
                },
              })
            }
          >
            Remove card
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-sm font-semibold underline"
        onClick={() =>
          setProfile({
            ...profile,
            journey: {
              ...profile.journey,
              cards: [
                ...cards,
                { title: "New card", text: "", imageUrl: "", order: cards.length },
              ],
            },
          })
        }
      >
        + Add card
      </button>
      <SaveBar saving={saving} onSave={() => save({ journey: profile.journey })} />
    </div>
  );
}

function AboutEditor({ profile, setProfile, save, saving }: EditorProps) {
  const a = profile.about;
  const stats = a.stats || [];
  function updateStat(i: number, patch: Partial<(typeof stats)[0]>) {
    const next = stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    setProfile({ ...profile, about: { ...a, stats: next } });
  }
  return (
    <div className="space-y-4">
      <Field
        label="Vertical name (left panel)"
        value={a.verticalName || ""}
        onChange={(v) => setProfile({ ...profile, about: { ...a, verticalName: v } })}
      />
      <Field
        label="Years count"
        value={a.yearsCount || ""}
        onChange={(v) => setProfile({ ...profile, about: { ...a, yearsCount: v } })}
      />
      <Field
        label="Years label"
        value={a.yearsLabel || ""}
        onChange={(v) => setProfile({ ...profile, about: { ...a, yearsLabel: v } })}
      />
      <Field
        label="Eyebrow"
        value={a.eyebrow || ""}
        onChange={(v) => setProfile({ ...profile, about: { ...a, eyebrow: v } })}
      />
      <Field
        label="Title (Who is)"
        value={a.titleWho || ""}
        onChange={(v) => setProfile({ ...profile, about: { ...a, titleWho: v } })}
      />
      <Field
        label="Title name (pink)"
        value={a.titleName || ""}
        onChange={(v) => setProfile({ ...profile, about: { ...a, titleName: v } })}
      />
      <Field
        label="Description"
        value={a.description || ""}
        onChange={(v) => setProfile({ ...profile, about: { ...a, description: v } })}
        textarea
      />
      {stats.map((s, i) => (
        <div key={s._id ?? i} className="space-y-3 rounded-xl border border-w-line p-4">
          <Field label="Stat value" value={s.value} onChange={(v) => updateStat(i, { value: v })} />
          <Field label="Stat label" value={s.label} onChange={(v) => updateStat(i, { label: v })} />
          <button
            type="button"
            className="text-sm text-red-600"
            onClick={() =>
              setProfile({
                ...profile,
                about: { ...a, stats: stats.filter((_, idx) => idx !== i) },
              })
            }
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-sm font-semibold underline"
        onClick={() =>
          setProfile({
            ...profile,
            about: {
              ...a,
              stats: [
                ...stats,
                { value: "0+", label: "New stat", order: stats.length },
              ],
            },
          })
        }
      >
        + Add stat
      </button>
      <Field
        label="CTA label"
        value={a.ctaLabel || ""}
        onChange={(v) => setProfile({ ...profile, about: { ...a, ctaLabel: v } })}
      />
      <Field
        label="CTA href"
        value={a.ctaHref || ""}
        onChange={(v) => setProfile({ ...profile, about: { ...a, ctaHref: v } })}
      />
      <Field
        label="Signature"
        value={a.signature || ""}
        onChange={(v) => setProfile({ ...profile, about: { ...a, signature: v } })}
      />
      <ImageField
        label="Left panel image"
        value={a.imageUrl}
        onChange={(v) => setProfile({ ...profile, about: { ...a, imageUrl: v } })}
      />
      <SaveBar saving={saving} onSave={() => save({ about: profile.about })} />
    </div>
  );
}

function SustainabilityEditor({ profile, setProfile, save, saving }: EditorProps) {
  const s = profile.sustainability;
  const stats = s.stats;
  function update(i: number, patch: Partial<(typeof stats)[0]>) {
    const next = stats.map((st, idx) => (idx === i ? { ...st, ...patch } : st));
    setProfile({ ...profile, sustainability: { ...s, stats: next } });
  }
  return (
    <div className="space-y-4">
      <Field
        label="Eyebrow"
        value={s.eyebrow}
        onChange={(v) => setProfile({ ...profile, sustainability: { ...s, eyebrow: v } })}
      />
      <Field
        label="Title"
        value={s.title}
        onChange={(v) => setProfile({ ...profile, sustainability: { ...s, title: v } })}
        textarea
      />
      <Field
        label="CTA label"
        value={s.ctaLabel}
        onChange={(v) => setProfile({ ...profile, sustainability: { ...s, ctaLabel: v } })}
      />
      <Field
        label="CTA href"
        value={s.ctaHref}
        onChange={(v) => setProfile({ ...profile, sustainability: { ...s, ctaHref: v } })}
      />
      <ImageField
        label="Background image"
        value={s.imageUrl}
        onChange={(v) => setProfile({ ...profile, sustainability: { ...s, imageUrl: v } })}
      />
      {stats.map((st, i) => (
        <div key={st._id ?? i} className="space-y-3 rounded-xl border border-w-line p-4">
          <Field label="Value" value={st.value} onChange={(v) => update(i, { value: v })} />
          <Field label="Label" value={st.label} onChange={(v) => update(i, { label: v })} />
          <button
            type="button"
            className="text-sm text-red-600"
            onClick={() =>
              setProfile({
                ...profile,
                sustainability: {
                  ...s,
                  stats: stats.filter((_, idx) => idx !== i),
                },
              })
            }
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-sm font-semibold underline"
        onClick={() =>
          setProfile({
            ...profile,
            sustainability: {
              ...s,
              stats: [
                ...stats,
                { value: "New", label: "", order: stats.length },
              ],
            },
          })
        }
      >
        + Add stat
      </button>
      <SaveBar
        saving={saving}
        onSave={() => save({ sustainability: profile.sustainability })}
      />
    </div>
  );
}

function InstructorsEditor({ profile, setProfile, save, saving }: EditorProps) {
  const ins = profile.instructors;
  const people = ins.people;
  function update(i: number, patch: Partial<(typeof people)[0]>) {
    const next = people.map((p, idx) => (idx === i ? { ...p, ...patch } : p));
    setProfile({ ...profile, instructors: { ...ins, people: next } });
  }
  return (
    <div className="space-y-4">
      <Field
        label="Title"
        value={ins.title}
        onChange={(v) => setProfile({ ...profile, instructors: { ...ins, title: v } })}
      />
      <Field
        label="Subtitle"
        value={ins.subtitle}
        onChange={(v) => setProfile({ ...profile, instructors: { ...ins, subtitle: v } })}
        textarea
      />
      {people.map((p, i) => (
        <div key={p._id ?? i} className="space-y-3 rounded-xl border border-w-line p-4">
          <Field label="Name" value={p.name} onChange={(v) => update(i, { name: v })} />
          <Field label="Role" value={p.role} onChange={(v) => update(i, { role: v })} />
          <ImageField
            label="Photo"
            value={p.imageUrl}
            onChange={(v) => update(i, { imageUrl: v })}
          />
          <Field
            label="Order"
            value={String(p.order)}
            onChange={(v) => update(i, { order: Number(v) || 0 })}
          />
          <button
            type="button"
            className="text-sm text-red-600"
            onClick={() =>
              setProfile({
                ...profile,
                instructors: {
                  ...ins,
                  people: people.filter((_, idx) => idx !== i),
                },
              })
            }
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-sm font-semibold underline"
        onClick={() =>
          setProfile({
            ...profile,
            instructors: {
              ...ins,
              people: [
                ...people,
                { name: "New", role: "", imageUrl: "", order: people.length },
              ],
            },
          })
        }
      >
        + Add instructor
      </button>
      <SaveBar
        saving={saving}
        onSave={() => save({ instructors: profile.instructors })}
      />
    </div>
  );
}

function emptyPlan(order: number): PricingPlan {
  return {
    name: "New plan",
    tagline: "",
    price: "0",
    currency: "$",
    badge: "",
    featured: false,
    features: [],
    order,
  };
}

function PricingEditor({ profile, setProfile, save, saving }: EditorProps) {
  const p = profile.pricing || {
    eyebrow: "- Session Rates",
    title: "My Rates",
    subtitle: "",
    ctaLabel: "Book Now",
    ctaHref: "/contact",
    note: "",
    plans: [],
  };
  const plans = p.plans || [];

  function setPricing(patch: Partial<typeof p>) {
    setProfile({ ...profile, pricing: { ...p, ...patch } });
  }

  function update(i: number, patch: Partial<PricingPlan>) {
    setPricing({
      plans: plans.map((plan, idx) => (idx === i ? { ...plan, ...patch } : plan)),
    });
  }

  return (
    <div className="space-y-4">
      <Field
        label="Eyebrow"
        value={p.eyebrow || ""}
        onChange={(v) => setPricing({ eyebrow: v })}
      />
      <Field label="Title" value={p.title} onChange={(v) => setPricing({ title: v })} />
      <Field
        label="Subtitle"
        value={p.subtitle}
        onChange={(v) => setPricing({ subtitle: v })}
        textarea
      />
      <Field
        label="Button label"
        value={p.ctaLabel}
        onChange={(v) => setPricing({ ctaLabel: v })}
      />
      <Field
        label="Button link"
        value={p.ctaHref}
        onChange={(v) => setPricing({ ctaHref: v })}
      />
      <Field
        label="Note under cards"
        value={p.note || ""}
        onChange={(v) => setPricing({ note: v })}
        textarea
      />
      {plans.map((plan, i) => (
        <div key={plan._id ?? i} className="space-y-3 rounded-xl border border-w-line p-4">
          <Field
            label="Plan name"
            value={plan.name}
            onChange={(v) => update(i, { name: v })}
          />
          <Field
            label="Tagline"
            value={plan.tagline}
            onChange={(v) => update(i, { tagline: v })}
          />
          <Field
            label="Price"
            value={plan.price}
            onChange={(v) => update(i, { price: v })}
          />
          <Field
            label="Currency"
            value={plan.currency || "$"}
            onChange={(v) => update(i, { currency: v })}
          />
          <Field
            label="Badge (optional)"
            value={plan.badge || ""}
            onChange={(v) => update(i, { badge: v })}
          />
          <label className="flex items-center gap-2 text-sm font-medium text-w-ink">
            <input
              type="checkbox"
              checked={Boolean(plan.featured)}
              onChange={(e) => update(i, { featured: e.target.checked })}
            />
            Highlight this plan
          </label>
          <Field
            label="Features (one per line)"
            value={(plan.features || []).join("\n")}
            onChange={(v) =>
              update(i, {
                features: v.split("\n").map((x) => x.trim()).filter(Boolean),
              })
            }
            textarea
          />
          <button
            type="button"
            className="text-sm text-red-600"
            onClick={() =>
              setPricing({ plans: plans.filter((_, idx) => idx !== i) })
            }
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-sm font-semibold underline"
        onClick={() => setPricing({ plans: [...plans, emptyPlan(plans.length)] })}
      >
        + Add plan
      </button>
      <SaveBar
        saving={saving}
        onSave={() => save({ pricing: profile.pricing || p })}
      />
    </div>
  );
}

function FaqEditor({ profile, setProfile, save, saving }: EditorProps) {
  const f = profile.faq;
  const items = f.items;
  function update(i: number, patch: Partial<(typeof items)[0]>) {
    const next = items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    setProfile({ ...profile, faq: { ...f, items: next } });
  }
  return (
    <div className="space-y-4">
      <Field
        label="Title"
        value={f.title}
        onChange={(v) => setProfile({ ...profile, faq: { ...f, title: v } })}
      />
      <Field
        label="Help title"
        value={f.helpTitle}
        onChange={(v) => setProfile({ ...profile, faq: { ...f, helpTitle: v } })}
      />
      <Field
        label="Help CTA"
        value={f.helpCta}
        onChange={(v) => setProfile({ ...profile, faq: { ...f, helpCta: v } })}
      />
      <Field
        label="Help CTA href"
        value={f.helpCtaHref}
        onChange={(v) => setProfile({ ...profile, faq: { ...f, helpCtaHref: v } })}
      />
      <ImageField
        label="Image"
        value={f.imageUrl}
        onChange={(v) => setProfile({ ...profile, faq: { ...f, imageUrl: v } })}
      />
      {items.map((it, i) => (
        <div key={it._id ?? i} className="space-y-3 rounded-xl border border-w-line p-4">
          <Field label="Question" value={it.q} onChange={(v) => update(i, { q: v })} />
          <Field label="Answer" value={it.a} onChange={(v) => update(i, { a: v })} textarea />
          <button
            type="button"
            className="text-sm text-red-600"
            onClick={() =>
              setProfile({
                ...profile,
                faq: { ...f, items: items.filter((_, idx) => idx !== i) },
              })
            }
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-sm font-semibold underline"
        onClick={() =>
          setProfile({
            ...profile,
            faq: {
              ...f,
              items: [...items, { q: "New question?", a: "", order: items.length }],
            },
          })
        }
      >
        + Add FAQ
      </button>
      <SaveBar saving={saving} onSave={() => save({ faq: profile.faq })} />
    </div>
  );
}

function TestimonialsEditor({ profile, setProfile, save, saving }: EditorProps) {
  const t = profile.testimonials;
  const reviews = t.reviews;
  function update(i: number, patch: Partial<(typeof reviews)[0]>) {
    const next = reviews.map((r, idx) => (idx === i ? { ...r, ...patch } : r));
    setProfile({ ...profile, testimonials: { ...t, reviews: next } });
  }
  return (
    <div className="space-y-4">
      <Field
        label="Eyebrow"
        value={t.eyebrow || ""}
        onChange={(v) => setProfile({ ...profile, testimonials: { ...t, eyebrow: v } })}
      />
      <Field
        label="Title line 1"
        value={t.titleMain || ""}
        onChange={(v) => setProfile({ ...profile, testimonials: { ...t, titleMain: v } })}
      />
      <Field
        label="Title line 2 (pink)"
        value={t.titleAccent || ""}
        onChange={(v) => setProfile({ ...profile, testimonials: { ...t, titleAccent: v } })}
      />
      {reviews.map((r, i) => (
        <div key={r._id ?? i} className="space-y-3 rounded-xl border border-w-line p-4">
          <Field label="Body" value={r.body} onChange={(v) => update(i, { body: v })} textarea />
          <Field label="Name" value={r.name} onChange={(v) => update(i, { name: v })} />
          <Field label="Role" value={r.role} onChange={(v) => update(i, { role: v })} />
          <Field
            label="Rating"
            value={r.rating || "5.0"}
            onChange={(v) => update(i, { rating: v })}
          />
          <ImageField
            label="Avatar"
            value={r.avatarUrl}
            onChange={(v) => update(i, { avatarUrl: v })}
          />
          <button
            type="button"
            className="text-sm text-red-600"
            onClick={() =>
              setProfile({
                ...profile,
                testimonials: {
                  ...t,
                  reviews: reviews.filter((_, idx) => idx !== i),
                },
              })
            }
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        className="text-sm font-semibold underline"
        onClick={() =>
          setProfile({
            ...profile,
            testimonials: {
              ...t,
              reviews: [
                ...reviews,
                {
                  title: "New review",
                  body: "",
                  name: "",
                  role: "",
                  avatarUrl: "",
                  rating: "5.0",
                  order: reviews.length,
                },
              ],
            },
          })
        }
      >
        + Add review
      </button>
      <SaveBar
        saving={saving}
        onSave={() => save({ testimonials: profile.testimonials })}
      />
    </div>
  );
}

function FooterEditor({ profile, setProfile, save, saving }: EditorProps) {
  const f = profile.footer;
  return (
    <div className="space-y-4">
      <Field
        label="CTA title"
        value={f.ctaTitle}
        onChange={(v) => setProfile({ ...profile, footer: { ...f, ctaTitle: v } })}
        textarea
      />
      <Field
        label="CTA label"
        value={f.ctaLabel}
        onChange={(v) => setProfile({ ...profile, footer: { ...f, ctaLabel: v } })}
      />
      <Field
        label="CTA href"
        value={f.ctaHref}
        onChange={(v) => setProfile({ ...profile, footer: { ...f, ctaHref: v } })}
      />
      <ImageField
        label="CTA background"
        value={f.imageUrl}
        onChange={(v) => setProfile({ ...profile, footer: { ...f, imageUrl: v } })}
      />
      <Field
        label="Newsletter label"
        value={f.newsletterLabel}
        onChange={(v) =>
          setProfile({ ...profile, footer: { ...f, newsletterLabel: v } })
        }
      />
      <p className="rounded-xl bg-w-card px-3 py-2 text-sm text-w-muted">
        Footer Contacts uses the same email and Telegram as the Contact page.
        Edit those fields in the Contact section.
      </p>
      <Field
        label="Resources (one per line)"
        value={f.resources.join("\n")}
        onChange={(v) =>
          setProfile({
            ...profile,
            footer: {
              ...f,
              resources: v.split("\n").map((x) => x.trim()).filter(Boolean),
            },
          })
        }
        textarea
      />
      <Field
        label="Explore (one per line)"
        value={f.explore.join("\n")}
        onChange={(v) =>
          setProfile({
            ...profile,
            footer: {
              ...f,
              explore: v.split("\n").map((x) => x.trim()).filter(Boolean),
            },
          })
        }
        textarea
      />
      <SaveBar saving={saving} onSave={() => save({ footer: profile.footer })} />
    </div>
  );
}

function ContactEditor({ profile, setProfile, save, saving }: EditorProps) {
  const c = profile.contact || {
    title: "Contact us",
    subtitle: "",
    bannerUrl: "",
    introTitle: "Get in touch",
    introText: "",
    emailLabel: "Email Us",
    email: "",
    telegramLabel: "Telegram",
    telegramHandle: "",
    telegramUrl: "",
    telegramQrUrl: "",
  };

  function setContact(patch: Partial<typeof c>) {
    setProfile({ ...profile, contact: { ...c, ...patch } });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-w-muted">
        This content appears on the <code>/contact</code> page. Leave the QR
        image empty to auto-generate one from the Telegram link.
      </p>
      <Field label="Title" value={c.title} onChange={(v) => setContact({ title: v })} />
      <Field
        label="Subtitle"
        value={c.subtitle}
        onChange={(v) => setContact({ subtitle: v })}
        textarea
      />
      <ImageField
        label="Banner image"
        value={c.bannerUrl}
        onChange={(v) => setContact({ bannerUrl: v })}
      />
      <Field
        label="Get in touch title"
        value={c.introTitle}
        onChange={(v) => setContact({ introTitle: v })}
      />
      <Field
        label="Get in touch text"
        value={c.introText}
        onChange={(v) => setContact({ introText: v })}
        textarea
      />
      <Field
        label="Email label"
        value={c.emailLabel}
        onChange={(v) => setContact({ emailLabel: v })}
      />
      <Field label="Email" value={c.email} onChange={(v) => setContact({ email: v })} />
      <Field
        label="Telegram label"
        value={c.telegramLabel || ""}
        onChange={(v) => setContact({ telegramLabel: v })}
      />
      <Field
        label="Telegram handle"
        value={c.telegramHandle || ""}
        onChange={(v) => setContact({ telegramHandle: v })}
      />
      <Field
        label="Telegram URL"
        value={c.telegramUrl || ""}
        onChange={(v) => setContact({ telegramUrl: v })}
      />
      <ImageField
        label="Telegram QR image (optional)"
        value={c.telegramQrUrl || ""}
        onChange={(v) => setContact({ telegramQrUrl: v })}
      />
      <SaveBar
        saving={saving}
        onSave={() => save({ contact: { ...c } })}
      />
    </div>
  );
}
