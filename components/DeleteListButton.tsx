"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteList } from "@/lib/actions/lists";

interface DeleteListButtonProps {
  listId: string;
  listTitle: string;
}

export function DeleteListButton({ listId, listTitle }: DeleteListButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function onDelete() {
    if (!confirm(`Delete "${listTitle}"? This cannot be undone.`)) return;
    setPending(true);
    const result = await deleteList(listId);
    setPending(false);
    if (result.ok) router.push("/lists");
    else alert(result.error);
  }

  return (
    <button
      type="button"
      onClick={onDelete}
      disabled={pending}
      className="text-sm text-red-400 hover:text-red-300 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete list"}
    </button>
  );
}
