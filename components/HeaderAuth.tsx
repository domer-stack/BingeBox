"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { UserAvatar } from "./UserAvatar";

export function HeaderAuth() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-20 animate-pulse rounded-lg bg-[var(--color-overlay)]" />;
  }

  if (session?.user) {
    return (
      <div className="flex shrink-0 items-center gap-2">
        <Link
          href="/profile"
          className="flex max-w-[120px] items-center gap-2 truncate rounded-lg px-2 py-1.5 text-sm font-medium text-[var(--color-muted)] transition hover:bg-[var(--surface-hover)] hover:text-[var(--color-text)]"
        >
          <UserAvatar
            avatarId={session.user.avatarId}
            alt={session.user.name ?? session.user.username ?? ""}
            size="xs"
          />
          <span className="hidden truncate sm:inline">{session.user.name ?? session.user.username}</span>
        </Link>
        <button type="button" onClick={() => signOut({ callbackUrl: "/" })} className="btn-ghost">
          Sign out
        </button>
      </div>
    );
  }

  return (
    <div className="flex shrink-0 gap-2">
      <Link href="/login" className="btn-secondary hidden px-3 py-2 sm:inline-flex">
        Sign in
      </Link>
      <Link href="/register" className="btn-primary px-3 py-2 text-sm">
        Join
      </Link>
    </div>
  );
}
