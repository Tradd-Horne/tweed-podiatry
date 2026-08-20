import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tweed Heads Podiatry | Mobile Podiatrist | Home Visits Northern NSW",
  description:
    "Professional mobile podiatry services in Tweed Heads, Northern Rivers and Northern NSW. Home visit podiatrist providing comprehensive foot care at your doorstep. Book your appointment today.",
  keywords:
    "podiatrist, mobile podiatry, home visit podiatrist, Tweed Heads, Northern Rivers, Northern NSW, foot care, podiatry home visits, Tweed Heads podiatry",
  authors: [{ name: "Tradd - B.HSc Pod" }],
  openGraph: {
    title: "Tweed Heads Podiatry | Mobile Home Visit Podiatrist",
    description:
      "Professional mobile podiatry services bringing expert foot care to your home in Tweed Heads, Northern Rivers and Northern NSW.",
    url: "https://tweedheadspodiatry.com.au",
    siteName: "Tweed Heads Podiatry",
    locale: "en_AU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://tweedheadspodiatry.com.au",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
