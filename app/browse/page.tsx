export const dynamic = "force-dynamic";

import Link from "next/link";
import { ShowGrid } from "@/components/ShowGrid";
import {
  discoverShows,
  getGenres,
  getPopularShows,
  getTopRatedShows,
  getTrendingShows,
  searchShows,
} from "@/lib/tmdb";

interface BrowsePageProps {
  searchParams: Promise<{
    q?: string;
    sort?: string;
    genre?: string;
    page?: string;
  }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const query = params.q?.trim();
  const sort = params.sort ?? "popular";
  const genre = params.genre;

  const genres = await getGenres();

  let shows;
  let title = "Popular Shows";

  if (query) {
    shows = await searchShows(query, page);
    title = `Results for "${query}"`;
  } else if (sort === "trending") {
    shows = await getTrendingShows("week");
    title = "Trending This Week";
  } else if (sort === "top_rated") {
    shows = await getTopRatedShows(page);
    title = "Top Rated";
  } else if (genre) {
    shows = await discoverShows({ page, with_genres: genre, sort_by: "popularity.desc" });
    const genreName = genres.genres.find((g) => String(g.id) === genre)?.name ?? "Genre";
    title = genreName;
  } else {
    shows = await getPopularShows(page);
    title = "Popular Shows";
  }

  const sortOptions = [
    { value: "popular", label: "Popular" },
    { value: "trending", label: "Trending" },
    { value: "top_rated", label: "Top Rated" },
  ];

  return (
    <div className="page-shell">
      <p className="section-eyebrow">Discover</p>
      <h1 className="mt-1 text-3xl font-bold">{title}</h1>
      {shows.total_results > 0 && (
        <p className="mt-1 text-sm text-[var(--color-subtle)]">{shows.total_results.toLocaleString()} shows</p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {sortOptions.map((opt) => (
          <Link
            key={opt.value}
            href={`/browse?sort=${opt.value}`}
            className={`chip ${sort === opt.value && !query && !genre ? "chip-active" : ""}`}
          >
            {opt.label}
          </Link>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {genres.genres.slice(0, 12).map((g) => (
          <Link
            key={g.id}
            href={`/browse?genre=${g.id}`}
            className={`chip ${genre === String(g.id) ? "chip-active" : ""}`}
          >
            {g.name}
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <ShowGrid shows={shows.results} />
      </div>

      {!query && shows.total_pages > 1 && (
        <div className="mt-10 flex justify-center gap-3">
          {page > 1 && (
            <Link
              href={`/browse?${new URLSearchParams({ ...params, page: String(page - 1) } as Record<string, string>).toString()}`}
              className="btn-secondary px-4 py-2 text-sm"
            >
              ← Previous
            </Link>
          )}
          {page < shows.total_pages && (
            <Link
              href={`/browse?${new URLSearchParams({ ...params, page: String(page + 1) } as Record<string, string>).toString()}`}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
