import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PricingTable } from "@/components/PricingTable";
import { FEES, SITE, pageBySlug } from "@/lib/site";

/**
 * Every price on the site, on one page.
 *
 * The six funding pages each answer one question well; this page answers "what will this
 * cost me?" for someone who does not yet know which route applies to them. It reuses the
 * exact same pricing blocks, so there is no second copy of any figure to drift.
 *
 * Order is deliberate: the private price list first, because it is the number everything
 * else is measured against, then the routes that reduce it.
 */
const ORDER = [
  { slug: "paying-privately", label: "Paying privately" },
  { slug: "medicare-podiatry", label: "Medicare" },
  { slug: "dva-podiatry", label: "DVA" },
  { slug: "ndis-podiatry", label: "NDIS" },
  { slug: "private-health-podiatry", label: "Private health" },
  { slug: "home-care-package-podiatry", label: "Home Care Package" },
];

const TITLE = "Fees | Tweed Heads Podiatry Home Visits";
const DESCRIPTION = `Every price in one place. Home visits from $${FEES.followUp.price}, nail surgery $${FEES.nailSurgery.price}, custom orthotics $${FEES.orthotics.price}. What Medicare, DVA, NDIS, your health fund and Support at Home each pay.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${SITE.url}/fees` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE.url}/fees`,
    siteName: SITE.name,
    locale: "en_AU",
    type: "article",
  },
};

export default function FeesPage() {
  const blocks = ORDER.map((o) => ({ ...o, page: pageBySlug(o.slug) })).filter(
    (o) => o.page?.pricing,
  );

  return (
    <>
      <Header />
      <main>
        <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
            <Link href="/" className="hover:text-slate-900 hover:underline">
              Home
            </Link>
            <span className="mx-2" aria-hidden="true">
              /
            </span>
            <span className="text-slate-700">Fees</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Fees
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            Every price, in one place. The first table is what a visit costs if nothing
            else applies. The tables after it show what Medicare, DVA, the NDIS, your
            health fund and Support at Home each pay, and what that leaves you.
          </p>

          {/* At-a-glance, before any of the funding detail. Most people want these four
              numbers and nothing else. */}
          <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl bg-slate-50 p-6 ring-1 ring-slate-200 sm:grid-cols-4">
            {[FEES.initial, FEES.followUp, FEES.nailSurgery, FEES.orthotics].map(
              (f) => (
                <div key={f.label}>
                  <dt className="text-xs leading-snug text-slate-600">{f.label}</dt>
                  <dd className="mt-1 text-2xl font-semibold tabular-nums text-slate-900">
                    ${f.price}
                  </dd>
                </div>
              ),
            )}
          </dl>

          <nav aria-label="Fees by funding type" className="mt-8">
            <ul className="flex flex-wrap gap-x-4 gap-y-2 text-sm">
              {blocks.map((b) => (
                <li key={b.slug}>
                  <a
                    href={`#${b.slug}`}
                    className="text-slate-700 underline underline-offset-4 hover:text-slate-900"
                  >
                    {b.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {blocks.map((b) => (
            <div key={b.slug} id={b.slug} className="scroll-mt-24">
              <PricingTable
                pricing={b.page!.pricing!}
                id={b.slug}
                heading={b.label}
                compact
              />
              <p className="mt-3 text-sm">
                <Link
                  href={`/${b.slug}`}
                  className="text-slate-700 underline underline-offset-4 hover:text-slate-900"
                >
                  {b.page!.h1} — the full explanation
                </Link>
              </p>
            </div>
          ))}

          <aside className="mt-12 rounded-xl bg-slate-50 p-6 ring-1 ring-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">
              Not sure which one applies to you?
            </h2>
            <p className="mt-2 text-slate-700">
              Ring me and I will work it out with you before you book. If you are on a GP
              chronic condition management plan, or you hold a DVA card, you will usually
              pay less than the table above.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={SITE.phoneHref}
                className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-700"
              >
                Call {SITE.phone}
              </a>
              <a
                href={`mailto:${SITE.email}`}
                className="rounded-lg px-5 py-2.5 font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-white"
              >
                Email
              </a>
            </div>
          </aside>
        </article>
      </main>
      <Footer />
    </>
  );
}
