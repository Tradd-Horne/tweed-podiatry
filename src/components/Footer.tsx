import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * The footer used to be the site's whole internal link map: every service page, every
 * funding page, every problem page and all twenty-two suburbs, four columns deep. That was
 * built to make sure no page was left with nothing linking to it — a real fault worth
 * avoiding — but it solved it with a wall of forty links that nobody reads.
 *
 * Crawlers do not need it. /areas links all twenty-two suburbs, /fees links all six funding
 * pages, and both are in the sitemap and one click from here. A link two clicks deep is
 * found just as reliably as one in the footer; a footer that reads as a sitemap is simply
 * a worse footer.
 *
 * What is left is what a person at the bottom of the page actually wants: how to make
 * contact, and who they are contacting.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-lg font-semibold text-slate-900">{SITE.name}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Home visit podiatry across the Tweed coast, the Tweed valley and the
              northern Byron shire.
            </p>
            <p className="mt-3 text-sm text-slate-600">
              {SITE.practitioner} {SITE.qualification}
              <br />
              AHPRA registration {SITE.ahpra}
              <br />
              ABN {SITE.abn}
            </p>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Get in touch
            </h2>
            <dl className="mt-3 space-y-2 text-sm">
              <div>
                <dt className="sr-only">Phone</dt>
                <dd>
                  <a
                    href={SITE.phoneHref}
                    data-umami-event="phone-tap"
                    className="text-base font-semibold text-slate-900 hover:underline"
                  >
                    {SITE.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="sr-only">Email</dt>
                <dd>
                  <a
                    href={`mailto:${SITE.email}`}
                    className="text-slate-700 hover:underline break-all"
                  >
                    {SITE.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Hours</dt>
                <dd className="text-slate-700">
                  Monday to Friday, appointments available
                </dd>
              </div>
            </dl>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              On this site
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/fees" className="text-slate-700 hover:underline">
                  Fees — every price in one place
                </Link>
              </li>
              <li>
                <Link href="/areas" className="text-slate-700 hover:underline">
                  Areas visited
                </Link>
              </li>
              <li>
                <Link
                  href="/home-visit-podiatrist-tweed-heads"
                  className="text-slate-700 hover:underline"
                >
                  What a home visit involves
                </Link>
              </li>
              <li>
                <Link href="/credits" className="text-slate-700 hover:underline">
                  Photo credits
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-xs text-slate-500">
          © {year} {SITE.name}
        </div>
      </div>
    </footer>
  );
}
