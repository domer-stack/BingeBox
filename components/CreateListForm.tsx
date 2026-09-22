"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState, useTransition } from "react";
import { createList } from "@/lib/actions/lists";

export function CreateListForm() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await createList(formData);
      if (result.ok && result.listId) {
        router.push(`/lists/${result.listId}`);
        router.refresh();
      } else if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-md space-y-4">
      <div>
        <label className="block text-sm text-[#9ab]">List title</label>
        <input
          name="title"
          required
          minLength={2}
          placeholder="Best limited series"
          className="glass-input mt-1 w-full px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm text-[#9ab]">Description (optional)</label>
        <textarea
          name="description"
          rows={3}
          placeholder="Shows that tell a complete story in one season…"
          className="glass-input mt-1 w-full px-3 py-2"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-[#9ab]">
        <input type="checkbox" name="isPublic" value="true" defaultChecked className="accent-[#00e054]" />
        Public list (visible to everyone)
      </label>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="btn-primary w-full py-2.5 disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create list"}
      </button>
    </form>
  );
}
