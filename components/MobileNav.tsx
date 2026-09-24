"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/discover", label: "Discover" },
  { href: "/browse", label: "Shows" },
  { href: "/lists", label: "Lists" },
  { href: "/members", label: "Members" },
  { href: "/diary", label: "Diary" },
  { href: "/profile", label: "Profile" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="touch-target flex items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--chip-bg)] text-[var(--color-muted)]"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" />
          ) : (
            <path d="M4 7h16M4 12h16M4 17h16" />
          )}
        </svg>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="mobile-nav-backdrop fixed inset-0 z-[90] bg-[var(--overlay-scrim)] backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav
            className="mobile-nav-panel fixed left-0 right-0 z-[95] overflow-y-auto border-b border-[var(--color-border)] bg-[var(--glass-bg)] p-3 backdrop-blur-xl"
            aria-label="Mobile"
          >
            <ul className="space-y-1">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`flex min-h-[48px] items-center rounded-lg px-4 text-base font-medium transition ${
                      pathname === href
                        ? "bg-[var(--nav-active-bg)] text-[var(--color-accent-soft)]"
                        : "text-[var(--color-muted)] active:bg-[var(--surface-hover-strong)]"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
