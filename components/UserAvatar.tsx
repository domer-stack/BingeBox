import Image from "next/image";
import { getAvatarSrc, resolveAvatarId } from "@/lib/avatars";

const SIZES = {
  xs: { box: 24, image: 24, radius: "rounded-md" },
  sm: { box: 48, image: 48, radius: "rounded-xl" },
  md: { box: 80, image: 80, radius: "rounded-2xl" },
  lg: { box: 96, image: 96, radius: "rounded-2xl" },
} as const;

interface UserAvatarProps {
  avatarId?: string | null;
  alt?: string;
  size?: keyof typeof SIZES;
  className?: string;
}

export function UserAvatar({ avatarId, alt = "", size = "sm", className = "" }: UserAvatarProps) {
  const dim = SIZES[size];
  const src = getAvatarSrc(avatarId);
  const label = alt || resolveAvatarId(avatarId);

  return (
    <span
      className={`relative inline-flex shrink-0 overflow-hidden bg-[var(--color-overlay)] ${dim.radius} ${className}`}
      style={{ width: dim.box, height: dim.box }}
    >
      <Image
        src={src}
        alt={label}
        width={dim.image}
        height={dim.image}
        className="h-full w-full object-cover"
      />
    </span>
  );
}
