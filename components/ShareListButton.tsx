"use client";

import { useState } from "react";

interface ShareListButtonProps {
  listTitle: string;
  isPublic: boolean;
}

export function ShareListButton({ listTitle, isPublic }: ShareListButtonProps) {
  const [copied, setCopied] = useState(false);

  if (!isPublic) {
    return (
      <p className="text-xs text-[var(--color-subtle)]">Make this list public to share a link.</p>
    );
  }

  async function copyLink() {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy list link:", url);
    }
  }

  return (
    <button type="button" onClick={copyLink} className="btn-secondary text-sm">
      {copied ? "Link copied!" : `Share “${listTitle}”`}
    </button>
  );
}
