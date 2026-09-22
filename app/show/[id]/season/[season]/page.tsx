export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StarRating } from "@/components/StarRating";
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

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <nav className="text-sm text-[#678]">
        <Link href={`/show/${show.id}`} className="hover:text-white">{show.name}</Link>
        <span className="mx-2">/</span>
        <span className="text-[#9ab]">{season.name}</span>
      </nav>

      <h1 className="mt-4 text-2xl font-bold">{season.name}</h1>
      {season.overview && <p className="mt-2 max-w-2xl text-[#9ab]">{season.overview}</p>}
      <p className="mt-1 text-sm text-[#678]">{season.episode_count} episodes</p>

      <div className="mt-8 space-y-1">
        {season.episodes.map((ep) => {
          const still = stillUrl(ep.still_path);
          const rating = toStarRating(ep.vote_average);

          return (
            <Link
              key={ep.id}
              href={`/show/${showId}/season/${seasonNumber}/episode/${ep.episode_number}`}
              className="flex gap-4 rounded border border-transparent p-3 transition hover:border-[#2c3440] hover:bg-[#1c2228]"
            >
              <div className="relative h-[68px] w-[120px] shrink-0 overflow-hidden rounded bg-[#2c3440]">
                {still ? (
                  <Image src={still} alt="" fill className="object-cover" sizes="120px" />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-[#678]">
                    E{ep.episode_number}
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-bold text-[#678]">{ep.episode_number}.</span>
                  <span className="font-semibold">{ep.name}</span>
                </div>
                <div className="mt-0.5 flex items-center gap-3 text-sm text-[#678]">
                  {ep.air_date && <span>{formatDate(ep.air_date)}</span>}
                  {ep.runtime && <span>{ep.runtime}m</span>}
                  {ep.vote_average > 0 && <StarRating rating={rating} size="sm" />}
                </div>
                {ep.overview && (
                  <p className="mt-1 line-clamp-2 text-sm text-[#678]">{ep.overview}</p>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
