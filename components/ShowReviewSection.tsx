"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { StarRating } from "@/components/StarRating";
import { StarRatingInput } from "@/components/StarRatingInput";
import { UserAvatar } from "@/components/UserAvatar";
import { deleteShowReview, upsertShowReview } from "@/lib/actions/show-reviews";

type PublicReview = {
  id: string;
  body: string;
  rating: number | null;
  updatedAt: Date;
  user: { id: string; username: string; displayName: string | null; avatarId: string };
};

interface ShowReviewSectionProps {
  tmdbShowId: number;
  showName: string;
  signedIn: boolean;
  ownReview: { body: string; rating: number | null } | null;
  communityReviews: PublicReview[];
}

export function ShowReviewSection({
  tmdbShowId,
  showName,
  signedIn,
  ownReview,
  communityReviews,
}: ShowReviewSectionProps) {
  const [body, setBody] = useState(ownReview?.body ?? "");
  const [rating, setRating] = useState<number | null>(ownReview?.rating ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    const result = await upsertShowReview({ tmdbShowId, showName, body, rating });
    setPending(false);
    if (result.ok) {
      setMessage("Review saved.");
      router.refresh();
    } else {
      setMessage(result.error);
    }
  }

  async function onDelete() {
    if (!confirm("Delete your review for this show?")) return;
    setPending(true);
    const result = await deleteShowReview(tmdbShowId);
    setPending(false);
    if (result.ok) {
      setBody("");
      setRating(null);
      setMessage("Review removed.");
      router.refresh();
    } else {
      setMessage(result.error);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-5 py-10">
      <h2 className="section-eyebrow mb-4">Written review</h2>
      <p className="mb-4 max-w-xl text-sm text-[var(--color-muted)]">
        Optional long-form review. Your star rating lives above — you can rate without writing here.
      </p>

      {signedIn ? (
        <form onSubmit={onSubmit} className="glass-card max-w-2xl p-5">
          <label className="block text-sm text-[var(--color-muted)]">
            Your review
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              maxLength={5000}
              className="glass-input mt-1 w-full resize-none px-3 py-2 text-sm"
              placeholder="What worked, what didn't, who should watch it…"
            />
          </label>
          <div className="mt-4">
            <p className="text-sm text-[var(--color-muted)]">Also update your show rating (optional)</p>
            <StarRatingInput value={rating} onChange={setRating} />
          </div>
          {message && <p className="mt-3 text-sm text-[var(--color-accent)]">{message}</p>}
          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={pending} className="btn-primary text-sm disabled:opacity-50">
              {pending ? "Saving…" : ownReview ? "Update review" : "Publish review"}
            </button>
            {ownReview && (
              <button type="button" onClick={onDelete} disabled={pending} className="btn-secondary text-sm">
                Delete
              </button>
            )}
          </div>
        </form>
      ) : (
        <p className="text-sm text-[var(--color-subtle)]">
          <Link href="/login" className="text-[var(--color-link)]">Sign in</Link> to write a review.
        </p>
      )}

      {communityReviews.length > 0 && (
        <ul className="mt-8 space-y-4">
          {communityReviews.map((r) => (
            <li key={r.id} className="glass-card p-5">
              <div className="flex items-center gap-3">
                <UserAvatar avatarId={r.user.avatarId} alt={r.user.displayName ?? r.user.username} size="sm" />
                <div>
                  <Link href={`/user/${r.user.username}`} className="text-sm font-semibold text-[var(--color-link)]">
                    {r.user.displayName ?? r.user.username}
                  </Link>
                  <p className="text-xs text-[var(--color-subtle)]">
                    {new Date(r.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              {r.rating != null && r.rating > 0 && (
                <div className="mt-2">
                  <StarRating rating={r.rating} size="sm" showValue />
                </div>
              )}
              {r.body.trim().length > 0 && (
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-[var(--color-muted)]">{r.body}</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
