import Link from "next/link";
import { FUNDING_PAGES, PROBLEM_PAGES, SERVICE_PAGES, SITE, SUBURBS } from "@/lib/site";

/**
 * The footer is the site's internal link map.
 *
 * Every page built is linked from here. The previous version pointed everything at #services
 * on the home page, which meant a page could exist, sit in the sitemap, and have nothing
 * linking to it — the exact fault that left twenty pages unindexed on another site this
 * month. If a page is worth building it is worth linking.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Home visits
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {SERVICE_PAGES.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="text-slate-700 hover:underline">
                    {p.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Funding
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/fees" className="font-medium text-slate-900 hover:underline">
                  Fees — every price in one place
                </Link>
              </li>
              {FUNDING_PAGES.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="text-slate-700 hover:underline">
                    {p.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Foot problems
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {PROBLEM_PAGES.map((p) => (
                <li key={p.slug}>
                  <Link href={`/${p.slug}`} className="text-slate-700 hover:underline">
                    {p.h1}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Areas visited
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {SUBURBS.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/areas/${s.slug}`}
                    className="text-slate-700 hover:underline"
                  >
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-8 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">{SITE.name}</p>
          <p className="mt-1">
            {SITE.practitioner} {SITE.qualification} · AHPRA registration{" "}
            {SITE.ahpra} · ABN {SITE.abn}
          </p>
          <p className="mt-1">
            <a href={SITE.phoneHref} data-umami-event="phone-tap" className="hover:underline">
              {SITE.phone}
            </a>{" "}
            ·{" "}
            <a href={`mailto:${SITE.email}`} className="hover:underline">
              {SITE.email}
            </a>
          </p>
          <p className="mt-4 max-w-3xl text-xs leading-relaxed text-slate-500">
            Information on this site is general in nature and is not a substitute for
            an assessment of your own feet.{" "}
            <strong className="font-semibold text-slate-700">
              If you have an open wound, an ulcer or a sore that is not healing, see your
              doctor, or go to your local emergency department if it looks infected.
            </strong>{" "}
            A wound is best managed by the high risk foot clinic, a hospital outpatient
            service your doctor can refer you to. We are happy to take over your ongoing
            foot care once the wound has healed.
          </p>
          {/* The hero clip is built from three Creative Commons photographs of this coast.
              BY-SA obliges us to name the photographers and to pass the same licence on,
              so the credit is part of the page, not a nicety. */}
          <p className="mt-3 text-xs leading-relaxed text-slate-500">
            Hero footage built from photographs of this coast by{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Headland_High_Rise_(9564031658).jpg"
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="hover:underline"
            >
              Michael Coghlan
            </a>{" "}
            and{" "}
            <a
              href="https://commons.wikimedia.org/wiki/File:Cabarita_Beach_-_panoramio.jpg"
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="hover:underline"
            >
              Steven Lawler
            </a>
            , used under{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/3.0"
              rel="noopener noreferrer nofollow"
              target="_blank"
              className="hover:underline"
            >
              CC BY-SA
            </a>
            . The clip is shared under the same licence.
          </p>
          <p className="mt-3 text-xs text-slate-500">
            © {year} {SITE.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
