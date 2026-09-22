export const dynamic = "force-dynamic";

import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ShowGrid } from "@/components/ShowGrid";
import { RemoveFromListButton } from "@/components/RemoveFromListButton";
import { getListById } from "@/lib/actions/lists";
import { getShow, type TmdbShow } from "@/lib/tmdb";

interface ListPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListDetailPage({ params }: ListPageProps) {
  const { id } = await params;
  const session = await auth();
  const list = await getListById(id);
  if (!list) notFound();
  if (!list.isPublic && list.userId !== session?.user?.id) notFound();

  const isOwner = session?.user?.id === list.userId;
  const shows: TmdbShow[] = [];
  for (const item of list.items) {
    try {
      shows.push(await getShow(item.tmdbShowId));
    } catch {
      /* skip */
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <Link href="/lists" className="text-sm text-[#678] hover:text-white">← All lists</Link>
      <h1 className="mt-4 text-2xl font-bold">{list.title}</h1>
      {list.description && <p className="mt-2 max-w-2xl text-[#9ab]">{list.description}</p>}
      <p className="mt-2 text-sm text-[#678]">
        {list.items.length} shows · by{" "}
        <Link href={`/user/${list.user.username}`} className="text-[#40bcf4] hover:text-white">
          {list.user.displayName ?? list.user.username}
        </Link>
        {!list.isPublic && " · Private"}
      </p>

      {shows.length === 0 ? (
        <p className="mt-10 text-[#678]">
          This list is empty.{" "}
          {isOwner && (
            <Link href="/browse" className="text-[#40bcf4]">Browse shows to add</Link>
          )}
        </p>
      ) : (
        <div className="mt-8">
          {isOwner && (
            <ul className="mb-6 space-y-1 text-sm">
              {list.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded bg-[#1c2228] px-3 py-2">
                  <span className="text-[#9ab]">{item.showName}</span>
                  <RemoveFromListButton listId={list.id} tmdbShowId={item.tmdbShowId} />
                </li>
              ))}
            </ul>
          )}
          <ShowGrid shows={shows} />
        </div>
      )}
    </div>
  );
}
