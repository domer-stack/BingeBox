import { NextResponse } from "next/server";
import { posterUrl, searchShows } from "@/lib/tmdb";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim();
  if (!q || q.length < 2) {
    return NextResponse.json({ results: [] });
  }

  try {
    const data = await searchShows(q, 1);
    return NextResponse.json({
      results: data.results.slice(0, 8).map((show) => ({
        id: show.id,
        name: show.name,
        year: show.first_air_date ? show.first_air_date.slice(0, 4) : null,
        posterUrl: posterUrl(show.poster_path, "w92"),
      })),
    });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
