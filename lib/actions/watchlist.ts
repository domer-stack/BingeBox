"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true; onWatchlist: boolean } | { ok: false; error: string };

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function toggleWatchlist(
  tmdbShowId: number,
  showName: string
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Sign in to use your watchlist." };

  const existing = await prisma.watchlistItem.findUnique({
    where: { userId_tmdbShowId: { userId, tmdbShowId } },
  });

  if (existing) {
    await prisma.watchlistItem.delete({ where: { id: existing.id } });
    revalidatePath(`/show/${tmdbShowId}`);
    revalidatePath("/profile");
    return { ok: true, onWatchlist: false };
  }

  await prisma.watchlistItem.create({
    data: { userId, tmdbShowId, showName },
  });
  revalidatePath(`/show/${tmdbShowId}`);
  revalidatePath("/profile");
  return { ok: true, onWatchlist: true };
}

export async function isOnWatchlist(tmdbShowId: number): Promise<boolean> {
  const userId = await requireUserId();
  if (!userId) return false;

  const item = await prisma.watchlistItem.findUnique({
    where: { userId_tmdbShowId: { userId, tmdbShowId } },
  });
  return !!item;
}

export async function getUserWatchlist(userId?: string) {
  const session = await auth();
  const id = userId ?? session?.user?.id;
  if (!id) return [];

  return prisma.watchlistItem.findMany({
    where: { userId: id },
    orderBy: { addedAt: "desc" },
  });
}
