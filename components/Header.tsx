"use client";

import Link from "next/link";
import { BrandLogo } from "./BrandLogo";
import { HeaderAuth } from "./HeaderAuth";
import { MobileNav } from "./MobileNav";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";

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

        <SearchBar />

        <MobileNav />
        <ThemeToggle />
        <HeaderAuth />
      </div>
    </header>
  );
}
