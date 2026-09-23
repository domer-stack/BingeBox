import { type TmdbShow } from "@/lib/tmdb";
import { ShowPoster } from "./ShowPoster";

interface ShowGridProps {
  shows: TmdbShow[];
  compact?: boolean;
}

export function ShowGrid({ shows, compact = false }: ShowGridProps) {
  if (shows.length === 0) {
    return (
      <div className="py-16 text-center text-[var(--color-subtle)]">
        <p className="text-lg text-[var(--color-muted)]">No shows found</p>
        <p className="mt-1 text-sm">Try a different search or filter.</p>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-3 ${
        compact
          ? "grid-cols-[repeat(auto-fill,minmax(100px,1fr))]"
          : "grid-cols-[repeat(auto-fill,minmax(140px,1fr))]"
      }`}
    >
      {shows.map((show) => (
        <ShowPoster key={show.id} show={show} compact={compact} />
      ))}
    </div>
  );
}
