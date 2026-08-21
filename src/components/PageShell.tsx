import Link from "next/link";
import { SITE, type PageDef } from "@/lib/site";
import { FaqSchema } from "@/components/Schema";
import { PricingTable } from "@/components/PricingTable";

/**
 * The body shared by every service, funding and problem page.
 *
 * One shell means every page gets the same heading order, the same call to action and the
 * same FAQ treatment — so the markup cannot drift page to page, which is where technical
 * SEO problems usually start.
 */
export function PageShell({
  page,
  related,
}: {
  page: PageDef;
  related: { href: string; label: string }[];
}) {
  return (
    <>
      <FaqSchema faqs={page.faqs} />

      <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-900 hover:underline">
            Home
          </Link>
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <span className="text-slate-700">{page.h1}</span>
        </nav>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {page.h1}
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-slate-700">{page.intro}</p>

        {page.pricing && <PricingTable pricing={page.pricing} />}

        {page.sections.map((s) => (
          <section key={s.heading} className="mt-10">
            <h2 className="text-xl font-semibold text-slate-900">{s.heading}</h2>
            <p className="mt-3 leading-relaxed text-slate-700">{s.body}</p>
          </section>
        ))}

        {page.faqs.length > 0 && (
          <section className="mt-12">
            <h2 className="text-xl font-semibold text-slate-900">
              Common questions
            </h2>
            <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
              {page.faqs.map((f) => (
                <div key={f.q} className="py-4">
                  <dt className="font-medium text-slate-900">{f.q}</dt>
                  <dd className="mt-2 leading-relaxed text-slate-700">{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <aside className="mt-12 rounded-xl bg-slate-50 p-6 ring-1 ring-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">
            Book a home visit
          </h2>
          <p className="mt-2 text-slate-700">
            {SITE.practitioner} {SITE.qualification} — AHPRA registered podiatrist
            visiting {SITE.baseSuburb} and the surrounding suburbs.
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

        {related.length > 0 && (
          <nav className="mt-10" aria-label="Related pages">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Related
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
              {related.map((r) => (
                <li key={r.href}>
                  <Link
                    href={r.href}
                    className="text-slate-700 underline underline-offset-4 hover:text-slate-900"
                  >
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </article>
    </>
  );
}
