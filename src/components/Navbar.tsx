"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Laptop } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/features", label: "Features" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "How It Works" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/95 backdrop-blur-md border-b-2 border-cimaa-bg-tan shadow-sm"
          : "bg-white border-b-2 border-cimaa-bg-tan"
      )}
    >
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-cimaa-yellow shadow-sm">
              <Laptop className="w-5 h-5 text-cimaa-text" strokeWidth={2.25} />
            </span>
            <span className="text-xl font-bold text-cimaa-text">
              Cimaa Sites
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-cimaa-text-muted hover:text-cimaa-text transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/admin"
              className="text-sm font-medium text-cimaa-text-muted hover:text-cimaa-text transition-colors"
            >
              Login
            </Link>
            <Button
              href="/contact"
              variant="primary"
              size="sm"
              className="shadow-md"
            >
              Get a Quote
            </Button>
          </div>

          <button
            className="md:hidden p-2 text-cimaa-text"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden pb-4 border-t border-cimaa-border mt-2">
            <div className="flex flex-col gap-1 pt-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-cimaa-text-muted hover:text-cimaa-text hover:bg-cimaa-bg-surface rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/admin"
                className="px-4 py-2 text-sm font-medium text-cimaa-text-muted hover:text-cimaa-text hover:bg-cimaa-bg-surface rounded-lg transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                Login
              </Link>
              <div className="px-4 pt-2">
                <Button
                  href="/contact"
                  variant="primary"
                  size="md"
                  className="w-full"
                >
                  Get a Quote
                </Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </nav>
  );
}
