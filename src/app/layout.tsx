import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BusinessSchema } from "@/components/Schema";

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
      <head>
        {/* Umami. Tradd wants this site measured alongside the rank-and-rent fleet on
            tradd.net — visits, phone taps and form submits, so its call volume can be
            compared against sites that have no real reviews or address.
            ⚠️ Served from the SHARED analytics host on purpose. Every fleet site serves its
            own from stats.<domain> so the sites cannot be linked to one another; this is
            openly Tradd's business, so that separation buys nothing and costs a subdomain. */}
        <script
          defer
          src="https://analytics.tradd.net/script.js"
          data-website-id="1141084f-6b6b-49cf-a6ac-eb9820542f5e"
        />
      </head>
      <body className={inter.className}>
        <BusinessSchema />{children}</body>
    </html>
  );
}
