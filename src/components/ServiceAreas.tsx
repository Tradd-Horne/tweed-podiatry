import Link from "next/link";
import { AreaMap } from "@/components/AreaMap";
import { SITE } from "@/lib/site";
const areas = [
  {
    region: "Tweed Heads & Surrounds",
    locations: [
      "Tweed Heads",
      "Tweed Heads South",
      "Tweed Heads West",
      "Banora Point",
      "Terranora",
      "Bilambil Heights",
      "Coolangatta",
      "Kirra",
    ],
  },
  {
    region: "Northern Rivers",
    locations: [
      "Murwillumbah",
      "Kingscliff",
      "Cabarita Beach",
      "Pottsville",
      "Hastings Point",
      "Casuarina",
      "Chinderah",
      "Fingal Head",
    ],
  },
  {
    region: "Northern NSW",
    locations: [
      "Byron Bay",
      "Ballina",
      "Lennox Head",
      "Brunswick Heads",
      "Ocean Shores",
      "Mullumbimby",
      "Suffolk Park",
      "Bangalow",
    ],
  },
];

export function ServiceAreas() {
  return (
    <section id="areas" className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            Service Areas
          </h2>
          <p className="text-lg text-gray-600">
            Mobile podiatry services available throughout Tweed Heads, the
            Northern Rivers and Northern NSW. Home visits at times that suit
            you.
          </p>
        </div>

        {/*
          The map and the list say the same thing twice, and both are needed. The map
          answers "roughly where does he go" at a glance; the list answers "does he come to
          MY street", which is the only question the visitor actually has. It is the same
          <AreaMap /> the areas page draws, not a copy, so the two can never disagree.

          The map is capped and centred rather than run full width. It is very nearly
          square, so a 1152px column would draw a map taller than the screen.
        */}
        <div className="mx-auto max-w-lg">
          <AreaMap />
          <Link
            href="/areas"
            className="mt-4 inline-block text-sm font-medium text-[#1e3a5f] hover:underline"
          >
            See every locality we visit &rarr;
          </Link>
        </div>

        {/*
          Three columns at every width, including a phone. Three columns on a 390px screen
          is only 111px each, which is less than "Tweed Heads South" needs at the size the
          rest of the page uses — so on a phone the type drops to 12px, the gap tightens and
          the pin icon is dropped entirely. The icon was decoration; the suburb name is the
          content, and it gets the whole column. Everything returns at 640px and up.
        */}
        <div className="mt-14 grid grid-cols-3 grid-rows-[auto_1fr] gap-x-2 sm:gap-x-8 gap-y-0">
          {areas.map((area) => (
            <div key={area.region} className="grid grid-rows-subgrid row-span-2">
              {/*
                The region names are different lengths, so "Tweed Heads & Surrounds" wraps
                where the other two do not, and that would push one column's rule and its
                first suburb below its neighbours. Subgrid makes the three headings share a
                row sized to the tallest, so the rules stay level at any width and any
                wording — no hand-tuned heights to go stale when a region gets renamed.
              */}
              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 leading-snug mb-3 sm:mb-4 pb-2 border-b border-gray-100 self-end">
                {area.region}
              </h3>
              <ul className="space-y-1.5 sm:space-y-2">
                {area.locations.map((location) => (
                  <li
                    key={location}
                    className="text-gray-600 text-xs sm:text-sm leading-snug flex items-start sm:items-center"
                  >
                    <svg
                      className="hidden sm:block w-4 h-4 mr-2 shrink-0 text-[#1e3a5f]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    {location}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-gray-50 border border-gray-100">
          <p className="text-gray-600 text-center">
            Don't see your area listed?{" "}
            <a
              href={SITE.phoneHref} data-umami-event="phone-tap"
              className="text-[#1e3a5f] font-medium hover:underline"
            >
              Give us a call
            </a>{" "}
            to check availability in your location.
          </p>
        </div>
      </div>
    </section>
  );
}
