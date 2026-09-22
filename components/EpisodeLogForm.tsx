"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FormEvent, useState, useTransition } from "react";
import Link from "next/link";
import { logEpisode } from "@/lib/actions/diary";
import { StarRating } from "./StarRating";

interface EpisodeLogFormProps {
  tmdbShowId: number;
  showName: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeName: string;
  existing?: {
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
      <div className="rounded border border-[#2c3440] bg-[#1c2228] p-6">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[#678]">Your diary entry</h2>
        <p className="mt-3 text-sm text-[#678]">
          Sign in to log when you watched this episode, add your rating, and write a review.
        </p>
        <Link href="/login" className="mt-4 inline-block text-sm font-semibold text-[#00e054] hover:text-white">
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
    <form onSubmit={onSubmit} className="rounded border border-[#2c3440] bg-[#1c2228] p-6">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[#678]">
        {existing ? "Your diary entry" : "Log this episode"}
      </h2>

      <div className="mt-4">
        <label className="block text-sm text-[#9ab]">Watched on</label>
        <input
          type="date"
          value={watchedAt}
          onChange={(e) => setWatchedAt(e.target.value)}
          className="mt-1 w-full max-w-xs rounded border border-[#2c3440] bg-[#14181c] px-3 py-2 text-sm text-white outline-none focus:border-[#00e054]"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm text-[#9ab]">Your rating</label>
        <div className="mt-2 flex flex-wrap gap-1">
          {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setRating(v === rating ? null : v)}
              className={`rounded px-2 py-1 text-sm ${
                rating === v
                  ? "bg-[#00e054] font-semibold text-[#14181c]"
                  : "bg-[#2c3440] text-[#9ab] hover:text-white"
              }`}
            >
              {v}★
            </button>
          ))}
        </div>
        {rating && <div className="mt-2"><StarRating rating={rating} size="md" /></div>}
      </div>

      <div className="mt-4">
        <label className="block text-sm text-[#9ab]">Review (optional)</label>
        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          placeholder="What did you think of this episode?"
          className="mt-1 w-full rounded border border-[#2c3440] bg-[#14181c] px-3 py-2 text-sm text-white outline-none focus:border-[#00e054]"
        />
      </div>

      {message && (
        <p className={`mt-3 text-sm ${message.type === "ok" ? "text-[#00e054]" : "text-red-400"}`}>
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 rounded bg-[#00e054] px-5 py-2 text-sm font-semibold text-[#14181c] hover:bg-[#00c949] disabled:opacity-50"
      >
        {pending ? "Saving…" : existing ? "Update entry" : "Log episode"}
      </button>
    </form>
  );
}
