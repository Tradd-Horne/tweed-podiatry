import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AreaMap } from "@/components/AreaMap";
import { EXTRA_LOCALITIES, SITE, SUBURBS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Areas Visited | Home Visit Podiatry, Tweed Coast & Northern Rivers",
  description:
    "Home visit podiatry from Tugun and Coolangatta down to Brunswick Heads and Mullumbimby, and inland to Murwillumbah, Uki and Tyalgum. Map and full list of every locality covered.",
  alternates: { canonical: `${SITE.url}/areas` },
};

/**
 * The map and the list carry the same information twice on purpose. The map answers
 * "roughly where does he go" in one glance; the list answers "does he come to MY
 * street", which a map at this scale cannot. Neither replaces the other.
 */
export default function AreasPage() {
  return (
    <>
      <Header />
      <main>
        <article className="mx-auto max-w-6xl px-5 py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Areas visited
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-700">
            Home visits across the Tweed coast, the Tweed valley and the northern end of
            the Byron shire — from Tugun and Coolangatta in the north down to Brunswick
            Heads and Mullumbimby, and inland as far as Tyalgum and Uki. Coastal suburbs
            are grouped onto the same run, so appointments in one area usually sit
            together on the same day.
          </p>

          <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,30rem)_1fr] lg:gap-12">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <AreaMap />
            </div>

            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                Suburbs with their own page
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Each one sets out what a visit involves there and how it is funded.
              </p>
              <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                {SUBURBS.map((s) => (
                  <li key={s.slug} className="rounded-xl p-4 ring-1 ring-slate-200">
                    <Link
                      href={`/areas/${s.slug}`}
                      className="font-semibold text-slate-900 underline underline-offset-4"
                    >
                      {s.name} {s.postcode}
                    </Link>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                      {s.note}
                    </p>
                  </li>
                ))}
              </ul>

              <h2 className="mt-12 text-xl font-semibold text-slate-900">
                Also visited
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Every other locality inside the area. These do not have a page of their
                own — the visit is the same, and the funding pages apply the same way.
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-700">
                {EXTRA_LOCALITIES.join(" · ")}
              </p>

              <div className="mt-10 rounded-xl bg-slate-50 p-6 ring-1 ring-slate-200">
                <h2 className="text-lg font-semibold text-slate-900">
                  Not on the list?
                </h2>
                <p className="mt-2 leading-relaxed text-slate-700">
                  Ring and ask. The run changes as the book fills, and a street just
                  outside the line is usually still doable on the right day. Anything well
                  beyond the area carries a travel charge, quoted before you book.
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <a
                    href={SITE.phoneHref} data-umami-event="phone-tap"
                    className="rounded-lg bg-slate-900 px-5 py-2.5 font-semibold text-white hover:bg-slate-700"
                  >
                    Call {SITE.phone}
                  </a>
                  <Link
                    href="/fees"
                    className="rounded-lg px-5 py-2.5 font-semibold text-slate-900 ring-1 ring-slate-300 hover:bg-white"
                  >
                    See the fees
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
