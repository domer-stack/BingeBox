import Image from "next/image";
import Link from "next/link";
import { posterUrl, type TmdbShow } from "@/lib/tmdb";

interface ShowPosterProps {
  show: TmdbShow;
  compact?: boolean;
}

export function ShowPoster({ show, compact = false }: ShowPosterProps) {
  const src = posterUrl(show.poster_path, compact ? "w342" : "w500");
  const year = show.first_air_date ? show.first_air_date.slice(0, 4) : "—";

  return (
    <Link href={`/show/${show.id}`} className="group block">
      <div className="poster-frame">
        {src ? (
          <Image
            src={src}
            alt={show.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            sizes={compact ? "140px" : "200px"}
          />
        ) : (
          <div className="flex h-full items-center justify-center p-2 text-center text-xs text-[var(--color-subtle)]">
            {show.name}
          </div>
        )}
        <div className="poster-hover-scrim" aria-hidden />
      </div>
      <p className="mt-2.5 line-clamp-2 text-sm font-semibold leading-snug text-[var(--color-muted)] transition group-hover:text-[var(--color-text)]">
        {show.name}
      </p>
      <p className="mt-0.5 text-xs tabular-nums text-[var(--color-subtle)]">{year}</p>
    </Link>
  );
}
