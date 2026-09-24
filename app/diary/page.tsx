export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import { StarRating } from "@/components/StarRating";
import { DeleteDiaryButton } from "@/components/DeleteDiaryButton";
import { getUserDiary } from "@/lib/actions/diary";
import { formatDate } from "@/lib/utils";
import { posterUrl } from "@/lib/tmdb";
import { getShow } from "@/lib/tmdb";

export default async function DiaryPage() {
  const session = await auth();
  const entries = session ? await getUserDiary() : [];

  if (!session) {
    return (
      <div className="page-shell max-w-6xl py-16 text-center">
        <h1 className="text-2xl font-bold">Your Diary</h1>
        <p className="mx-auto mt-3 max-w-md text-[var(--color-muted)]">
          Log every episode you watch, in order — your personal TV diary.
        </p>
        <Link href="/login" className="mt-6 inline-block rounded bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-[var(--btn-primary-text)]">
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
    <div className="page-shell max-w-6xl">
      <h1 className="text-2xl font-bold">Your Diary</h1>
      <p className="mt-1 text-sm text-[var(--color-subtle)]">{entries.length} episodes logged</p>

      {entries.length === 0 ? (
        <div className="py-16 text-center text-[var(--color-subtle)]">
          <p className="text-lg text-[var(--color-muted)]">No entries yet</p>
          <p className="mt-2 text-sm">Find a show and log your first episode.</p>
          <Link href="/browse" className="mt-6 inline-block text-[var(--color-accent)] hover:text-[var(--color-text)]">
            Browse shows →
          </Link>
        </div>
      ) : (
        <div className="mt-8 divide-y divide-[var(--color-border)]">
          {entries.map((entry) => {
            const poster = posterCache.get(entry.tmdbShowId);
            const d = new Date(entry.watchedAt);
            return (
              <div
                key={entry.id}
                className="py-4 sm:grid sm:grid-cols-[80px_60px_1fr_auto] sm:items-center sm:gap-4"
              >
                <div className="flex gap-3 sm:contents">
                  <div className="shrink-0 text-left text-sm text-[var(--color-subtle)] sm:text-right">
                    <span className="block text-xl font-bold text-[var(--color-text)]">{d.getDate()}</span>
                    {d.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  </div>
                  <Link
                    href={`/show/${entry.tmdbShowId}`}
                    className="relative h-[84px] w-14 shrink-0 overflow-hidden rounded bg-[var(--color-overlay)] sm:aspect-[2/3] sm:h-auto sm:w-auto"
                  >
                    {poster && (
                      <Image src={poster} alt="" fill className="object-cover" sizes="60px" />
                    )}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/show/${entry.tmdbShowId}/season/${entry.seasonNumber}/episode/${entry.episodeNumber}`}
                      className="font-semibold text-[var(--color-link)] hover:text-[var(--color-text)]"
                    >
                      {entry.showName}
                    </Link>
                    <p className="text-sm text-[var(--color-muted)]">
                      S{entry.seasonNumber}E{entry.episodeNumber}
                      {entry.episodeName && ` · ${entry.episodeName}`}
                    </p>
                    {entry.review && (
                      <p className="mt-1 line-clamp-2 text-sm text-[var(--color-subtle)]">{entry.review}</p>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between gap-2 sm:mt-0 sm:flex-col sm:items-end">
                  {entry.rating ? <StarRating rating={entry.rating} size="sm" /> : <span />}
                  <DeleteDiaryButton entryId={entry.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
