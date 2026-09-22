"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type ActionResult = { ok: true; listId?: string } | { ok: false; error: string };

async function requireUserId(): Promise<string | null> {
  const session = await auth();
  return session?.user?.id ?? null;
}

export async function createList(formData: FormData): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Sign in to create lists." };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const isPublic = formData.get("isPublic") !== "false";

  if (!title || title.length < 2) {
    return { ok: false, error: "List title must be at least 2 characters." };
  }

  const list = await prisma.showList.create({
    data: { userId, title, description, isPublic },
  });

  revalidatePath("/lists");
  revalidatePath("/profile");
  return { ok: true, listId: list.id };
}

export async function addShowToList(
  listId: string,
  tmdbShowId: number,
  showName: string
): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Sign in required." };

  const list = await prisma.showList.findFirst({ where: { id: listId, userId } });
  if (!list) return { ok: false, error: "List not found." };

  const count = await prisma.listItem.count({ where: { listId } });
  await prisma.listItem.upsert({
    where: { listId_tmdbShowId: { listId, tmdbShowId } },
    create: { listId, tmdbShowId, showName, position: count },
    update: {},
  });

  revalidatePath(`/lists/${listId}`);
  revalidatePath("/lists");
  return { ok: true };
}

export async function removeShowFromList(listId: string, tmdbShowId: number): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Sign in required." };

  const list = await prisma.showList.findFirst({ where: { id: listId, userId } });
  if (!list) return { ok: false, error: "List not found." };

  await prisma.listItem.deleteMany({ where: { listId, tmdbShowId } });
  revalidatePath(`/lists/${listId}`);
  return { ok: true };
}

export async function deleteList(listId: string): Promise<ActionResult> {
  const userId = await requireUserId();
  if (!userId) return { ok: false, error: "Sign in required." };

  const list = await prisma.showList.findFirst({ where: { id: listId, userId } });
  if (!list) return { ok: false, error: "List not found." };

  await prisma.showList.delete({ where: { id: listId } });
  revalidatePath("/lists");
  revalidatePath("/profile");
  return { ok: true };
}

export async function getPublicLists(limit = 20) {
  return prisma.showList.findMany({
    where: { isPublic: true },
    include: {
      user: { select: { username: true, displayName: true } },
      items: { take: 5, orderBy: { position: "asc" } },
      _count: { select: { items: true } },
    },
    orderBy: { updatedAt: "desc" },
    take: limit,
  });
}

export async function getUserLists(userId: string) {
  return prisma.showList.findMany({
    where: { userId },
    include: { _count: { select: { items: true } }, items: { take: 5, orderBy: { position: "asc" } } },
    orderBy: { updatedAt: "desc" },
  });
}

export async function getListById(listId: string) {
  return prisma.showList.findUnique({
    where: { id: listId },
    include: {
      user: { select: { id: true, username: true, displayName: true } },
      items: { orderBy: { position: "asc" } },
    },
  });
}

export async function getUserListsForShow(tmdbShowId: number) {
  const userId = await requireUserId();
  if (!userId) return [];

  return prisma.showList.findMany({
    where: { userId },
    include: {
      items: { where: { tmdbShowId }, select: { id: true } },
    },
    orderBy: { title: "asc" },
  });
}
