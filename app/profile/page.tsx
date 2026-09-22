export const dynamic = "force-dynamic";

import Link from "next/link";
import { auth } from "@/auth";
import { getUserDiary } from "@/lib/actions/diary";
import { getUserLists } from "@/lib/actions/lists";
import { getUserWatchlist } from "@/lib/actions/watchlist";
import { ListCard } from "@/components/ListCard";
import { prisma } from "@/lib/prisma";
import { ShowGrid } from "@/components/ShowGrid";
import { getShow, type TmdbShow } from "@/lib/tmdb";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#2c3440] text-3xl">
          ▶
        </div>
        <h1 className="mt-6 text-2xl font-bold">Your Profile</h1>
        <p className="mx-auto mt-3 max-w-md text-[#9ab]">
          Track stats, showcase favorite shows, and connect with other TV lovers.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/login" className="rounded border border-[#456] px-5 py-2.5 text-sm font-semibold text-[#9ab] hover:text-white">
            Sign in
          </Link>
          <Link href="/register" className="rounded bg-[#00e054] px-5 py-2.5 text-sm font-semibold text-[#14181c]">
            Join free
          </Link>
        </div>
      </div>
    );
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  const [diary, watchlist, lists] = await Promise.all([
    getUserDiary(session.user.id),
    getUserWatchlist(session.user.id),
    getUserLists(session.user.id),
  ]);

  const uniqueShows = new Set(diary.map((e) => e.tmdbShowId)).size;
  const watchlistShows: TmdbShow[] = [];
  for (const item of watchlist.slice(0, 12)) {
    try {
      const show = await getShow(item.tmdbShowId);
      watchlistShows.push(show);
    } catch {
      /* skip unavailable */
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[#00e054] text-3xl font-bold text-[#14181c]">
          {(user?.displayName ?? user?.username ?? "?")[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.displayName ?? user?.username}</h1>
          <p className="text-sm text-[#678]">@{user?.username}</p>
          {user?.bio && <p className="mt-2 max-w-lg text-[#9ab]">{user.bio}</p>}
          <div className="mt-4 flex gap-8">
            <div>
              <p className="text-xl font-bold">{diary.length}</p>
              <p className="text-xs uppercase tracking-wider text-[#678]">Episodes</p>
            </div>
            <div>
              <p className="text-xl font-bold">{uniqueShows}</p>
              <p className="text-xs uppercase tracking-wider text-[#678]">Shows</p>
            </div>
            <div>
              <p className="text-xl font-bold">{watchlist.length}</p>
              <p className="text-xs uppercase tracking-wider text-[#678]">Watchlist</p>
            </div>
            <div>
              <p className="text-xl font-bold">{lists.length}</p>
              <p className="text-xs uppercase tracking-wider text-[#678]">Lists</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 border-b border-[#2c3440]">
        <nav className="flex gap-6">
          <Link href="/diary" className="border-b-2 border-[#00e054] pb-3 text-xs font-semibold uppercase tracking-wider text-white">
            Diary
          </Link>
          <span className="pb-3 text-xs font-semibold uppercase tracking-wider text-[#678]">
            Watchlist
          </span>
        </nav>
      </div>

      {lists.length > 0 && (
        <section className="mt-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-[#678]">Your lists</h2>
            <Link href="/lists/new" className="text-xs text-[#678] hover:text-[#00e054]">+ New list</Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {lists.slice(0, 3).map((list) => (
              <ListCard
                key={list.id}
                id={list.id}
                title={list.title}
                authorName={user?.displayName ?? user?.username ?? ""}
                authorUsername={user?.username ?? ""}
                itemCount={list._count.items}
                showIds={list.items.map((i) => i.tmdbShowId)}
              />
            ))}
          </div>
        </section>
      )}

      {watchlistShows.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#678]">Watchlist</h2>
          <ShowGrid shows={watchlistShows} />
        </section>
      )}

      <section className="mt-8">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#678]">Recent diary</h2>
          <Link href="/diary" className="text-xs text-[#678] hover:text-[#00e054]">View all →</Link>
        </div>
        {diary.length === 0 ? (
          <p className="text-sm text-[#678]">No episodes logged yet. <Link href="/browse" className="text-[#40bcf4]">Browse shows</Link></p>
        ) : (
          <ul className="space-y-3">
            {diary.slice(0, 5).map((entry) => (
              <li key={entry.id} className="text-sm">
                <Link
                  href={`/show/${entry.tmdbShowId}/season/${entry.seasonNumber}/episode/${entry.episodeNumber}`}
                  className="font-semibold text-[#40bcf4] hover:text-white"
                >
                  {entry.showName}
                </Link>
                <span className="text-[#678]">
                  {" "}· S{entry.seasonNumber}E{entry.episodeNumber}
                  {" "}· {new Date(entry.watchedAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
