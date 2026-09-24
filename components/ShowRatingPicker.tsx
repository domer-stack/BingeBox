"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { StarRating } from "@/components/StarRating";
import { StarRatingInput } from "@/components/StarRatingInput";
import { rateShow } from "@/lib/actions/show-reviews";

interface ShowRatingPickerProps {
  tmdbShowId: number;
  showName: string;
  signedIn: boolean;
  initialRating: number | null;
}

export function ShowRatingPicker({
  tmdbShowId,
  showName,
  signedIn,
  initialRating,
}: ShowRatingPickerProps) {
  const router = useRouter();
  const [rating, setRating] = useState<number | null>(initialRating);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  function save(next: number | null) {
    setRating(next);
    setMessage(null);
    if (!signedIn) return;

    startTransition(async () => {
      const result = await rateShow({ tmdbShowId, showName, rating: next });
      if (result.ok) {
        setMessage("Saved");
        router.refresh();
      } else {
        setMessage(result.error);
      }
    });
  }

  return (
    <div className="glass-card mt-4 max-w-xl p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-subtle)]">Your show rating</p>
      <p className="mt-1 text-sm text-[var(--color-muted)]">Rate the series as a whole — no written review required.</p>

      {!signedIn ? (
        <p className="mt-3 text-sm text-[var(--color-subtle)]">
          <Link href="/login" className="text-[var(--color-link)] hover:text-[var(--color-text)]">
            Sign in
          </Link>{" "}
          to rate this show.
        </p>
      ) : (
        <>
          {rating != null && rating > 0 && (
            <div className="mt-3">
              <StarRating rating={rating} size="lg" showValue />
            </div>
          )}
          <div className="mt-3">
            <StarRatingInput value={rating} onChange={save} />
          </div>
          <p className="mt-2 min-h-[1.25rem] text-xs text-[var(--color-subtle)]">
            {pending ? "Saving…" : message}
          </p>
        </>
      )}
    </div>
  );
}
