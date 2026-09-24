"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSimilarShows, type TmdbShow } from "@/lib/tmdb";

export async function getDiscoverForYou(limit = 18): Promise<TmdbShow[]> {
  const session = await auth();
  const userId = session?.user?.id;

  const exclude = new Set<number>();

  if (userId) {
    const [diary, watchlist] = await Promise.all([
      prisma.diaryEntry.findMany({
        where: { userId },
        select: { tmdbShowId: true },
        distinct: ["tmdbShowId"],
      }),
      prisma.watchlistItem.findMany({
        where: { userId },
        select: { tmdbShowId: true },
      }),
    ]);
    for (const d of diary) exclude.add(d.tmdbShowId);
    for (const w of watchlist) exclude.add(w.tmdbShowId);
  }

  let seedIds: number[] = [];
  if (userId) {
    const recent = await prisma.diaryEntry.findMany({
      where: { userId },
      orderBy: { watchedAt: "desc" },
      distinct: ["tmdbShowId"],
      take: 4,
      select: { tmdbShowId: true },
    });
    seedIds = recent.map((r) => r.tmdbShowId);
  }

  if (seedIds.length === 0) {
    const { getTrendingShows } = await import("@/lib/tmdb");
    const trending = await getTrendingShows("week");
    seedIds = trending.results.slice(0, 3).map((s) => s.id);
  }

  const scored = new Map<number, TmdbShow>();
  for (const id of seedIds) {
    try {
      const similar = await getSimilarShows(id);
      for (const show of similar.results) {
        if (exclude.has(show.id)) continue;
        if (!scored.has(show.id)) scored.set(show.id, show);
      }
    } catch {
      continue;
    }
  }

  return [...scored.values()].slice(0, limit);
}
