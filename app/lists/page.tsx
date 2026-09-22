export const dynamic = "force-dynamic";

import Link from "next/link";
import { auth } from "@/auth";
import { ListCard } from "@/components/ListCard";
import { getPublicLists, getUserLists } from "@/lib/actions/lists";

export default async function ListsPage() {
  const session = await auth();
  const [publicLists, myLists] = await Promise.all([
    getPublicLists(),
    session?.user?.id ? getUserLists(session.user.id) : Promise.resolve([]),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex items-baseline justify-between">
        <div>
          <h1 className="text-2xl font-bold">Lists</h1>
          <p className="mt-1 text-sm text-[#678]">Curated collections from the BingeBox community</p>
        </div>
        {session && (
          <Link
            href="/lists/new"
            className="rounded bg-[#00e054] px-4 py-2 text-sm font-semibold text-[#14181c] hover:bg-[#00c949]"
          >
            + New list
          </Link>
        )}
      </div>

      {session && myLists.length > 0 && (
        <section className="mt-10">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#678]">Your lists</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {myLists.map((list) => (
              <ListCard
                key={list.id}
                id={list.id}
                title={list.title}
                authorName={session.user.name ?? session.user.username}
                authorUsername={session.user.username}
                itemCount={list._count.items}
                showIds={list.items.map((i) => i.tmdbShowId)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-10">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-[#678]">
          {session ? "Public lists" : "Popular lists"}
        </h2>
        {publicLists.length === 0 ? (
          <p className="text-sm text-[#678]">
            No public lists yet.{" "}
            {session ? (
              <Link href="/lists/new" className="text-[#40bcf4]">Create the first one</Link>
            ) : (
              <Link href="/register" className="text-[#40bcf4]">Join to create lists</Link>
            )}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {publicLists.map((list) => (
              <ListCard
                key={list.id}
                id={list.id}
                title={list.title}
                authorName={list.user.displayName ?? list.user.username}
                authorUsername={list.user.username}
                itemCount={list._count.items}
                showIds={list.items.map((i) => i.tmdbShowId)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
