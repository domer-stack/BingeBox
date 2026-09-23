export const dynamic = "force-dynamic";

import Link from "next/link";
import { UserAvatar } from "@/components/UserAvatar";
import { getMembers } from "@/lib/actions/social";

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-bold">Members</h1>
      <p className="mt-1 text-sm text-[var(--color-subtle)]">Find TV lovers to follow and see their activity</p>

      {members.length === 0 ? (
        <p className="mt-10 text-[var(--color-subtle)]">No members yet. Be the first to join!</p>
      ) : (
        <div className="mt-8 divide-y divide-[var(--color-border)]">
          {members.map((member) => (
            <Link
              key={member.id}
              href={`/user/${member.username}`}
              className="flex items-center gap-4 py-4 transition hover:bg-[var(--color-elevated)]/50"
            >
              <UserAvatar avatarId={member.avatarId} alt={member.displayName ?? member.username} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="font-semibold">{member.displayName ?? member.username}</p>
                <p className="text-sm text-[var(--color-subtle)]">@{member.username}</p>
                {member.bio && <p className="mt-1 line-clamp-1 text-sm text-[var(--color-muted)]">{member.bio}</p>}
              </div>
              <div className="hidden shrink-0 text-right text-sm text-[var(--color-subtle)] sm:block">
                <p>{member._count.diaryEntries} episodes</p>
                <p>{member._count.followers} followers</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
