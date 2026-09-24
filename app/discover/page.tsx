export const dynamic = "force-dynamic";

import { SectionHeader } from "@/components/SectionHeader";
import { ShowGrid } from "@/components/ShowGrid";
import { getDiscoverForYou } from "@/lib/actions/discover";
import Link from "next/link";

export default async function DiscoverPage() {
  const shows = await getDiscoverForYou(24);

  return (
    <div className="page-shell py-10">
      <p className="section-eyebrow">Discover</p>
      <h1 className="text-2xl font-bold">For you</h1>
      <p className="mt-2 max-w-xl text-sm text-[var(--color-muted)]">
        Recommendations based on what you&apos;ve logged and what&apos;s similar on TMDb.{" "}
        <Link href="/browse" className="text-[var(--color-link)] hover:text-[var(--color-text)]">
          Browse all shows
        </Link>
      </p>

      {shows.length === 0 ? (
        <p className="mt-10 text-sm text-[var(--color-subtle)]">
          Log a few episodes or{" "}
          <Link href="/login" className="text-[var(--color-link)]">sign in</Link> to personalize this feed.
        </p>
      ) : (
        <div className="mt-8">
          <SectionHeader title="Picked for your taste" />
          <ShowGrid shows={shows} />
        </div>
      )}
    </div>
  );
}
