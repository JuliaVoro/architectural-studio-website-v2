"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/systems", label: "Systems" },
  { href: "/approach", label: "Approach" },
  { href: "/studio", label: "Studio" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-12">
        <Link href="/" className="font-serif text-lg tracking-tight text-foreground">
          SAS
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-300",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile hamburger */}
        <button
          className="flex flex-col gap-1.5 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <span
            className={cn(
              "block h-px w-6 bg-foreground transition-transform duration-300",
              mobileOpen && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-px w-6 bg-foreground transition-transform duration-300",
              mobileOpen && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden bg-background transition-all duration-500 ease-in-out md:hidden",
          mobileOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <ul className="flex flex-col gap-4 px-6 pb-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-300",
                  pathname === link.href
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
