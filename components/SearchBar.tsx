"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, KeyboardEvent, useCallback, useEffect, useRef, useState } from "react";

type SearchResult = {
  id: number;
  name: string;
  year: string | null;
  posterUrl: string | null;
};

interface SearchBarProps {
  className?: string;
  /** Full-width fixed dropdown under header on small screens */
  mobileOverlay?: boolean;
}

export function SearchBar({ className = "", mobileOverlay = false }: SearchBarProps) {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const fetchResults = useCallback(async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search/shows?q=${encodeURIComponent(term)}`);
      const data = (await res.json()) as { results: SearchResult[] };
      setResults(data.results ?? []);
      setOpen(true);
      setActiveIndex(-1);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void fetchResults(query.trim());
    }, 280);
    return () => window.clearTimeout(timer);
  }, [query, fetchResults]);

  useEffect(() => {
    function onPointerOutside(e: MouseEvent | TouchEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onPointerOutside);
    document.addEventListener("touchstart", onPointerOutside, { passive: true });
    return () => {
      document.removeEventListener("mousedown", onPointerOutside);
      document.removeEventListener("touchstart", onPointerOutside);
    };
  }, []);

  function goToBrowse(term: string) {
    setOpen(false);
    router.push(`/browse?q=${encodeURIComponent(term)}`);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    if (activeIndex >= 0 && results[activeIndex]) {
      setOpen(false);
      router.push(`/show/${results[activeIndex].id}`);
      return;
    }
    goToBrowse(term);
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (!open || results.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? results.length - 1 : i - 1));
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
      inputRef.current?.blur();
    }
  }

  const showDropdown = open && query.trim().length >= 2;

  return (
    <div
      ref={wrapperRef}
      className={`search-bar relative ${mobileOverlay ? "search-bar--mobile" : ""} ${className}`.trim()}
    >
      <form onSubmit={onSubmit} role="search">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 fill-[var(--color-subtle)]"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" />
        </svg>
        <input
          ref={inputRef}
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.trim().length >= 2 && results.length > 0 && setOpen(true)}
          onKeyDown={onKeyDown}
          placeholder="Search shows…"
          className="glass-input search-input w-full py-2.5 pl-9 pr-3"
          role="combobox"
          aria-expanded={showDropdown}
          aria-autocomplete="list"
          aria-controls="search-suggestions"
        />
      </form>

      {showDropdown && (
        <ul
          id="search-suggestions"
          role="listbox"
          className={`search-suggestions ${mobileOverlay ? "search-suggestions--mobile" : ""}`}
        >
          {loading && results.length === 0 && (
            <li className="search-suggestion-muted px-3 py-3 text-sm">Searching…</li>
          )}
          {!loading && results.length === 0 && (
            <li className="search-suggestion-muted px-3 py-3 text-sm">No shows found</li>
          )}
          {results.map((show, i) => (
            <li key={show.id} role="option" aria-selected={i === activeIndex}>
              <Link
                href={`/show/${show.id}`}
                className={`search-suggestion ${i === activeIndex ? "is-active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <span className="search-suggestion-poster">
                  {show.posterUrl ? (
                    <Image src={show.posterUrl} alt="" width={36} height={54} className="object-cover" />
                  ) : (
                    <span className="flex h-full items-center justify-center text-[10px] text-[var(--color-subtle)]">TV</span>
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium text-[var(--color-text)]">{show.name}</span>
                  {show.year && (
                    <span className="text-xs text-[var(--color-subtle)]">{show.year}</span>
                  )}
                </span>
              </Link>
            </li>
          ))}
          {results.length > 0 && (
            <li>
              <button
                type="button"
                className="search-suggestion-footer w-full min-h-[44px] text-left text-sm"
                onClick={() => goToBrowse(query.trim())}
              >
                See all results for &ldquo;{query.trim()}&rdquo; →
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
