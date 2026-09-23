"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { addShowToList, getUserListsForShow } from "@/lib/actions/lists";

interface AddToListButtonProps {
  tmdbShowId: number;
  showName: string;
}

type UserList = Awaited<ReturnType<typeof getUserListsForShow>>[number];

export function AddToListButton({ tmdbShowId, showName }: AddToListButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [lists, setLists] = useState<UserList[]>([]);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (open && session) {
      getUserListsForShow(tmdbShowId).then(setLists);
    }
  }, [open, session, tmdbShowId]);

  if (!session) {
    return (
      <Link
        href="/login"
        className="btn-secondary px-4 py-2 text-sm"
      >
        + Add to list
      </Link>
    );
  }

  function handleAdd(listId: string) {
    startTransition(async () => {
      await addShowToList(listId, tmdbShowId, showName);
      router.refresh();
      setOpen(false);
    });
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="btn-secondary px-4 py-2 text-sm"
      >
        + Add to list
      </button>
      {open && (
        <div className="absolute left-0 top-full z-20 mt-1 min-w-[200px] rounded border border-[var(--color-border)] bg-[var(--color-elevated)] py-2 shadow-xl">
          {lists.length === 0 ? (
            <p className="px-3 py-2 text-sm text-[var(--color-subtle)]">
              No lists yet.{" "}
              <Link href="/lists/new" className="text-[var(--color-link)]">
                Create one
              </Link>
            </p>
          ) : (
            lists.map((list) => {
              const inList = list.items.length > 0;
              return (
                <button
                  key={list.id}
                  type="button"
                  disabled={pending || inList}
                  onClick={() => handleAdd(list.id)}
                  className="block w-full px-3 py-2 text-left text-sm text-[var(--color-muted)] hover:bg-[var(--color-overlay)] hover:text-[var(--color-text)] disabled:opacity-50"
                >
                  {inList ? "✓ " : ""}{list.title}
                </button>
              );
            })
          )}
          <Link
            href="/lists/new"
            className="block border-t border-[var(--color-border)] px-3 py-2 text-sm text-[var(--color-accent)] hover:text-[var(--color-text)]"
          >
            + New list
          </Link>
        </div>
      )}
    </div>
  );
}
