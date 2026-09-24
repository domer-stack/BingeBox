export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ShowRatingPicker } from "@/components/ShowRatingPicker";
import { ShowReviewSection } from "@/components/ShowReviewSection";
import { StarRating } from "@/components/StarRating";
import { getPublicShowReviews, getShowReview } from "@/lib/actions/show-reviews";
import { ShowGrid } from "@/components/ShowGrid";
import { AddToListButton } from "@/components/AddToListButton";
import { WatchlistButton } from "@/components/WatchlistButton";
import { isOnWatchlist } from "@/lib/actions/watchlist";
import { formatDate } from "@/lib/utils";
import {
  backdropUrl,
  getShow,
  parseWatchProviders,
  posterUrl,
  showYearRange,
  toStarRating,
  type TmdbShow,
} from "@/lib/tmdb";

interface ShowPageProps {
  params: Promise<{ id: string }>;
}

export default async function ShowPage({ params }: ShowPageProps) {
  const { id } = await params;
  const showId = Number(id);
  if (Number.isNaN(showId)) notFound();

  let show;
  try {
    show = await getShow(showId);
  } catch {
    notFound();
  }

  const backdrop = backdropUrl(show.backdrop_path ?? show.poster_path);
  const poster = posterUrl(show.poster_path, "w500");
  const rating = toStarRating(show.vote_average);
  const providers = parseWatchProviders(
    (show as unknown as { "watch/providers"?: { results?: Record<string, unknown> } })["watch/providers"]
  );
  const similar = (show as unknown as { similar?: { results: TmdbShow[] } }).similar?.results?.slice(0, 6) ?? [];
  const credits = (show as unknown as { credits?: { cast: { name: string }[] } }).credits;
  const session = await auth();
  const [onWatchlist, ownReview, communityReviews] = await Promise.all([
    isOnWatchlist(showId),
    getShowReview(showId),
    getPublicShowReviews(showId, 8),
  ]);
  const firstSeason = show.seasons.find((s) => s.season_number > 0)?.season_number ?? 1;
  const reviewsForList = communityReviews.filter((r) => r.user.id !== session?.user?.id);

  return (
    <>
      <section className="relative min-h-[360px]">
        {backdrop && (
          <Image src={backdrop} alt="" fill className="object-cover brightness-[0.3] blur-sm" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-base)] via-[var(--color-base)]/75 to-[var(--color-base)]/35" />

        <div className="relative mx-auto grid max-w-6xl gap-8 px-5 py-10 md:grid-cols-[200px_1fr]">
          <div className="relative aspect-[2/3] overflow-hidden rounded shadow-2xl">
            {poster ? (
              <Image src={poster} alt={show.name} fill className="object-cover" sizes="200px" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[var(--color-overlay)] p-4 text-center text-sm text-[var(--color-subtle)]">
                {show.name}
              </div>
            )}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{show.name}</h1>
            <div className="mt-2 flex flex-wrap gap-x-4 text-sm text-[var(--color-subtle)]">
              <span>{showYearRange(show.first_air_date, show.last_air_date, show.in_production)}</span>
              <span>{show.number_of_seasons} seasons · {show.number_of_episodes} episodes</span>
              <span>{show.status}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {show.genres.map((g) => (
                <Link
                  key={g.id}
                  href={`/browse?genre=${g.id}`}
                  className="rounded-full bg-[var(--color-overlay)] px-2.5 py-0.5 text-xs text-[var(--color-muted)] hover:text-[var(--color-text)]"
                >
                  {g.name}
                </Link>
              ))}
            </div>

            <div className="mt-4 flex items-center gap-3">
              <StarRating rating={rating} size="lg" showValue />
              <span className="text-sm text-[var(--color-subtle)]">{show.vote_count.toLocaleString()} ratings on TMDb</span>
            </div>

            <ShowRatingPicker
              tmdbShowId={showId}
              showName={show.name}
              signedIn={Boolean(session?.user)}
              initialRating={ownReview?.rating ?? null}
            />

            <div className="mt-5 flex flex-wrap gap-2">
              <WatchlistButton
                tmdbShowId={showId}
                showName={show.name}
                initialOnWatchlist={onWatchlist}
              />
              <AddToListButton tmdbShowId={showId} showName={show.name} />
              <Link
                href={`/show/${showId}/season/${firstSeason}`}
                className="rounded border border-[var(--color-border-strong)] px-4 py-2 text-sm font-semibold text-[var(--color-muted)] hover:text-[var(--color-text)]"
              >
                Log episodes
              </Link>
            </div>

            {show.tagline && <p className="mt-4 text-sm italic text-[var(--color-muted)]">{show.tagline}</p>}
            <p className="mt-4 max-w-2xl text-[var(--color-muted)] leading-relaxed">{show.overview || "No overview available."}</p>

            {show.created_by.length > 0 && (
              <p className="mt-4 text-sm text-[var(--color-subtle)]">
                Created by{" "}
                <span className="text-[var(--color-muted)]">{show.created_by.map((c) => c.name).join(", ")}</span>
              </p>
            )}

            {show.networks.length > 0 && (
              <p className="mt-1 text-sm text-[var(--color-subtle)]">
                Network: <span className="text-[var(--color-muted)]">{show.networks.map((n) => n.name).join(", ")}</span>
              </p>
            )}

            {providers.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-subtle)]">Stream on</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {providers.map((p) => (
                    <span
                      key={p.provider_id}
                      className="rounded bg-[var(--color-overlay)] px-3 py-1.5 text-sm text-[var(--color-muted)]"
                    >
                      {p.provider_name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {credits?.cast && credits.cast.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-[var(--color-subtle)]">Cast</h3>
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  {credits.cast.slice(0, 8).map((c) => c.name).join(", ")}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-subtle)]">Seasons</h2>
        <div className="space-y-2">
          {show.seasons
            .filter((s) => s.season_number > 0)
            .map((season) => (
              <Link
                key={season.id}
                href={`/show/${show.id}/season/${season.season_number}`}
                className="flex items-center gap-4 rounded border border-[var(--color-border)] bg-[var(--color-elevated)] p-4 transition hover:border-[var(--color-border-strong)]"
              >
                <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded bg-[var(--color-overlay)]">
                  {season.poster_path && (
                    <Image
                      src={posterUrl(season.poster_path, "w154")!}
                      alt=""
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{season.name}</p>
                  <p className="text-sm text-[var(--color-subtle)]">
                    {season.episode_count} episodes
                    {season.air_date && ` · ${formatDate(season.air_date)}`}
                  </p>
                </div>
                <span className="text-[var(--color-subtle)]">→</span>
              </Link>
            ))}
        </div>
      </section>

      <ShowReviewSection
        tmdbShowId={showId}
        showName={show.name}
        signedIn={Boolean(session?.user)}
        ownReview={ownReview ? { body: ownReview.body, rating: ownReview.rating } : null}
        communityReviews={reviewsForList}
      />

      {similar.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-10">
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-widest text-[var(--color-subtle)]">Similar shows</h2>
          <ShowGrid shows={similar} />
        </section>
      )}
    </>
  );
}
