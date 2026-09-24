import type { UserStats } from "@/lib/actions/stats";

interface ProfileStatsProps {
  stats: UserStats;
}

export function ProfileStats({ stats }: ProfileStatsProps) {
  const maxDay = Math.max(1, ...stats.last28Days.map((d) => d.count));

  return (
    <section className="mt-10">
      <h2 className="section-eyebrow mb-4">Your stats</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-card p-4">
          <p className="text-2xl font-bold">{stats.totalEpisodes}</p>
          <p className="text-xs uppercase tracking-wider text-[var(--color-subtle)]">Episodes logged</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-2xl font-bold">{stats.uniqueShows}</p>
          <p className="text-xs uppercase tracking-wider text-[var(--color-subtle)]">Shows</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-2xl font-bold">{stats.currentStreak}</p>
          <p className="text-xs uppercase tracking-wider text-[var(--color-subtle)]">Day streak</p>
        </div>
        <div className="glass-card p-4">
          <p className="text-2xl font-bold">{stats.averageRating ?? "—"}</p>
          <p className="text-xs uppercase tracking-wider text-[var(--color-subtle)]">Avg rating</p>
        </div>
      </div>

      <div className="glass-card mt-4 p-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-subtle)]">Last 28 days</p>
        <div className="mt-4 flex h-24 items-end gap-1">
          {stats.last28Days.map((d) => (
            <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full max-w-[10px] rounded-t bg-[var(--color-accent)] opacity-90"
                style={{ height: `${Math.max(4, (d.count / maxDay) * 100)}%` }}
                title={`${d.date}: ${d.count}`}
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-[var(--color-subtle)]">
          Longest streak: {stats.longestStreak} day{stats.longestStreak === 1 ? "" : "s"}
        </p>
      </div>

      {stats.topGenres.length > 0 && (
        <div className="glass-card mt-4 p-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-subtle)]">Top genres</p>
          <ul className="mt-3 space-y-2">
            {stats.topGenres.map((g) => {
              const max = stats.topGenres[0]?.count ?? 1;
              return (
                <li key={g.name}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[var(--color-muted)]">{g.name}</span>
                    <span className="tabular-nums text-[var(--color-subtle)]">{g.count}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--color-overlay)]">
                    <div
                      className="h-full rounded-full bg-[var(--color-link)]"
                      style={{ width: `${(g.count / max) * 100}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
