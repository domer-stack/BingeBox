"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { removeShowFromList } from "@/lib/actions/lists";

export function RemoveFromListButton({
  listId,
  tmdbShowId,
}: {
  listId: string;
  tmdbShowId: number;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await removeShowFromList(listId, tmdbShowId);
          router.refresh();
        })
      }
      className="text-xs text-[#678] hover:text-red-400 disabled:opacity-50"
    >
      Remove
    </button>
  );
}
