"use client";

import { useEffect, useMemo, useState, type FormEvent, type ReactNode } from "react";
import { Field, ImageField } from "@/components/dashboard/FormFields";
import {
  IconClose,
  IconEye,
  IconPencil,
  IconPlus,
  IconReviews,
  IconSearch,
  IconTrash,
} from "@/components/dashboard/icons";
import { api } from "@/lib/api";
import type { LandingProfile, Review } from "@/lib/types";

type ReviewRow = Review & {
  profileId: string;
  profileName: string;
  profileActive: boolean;
};

type Draft = {
  profileId: string;
  title: string;
  body: string;
  name: string;
  role: string;
  avatarUrl: string;
  rating: string;
  order: string;
};

type Mode = "create" | "edit" | "view";

const RATINGS = ["5.0", "4.5", "4.0", "3.5", "3.0", "2.5", "2.0", "1.0"];

function emptyDraft(profileId: string, order: number): Draft {
  return {
    profileId,
    title: "",
    body: "",
    name: "",
    role: "",
    avatarUrl: "",
    rating: "5.0",
    order: String(order),
  };
}

function stars(rating: string) {
  const value = Math.max(0, Math.min(5, Number.parseFloat(rating) || 0));
  const full = Math.round(value);
  return "★★★★★".slice(0, full) + "☆☆☆☆☆".slice(0, 5 - full);
}

