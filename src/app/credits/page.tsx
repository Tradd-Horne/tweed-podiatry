import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SITE, SUBURBS } from "@/lib/site";

/**
 * Where the photo credits live now that the footer is short.
 *
 * They cannot simply be deleted. Almost every photograph on this site is CC BY-SA, and
 * attribution is a CONDITION of that licence, not a courtesy — drop the credit and the
 * permission to use the photo goes with it. What the licence does allow is a credit that
 * is "reasonable to the medium", and a linked credits page is long-settled practice for
 * exactly this: it keeps the obligation met and gets forty lines out of the footer.
 *
 * Every credit is generated from the same data the pages render from, so a photo cannot be
 * swapped without its credit following it here.
 */
export const metadata: Metadata = {
  title: "Photo credits | Tweed Heads Podiatry",
  description:
    "Photographers and licences for the images used on this site, including the hero footage and the suburb photographs.",
  alternates: { canonical: `${SITE.url}/credits` },
  robots: { index: false, follow: true },
};

const HERO = [
  {
    what: "Tweed Heads and Coolangatta from the air",
    who: "Michael Coghlan",
    licence: "CC BY-SA 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Headland_High_Rise_(9564031658).jpg",
  },
  {
    what: "Cabarita Beach from Norries Head",
    who: "Steven Lawler",
    licence: "CC BY-SA 3.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/3.0",
    source: "https://commons.wikimedia.org/wiki/File:Cabarita_Beach_-_panoramio.jpg",
  },
  {
    what: "The Tweed River and the valley",
    who: "Michael Coghlan",
    licence: "CC BY-SA 2.0",
    licenceUrl: "https://creativecommons.org/licenses/by-sa/2.0",
    source:
      "https://commons.wikimedia.org/wiki/File:Coast_and_Hinterland_(21874206702).jpg",
  },
];

function Credit({
  what,
  who,
  licence,
  licenceUrl,
  source,
}: {
  what: string;
  who: string;
  licence: string;
  licenceUrl: string;
  source: string;
}) {
  return (
    <li className="py-2.5">
      <span className="text-slate-900">{what}</span>{" "}
      <span className="text-slate-600">
        — {who},{" "}
        <a
          href={licenceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-slate-900"
        >
          {licence}
        </a>
        ,{" "}
        <a
          href={source}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-slate-900"
        >
          source
        </a>
      </span>
    </li>
  );
}

export default function CreditsPage() {
  const suburbPhotos = SUBURBS.filter((s) => s.photo);

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
            <span className="text-slate-700">Photo credits</span>
          </nav>

          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Photo credits
          </h1>
          <p className="mt-5 leading-relaxed text-slate-700">
            The photographs on this site are other people's work, used under Creative
            Commons licences. Those licences require the photographer to be named, so
            here they are.
          </p>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-slate-900">The hero footage</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              The moving clip behind the top of the home page was built from three still
              photographs of this coast. Because they are BY-SA, the clip made from them
              carries the same licence.
            </p>
            <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200 text-sm">
              {HERO.map((c) => (
                <Credit key={c.source} {...c} />
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-slate-900">The suburb photographs</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Each one was taken in the suburb it appears on. The credit also shows in the
              corner of the photograph itself.
            </p>
            <ul className="mt-3 divide-y divide-slate-200 border-y border-slate-200 text-sm">
              {suburbPhotos.map((s) => (
                <Credit
                  key={s.slug}
                  what={s.name}
                  who={s.photo!.credit}
                  licence={s.photo!.license}
                  licenceUrl={s.photo!.licenseUrl}
                  source={s.photo!.sourceUrl}
                />
              ))}
            </ul>
          </section>

          <section className="mt-10">
            <h2 className="text-xl font-semibold text-slate-900">The map</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              The coastline on the areas page is drawn from{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-slate-900"
              >
                OpenStreetMap
              </a>{" "}
              data, © OpenStreetMap contributors, ODbL.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
