import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE, SUBURBS } from "@/lib/site";

export const metadata: Metadata = {
  title: "Areas Visited | Home Visit Podiatry Tweed Heads & Northern NSW",
  description:
    "Suburbs covered for home visit podiatry: Tweed Heads, Banora Point, Kingscliff, Coolangatta, Terranora, Pottsville, Cabarita Beach and Murwillumbah.",
  alternates: { canonical: `${SITE.url}/areas` },
};

export default function AreasPage() {
  return (
    <>
      <Header />
      <main>
        <article className="mx-auto max-w-3xl px-5 py-12 sm:py-16">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Areas visited
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-slate-700">
            Home visits across the Tweed and the far Northern Rivers. Coastal
            suburbs are grouped onto the same run, so appointments in one area
            usually sit together on the same day.
          </p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {SUBURBS.map((s) => (
              <li key={s.slug} className="rounded-xl p-5 ring-1 ring-slate-200">
                <Link
                  href={`/areas/${s.slug}`}
                  className="font-semibold text-slate-900 underline underline-offset-4"
                >
                  {s.name} {s.postcode}
                </Link>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {s.note}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-slate-700">
            Just outside these suburbs? Ring{" "}
            <a href={SITE.phoneHref} className="font-semibold underline">
              {SITE.phone}
            </a>{" "}
            and ask — the run changes as the book fills.
          </p>
        </article>
      </main>
      <Footer />
    </>
  );
}
