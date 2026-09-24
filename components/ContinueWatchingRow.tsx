import Link from "next/link";
import Image from "next/image";
import type { ContinueWatchingItem } from "@/lib/actions/continue-watching";
import { posterUrl } from "@/lib/tmdb";

interface ContinueWatchingRowProps {
  items: ContinueWatchingItem[];
}

export function ContinueWatchingRow({ items }: ContinueWatchingRowProps) {
  if (items.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {items.map((item) => {
        const src = posterUrl(item.posterPath, "w342");
        return (
          <article
            key={item.tmdbShowId}
            className="glass-card w-[min(100%,240px)] shrink-0 p-4"
          >
            <Link href={`/show/${item.tmdbShowId}`} className="flex gap-3">
              <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg bg-[var(--color-overlay)]">
                {src ? (
                  <Image src={src} alt="" fill className="object-cover" sizes="56px" />
                ) : (
                  <span className="flex h-full items-center justify-center text-[10px] text-[var(--color-subtle)]">TV</span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-text)]">
                  {item.showName}
                </h3>
                <p className="mt-1 text-xs text-[var(--color-subtle)]">
                  {item.watchedCount}/{item.totalEpisodes} episodes
                </p>
              </div>
            </Link>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--color-overlay)]">
              <div
                className="h-full rounded-full bg-[var(--color-accent)] transition-all"
                style={{ width: `${item.progressPercent}%` }}
              />
            </div>
            <Link
              href={item.nextHref}
              className="mt-3 block text-xs font-medium text-[var(--color-link)] hover:text-[var(--color-text)]"
            >
              Continue · {item.nextLabel}
            </Link>
          </article>
        );
      })}
    </div>
  );
}
