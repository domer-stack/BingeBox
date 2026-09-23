"use client";

import Image from "next/image";
import { AVATARS, type AvatarId } from "@/lib/avatars";

interface AvatarPickerProps {
  value: AvatarId;
  onChange: (id: AvatarId) => void;
  name?: string;
}

export function AvatarPicker({ value, onChange, name = "avatarId" }: AvatarPickerProps) {
  return (
    <div>
      <p className="text-sm text-[var(--color-muted)]">Profile picture</p>
      <input type="hidden" name={name} value={value} />
      <div className="mt-2 flex flex-wrap gap-3">
        {AVATARS.map((avatar) => {
          const selected = value === avatar.id;
          return (
            <button
              key={avatar.id}
              type="button"
              title={avatar.name}
              onClick={() => onChange(avatar.id)}
              className={`rounded-2xl p-1 transition ${
                selected
                  ? "ring-2 ring-[var(--color-accent)] ring-offset-2 ring-offset-[var(--color-base)]"
                  : "opacity-80 hover:opacity-100"
              }`}
            >
              <Image src={avatar.file} alt={avatar.name} width={56} height={56} className="rounded-xl" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
