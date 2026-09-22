export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { FollowButton } from "@/components/FollowButton";
import { ListCard } from "@/components/ListCard";
import { StarRating } from "@/components/StarRating";
import { getUserLists } from "@/lib/actions/lists";
import { getUserByUsername, getUserPublicDiary, isFollowing } from "@/lib/actions/social";

interface UserPageProps {
  params: Promise<{ username: string }>;
}

export default async function UserProfilePage({ params }: UserPageProps) {
  const { username } = await params;
  const session = await auth();
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const isSelf = session?.user?.id === user.id;
  const [diary, lists, following] = await Promise.all([
    getUserPublicDiary(user.id, 10),
    getUserLists(user.id),
    isSelf ? false : isFollowing(user.id),
  ]);

  const publicLists = lists.filter((l) => l.isPublic || isSelf);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#00e054] text-3xl font-bold text-[#14181c]">
            {(user.displayName ?? user.username)[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user.displayName ?? user.username}</h1>
            <p className="text-sm text-[#678]">@{user.username}</p>
            {user.bio && <p className="mt-2 max-w-lg text-[#9ab]">{user.bio}</p>}
            <div className="mt-3 flex gap-6 text-sm">
              <span><strong className="text-white">{user._count.diaryEntries}</strong> <span className="text-[#678]">episodes</span></span>
              <span><strong className="text-white">{user._count.followers}</strong> <span className="text-[#678]">followers</span></span>
              <span><strong className="text-white">{user._count.following}</strong> <span className="text-[#678]">following</span></span>
              <span><strong className="text-white">{user._count.lists}</strong> <span className="text-[#678]">lists</span></span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {isSelf ? (
            <Link href="/profile" className="rounded border border-[#456] px-4 py-2 text-sm font-semibold text-[#9ab] hover:text-white">
              Edit profile
            </Link>
          ) : (
            <FollowButton targetUserId={user.id} initialFollowing={following} />
          )}
        </div>
      </div>

      {publicLists.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#678]">Lists</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publicLists.slice(0, 6).map((list) => (
              <ListCard
                key={list.id}
                id={list.id}
                title={list.title}
                authorName={user.displayName ?? user.username}
                authorUsername={user.username}
                itemCount={list._count.items}
                showIds={list.items.map((i) => i.tmdbShowId)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#678]">Recent activity</h2>
        {diary.length === 0 ? (
          <p className="text-sm text-[#678]">No logged episodes yet.</p>
        ) : (
          <ul className="divide-y divide-[#2c3440]">
            {diary.map((entry) => (
              <li key={entry.id} className="py-3">
                <Link
                  href={`/show/${entry.tmdbShowId}/season/${entry.seasonNumber}/episode/${entry.episodeNumber}`}
                  className="font-semibold text-[#40bcf4] hover:text-white"
                >
                  {entry.showName}
                </Link>
                <span className="text-sm text-[#678]">
                  {" "}· S{entry.seasonNumber}E{entry.episodeNumber}
                  {" "}· {new Date(entry.watchedAt).toLocaleDateString()}
                </span>
                {entry.rating && <div className="mt-1"><StarRating rating={entry.rating} size="sm" /></div>}
                {entry.review && <p className="mt-1 line-clamp-2 text-sm text-[#9ab]">{entry.review}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
