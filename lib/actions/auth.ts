"use server";

import bcrypt from "bcryptjs";
import { isValidAvatarId } from "@/lib/avatars";
import { prisma } from "@/lib/prisma";

export type ActionResult =
  | { ok: true; avatarId?: string; displayName?: string }
  | { ok: false; error: string };

export async function registerUser(formData: FormData): Promise<ActionResult> {
  const username = (formData.get("username") as string)?.trim();
  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;
  const displayName = (formData.get("displayName") as string)?.trim() || username;

  if (!username || username.length < 3) {
    return { ok: false, error: "Username must be at least 3 characters." };
  }
  if (!email || !email.includes("@")) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (!password || password.length < 6) {
    return { ok: false, error: "Password must be at least 6 characters." };
  }

  const existing = await prisma.user.findFirst({
    where: { OR: [{ username }, { email }] },
  });
  if (existing) {
    return { ok: false, error: "Username or email already taken." };
  }

  const hashed = await bcrypt.hash(password, 12);
  await prisma.user.create({
    data: { username, email, password: hashed, displayName },
  });

  return { ok: true };
}

export async function updateProfile(formData: FormData): Promise<ActionResult> {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (!session?.user?.id) return { ok: false, error: "Sign in required." };

  const displayName = (formData.get("displayName") as string)?.trim() || null;
  const bio = (formData.get("bio") as string)?.trim() || null;
  const avatarRaw = (formData.get("avatarId") as string)?.trim();
  const avatarId = isValidAvatarId(avatarRaw) ? avatarRaw : undefined;

  if (displayName && displayName.length > 80) {
    return { ok: false, error: "Display name must be 80 characters or less." };
  }
  if (bio && bio.length > 280) {
    return { ok: false, error: "Bio must be 280 characters or less." };
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      displayName,
      bio,
      ...(avatarId && { avatarId }),
    },
    select: { username: true, avatarId: true, displayName: true },
  });

  const { revalidatePath } = await import("next/cache");
  revalidatePath("/profile");
  revalidatePath(`/user/${user.username}`);
  revalidatePath("/members");
  revalidatePath("/");

  return {
    ok: true,
    avatarId: user.avatarId,
    displayName: user.displayName ?? undefined,
  };
}
