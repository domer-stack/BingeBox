export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StarRating } from "@/components/StarRating";
import { getSeasonDiaryMap } from "@/lib/actions/diary";
import { formatDate } from "@/lib/utils";
import { getSeason, getShow, stillUrl, toStarRating } from "@/lib/tmdb";

interface SeasonPageProps {
  params: Promise<{ id: string; season: string }>;
}

export default async function SeasonPage({ params }: SeasonPageProps) {
  const { id, season: seasonStr } = await params;
  const showId = Number(id);
  const seasonNumber = Number(seasonStr);
  if (Number.isNaN(showId) || Number.isNaN(seasonNumber)) notFound();

  let show, season;
  try {
    [show, season] = await Promise.all([getShow(showId), getSeason(showId, seasonNumber)]);
  } catch {
    notFound();
  }

  const diaryMap = await getSeasonDiaryMap(showId, seasonNumber);
  const watchedCount = Object.keys(diaryMap).length;

  return (
    <div className="page-shell py-10">
      <nav className="text-sm text-[var(--color-subtle)]">
        <Link href={`/show/${show.id}`} className="hover:text-[var(--color-text)]">{show.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-muted)]">{season.name}</span>
      </nav>

      <h1 className="mt-4 text-2xl font-bold">{season.name}</h1>
      {season.overview && <p className="mt-2 max-w-2xl text-[var(--color-muted)]">{season.overview}</p>}
      <p className="mt-1 text-sm text-[var(--color-subtle)]">
        {season.episode_count} episodes
        {watchedCount > 0 && (
          <span className="text-[var(--color-accent)]"> · {watchedCount} watched by you</span>
        )}
      </p>

      <div className="mt-8 space-y-1">
        {season.episodes.map((ep) => {
          const still = stillUrl(ep.still_path);
          const rating = toStarRating(ep.vote_average);
          const watched = diaryMap[ep.episode_number];

          return (
            <Link
              key={ep.id}
              href={`/show/${showId}/season/${seasonNumber}/episode/${ep.episode_number}`}
              className={`flex gap-4 rounded border p-3 transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-elevated)] ${
                watched ? "border-[var(--color-accent)]/30 bg-[var(--chip-active-bg)]" : "border-transparent"
              }`}
            >
              <div className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded bg-[var(--color-overlay)]">
                {still ? (
                  <Image src={still} alt="" fill className="object-cover" sizes="120px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[var(--color-subtle)]">
                    E{ep.episode_number}
                  </div>
                )}
                {watched && (
                  <span className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--color-accent)] text-xs text-[var(--btn-primary-text)]">
                    ✓
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[var(--color-subtle)]">{ep.episode_number}.</span>
                  <span className="font-semibold">{ep.name}</span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-3 text-sm text-[var(--color-subtle)]">
                  {ep.air_date && <span>{formatDate(ep.air_date)}</span>}
                  {ep.runtime && <span>{ep.runtime}m</span>}
                  {ep.vote_average > 0 && <StarRating rating={rating} size="sm" />}
                  {watched?.rating && (
                    <span className="flex items-center gap-1 text-[var(--color-accent)]">
                      You: <StarRating rating={watched.rating} size="sm" />
                    </span>
                  )}
                </div>
                {ep.overview && (
                  <p className="mt-1 line-clamp-2 text-sm text-[var(--color-subtle)]">{ep.overview}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
