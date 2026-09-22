"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleDiaryLike } from "@/lib/actions/social";

interface LikeButtonProps {
  diaryEntryId: string;
  initialLikeCount: number;
  initialLiked: boolean;
}

export function LikeButton({ diaryEntryId, initialLikeCount, initialLiked }: LikeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialLikeCount);
  const [pending, startTransition] = useTransition();

  function handleClick() {
    if (!session) return;
    startTransition(async () => {
      const result = await toggleDiaryLike(diaryEntryId);
      if (result.ok) {
        setLiked(!!result.liked);
        if (result.likeCount !== undefined) setCount(result.likeCount);
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending || !session}
      title={session ? "Like this review" : "Sign in to like"}
      className={`flex items-center gap-1 text-sm ${liked ? "text-[var(--color-accent-soft)]" : "text-[var(--color-subtle)] hover:text-[var(--color-muted)]"} disabled:cursor-default`}
    >
      {liked ? "♥" : "♡"} {count > 0 && count}
    </button>
  );
}
