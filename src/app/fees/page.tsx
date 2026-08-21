import type { Metadata } from "next";
import Image from "next/image";
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
  { slug: "paying-privately", label: "Paying privately", logo: "/logos/privately.svg" },
  { slug: "medicare-podiatry", label: "Medicare", logo: "/logos/medicare.webp" },
  { slug: "dva-podiatry", label: "DVA", logo: "/logos/dva.webp" },
  { slug: "ndis-podiatry", label: "NDIS", logo: "/logos/ndis.png" },
  {
    slug: "private-health-podiatry",
    label: "Private health",
    logo: "/logos/private-health.svg",
  },
  {
    slug: "home-care-package-podiatry",
    label: "Home Care Package",
    logo: "/logos/home-care.svg",
  },
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
            Every price, in one place. Open the one that applies to you. “Paying
            privately” is what a visit costs when nothing else applies; the rest show
            what Medicare, DVA, the NDIS, your health fund and Support at Home each pay,
            and what that leaves you.
          </p>

          {/* <details> rather than a scripted accordion: it opens with no JavaScript, it
              is keyboard-operable for free, and the content stays in the DOM so search
              engines and Ctrl+F still find the prices inside a closed panel. */}
          <div className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
            {blocks.map((b, i) => (
              <details
                key={b.slug}
                id={b.slug}
                open={i === 0}
                className="group scroll-mt-24 py-4"
              >
                <summary className="flex cursor-pointer list-none items-center gap-4">
                  <Image
                    src={b.logo}
                    alt=""
                    width={72}
                    height={34}
                    className="h-8 w-[4.5rem] shrink-0 object-contain"
                  />
                  <h2 className="flex-1 text-lg font-semibold text-slate-900">
                    {b.label}
                  </h2>
                  <svg
                    className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                    viewBox="0 0 20 20"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 8l5 5 5-5"
                    />
                  </svg>
                </summary>

                <div className="mt-4">
                  <PricingTable
                    pricing={b.page!.pricing!}
                    id={b.slug}
                    compact
                    hideHeading
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
              </details>
            ))}
          </div>

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
