"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Link from "next/link";
import { toggleWatchlist } from "@/lib/actions/watchlist";

interface WatchlistButtonProps {
  tmdbShowId: number;
  showName: string;
  initialOnWatchlist: boolean;
}

export function WatchlistButton({ tmdbShowId, showName, initialOnWatchlist }: WatchlistButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [onWatchlist, setOnWatchlist] = useState(initialOnWatchlist);
  const [pending, startTransition] = useTransition();

  if (!session) {
    return (
      <Link
        href="/login"
        className="btn-primary px-4 py-2 text-sm"
      >
        + Watchlist
      </Link>
    );
  }

  function handleClick() {
    startTransition(async () => {
      const result = await toggleWatchlist(tmdbShowId, showName);
      if (result.ok) {
        setOnWatchlist(result.onWatchlist);
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`disabled:opacity-50 ${onWatchlist ? "btn-primary px-4 py-2 text-sm" : "btn-secondary px-4 py-2 text-sm"}`}
    >
      {pending ? "…" : onWatchlist ? "✓ On watchlist" : "+ Watchlist"}
    </button>
  );
}
