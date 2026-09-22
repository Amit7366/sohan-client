"use client";

import Link from "next/link";
import { useEffect, useState, type FormEvent } from "react";
import {
  IconCheck,
  IconEye,
  IconPencil,
  IconPlus,
  IconPower,
  IconTrash,
} from "@/components/dashboard/icons";
import { api } from "@/lib/api";
import type { LandingProfile } from "@/lib/types";

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<LandingProfile[]>([]);
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function load() {
    const data = await api<{ profiles: LandingProfile[] }>("/admin/profiles");
    setProfiles(data.profiles);
  }

  useEffect(() => {
    load().catch((err: Error) => setError(err.message));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await api("/admin/profiles", {
        method: "POST",
        body: JSON.stringify({ name }),
      });
      setName("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    } finally {
      setBusy(false);
    }
  }

  async function activate(id: string) {
    await api(`/admin/profiles/${id}/activate`, { method: "PATCH" });
    await load();
  }

  async function deactivate(id: string) {
    await api(`/admin/profiles/${id}/deactivate`, { method: "PATCH" });
    await load();
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Delete “${label}” and all of its content?`)) return;
    await api(`/admin/profiles/${id}`, { method: "DELETE" });
    await load();
  }

  const live = profiles.find((profile) => profile.isActive);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Profiles</h1>
          <p className="mt-1 text-sm text-[var(--dash-muted)]">
            One profile can be live on the public site. Open a profile to edit every section.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-3">
        <Stat label="Profiles" value={String(profiles.length)} />
        <Stat label="Live now" value={live?.name ?? "None"} />
        <Stat
          label="Reviews"
          value={String(
            profiles.reduce(
              (sum, profile) => sum + (profile.testimonials?.reviews?.length ?? 0),
              0
            )
          )}
        />
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <form
        onSubmit={onCreate}
        className="mt-5 flex flex-col gap-3 rounded-xl border border-[var(--dash-line)] bg-[var(--dash-surface)] p-3 sm:flex-row"
      >
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New profile name"
          className="flex-1 border border-[var(--dash-line)] bg-[var(--dash-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--dash-ink)]"
        />
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--dash-ink)] px-4 py-2 text-sm font-semibold text-[var(--dash-bg)] disabled:opacity-50"
        >
          <IconPlus />
          {busy ? "Creating…" : "Create profile"}
        </button>
      </form>

      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--dash-line)] bg-[var(--dash-surface)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-[var(--dash-line)] text-[11px] tracking-[0.12em] text-[var(--dash-muted)] uppercase">
              <tr>
                <th className="px-4 py-3 font-semibold">Profile</th>
                <th className="px-4 py-3 font-semibold">Slug</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Reviews</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr
                  key={profile.id}
                  className="border-b border-[var(--dash-line)] last:border-0"
                >
                  <td className="px-4 py-3 font-medium">{profile.name}</td>
                  <td className="px-4 py-3 text-[var(--dash-muted)]">/{profile.slug}</td>
                  <td className="px-4 py-3">
                    {profile.isActive ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[var(--dash-ink)] px-2 py-0.5 text-[11px] font-semibold text-[var(--dash-bg)]">
                        <IconCheck className="h-3 w-3" />
                        Live
                      </span>
                    ) : (
                      <span className="rounded-full border border-[var(--dash-line)] px-2 py-0.5 text-[11px] font-semibold text-[var(--dash-muted)]">
                        Draft
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 tabular-nums">
                    {profile.testimonials?.reviews?.length ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-1">
                      <Link
                        href={`/dashboard/profiles/${profile.id}`}
                        aria-label={`Manage ${profile.name}`}
                        title="Manage"
                        className="rounded-md border border-[var(--dash-line)] p-1.5 hover:bg-[var(--dash-hover)]"
                      >
                        <IconPencil />
                      </Link>
                      <Link
                        href="/"
                        aria-label="Preview site"
                        title="Preview site"
                        className="rounded-md border border-[var(--dash-line)] p-1.5 hover:bg-[var(--dash-hover)]"
                      >
                        <IconEye />
                      </Link>
                      <button
                        type="button"
                        aria-label={profile.isActive ? "Deactivate" : "Activate"}
                        title={profile.isActive ? "Deactivate" : "Activate"}
                        onClick={() =>
                          profile.isActive ? deactivate(profile.id) : activate(profile.id)
                        }
                        className="rounded-md border border-[var(--dash-line)] p-1.5 hover:bg-[var(--dash-hover)]"
                      >
                        <IconPower />
                      </button>
                      <button
                        type="button"
                        aria-label={`Delete ${profile.name}`}
                        title="Delete"
                        onClick={() => remove(profile.id, profile.name)}
                        className="rounded-md border border-[var(--dash-line)] p-1.5 hover:bg-[var(--dash-hover)]"
                      >
                        <IconTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {profiles.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-[var(--dash-muted)]">
                    No profiles yet. Create one to start.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
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
