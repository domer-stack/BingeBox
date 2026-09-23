"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { deleteDiaryEntry, logEpisode } from "@/lib/actions/diary";
import { StarRating } from "./StarRating";

interface EpisodeLogFormProps {
  tmdbShowId: number;
  showName: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeName: string;
  existing?: {
    id: string;
    rating: number | null;
    review: string | null;
    watchedAt: Date;
  } | null;
}

export function EpisodeLogForm({
  tmdbShowId,
  showName,
  seasonNumber,
  episodeNumber,
  episodeName,
  existing,
}: EpisodeLogFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [rating, setRating] = useState<number | null>(existing?.rating ?? null);
  const [review, setReview] = useState(existing?.review ?? "");
  const [watchedAt, setWatchedAt] = useState(
    existing?.watchedAt
      ? existing.watchedAt.toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  );
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  if (!session) {
    return (
      <div className="rounded border border-[var(--color-border)] bg-[var(--color-elevated)] p-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-subtle)]">Your diary entry</h2>
        <p className="mt-3 text-sm text-[var(--color-subtle)]">
          Sign in to log when you watched this episode, add your rating, and write a review.
        </p>
        <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-[var(--color-accent)] hover:text-[var(--color-text)]">
          Sign in →
        </Link>
      </div>
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      const result = await logEpisode({
        tmdbShowId,
        showName,
        seasonNumber,
        episodeNumber,
        episodeName,
        rating,
        review: review || null,
        watchedAt,
      });
      if (result.ok) {
        setMessage({ type: "ok", text: existing ? "Diary entry updated!" : "Episode logged!" });
        router.refresh();
      } else {
        setMessage({ type: "err", text: result.error });
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="rounded border border-[var(--color-border)] bg-[var(--color-elevated)] p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-subtle)]">
        {existing ? "Your diary entry" : "Log this episode"}
      </h2>

      <div className="mt-4">
        <label className="block text-sm text-[var(--color-muted)]">Watched on</label>
        <input
          type="date"
          value={watchedAt}
          onChange={(e) => setWatchedAt(e.target.value)}
          className="mt-1 w-full max-w-xs rounded border border-[var(--color-border)] bg-[var(--color-base)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm text-[var(--color-muted)]">Your rating</label>
        <div className="mt-2 flex flex-wrap gap-1">
          {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setRating(v === rating ? null : v)}
              className={`rounded px-2 py-1 text-sm ${
                rating === v
                  ? "bg-[var(--color-accent)] font-semibold text-[var(--btn-primary-text)]"
                  : "bg-[var(--color-overlay)] text-[var(--color-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {v}★
            </button>
          ))}
        </div>
        {rating && <div className="mt-2"><StarRating rating={rating} size="md" /></div>}
      </div>

      <div className="mt-4">
        <label className="block text-sm text-[var(--color-muted)]">Review (optional)</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          placeholder="What did you think of this episode?"
          className="mt-1 w-full rounded border border-[var(--color-border)] bg-[var(--color-base)] px-3 py-2 text-sm text-[var(--color-text)] outline-none focus:border-[var(--color-accent)]"
        />
      </div>

      {message && (
        <p className={`mt-3 text-sm ${message.type === "ok" ? "text-[var(--color-accent)]" : "text-red-400"}`}>
          {message.text}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="btn-primary text-sm disabled:opacity-50"
        >
          {pending ? "Saving…" : existing ? "Update entry" : "Log episode"}
        </button>
        {existing && (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm("Remove this diary entry?")) return;
              startTransition(async () => {
                const result = await deleteDiaryEntry(existing.id);
                if (result.ok) {
                  setRating(null);
                  setReview("");
                  setMessage({ type: "ok", text: "Entry removed." });
                  router.refresh();
                } else {
                  setMessage({ type: "err", text: result.error });
                }
              });
            }}
            className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
          >
            Remove entry
          </button>
        )}
      </div>
    </form>
  );
}
