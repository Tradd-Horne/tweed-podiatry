import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BreadcrumbSchema } from "@/components/Schema";
import { PROBLEM_PAGES, SITE, SUBURBS } from "@/lib/site";

export function generateStaticParams() {
  return SUBURBS.map((s) => ({ suburb: s.slug }));
}

export const dynamicParams = false;

function find(slug: string) {
  return SUBURBS.find((s) => s.slug === slug);
}

export function generateMetadata({
  params,
}: {
  params: { suburb: string };
}): Metadata {
  const suburb = find(params.suburb);
  if (!suburb) return {};
  const title = `Home Visit Podiatrist ${suburb.name} | Mobile Podiatry`;
  const description = `A registered podiatrist visiting homes in ${suburb.name} ${suburb.postcode}. Nail care, corns, callus and diabetic foot checks. Home Care Package, DVA and NDIS welcome.`;
  const url = `${SITE.url}/areas/${suburb.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: SITE.name, locale: "en_AU" },
  };
}

export default function SuburbPage({
  params,
}: {
  params: { suburb: string };
}) {
  const suburb = find(params.suburb);
  if (!suburb) notFound();

  // Every suburb links to every other one. Eight pages is few enough that a full mesh is
  // sensible, and it means no suburb page is ever left without inbound links.
  const others = SUBURBS.filter((s) => s.slug !== suburb.slug);

  return (
    <>
      <Header />
      <BreadcrumbSchema
        trail={[
          { name: "Home", url: "/" },
          { name: "Areas visited", url: "/areas" },
          { name: suburb.name, url: `/areas/${suburb.slug}` },
        ]}
      />
      <main>
        <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <Link href="/" className="hover:underline">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/areas" className="hover:underline">
              Areas visited
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-700">{suburb.name}</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Home visit podiatrist in {suburb.name}
          </h1>

          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            Podiatry at home in {suburb.name} {suburb.postcode}. {suburb.note}
          </p>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-slate-900">
              What a visit in {suburb.name} covers
            </h2>
            <p className="mt-3 leading-relaxed text-slate-700">
              Nails cut and thinned, corns and hard skin removed, circulation and
              sensation checked, and footwear looked at if it is causing trouble.
              About forty-five minutes, at your kitchen table, with everything
              needed brought along.
            </p>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-slate-900">
              Paying for it
            </h2>
            <p className="mt-3 leading-relaxed text-slate-700">
              Home Care Package and Support at Home funding both cover podiatry, and
              I invoice your provider directly. DVA Gold Card holders pay nothing
              with a GP referral. I am a registered NDIS provider, so agency-managed,
              plan-managed and self-managed participants can all book. Everyone else
              pays a single visit fee — $170 for a first visit, $150 after that — with
              no separate call-out charge inside the areas I visit.
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              <li>
                <Link
                  href="/home-care-package-podiatry"
                  className="text-slate-700 underline underline-offset-4 hover:text-slate-900"
                >
                  Home Care Package podiatry
                </Link>
              </li>
              <li>
                <Link
                  href="/dva-podiatry"
                  className="text-slate-700 underline underline-offset-4 hover:text-slate-900"
                >
                  DVA podiatry
                </Link>
              </li>
              <li>
                <Link
                  href="/ndis-podiatry"
                  className="text-slate-700 underline underline-offset-4 hover:text-slate-900"
                >
                  NDIS podiatry
                </Link>
              </li>
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-slate-900">
              Common reasons people in {suburb.name} call
            </h2>
            <ul className="mt-3 space-y-2">
              {PROBLEM_PAGES.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    className="text-slate-700 underline underline-offset-4 hover:text-slate-900"
                  >
                    {p.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <aside className="mt-12 rounded-xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Book a visit in {suburb.name}
            </h2>
            <p className="mt-2 text-slate-700">
              {SITE.practitioner} {SITE.qualification}, AHPRA registered
              ({SITE.ahpra}).
            </p>
            <a
              href={SITE.phoneHref}
              className="mt-4 inline-block rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-700"
            >
              Call {SITE.phone}
            </a>
          </aside>

          <nav className="mt-10" aria-label="Other areas">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Other areas visited
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {others.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/areas/${s.slug}`}
                    className="text-slate-700 underline underline-offset-4 hover:text-slate-900"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </article>
      </main>
      <Footer />
    </>
  );
}
