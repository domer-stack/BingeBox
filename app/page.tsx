export const dynamic = "force-dynamic";

import { ActivityFeed } from "@/components/ActivityFeed";
import { ContinueWatchingRow } from "@/components/ContinueWatchingRow";
import { HeroCarousel, type HeroSlide } from "@/components/HeroCarousel";
import { SectionHeader } from "@/components/SectionHeader";
import { ShowGrid } from "@/components/ShowGrid";
import { getContinueWatching } from "@/lib/actions/continue-watching";
import { getDiscoverForYou } from "@/lib/actions/discover";
import { getActivityFeed } from "@/lib/actions/social";
import { getPopularShows, getTrendingShows, posterUrl, type TmdbShow } from "@/lib/tmdb";

function toHeroSlide(show: TmdbShow): HeroSlide {
  const backdropUrl = posterUrl(show.backdrop_path ?? show.poster_path, "original");
  const year = show.first_air_date ? show.first_air_date.slice(0, 4) : "—";
  return {
    id: show.id,
    name: show.name,
    overview: show.overview,
    backdropUrl,
    year,
  };
}

export default async function HomePage() {
  const [trending, popular, activity, continueWatching, forYou] = await Promise.all([
    getTrendingShows("week"),
    getPopularShows(1),
    getActivityFeed(),
    getContinueWatching(8),
    getDiscoverForYou(12),
  ]);

  const heroSlides = trending.results
    .filter((s) => s.backdrop_path || s.poster_path)
    .slice(0, 6)
    .map(toHeroSlide);

  return (
    <>
      <HeroCarousel slides={heroSlides} />

      {continueWatching.length > 0 && (
        <section className="page-shell py-4">
          <SectionHeader title="Continue watching" href="/diary" />
          <ContinueWatchingRow items={continueWatching} />
        </section>
      )}

      {forYou.length > 0 && (
        <section className="page-shell py-4">
          <SectionHeader title="For you" href="/discover" />
          <ShowGrid shows={forYou} />
        </section>
      )}

      <section className="page-shell py-4">
        <SectionHeader title="Activity from people you follow" />
        <div className="glass-card px-5 py-2">
          <ActivityFeed entries={activity} />
        </div>
      </section>

      <section className="page-shell py-4">
        <SectionHeader title="Trending this week" href="/browse?sort=trending" />
        <ShowGrid shows={trending.results.slice(0, 12)} />
      </section>

      <section className="page-shell pb-16">
        <SectionHeader title="Popular shows" href="/browse?sort=popular" />
        <ShowGrid shows={popular.results.slice(0, 12)} />
      </section>
    </>
  );
}
