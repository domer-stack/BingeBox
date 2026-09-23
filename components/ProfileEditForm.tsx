"use client";

import { FormEvent, useState } from "react";
import { updateProfile } from "@/lib/actions/auth";

interface ProfileEditFormProps {
  displayName: string;
  bio: string;
}

export function ProfileEditForm({ displayName, bio }: ProfileEditFormProps) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setMessage(null);
    const result = await updateProfile(new FormData(e.currentTarget));
    setPending(false);
    if (result.ok) {
      setMessage({ type: "ok", text: "Profile updated." });
      setOpen(false);
    } else {
      setMessage({ type: "err", text: result.error });
    }
  }

  return (
    <div className="mt-4">
      {!open ? (
        <button type="button" onClick={() => setOpen(true)} className="btn-secondary text-sm">
          Edit profile
        </button>
      ) : (
        <form onSubmit={onSubmit} className="glass-card mt-2 max-w-lg p-5">
          <h2 className="section-eyebrow mb-4">Edit profile</h2>
          <label className="block text-sm text-[var(--color-muted)]">
            Display name
            <input
              name="displayName"
              defaultValue={displayName}
              maxLength={80}
              className="glass-input mt-1 w-full px-3 py-2 text-sm"
            />
          </label>
          <label className="mt-4 block text-sm text-[var(--color-muted)]">
            Bio
            <textarea
              name="bio"
              defaultValue={bio}
              maxLength={280}
              rows={3}
              className="glass-input mt-1 w-full resize-none px-3 py-2 text-sm"
              placeholder="What are you watching?"
            />
          </label>
          {message && (
            <p className={`mt-3 text-sm ${message.type === "ok" ? "text-[var(--color-accent)]" : "text-red-400"}`}>
              {message.text}
            </p>
          )}
          <div className="mt-4 flex gap-2">
            <button type="submit" disabled={pending} className="btn-primary text-sm disabled:opacity-50">
              {pending ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}
      {!open && message?.type === "ok" && (
        <p className="mt-2 text-sm text-[var(--color-accent)]">{message.text}</p>
      )}
    </div>
  );
}
