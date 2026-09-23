"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

export type HeroSlide = {
  id: number;
  name: string;
  overview: string;
  backdropUrl: string | null;
  year: string;
};

const FEATURES = [
  { icon: "▶", title: "Episode diary", desc: "Log every episode from pilot to finale." },
  { icon: "★", title: "Half-star ratings", desc: "Half-star precision — your take, not the crowd's." },
  { icon: "☰", title: "Lists & watchlists", desc: "Curate collections and never lose track." },
];

const INTERVAL_MS = 7000;

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);
  const count = slides.length;

  const goTo = useCallback(
    (index: number, slideDirection?: number) => {
      if (count === 0) return;
      setActive((prev) => {
        const next = ((index % count) + count) % count;
        const dir =
          slideDirection ?? (next === prev ? 1 : next > prev ? 1 : -1);
        setDirection(dir);
        return next;
      });
    },
    [count]
  );

  const next = useCallback(() => goTo(active + 1, 1), [active, goTo]);
  const prev = useCallback(() => goTo(active - 1, -1), [active, goTo]);

  useEffect(() => {
    if (count <= 1 || paused) return;
    const timer = window.setInterval(next, INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [count, paused, next]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev]);

  const current = slides[active];

  return (
    <section
      className={`hero-carousel relative flex min-h-[580px] items-center overflow-hidden md:min-h-[640px]${paused ? " hero-carousel--paused" : ""}`}
      style={{ ["--hero-interval" as string]: `${INTERVAL_MS}ms` }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Trending shows"
    >
      {/* Backdrop slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={`hero-slide-bg ${i === active ? "is-active" : ""}`}
          aria-hidden={i !== active}
        >
          {slide.backdropUrl ? (
            <div className="hero-slide-media">
              <Image
                src={slide.backdropUrl}
                alt=""
                fill
                className="hero-slide-image object-cover object-top saturate-[0.9] contrast-[1.05] [opacity:var(--hero-image-opacity)]"
                priority={i === 0}
                sizes="100vw"
              />
            </div>
          ) : (
            <div className="absolute inset-0 bg-[var(--color-overlay)]" />
          )}
        </div>
      ))}

      <div className="hero-carousel-overlay" />
      <div className="hero-carousel-shimmer" aria-hidden />
      <div className="hero-glow hero-glow-drift -left-20 top-20" />
      <div
        className="hero-glow hero-glow-drift-alt right-0 top-0 opacity-60"
        style={{ background: "radial-gradient(circle, var(--color-violet-glow) 0%, transparent 70%)" }}
      />

      <div className="page-shell relative w-full py-14 md:py-20">
        <p className="section-eyebrow mb-3">Trending this week</p>
        <h1 className="hero-title max-w-2xl text-4xl font-extrabold leading-[1.08] md:text-5xl lg:text-6xl">
          Your life in <span className="text-gradient text-gradient-live">TV</span>
        </h1>

        {current && (
          <div
            key={current.id}
            className={`hero-slide-content mt-8 max-w-xl${direction < 0 ? " hero-slide-content--from-left" : " hero-slide-content--from-right"}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <p className="hero-stagger hero-stagger-1 text-sm font-medium tabular-nums text-[var(--color-subtle)]">
                {current.year}
              </p>
              {count > 1 && (
                <span className="hero-stagger hero-stagger-1 hero-slide-index" aria-hidden>
                  {String(active + 1).padStart(2, "0")}
                  <span className="text-[var(--color-border-strong)]"> / </span>
                  {String(count).padStart(2, "0")}
                </span>
              )}
            </div>
            <h2 className="hero-stagger hero-stagger-2 mt-1 text-2xl font-bold leading-tight text-[var(--color-text)] md:text-3xl">
              {current.name}
            </h2>
            {current.overview && (
              <p className="hero-stagger hero-stagger-3 mt-3 line-clamp-3 text-base leading-relaxed text-[var(--color-muted)]">
                {current.overview}
              </p>
            )}
            <div className="hero-stagger hero-stagger-4 mt-6 flex flex-wrap items-center gap-3">
              <Link href={`/show/${current.id}`} className="btn-primary px-6 py-2.5">
                View show
              </Link>
              <Link href="/browse?sort=trending" className="btn-secondary px-6 py-2.5">
                Browse trending
              </Link>
              <Link href="/register" className="text-sm font-medium text-[var(--color-muted)] hover:text-[var(--color-text)]">
                Join free →
              </Link>
            </div>
          </div>
        )}

        {count > 1 && (
          <div className="mt-10 flex items-center gap-4">
            <div className="flex items-center gap-2" role="tablist" aria-label="Carousel slides">
              {slides.map((slide, i) => (
                <button
                  key={i === active ? `dot-active-${active}` : slide.id}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-label={`Go to ${slide.name}`}
                  onClick={() => goTo(i, i > active ? 1 : i < active ? -1 : 1)}
                  className={`hero-dot ${i === active ? "is-active" : ""}`}
                />
              ))}
            </div>
            <div className="flex gap-1">
              <button type="button" onClick={prev} className="hero-arrow" aria-label="Previous slide">
                ‹
              </button>
              <button type="button" onClick={next} className="hero-arrow" aria-label="Next slide">
                ›
              </button>
            </div>
            {paused && count > 1 && (
              <span className="hidden text-xs text-[var(--color-subtle)] sm:inline">Paused</span>
            )}
          </div>
        )}

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="hero-feature-card glass-card p-5" style={{ animationDelay: `${0.15 * i}s` }}>
              <div className="feature-icon">{f.icon}</div>
              <h3 className="mt-3 text-sm font-semibold text-[var(--color-text)]">{f.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[var(--color-subtle)]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
