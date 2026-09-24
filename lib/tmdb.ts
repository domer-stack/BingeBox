const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

export type ImageSize = "w92" | "w154" | "w185" | "w300" | "w342" | "w500" | "w780" | "w1280" | "original";

export interface TmdbShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids?: number[];
  origin_country?: string[];
}

export interface TmdbShowDetail extends TmdbShow {
  genres: { id: number; name: string }[];
  number_of_seasons: number;
  number_of_episodes: number;
  status: string;
  tagline: string;
  created_by: { id: number; name: string }[];
  networks: { id: number; name: string }[];
  seasons: TmdbSeasonSummary[];
  last_air_date: string;
  in_production: boolean;
}

export interface TmdbSeasonSummary {
  id: number;
  name: string;
  season_number: number;
  episode_count: number;
  poster_path: string | null;
  air_date: string;
}

export interface TmdbEpisode {
  id: number;
  name: string;
  overview: string;
  season_number: number;
  episode_number: number;
  air_date: string;
  still_path: string | null;
  runtime: number | null;
  vote_average: number;
}

export interface TmdbSeasonDetail extends TmdbSeasonSummary {
  episodes: TmdbEpisode[];
  overview: string;
}

export interface TmdbPaginated<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface WatchProvider {
  provider_id: number;
  provider_name: string;
  logo_path: string;
}

function getAuthHeaders(): HeadersInit {
  const headers: HeadersInit = { Accept: "application/json" };
  const token = process.env.TMDB_ACCESS_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

function getApiKey(): string {
  const key = process.env.TMDB_API_KEY;
  if (!key) throw new Error("TMDB_API_KEY is not configured in .env.local");
  return key;
}

export async function tmdbFetch<T>(
  path: string,
  params: Record<string, string | number | boolean | undefined> = {},
  revalidate = 3600
): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", getApiKey());
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) url.searchParams.set(key, String(value));
  });

  const res = await fetch(url.toString(), {
    headers: getAuthHeaders(),
    next: { revalidate },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`TMDB ${path} failed (${res.status}): ${body}`);
  }

  return res.json() as Promise<T>;
}

function normalizeTmdbImagePath(path: string): string {
  const trimmed = path.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function posterUrl(path: string | null | undefined, size: ImageSize = "w500"): string | null {
  if (!path) return null;
  const normalized = normalizeTmdbImagePath(path);
  if (normalized.startsWith("http")) return normalized;
  return `${IMAGE_BASE}/${size}${normalized}`;
}

export function backdropUrl(path: string | null | undefined, size: ImageSize = "w1280"): string | null {
  if (!path) return null;
  const normalized = normalizeTmdbImagePath(path);
  if (normalized.startsWith("http")) return normalized;
  return `${IMAGE_BASE}/${size}${normalized}`;
}

export function stillUrl(path: string | null | undefined, size: ImageSize = "w300"): string | null {
  if (!path) return null;
  const normalized = normalizeTmdbImagePath(path);
  if (normalized.startsWith("http")) return normalized;
  return `${IMAGE_BASE}/${size}${normalized}`;
}

export function showYearRange(firstAirDate: string, lastAirDate?: string, inProduction?: boolean): string {
  const start = firstAirDate ? firstAirDate.slice(0, 4) : "—";
  if (inProduction || !lastAirDate) return `${start}–`;
  const end = lastAirDate.slice(0, 4);
  return start === end ? start : `${start}–${end}`;
}

export function toStarRating(voteAverage: number): number {
  return Math.round((voteAverage / 2) * 2) / 2;
}

export async function getTrendingShows(timeWindow: "day" | "week" = "week") {
  return tmdbFetch<TmdbPaginated<TmdbShow>>(`/trending/tv/${timeWindow}`);
}

export async function getPopularShows(page = 1) {
  return tmdbFetch<TmdbPaginated<TmdbShow>>("/tv/popular", { page });
}

export async function getTopRatedShows(page = 1) {
  return tmdbFetch<TmdbPaginated<TmdbShow>>("/tv/top_rated", { page });
}

export async function searchShows(query: string, page = 1) {
  return tmdbFetch<TmdbPaginated<TmdbShow>>("/search/tv", { query, page, include_adult: false });
}

export async function discoverShows(params: {
  page?: number;
  sort_by?: string;
  with_genres?: string;
  first_air_date_year?: number;
}) {
  return tmdbFetch<TmdbPaginated<TmdbShow>>("/discover/tv", {
    page: params.page ?? 1,
    sort_by: params.sort_by ?? "popularity.desc",
    ...(params.with_genres && { with_genres: params.with_genres }),
    ...(params.first_air_date_year && { first_air_date_year: params.first_air_date_year }),
  });
}

export async function getShow(id: number) {
  return tmdbFetch<TmdbShowDetail>(`/tv/${id}`, {
    append_to_response: "credits,watch/providers,similar",
  });
}

export async function getSimilarShows(id: number, page = 1) {
  return tmdbFetch<TmdbPaginated<TmdbShow>>(`/tv/${id}/similar`, { page });
}

export async function getSeason(showId: number, seasonNumber: number) {
  return tmdbFetch<TmdbSeasonDetail>(`/tv/${showId}/season/${seasonNumber}`);
}

export async function getEpisode(showId: number, seasonNumber: number, episodeNumber: number) {
  return tmdbFetch<TmdbEpisode>(`/tv/${showId}/season/${seasonNumber}/episode/${episodeNumber}`);
}

export async function getGenres() {
  return tmdbFetch<{ genres: { id: number; name: string }[] }>("/genre/tv/list");
}

export function parseWatchProviders(
  data: Record<string, unknown> | undefined,
  region = process.env.TMDB_DEFAULT_REGION ?? "US"
): WatchProvider[] {
  if (!data || typeof data !== "object") return [];
  const regionData = (data as { results?: Record<string, { flatrate?: WatchProvider[] }> }).results?.[region];
  return regionData?.flatrate ?? [];
}
