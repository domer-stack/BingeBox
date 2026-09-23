"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV = [
  { href: "/", label: "Home" },
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
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--color-border)] bg-[var(--chip-bg)] text-[var(--color-muted)]"
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <nav className="fixed left-0 right-0 top-[3.75rem] z-50 border-b border-[var(--color-border)] bg-[var(--glass-bg)] p-4 backdrop-blur-xl">
            <ul className="space-y-1">
              {NAV.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={`block rounded-lg px-4 py-3 text-sm font-medium transition ${
                      pathname === href
                        ? "bg-[var(--nav-active-bg)] text-[var(--color-accent-soft)]"
                        : "text-[var(--color-muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--color-text)]"
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