function initials(name: string) {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

export default function ReviewsPage() {
  const [profiles, setProfiles] = useState<LandingProfile[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [query, setQuery] = useState("");
  const [profileFilter, setProfileFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState<Mode | null>(null);
  const [editing, setEditing] = useState<ReviewRow | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft("", 0));
  const [pendingDelete, setPendingDelete] = useState<ReviewRow | null>(null);

  async function load() {
    const data = await api<{ profiles: LandingProfile[] }>("/admin/profiles");
    setProfiles(data.profiles);
  }

  useEffect(() => {
    load()
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const rows = useMemo<ReviewRow[]>(() => {
    return profiles
      .flatMap((profile) =>
        (profile.testimonials?.reviews ?? []).map((review) => ({
          ...review,
          profileId: profile.id,
          profileName: profile.name,
          profileActive: profile.isActive,
        }))
      )
      .sort((a, b) => a.order - b.order || a.name.localeCompare(b.name));
  }, [profiles]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (profileFilter !== "all" && row.profileId !== profileFilter) return false;
      if (ratingFilter !== "all" && (row.rating || "5.0") !== ratingFilter) return false;
      if (!q) return true;
      return [row.name, row.role, row.title, row.body, row.profileName]
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [rows, query, profileFilter, ratingFilter]);

  const pageSize = 8;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const average = rows.length
    ? (
        rows.reduce((sum, row) => sum + (Number.parseFloat(row.rating || "5") || 0), 0) /
        rows.length
      ).toFixed(1)
    : "—";

  function openCreate() {
    const preferred =
      profiles.find((profile) => profile.isActive)?.id ?? profiles[0]?.id ?? "";
    const nextOrder =
      Math.max(
        0,
        ...rows.filter((row) => row.profileId === preferred).map((row) => row.order)
      ) + 1;
    setEditing(null);
    setDraft(emptyDraft(preferred, nextOrder || rows.length));
    setMode("create");
    setError("");
  }

  function openRow(row: ReviewRow, next: Mode) {
    setEditing(row);
    setDraft({
      profileId: row.profileId,
      title: row.title || "",
      body: row.body || "",
      name: row.name || "",
      role: row.role || "",
      avatarUrl: row.avatarUrl || "",
      rating: row.rating || "5.0",
      order: String(row.order ?? 0),
    });
    setMode(next);
    setError("");
  }

  async function saveTestimonials(profileId: string, reviews: Review[]) {
    const profile = profiles.find((item) => item.id === profileId);
    if (!profile) throw new Error("Profile not found");
    await api(`/admin/profiles/${profileId}`, {
      method: "PATCH",
      body: JSON.stringify({
        testimonials: { ...profile.testimonials, reviews },
      }),
    });
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    if (!draft.name.trim() || !draft.body.trim()) {
      setError("Name and review text are required.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const nextReview: Review = {
        ...(editing?._id ? { _id: editing._id } : {}),
        title: draft.title.trim(),
        body: draft.body.trim(),
        name: draft.name.trim(),
        role: draft.role.trim(),
        avatarUrl: draft.avatarUrl.trim(),
        rating: draft.rating || "5.0",
        order: Number.parseInt(draft.order, 10) || 0,
      };

      const moved = editing && editing.profileId !== draft.profileId;
      if (!editing || moved) {
        const target = profiles.find((item) => item.id === draft.profileId);
        if (!target) throw new Error("Choose a profile");
        const created = { ...nextReview };
        delete created._id;
        await saveTestimonials(target.id, [
          ...(target.testimonials?.reviews ?? []),
          created,
        ]);
      }

      if (editing) {
        const source = profiles.find((item) => item.id === editing.profileId);
        if (!source) throw new Error("Source profile not found");
        const remaining = (source.testimonials?.reviews ?? [])
          .map((review) =>
            !moved && review._id === editing._id ? nextReview : review
          )
          .filter((review) => moved ? review._id !== editing._id : true);
        await saveTestimonials(source.id, remaining);
      }

      await load();
      setMode(null);
      setNotice(editing ? "Review updated." : "Review created.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setBusy(false);
    }
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const source = profiles.find((item) => item.id === pendingDelete.profileId);
      if (!source) throw new Error("Profile not found");
      await saveTestimonials(
        source.id,
        (source.testimonials?.reviews ?? []).filter(
          (review) => review._id !== pendingDelete._id
        )
      );
      await load();
      setPendingDelete(null);
      setNotice("Review deleted.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Reviews</h1>
          <p className="mt-1 text-sm text-[var(--dash-muted)]">
            Create, review, edit, and remove testimonials shown on the landing page.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          disabled={!profiles.length}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--dash-ink)] px-3.5 py-2 text-sm font-semibold text-[var(--dash-bg)] disabled:opacity-40"
        >
          <IconPlus />
          Add review
        </button>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Total reviews" value={String(rows.length)} />
        <Stat label="Average rating" value={average} />
        <Stat
          label="Live profile"
          value={profiles.find((profile) => profile.isActive)?.name ?? "None"}
        />
      </div>

      {notice && (
        <p className="mt-4 rounded-lg border border-[var(--dash-line)] bg-[var(--dash-surface)] px-3 py-2 text-sm">
          {notice}
        </p>
      )}
      {error && !mode && !pendingDelete && (
        <p className="mt-4 text-sm text-red-600">{error}</p>
      )}

      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-[var(--dash-line)] bg-[var(--dash-surface)] p-3 lg:flex-row lg:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-[var(--dash-muted)]">
            <IconSearch />
          </span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search name, role, or review"
            className="w-full border border-[var(--dash-line)] bg-[var(--dash-bg)] py-2 pr-3 pl-9 text-sm outline-none focus:border-[var(--dash-ink)]"
          />
        </label>
        <select
          value={profileFilter}
          onChange={(e) => {
            setProfileFilter(e.target.value);
            setPage(1);
          }}
          className="border border-[var(--dash-line)] bg-[var(--dash-bg)] px-3 py-2 text-sm outline-none"
        >
          <option value="all">All profiles</option>
          {profiles.map((profile) => (
            <option key={profile.id} value={profile.id}>
              {profile.name}
            </option>
          ))}
        </select>
        <select
          value={ratingFilter}
          onChange={(e) => {
            setRatingFilter(e.target.value);
            setPage(1);
          }}
          className="border border-[var(--dash-line)] bg-[var(--dash-bg)] px-3 py-2 text-sm outline-none"
        >
          <option value="all">All ratings</option>
          {RATINGS.map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--dash-line)] bg-[var(--dash-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b border-[var(--dash-line)] text-[11px] tracking-[0.12em] text-[var(--dash-muted)] uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Reviewer</th>
                <th className="px-4 py-3 font-semibold">Review</th>
                <th className="px-4 py-3 font-semibold">Rating</th>
                <th className="px-4 py-3 font-semibold">Profile</th>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[var(--dash-muted)]">
                    Loading reviews…
                  </td>
                </tr>
              )}
              {!loading && visible.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--dash-line)]">
                      <IconReviews />
                    </span>
                    <p className="font-medium">
                      {rows.length === 0 ? "No reviews yet" : "No matching reviews"}
                    </p>
                    <p className="mt-1 text-[var(--dash-muted)]">
                      {rows.length === 0
                        ? "Add a review to show it in the testimonials section."
                        : "Try a different search or filter."}
                    </p>
                  </td>
                </tr>
              )}
              {visible.map((row) => (
                <tr
                  key={`${row.profileId}-${row._id ?? row.name}`}
                  className="border-b border-[var(--dash-line)] last:border-0"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {row.avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.avatarUrl}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                      ) : (
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--dash-ink)] text-[11px] font-semibold text-[var(--dash-bg)]">
                          {initials(row.name)}
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium">{row.name || "Untitled"}</p>
                        <p className="truncate text-xs text-[var(--dash-muted)]">
                          {row.role || "No role"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="max-w-[280px] px-4 py-3">
                    <p className="truncate font-medium">{row.title || "Untitled review"}</p>
                    <p className="truncate text-xs text-[var(--dash-muted)]">{row.body}</p>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="tracking-tight">{stars(row.rating || "5.0")}</span>
                    <span className="ml-2 text-xs text-[var(--dash-muted)]">
                      {row.rating || "5.0"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5">
                      {row.profileName}
                      {row.profileActive && (
                        <span className="rounded-full border border-[var(--dash-line)] px-1.5 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                          Live
                        </span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 tabular-nums">{row.order}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <IconAction label="View review" onClick={() => openRow(row, "view")}>
                        <IconEye />
                      </IconAction>
                      <IconAction label="Edit review" onClick={() => openRow(row, "edit")}>
                        <IconPencil />
                      </IconAction>
                      <IconAction label="Delete review" onClick={() => setPendingDelete(row)}>
                        <IconTrash />
                      </IconAction>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between border-t border-[var(--dash-line)] px-4 py-3 text-xs text-[var(--dash-muted)]">
          <span>
            {filtered.length} review{filtered.length === 1 ? "" : "s"}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              className="rounded-md border border-[var(--dash-line)] px-2.5 py-1 disabled:opacity-40"
            >
              Previous
            </button>
            <span>
              {safePage} / {pageCount}
            </span>
            <button
              type="button"
              disabled={safePage >= pageCount}
              onClick={() => setPage((value) => value + 1)}
              className="rounded-md border border-[var(--dash-line)] px-2.5 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {mode && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-4 sm:items-center">
          <form
            onSubmit={onSave}
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[var(--dash-line)] bg-[var(--dash-surface)] p-5 shadow-xl"
          >
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-xl font-semibold">
                  {mode === "create"
                    ? "New review"
                    : mode === "edit"
                      ? "Edit review"
                      : "Review"}
                </h2>
                <p className="mt-1 text-sm text-[var(--dash-muted)]">
                  {mode === "view"
                    ? "Read-only preview of this testimonial."
                    : "This saves to the selected landing profile."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMode(null)}
                className="rounded-md p-1.5 hover:bg-[var(--dash-hover)]"
                aria-label="Close"
              >
                <IconClose />
              </button>
            </div>

            {mode === "view" && editing ? (
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3">
                  {editing.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editing.avatarUrl}
                      alt=""
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--dash-ink)] text-sm font-semibold text-[var(--dash-bg)]">
                      {initials(editing.name)}
                    </span>
                  )}
                  <div>
                    <p className="font-semibold">{editing.name}</p>
                    <p className="text-[var(--dash-muted)]">{editing.role}</p>
                    <p className="mt-1 tracking-tight">
                      {stars(editing.rating || "5.0")}{" "}
                      <span className="text-xs text-[var(--dash-muted)]">
                        {editing.rating || "5.0"}
                      </span>
                    </p>
                  </div>
                </div>
                <p className="font-medium">{editing.title}</p>
                <p className="leading-relaxed text-[var(--dash-muted)]">{editing.body}</p>
                <p className="text-xs text-[var(--dash-muted)]">
                  {editing.profileName} · order {editing.order}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <label className="block text-sm font-medium">
                  Profile
                  <select
                    value={draft.profileId}
                    onChange={(e) => setDraft({ ...draft, profileId: e.target.value })}
                    className="mt-1 w-full border border-w-line bg-w-bg px-3 py-2 text-sm font-normal outline-none"
                  >
                    {profiles.map((profile) => (
                      <option key={profile.id} value={profile.id}>
                        {profile.name}
                        {profile.isActive ? " (live)" : ""}
                      </option>
                    ))}
                  </select>
                </label>
                <Field
                  label="Title"
                  value={draft.title}
                  onChange={(title) => setDraft({ ...draft, title })}
                />
                <Field
                  label="Review"
                  value={draft.body}
                  onChange={(body) => setDraft({ ...draft, body })}
                  textarea
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Name"
                    value={draft.name}
                    onChange={(name) => setDraft({ ...draft, name })}
                  />
                  <Field
                    label="Role"
                    value={draft.role}
                    onChange={(role) => setDraft({ ...draft, role })}
                  />
                  <label className="block text-sm font-medium">
                    Rating
                    <select
                      value={draft.rating}
                      onChange={(e) => setDraft({ ...draft, rating: e.target.value })}
                      className="mt-1 w-full border border-w-line bg-w-bg px-3 py-2 text-sm font-normal outline-none"
                    >
                      {RATINGS.map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}
                        </option>
                      ))}
                    </select>
                  </label>
                  <Field
                    label="Order"
                    value={draft.order}
                    onChange={(order) => setDraft({ ...draft, order })}
                  />
                </div>
                <ImageField
                  label="Avatar"
                  value={draft.avatarUrl}
                  onChange={(avatarUrl) => setDraft({ ...draft, avatarUrl })}
                />
              </div>
            )}

            {error && mode && <p className="mt-3 text-sm text-red-600">{error}</p>}

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMode(null)}
                className="rounded-lg border border-[var(--dash-line)] px-3.5 py-2 text-sm"
              >
                {mode === "view" ? "Close" : "Cancel"}
              </button>
              {mode === "view" && editing ? (
                <button
                  type="button"
                  onClick={() => setMode("edit")}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--dash-ink)] px-3.5 py-2 text-sm font-semibold text-[var(--dash-bg)]"
                >
                  <IconPencil />
                  Edit
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={busy}
                  className="rounded-lg bg-[var(--dash-ink)] px-3.5 py-2 text-sm font-semibold text-[var(--dash-bg)] disabled:opacity-50"
                >
                  {busy ? "Saving…" : mode === "edit" ? "Save changes" : "Create review"}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-[var(--dash-line)] bg-[var(--dash-surface)] p-5">
            <h2 className="font-display text-xl font-semibold">Delete review</h2>
            <p className="mt-2 text-sm text-[var(--dash-muted)]">
              Remove {pendingDelete.name || "this review"} from {pendingDelete.profileName}?
              This cannot be undone.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setPendingDelete(null)}
                className="rounded-lg border border-[var(--dash-line)] px-3.5 py-2 text-sm"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={confirmDelete}
                className="rounded-lg bg-[var(--dash-ink)] px-3.5 py-2 text-sm font-semibold text-[var(--dash-bg)] disabled:opacity-50"
              >
                {busy ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[var(--dash-line)] bg-[var(--dash-surface)] px-4 py-3">
      <p className="text-[11px] font-semibold tracking-[0.12em] text-[var(--dash-muted)] uppercase">
        {label}
      </p>
      <p className="mt-1 truncate text-lg font-semibold">{value}</p>
    </div>
  );
}

function IconAction({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="rounded-md border border-[var(--dash-line)] p-1.5 text-[var(--dash-ink)] hover:bg-[var(--dash-hover)]"
    >
      {children}
    </button>
  );
}
