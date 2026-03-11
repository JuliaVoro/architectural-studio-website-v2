"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/systems", label: "Stories" },
  { href: "/approach", label: "Approach" },
  { href: "/studio", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // On the homepage, navigation is transparent until scrolled
  const isTransparent = isHome && !scrolled && !mobileOpen;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isTransparent
          ? "bg-transparent"
          : "bg-background/95 backdrop-blur-sm border-b border-border/50"
      )}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-12">
        <Link
          href="/"
          className="flex items-center"
        >
          <img
            src="/images/logo.svg"
            alt="PSHKRV"
            className={cn(
              "h-8 w-auto transition-colors duration-500",
              isTransparent ? "brightness-0 invert" : "brightness-0"
            )}
          />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={cn(
                  "text-[11px] font-medium uppercase tracking-[0.15em] transition-colors duration-300",
                  isTransparent
                    ? pathname === link.href
                      ? "text-cream"
                      : "text-cream/60 hover:text-cream"
                    : pathname === link.href
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
              "block h-px w-6 transition-all duration-300",
              isTransparent ? "bg-cream" : "bg-foreground",
              mobileOpen && "translate-y-[3.5px] rotate-45"
            )}
          />
          <span
            className={cn(
              "block h-px w-6 transition-all duration-300",
              isTransparent ? "bg-cream" : "bg-foreground",
              mobileOpen && "-translate-y-[3.5px] -rotate-45"
            )}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-500 ease-in-out md:hidden",
          isTransparent ? "bg-charcoal/90 backdrop-blur-sm" : "bg-background",
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
                  isTransparent
                    ? pathname === link.href
                      ? "text-cream"
                      : "text-cream/60 hover:text-cream"
                    : pathname === link.href
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
