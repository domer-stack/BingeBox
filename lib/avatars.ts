export const DEFAULT_AVATAR_ID = "stream-pulse";

export const AVATARS = [
  { id: "stream-pulse", name: "Stream Pulse", file: "/avatars/stream-pulse.svg" },
  { id: "plot-twist", name: "Plot Twist", file: "/avatars/plot-twist.svg" },
  { id: "popcorn-night", name: "Popcorn Night", file: "/avatars/popcorn-night.svg" },
  { id: "remote-critic", name: "Remote Critic", file: "/avatars/remote-critic.svg" },
  { id: "midnight-sofa", name: "Midnight Sofa", file: "/avatars/midnight-sofa.svg" },
] as const;

export type AvatarId = (typeof AVATARS)[number]["id"];

const AVATAR_IDS = new Set<string>(AVATARS.map((a) => a.id));

export function isValidAvatarId(id: string | null | undefined): id is AvatarId {
  return !!id && AVATAR_IDS.has(id);
}

export function resolveAvatarId(id: string | null | undefined): AvatarId {
  return isValidAvatarId(id) ? id : DEFAULT_AVATAR_ID;
}

export function getAvatarSrc(id: string | null | undefined): string {
  const resolved = resolveAvatarId(id);
  return AVATARS.find((a) => a.id === resolved)!.file;
}
