export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { EpisodeLogForm } from "@/components/EpisodeLogForm";
import { StarRating } from "@/components/StarRating";
import { getEpisodeDiaryEntry } from "@/lib/actions/diary";
import { formatDate } from "@/lib/utils";
import { getEpisode, getShow, stillUrl, toStarRating } from "@/lib/tmdb";

interface EpisodePageProps {
  params: Promise<{ id: string; season: string; episode: string }>;
}

export default async function EpisodePage({ params }: EpisodePageProps) {
  const { id, season: seasonStr, episode: episodeStr } = await params;
  const showId = Number(id);
  const seasonNumber = Number(seasonStr);
  const episodeNumber = Number(episodeStr);
  if ([showId, seasonNumber, episodeNumber].some(Number.isNaN)) notFound();

  let show, episode;
  try {
    [show, episode] = await Promise.all([
      getShow(showId),
      getEpisode(showId, seasonNumber, episodeNumber),
    ]);
  } catch {
    notFound();
  }

  const diaryEntry = await getEpisodeDiaryEntry(showId, seasonNumber, episodeNumber);
  const still = stillUrl(episode.still_path, "w780");
  const rating = toStarRating(episode.vote_average);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav className="text-sm text-[var(--color-subtle)]">
        <Link href={`/show/${show.id}`} className="hover:text-[var(--color-text)]">{show.name}</Link>
        <span className="mx-2">/</span>
        <Link href={`/show/${show.id}/season/${seasonNumber}`} className="hover:text-[var(--color-text)]">
          Season {seasonNumber}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-muted)]">Episode {episodeNumber}</span>
      </nav>

      <div className="mt-6 grid gap-8 md:grid-cols-[1fr_320px]">
        <div>
          <h1 className="text-2xl font-bold">
            {episodeNumber}. {episode.name}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[var(--color-subtle)]">
            {episode.air_date && <span>Aired {formatDate(episode.air_date)}</span>}
            {episode.runtime && <span>{episode.runtime} min</span>}
            {episode.vote_average > 0 && (
              <span className="flex items-center gap-1">
                TMDb <StarRating rating={rating} size="sm" />
              </span>
            )}
          </div>

          <p className="mt-6 leading-relaxed text-[var(--color-muted)]">
            {episode.overview || "No overview available for this episode."}
          </p>

          <div className="mt-10">
            <EpisodeLogForm
              tmdbShowId={showId}
              showName={show.name}
              seasonNumber={seasonNumber}
              episodeNumber={episodeNumber}
              episodeName={episode.name}
              existing={
                diaryEntry
                  ? {
                      id: diaryEntry.id,
                      rating: diaryEntry.rating,
                      review: diaryEntry.review,
                      watchedAt: diaryEntry.watchedAt,
                    }
                  : null
              }
            />
          </div>
        </div>

        {still && (
          <div className="relative aspect-video overflow-hidden rounded bg-[var(--color-overlay)] shadow-lg">
            <Image src={still} alt={episode.name} fill className="object-cover" sizes="320px" />
          </div>
        )}
      </div>
    </div>
  );
}
