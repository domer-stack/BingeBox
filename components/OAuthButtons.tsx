"use client";

import { signIn } from "next-auth/react";

interface OAuthButtonsProps {
  callbackUrl?: string;
  google?: boolean;
  github?: boolean;
}

export function OAuthButtons({
  callbackUrl = "/profile",
  google = false,
  github = false,
}: OAuthButtonsProps) {
  if (!google && !github) return null;

  return (
    <div className="space-y-3">
      <p className="text-center text-xs uppercase tracking-wider text-[var(--color-subtle)]">Or continue with</p>
      <div className="flex flex-col gap-2">
        {google && (
          <button
            type="button"
            onClick={() => signIn("google", { callbackUrl })}
            className="btn-secondary w-full py-2.5 text-sm"
          >
            Google
          </button>
        )}
        {github && (
          <button
            type="button"
            onClick={() => signIn("github", { callbackUrl })}
            className="btn-secondary w-full py-2.5 text-sm"
          >
            GitHub
          </button>
        )}
      </div>
    </div>
  );
}
