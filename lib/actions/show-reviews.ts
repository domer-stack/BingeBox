"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function getShowReview(tmdbShowId: number, userId?: string) {
  const session = await auth();
  const id = userId ?? session?.user?.id;
  if (!id) return null;

  return prisma.showReview.findUnique({
    where: { userId_tmdbShowId: { userId: id, tmdbShowId } },
  });
}

export async function getPublicShowReviews(tmdbShowId: number, limit = 6) {
  return prisma.showReview.findMany({
    where: { tmdbShowId },
    orderBy: { updatedAt: "desc" },
    take: limit,
    include: {
      user: { select: { id: true, username: true, displayName: true, avatarId: true } },
    },
  });
}

function normalizeRating(rating?: number | null): number | null {
  if (rating == null || rating <= 0) return null;
  if (rating < 0.5 || rating > 5) return null;
  return rating;
}

export async function rateShow(data: {
  tmdbShowId: number;
  showName: string;
  rating: number | null;
}): Promise<ActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Sign in to rate this show." };

  const existing = await prisma.showReview.findUnique({
    where: { userId_tmdbShowId: { userId, tmdbShowId: data.tmdbShowId } },
  });

  const rating = normalizeRating(data.rating);

  if (rating == null) {
    if (!existing) return { ok: true };
    if (existing.body.trim().length > 0) {
      await prisma.showReview.update({
        where: { userId_tmdbShowId: { userId, tmdbShowId: data.tmdbShowId } },
        data: { rating: null, showName: data.showName },
      });
    } else {
      await prisma.showReview.delete({
        where: { userId_tmdbShowId: { userId, tmdbShowId: data.tmdbShowId } },
      });
    }
    revalidatePath(`/show/${data.tmdbShowId}`);
    revalidatePath("/profile");
    return { ok: true };
  }

  await prisma.showReview.upsert({
    where: { userId_tmdbShowId: { userId, tmdbShowId: data.tmdbShowId } },
    create: {
      userId,
      tmdbShowId: data.tmdbShowId,
      showName: data.showName,
      body: existing?.body ?? "",
      rating,
    },
    update: { rating, showName: data.showName },
  });

  revalidatePath(`/show/${data.tmdbShowId}`);
  revalidatePath("/profile");
  return { ok: true };
}

export async function upsertShowReview(data: {
  tmdbShowId: number;
  showName: string;
  body: string;
  rating?: number | null;
}): Promise<ActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Sign in to write a review." };

  const body = data.body.trim();
  const rating = normalizeRating(data.rating);

  if (body.length > 5000) return { ok: false, error: "Review must be 5000 characters or less." };
  if (body.length > 0 && body.length < 20) {
    return { ok: false, error: "Review must be at least 20 characters, or leave blank and rate only." };
  }
  if (!rating && body.length === 0) {
    return { ok: false, error: "Add a rating and/or a written review." };
  }

  await prisma.showReview.upsert({
    where: { userId_tmdbShowId: { userId, tmdbShowId: data.tmdbShowId } },
    create: {
      userId,
      tmdbShowId: data.tmdbShowId,
      showName: data.showName,
      body,
      rating,
    },
    update: { body, rating, showName: data.showName },
  });

  revalidatePath(`/show/${data.tmdbShowId}`);
  revalidatePath("/profile");
  return { ok: true };
}

export async function deleteShowReview(tmdbShowId: number): Promise<ActionResult> {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) return { ok: false, error: "Sign in required." };

  await prisma.showReview.deleteMany({
    where: { userId, tmdbShowId },
  });

  revalidatePath(`/show/${tmdbShowId}`);
  return { ok: true };
}
