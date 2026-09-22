import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 mt-20 border-t border-[var(--color-border)]">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-8 px-5 py-12">
        <div className="max-w-sm">
          <p className="font-[family-name:var(--font-display)] text-lg font-bold">
            <span className="text-gradient">BingeBox</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-muted)]">
            The social network for TV lovers. Track, rate, list, and discover your next binge.
          </p>
          <p className="mt-4 text-xs text-[var(--color-subtle)]">
            TV data from{" "}
            <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer">
              TMDb
            </a>
            . Not endorsed by TMDb.
          </p>
        </div>
        <div className="flex gap-8 text-sm">
          <div className="flex flex-col gap-2">
            <span className="section-eyebrow">Explore</span>
            <Link href="/browse" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">Browse</Link>
            <Link href="/lists" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">Lists</Link>
            <Link href="/members" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">Members</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="section-eyebrow">You</span>
            <Link href="/diary" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">Diary</Link>
            <Link href="/profile" className="text-[var(--color-muted)] hover:text-[var(--color-text)]">Profile</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
