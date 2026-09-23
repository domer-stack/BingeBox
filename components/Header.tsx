"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { HeaderAuth } from "./HeaderAuth";
import { MobileNav } from "./MobileNav";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Shows" },
  { href: "/lists", label: "Lists" },
  { href: "/members", label: "Members" },
  { href: "/diary", label: "Diary" },
  { href: "/profile", label: "Profile" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSearch(e: FormEvent) {
    e.preventDefault();
    if (query.trim()) router.push(`/browse?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <header className="glass sticky top-0 z-50 border-b border-[var(--color-border)]">
      <div className="relative z-10 mx-auto flex h-[3.75rem] max-w-6xl items-center gap-4 px-5 lg:gap-6">
        <BrandLogo size="sm" />

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`nav-pill ${pathname === href ? "nav-pill-active" : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <form onSubmit={onSearch} className="relative ml-auto max-w-[220px] flex-1 lg:max-w-xs">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 fill-[var(--color-subtle)]"
            viewBox="0 0 24 24"
          >
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0016 9.5 6.5 6.5 0 109.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C8.01 14 6 11.99 6 9.5S8.01 5 10.5 5 15 7.01 15 9.5 12.99 14 10.5 14z" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search shows…"
            className="glass-input w-full py-2 pl-9 pr-3 text-sm"
          />
        </form>

        <MobileNav />
        <ThemeToggle />
        <HeaderAuth />
      </div>
    </header>
  );
}
