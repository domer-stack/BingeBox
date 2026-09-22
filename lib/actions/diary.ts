"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true } | { ok: false; error: string };

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function logEpisode(data: {
  tmdbShowId: number;
  showName: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeName?: string;
  rating?: number | null;
  review?: string | null;
  watchedAt?: string;
}): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Sign in to log episodes." };

  const rating = data.rating && data.rating > 0 ? data.rating : null;
  const review = data.review?.trim() || null;
  const watchedAt = data.watchedAt ? new Date(data.watchedAt) : new Date();

  await prisma.diaryEntry.upsert({
    where: {
      userId_tmdbShowId_seasonNumber_episodeNumber: {
        userId,
        tmdbShowId: data.tmdbShowId,
        seasonNumber: data.seasonNumber,
        episodeNumber: data.episodeNumber,
      },
    },
    create: {
      userId,
      tmdbShowId: data.tmdbShowId,
      showName: data.showName,
      seasonNumber: data.seasonNumber,
      episodeNumber: data.episodeNumber,
      episodeName: data.episodeName,
      rating,
      review,
      watchedAt,
    },
    update: {
      episodeName: data.episodeName,
      rating,
      review,
      watchedAt,
    },
  });

  // Remove from watchlist when logged
  await prisma.watchlistItem.deleteMany({
    where: { userId, tmdbShowId: data.tmdbShowId },
  });

  revalidatePath("/diary");
  revalidatePath("/profile");
  revalidatePath(`/show/${data.tmdbShowId}`);
  revalidatePath(
    `/show/${data.tmdbShowId}/season/${data.seasonNumber}/episode/${data.episodeNumber}`
  );

  return { ok: true };
}

export async function deleteDiaryEntry(entryId: string): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Sign in required." };

  const entry = await prisma.diaryEntry.findFirst({
    where: { id: entryId, userId },
  });
  if (!entry) return { ok: false, error: "Entry not found." };

  await prisma.diaryEntry.delete({ where: { id: entryId } });
  revalidatePath("/diary");
  revalidatePath("/profile");
  return { ok: true };
}

export async function getUserDiary(userId?: string) {
  const session = await auth();
  const id = userId ?? session?.user?.id;
  if (!id) return [];

  return prisma.diaryEntry.findMany({
    where: { userId: id },
    orderBy: { watchedAt: "desc" },
  });
}

export async function getEpisodeDiaryEntry(
  tmdbShowId: number,
  seasonNumber: number,
  episodeNumber: number
) {
  const userId = await requireUserId();
  if (!userId) return null;

  return prisma.diaryEntry.findUnique({
    where: {
      userId_tmdbShowId_seasonNumber_episodeNumber: {
        userId,
        tmdbShowId,
        seasonNumber,
        episodeNumber,
      },
    },
  });
}
