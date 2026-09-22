"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toggleFollow } from "@/lib/actions/social";

interface FollowButtonProps {
  targetUserId: string;
  initialFollowing: boolean;
  isSelf?: boolean;
}

export function FollowButton({ targetUserId, initialFollowing, isSelf }: FollowButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [pending, startTransition] = useTransition();

  if (isSelf) return null;

  if (!session) {
    return (
      <Link href="/login" className="rounded bg-[#00e054] px-4 py-2 text-sm font-semibold text-[#14181c]">
        Sign in to follow
      </Link>
    );
  }

  function handleClick() {
    startTransition(async () => {
      const result = await toggleFollow(targetUserId);
      if (result.ok && result.following !== undefined) {
        setFollowing(result.following);
        router.refresh();
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      className={`rounded px-4 py-2 text-sm font-semibold disabled:opacity-50 ${
        following
          ? "border border-[#456] text-[#9ab] hover:text-white"
          : "bg-[#00e054] text-[#14181c] hover:bg-[#00c949]"
      }`}
    >
      {pending ? "…" : following ? "Following" : "Follow"}
    </button>
  );
}
