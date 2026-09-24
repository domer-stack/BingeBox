"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { BrandLogo } from "./BrandLogo";
import { HeaderAuth } from "./HeaderAuth";
import { MobileNav } from "./MobileNav";
import { SearchBar } from "./SearchBar";
import { ThemeToggle } from "./ThemeToggle";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/browse", label: "Shows" },
  { href: "/lists", label: "Lists" },
  { href: "/members", label: "Members" },
  { href: "/diary", label: "Diary" },
  { href: "/profile", label: "Profile" },
];

export function Header() {
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty("--site-header-height", `${el.offsetHeight}px`);
    };

    syncHeaderHeight();
    const observer = new ResizeObserver(syncHeaderHeight);
    observer.observe(el);
    window.addEventListener("resize", syncHeaderHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderHeight);
    };
  }, []);

  return (
    <header
      ref={headerRef}
      className="site-header glass sticky top-0 z-50 overflow-visible border-b border-[var(--color-border)]"
    >
      <div className="site-header-inner relative z-10 mx-auto max-w-6xl overflow-visible">
        <div className="site-header-toolbar flex h-14 items-center gap-2 px-4 md:h-[3.75rem] md:px-5">
          <BrandLogo size="sm" />

          <nav className="header-nav hidden min-w-0 md:flex md:items-center md:gap-0.5 lg:gap-1">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`nav-pill shrink-0 ${pathname === href ? "nav-pill-active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <SearchBar className="header-search hidden md:block md:min-w-0 md:w-full" />

          <div className="header-actions ml-auto flex shrink-0 items-center gap-1.5 md:ml-0">
            <ThemeToggle />
            <HeaderAuth />
            <MobileNav />
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] px-4 pb-3 pt-2 md:hidden">
          <SearchBar className="w-full max-w-none" variant="mobile" />
        </div>
      </div>
    </header>
  );
}
