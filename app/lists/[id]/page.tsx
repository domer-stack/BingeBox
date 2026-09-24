export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ShowGrid } from "@/components/ShowGrid";
import { DeleteListButton } from "@/components/DeleteListButton";
import { RemoveFromListButton } from "@/components/RemoveFromListButton";
import { ShareListButton } from "@/components/ShareListButton";
import { getListById } from "@/lib/actions/lists";
import { getShow, posterUrl, type TmdbShow } from "@/lib/tmdb";

interface ListPageProps {
  params: Promise<{ id: string }>;
}

const siteUrl = process.env.AUTH_URL ?? "https://bingebox.life";

export async function generateMetadata({ params }: ListPageProps): Promise<Metadata> {
  const { id } = await params;
  const list = await getListById(id);
  if (!list) return { title: "List not found" };

  const title = `${list.title} · BingeBox`;
  const description =
    list.description?.trim() ||
    `${list.items.length} show${list.items.length === 1 ? "" : "s"} on BingeBox — curated by ${list.user.displayName ?? list.user.username}.`;

  let ogImage = `${siteUrl}/logo.png`;
  const firstItem = list.items[0];
  if (firstItem) {
    try {
      const show = await getShow(firstItem.tmdbShowId);
      const poster = posterUrl(show.poster_path, "w500");
      if (poster) ogImage = poster;
    } catch {
      /* keep logo */
    }
  }

  return {
    title,
    description,
    openGraph: {
      title: list.title,
      description,
      url: `${siteUrl}/lists/${id}`,
      siteName: "BingeBox",
      type: "website",
      images: [{ url: ogImage, alt: list.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: list.title,
      description,
      images: [ogImage],
    },
  };
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
      <Link href="/lists" className="text-sm text-[var(--color-subtle)] hover:text-[var(--color-text)]">← All lists</Link>
      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <h1 className="text-2xl font-bold">{list.title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <ShareListButton listTitle={list.title} isPublic={list.isPublic} />
          {isOwner && <DeleteListButton listId={list.id} listTitle={list.title} />}
        </div>
      </div>
      {list.description && <p className="mt-2 max-w-2xl text-[var(--color-muted)]">{list.description}</p>}
      <p className="mt-2 text-sm text-[var(--color-subtle)]">
        {list.items.length} shows · by{" "}
        <Link href={`/user/${list.user.username}`} className="text-[var(--color-link)] hover:text-[var(--color-text)]">
          {list.user.displayName ?? list.user.username}
        </Link>
        {!list.isPublic && " · Private"}
      </p>

      {shows.length === 0 ? (
        <p className="mt-10 text-[var(--color-subtle)]">
          This list is empty.{" "}
          {isOwner && (
            <Link href="/browse" className="text-[var(--color-link)]">Browse shows to add</Link>
          )}
        </p>
      ) : (
        <div className="mt-8">
          {isOwner && (
            <ul className="mb-6 space-y-1 text-sm">
              {list.items.map((item) => (
                <li key={item.id} className="flex items-center justify-between rounded bg-[var(--color-elevated)] px-3 py-2">
                  <span className="text-[var(--color-muted)]">{item.showName}</span>
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
