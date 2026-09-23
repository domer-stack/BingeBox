import Image from "next/image";
import Link from "next/link";
import { StarRating } from "./StarRating";
import { UserAvatar } from "./UserAvatar";
import { LikeButton } from "./LikeButton";
import { posterUrl, getShow } from "@/lib/tmdb";

type ActivityEntry = {
  id: string;
  tmdbShowId: number;
  showName: string;
  seasonNumber: number;
  episodeNumber: number;
  episodeName: string | null;
  rating: number | null;
  review: string | null;
  watchedAt: Date;
  user: { username: string; displayName: string | null; avatarId: string };
  _count: { likes: number };
  likes: { id: string }[];
};

export async function ActivityFeed({ entries }: { entries: ActivityEntry[] }) {
  if (entries.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-[var(--color-muted)]">
        Follow members to see their activity here.{" "}
        <Link href="/members" className="font-medium text-[var(--color-accent-soft)] hover:text-[var(--color-text)]">
          Browse members →
        </Link>
      </p>
    );
  }

  const posterCache = new Map<number, string | null>();
  for (const entry of entries) {
    if (!posterCache.has(entry.tmdbShowId)) {
      try {
        const show = await getShow(entry.tmdbShowId);
        posterCache.set(entry.tmdbShowId, posterUrl(show.poster_path, "w154"));
      } catch {
        posterCache.set(entry.tmdbShowId, null);
      }
    }
  }

  return (
    <div>
      {entries.map((entry) => {
        const poster = posterCache.get(entry.tmdbShowId);
        const displayName = entry.user.displayName ?? entry.user.username;
        return (
          <article key={entry.id} className="feed-row grid grid-cols-[48px_56px_1fr] gap-4 px-1">
            <Link href={`/user/${entry.user.username}`}>
              <UserAvatar avatarId={entry.user.avatarId} alt={displayName} size="sm" className="!h-11 !w-11" />
            </Link>
            <Link
              href={`/show/${entry.tmdbShowId}`}
              className="poster-frame !aspect-[2/3] !shadow-none"
            >
              {poster && <Image src={poster} alt="" fill className="object-cover" sizes="56px" />}
            </Link>
            <div className="min-w-0">
              <p className="text-sm leading-relaxed">
                <Link href={`/user/${entry.user.username}`} className="font-semibold text-[var(--color-text)] hover:text-[var(--color-accent-soft)]">
                  {displayName}
                </Link>
                <span className="text-[var(--color-subtle)]"> watched </span>
                <Link
                  href={`/show/${entry.tmdbShowId}/season/${entry.seasonNumber}/episode/${entry.episodeNumber}`}
                  className="font-semibold hover:text-[var(--color-text)]"
                >
                  {entry.showName}
                </Link>
                <span className="text-[var(--color-subtle)]">
                  {" "}· S{entry.seasonNumber}E{entry.episodeNumber}
                </span>
              </p>
              {entry.rating && <div className="mt-1.5"><StarRating rating={entry.rating} size="sm" /></div>}
              {entry.review && <p className="mt-2 line-clamp-3 text-sm text-[var(--color-muted)]">{entry.review}</p>}
              <div className="mt-2.5 flex items-center gap-4">
                <LikeButton
                  diaryEntryId={entry.id}
                  initialLikeCount={entry._count.likes}
                  initialLiked={entry.likes.length > 0}
                />
                <span className="text-xs tabular-nums text-[var(--color-subtle)]">
                  {new Date(entry.watchedAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
