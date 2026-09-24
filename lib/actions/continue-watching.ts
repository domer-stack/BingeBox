"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSeason, getShow } from "@/lib/tmdb";

export type ContinueWatchingItem = {
  tmdbShowId: number;
  showName: string;
  posterPath: string | null;
  watchedCount: number;
  totalEpisodes: number;
  progressPercent: number;
  lastWatchedAt: Date;
  nextHref: string;
  nextLabel: string;
};

export async function getContinueWatching(limit = 8): Promise<ContinueWatchingItem[]> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return [];

  const entries = await prisma.diaryEntry.findMany({
    where: { userId },
    orderBy: { watchedAt: "desc" },
  });
  if (entries.length === 0) return [];

  const byShow = new Map<number, typeof entries>();
  for (const e of entries) {
    const list = byShow.get(e.tmdbShowId) ?? [];
    list.push(e);
    byShow.set(e.tmdbShowId, list);
  }

  const showIds = [...byShow.keys()].slice(0, limit * 2);
  const results: ContinueWatchingItem[] = [];

  for (const tmdbShowId of showIds) {
    if (results.length >= limit) break;
    const showEntries = byShow.get(tmdbShowId)!;
    const watchedCount = showEntries.length;
    const last = showEntries.reduce((a, b) => (a.watchedAt > b.watchedAt ? a : b));

    let show;
    try {
      show = await getShow(tmdbShowId);
    } catch {
      continue;
    }

    const totalEpisodes = show.number_of_episodes;
    if (totalEpisodes > 0 && watchedCount >= totalEpisodes) continue;

    const logged = new Set(
      showEntries.map((e) => `${e.seasonNumber}:${e.episodeNumber}`)
    );

    let nextSeason = last.seasonNumber;
    let nextEpisode = last.episodeNumber + 1;
    let seasonMeta = show.seasons.find((s) => s.season_number === nextSeason);

    try {
      if (!seasonMeta || nextEpisode > seasonMeta.episode_count) {
        const nextSeasonNum =
          show.seasons
            .filter((s) => s.season_number > 0 && s.season_number > nextSeason)
            .sort((a, b) => a.season_number - b.season_number)[0]?.season_number ??
          null;
        if (nextSeasonNum == null) continue;
        nextSeason = nextSeasonNum;
        nextEpisode = 1;
        seasonMeta = show.seasons.find((s) => s.season_number === nextSeason);
      }

      while (seasonMeta && logged.has(`${nextSeason}:${nextEpisode}`)) {
        nextEpisode++;
        if (nextEpisode > seasonMeta.episode_count) {
          const nextSeasonNum =
            show.seasons
              .filter((s) => s.season_number > 0 && s.season_number > nextSeason)
              .sort((a, b) => a.season_number - b.season_number)[0]?.season_number ?? null;
          if (nextSeasonNum == null) break;
          nextSeason = nextSeasonNum;
          nextEpisode = 1;
          seasonMeta = show.seasons.find((s) => s.season_number === nextSeason);
        }
      }

      if (!seasonMeta) continue;
      const seasonDetail = await getSeason(tmdbShowId, nextSeason);
      const nextEp = seasonDetail.episodes.find((ep) => ep.episode_number === nextEpisode);
      if (!nextEp) continue;

      const progressPercent =
        totalEpisodes > 0 ? Math.min(100, Math.round((watchedCount / totalEpisodes) * 100)) : 0;

      results.push({
        tmdbShowId,
        showName: show.name,
        posterPath: show.poster_path,
        watchedCount,
        totalEpisodes,
        progressPercent,
        lastWatchedAt: last.watchedAt,
        nextHref: `/show/${tmdbShowId}/season/${nextSeason}/episode/${nextEpisode}`,
        nextLabel: `S${nextSeason}E${nextEpisode}${nextEp.name ? ` · ${nextEp.name}` : ""}`,
      });
    } catch {
      continue;
    }
  }

  results.sort((a, b) => b.lastWatchedAt.getTime() - a.lastWatchedAt.getTime());
  return results.slice(0, limit);
}
