"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    // Real pages, not anchors. Anchor-only navigation left every page on this site
    // with nothing linking to it but the sitemap.
    // Aged care, Funding and Home visits came out on 23 August: all three are articles
    // people read once, not places they navigate to, and a six-item nav on a
    // four-page-deep site buries the two that matter. They are still linked from the
    // pages that lead to them, from /fees, and from the sitemap.
    { href: "/fees", label: "Fees" },
    { href: "/areas", label: "Areas visited" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Tweed Heads Podiatry, home">
            {/* Inline rather than an <img> so the mark inherits currentColor if the
                header is ever reversed, and costs no extra request. */}
            <Image
              src="/logo.svg"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0"
              priority
            />
            <span className="text-lg sm:text-xl font-semibold text-[#1e3a5f] leading-none">
              Tweed Heads Podiatry
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-gray-600 hover:text-[#1e3a5f] transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href={SITE.phoneHref} data-umami-event="phone-tap"
              className="bg-[#1e3a5f] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#152a45] transition-colors"
            >
              Call Now
            </a>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-gray-600 hover:text-[#1e3a5f] transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <a
                href={SITE.phoneHref} data-umami-event="phone-tap"
                className="bg-[#1e3a5f] text-white px-5 py-2.5 text-sm font-medium hover:bg-[#152a45] transition-colors text-center"
              >
                Call Now
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
