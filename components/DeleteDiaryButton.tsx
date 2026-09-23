"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteDiaryEntry } from "@/lib/actions/diary";

interface DeleteDiaryButtonProps {
  entryId: string;
}

export function DeleteDiaryButton({ entryId }: DeleteDiaryButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (!confirm("Remove this diary entry?")) return;
    setPending(true);
    const result = await deleteDiaryEntry(entryId);
    setPending(false);
    if (result.ok) router.refresh();
    else alert(result.error);
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className="text-xs text-[var(--color-subtle)] hover:text-red-400 disabled:opacity-50"
      aria-label="Delete entry"
    >
      {pending ? "…" : "Remove"}
    </button>
  );
}
