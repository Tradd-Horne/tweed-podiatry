import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageShell } from "@/components/PageShell";
import { ALL_PAGES, SITE, pageBySlug } from "@/lib/site";

/** Every service, funding and problem page is built at build time — static HTML, no runtime
 *  work, which is the cheapest way to be fast. */
export function generateStaticParams() {
  return ALL_PAGES.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const page = pageBySlug(params.slug);
  if (!page) return {};
  const url = `${SITE.url}/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: url },
    openGraph: {
      title: page.title,
      description: page.description,
      url,
      siteName: SITE.name,
      locale: "en_AU",
      type: "article",
    },
  };
}

export default function Page({ params }: { params: { slug: string } }) {
  const page = pageBySlug(params.slug);
  if (!page) notFound();

  // Related links point ACROSS the three groups on purpose. A problem page that only links
  // to other problem pages leaves the funding pages with nothing pointing at them, and a
  // page nothing links to does not get found.
  const related = ALL_PAGES.filter(
    (p) => p.slug !== page.slug && p.kind !== page.kind,
  )
    .slice(0, 4)
    .map((p) => ({ href: `/${p.slug}`, label: p.h1 }));

  return (
    <>
      <Header />
      <main>
        <PageShell page={page} related={related} />
      </main>
      <Footer />
    </>
  );
}
