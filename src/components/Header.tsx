"use client";

import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "#services", label: "Services" },
    { href: "#about", label: "About" },
    { href: "#areas", label: "Service Areas" },
    { href: "#contact", label: "Contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg sm:text-xl font-semibold text-[#1e3a5f]">
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
              href="tel:0403643158"
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
                href="tel:0403643158"
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
