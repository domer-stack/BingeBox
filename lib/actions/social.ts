"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ActionResult =
  | { ok: true; following?: boolean; liked?: boolean; likeCount?: number }
  | { ok: false; error: string };

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function toggleFollow(targetUserId: string): Promise<ActionResult> {
  const followerId = await requireUserId();
  if (!followerId) return { ok: false, error: "Sign in to follow members." };
  if (followerId === targetUserId) return { ok: false, error: "You can't follow yourself." };

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId: targetUserId } },
  });

  const target = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { username: true },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
    if (target) revalidatePath(`/user/${target.username}`);
    return { ok: true, following: false };
  }

  await prisma.follow.create({ data: { followerId, followingId: targetUserId } });
  if (target) revalidatePath(`/user/${target.username}`);
  revalidatePath("/");
  revalidatePath("/members");
  return { ok: true, following: true };
}

export async function isFollowing(targetUserId: string): Promise<boolean> {
  const followerId = await requireUserId();
  if (!followerId) return false;

  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId: targetUserId } },
  });
  return !!follow;
}

export async function toggleDiaryLike(diaryEntryId: string): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Sign in to like reviews." };

  const existing = await prisma.diaryLike.findUnique({
    where: { userId_diaryEntryId: { userId, diaryEntryId } },
  });

  if (existing) {
    await prisma.diaryLike.delete({ where: { id: existing.id } });
  } else {
    await prisma.diaryLike.create({ data: { userId, diaryEntryId } });
  }

  const likeCount = await prisma.diaryLike.count({ where: { diaryEntryId } });
  revalidatePath("/");
  revalidatePath("/diary");
  return { ok: true, liked: !existing, likeCount };
}

export async function getActivityFeed(limit = 20) {
  const session = await auth();
  if (!session?.user?.id) return [];

  const following = await prisma.follow.findMany({
    where: { followerId: session.user.id },
    select: { followingId: true },
  });
  const userIds = following.map((f) => f.followingId);
  if (userIds.length === 0) return [];

  return prisma.diaryEntry.findMany({
    where: { userId: { in: userIds }, OR: [{ review: { not: null } }, { rating: { not: null } }] },
    include: {
      user: { select: { username: true, displayName: true } },
      _count: { select: { likes: true } },
      likes: { where: { userId: session.user.id }, select: { id: true } },
    },
    orderBy: { watchedAt: "desc" },
    take: limit,
  });
}

export async function getMembers(limit = 30) {
  return prisma.user.findMany({
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      createdAt: true,
      _count: { select: { diaryEntries: true, followers: true, following: true } },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      bio: true,
      createdAt: true,
      _count: { select: { diaryEntries: true, followers: true, following: true, lists: true } },
    },
  });
}

export async function getUserPublicDiary(userId: string, limit = 10) {
  return prisma.diaryEntry.findMany({
    where: { userId },
    include: { _count: { select: { likes: true } } },
    orderBy: { watchedAt: "desc" },
    take: limit,
  });
}
