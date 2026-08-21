import type { MetadataRoute } from "next";
import { ALL_PAGES, SITE, SUBURBS } from "@/lib/site";

/** Generated from the same lists the pages are, so a new page cannot exist without being
 *  in the sitemap. A hand-maintained sitemap is a page that quietly stops being indexed. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE.url, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE.url}/fees`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE.url}/areas`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    ...ALL_PAGES.map((p) => ({
      url: `${SITE.url}/${p.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: p.kind === "service" ? 0.9 : 0.8,
    })),
    ...SUBURBS.map((s) => ({
      url: `${SITE.url}/areas/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
