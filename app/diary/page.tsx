export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { StarRating } from "@/components/StarRating";
import { getUserDiary } from "@/lib/actions/diary";
import { formatDate } from "@/lib/utils";
import { posterUrl } from "@/lib/tmdb";
import { getShow } from "@/lib/tmdb";

export default async function DiaryPage() {
  const session = await auth();
  const entries = session ? await getUserDiary() : [];

  if (!session) {
    return (
      <div className="mx-auto max-w-6xl px-5 py-16 text-center">
        <h1 className="text-2xl font-bold">Your Diary</h1>
        <p className="mx-auto mt-3 max-w-md text-[#9ab]">
          Log every episode you watch, in order — your personal TV diary.
        </p>
        <Link href="/login" className="mt-6 inline-block rounded bg-[#00e054] px-5 py-2.5 text-sm font-semibold text-[#14181c]">
          Sign in to start
        </Link>
      </div>
    );
  }

  const posterCache = new Map<number, string | null>();
  for (const entry of entries.slice(0, 30)) {
    if (!posterCache.has(entry.tmdbShowId)) {
      try {
        const show = await getShow(entry.tmdbShowId);
        posterCache.set(entry.tmdbShowId, posterUrl(show.poster_path, "w154"));
      } catch {
        posterCache.set(entry.tmdbShowId, null);
      }
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <h1 className="text-2xl font-bold">Your Diary</h1>
      <p className="mt-1 text-sm text-[#678]">{entries.length} episodes logged</p>

      {entries.length === 0 ? (
        <div className="py-16 text-center text-[#678]">
          <p className="text-lg text-[#9ab]">No entries yet</p>
          <p className="mt-2 text-sm">Find a show and log your first episode.</p>
          <Link href="/browse" className="mt-6 inline-block text-[#00e054] hover:text-white">
            Browse shows →
          </Link>
        </div>
      ) : (
        <div className="mt-8 divide-y divide-[#2c3440]">
          {entries.map((entry) => {
            const poster = posterCache.get(entry.tmdbShowId);
            const d = new Date(entry.watchedAt);
            return (
              <div
                key={entry.id}
                className="grid grid-cols-[72px_56px_1fr_auto] items-center gap-4 py-4 sm:grid-cols-[80px_60px_1fr_auto]"
              >
                <div className="text-right text-sm text-[#678]">
                  <span className="block text-xl font-bold text-white">{d.getDate()}</span>
                  {d.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </div>
                <Link
                  href={`/show/${entry.tmdbShowId}`}
                  className="relative aspect-[2/3] overflow-hidden rounded bg-[#2c3440]"
                >
                  {poster && (
                    <Image src={poster} alt="" fill className="object-cover" sizes="60px" />
                  )}
                </Link>
                <div className="min-w-0">
                  <Link
                    href={`/show/${entry.tmdbShowId}/season/${entry.seasonNumber}/episode/${entry.episodeNumber}`}
                    className="font-semibold text-[#40bcf4] hover:text-white"
                  >
                    {entry.showName}
                  </Link>
                  <p className="text-sm text-[#9ab]">
                    S{entry.seasonNumber}E{entry.episodeNumber}
                    {entry.episodeName && ` · ${entry.episodeName}`}
                  </p>
                  {entry.review && (
                    <p className="mt-1 line-clamp-2 text-sm text-[#678]">{entry.review}</p>
                  )}
                </div>
                <div>{entry.rating && <StarRating rating={entry.rating} size="sm" />}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
