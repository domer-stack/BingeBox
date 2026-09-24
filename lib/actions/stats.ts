"use server";

import { prisma } from "@/lib/prisma";
import { getShow } from "@/lib/tmdb";

export type DayCount = { date: string; count: number };

export type UserStats = {
  totalEpisodes: number;
  uniqueShows: number;
  averageRating: number | null;
  currentStreak: number;
  longestStreak: number;
  last28Days: DayCount[];
  topGenres: { name: string; count: number }[];
};

function dateKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function computeStreaks(dates: string[]): { current: number; longest: number } {
  const set = new Set(dates);
  const sorted = [...set].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;

  for (const d of sorted) {
    if (!prev) {
      run = 1;
    } else {
      const prevDate = new Date(prev + "T12:00:00Z");
      const curDate = new Date(d + "T12:00:00Z");
      const diff = (curDate.getTime() - prevDate.getTime()) / 86400000;
      run = diff === 1 ? run + 1 : 1;
    }
    longest = Math.max(longest, run);
    prev = d;
  }

  let current = 0;
  const today = dateKey(new Date());
  let cursor = today;
  while (set.has(cursor)) {
    current++;
    const d = new Date(cursor + "T12:00:00Z");
    d.setUTCDate(d.getUTCDate() - 1);
    cursor = dateKey(d);
  }

  return { current, longest };
}

export async function getUserStats(userId: string): Promise<UserStats> {
  const entries = await prisma.diaryEntry.findMany({
    where: { userId },
    select: {
      tmdbShowId: true,
      rating: true,
      watchedAt: true,
    },
  });

  const totalEpisodes = entries.length;
  const uniqueShows = new Set(entries.map((e) => e.tmdbShowId)).size;
  const ratings = entries.map((e) => e.rating).filter((r): r is number => r != null && r > 0);
  const averageRating =
    ratings.length > 0 ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10 : null;

  const dayKeys = entries.map((e) => dateKey(e.watchedAt));
  const { current: currentStreak, longest: longestStreak } = computeStreaks(dayKeys);

  const last28Days: DayCount[] = [];
  for (let i = 27; i >= 0; i--) {
    const d = new Date();
    d.setUTCDate(d.getUTCDate() - i);
    const key = dateKey(d);
    last28Days.push({ date: key, count: dayKeys.filter((k) => k === key).length });
  }

  const showIds = [...new Set(entries.map((e) => e.tmdbShowId))].slice(0, 24);
  const genreCounts = new Map<string, number>();
  for (const id of showIds) {
    try {
      const show = await getShow(id);
      for (const g of show.genres) {
        genreCounts.set(g.name, (genreCounts.get(g.name) ?? 0) + 1);
      }
    } catch {
      /* skip */
    }
  }

  const topGenres = [...genreCounts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return {
    totalEpisodes,
    uniqueShows,
    averageRating,
    currentStreak,
    longestStreak,
    last28Days,
    topGenres,
  };
}
