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
        */}
        <div className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_1fr] lg:gap-12 items-start">
          <div>
            <AreaMap />
            <Link
              href="/areas"
              className="mt-4 inline-block text-sm font-medium text-[#1e3a5f] hover:underline"
            >
              See every locality we visit &rarr;
            </Link>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
          {areas.map((area) => (
            <div key={area.region}>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                {area.region}
              </h3>
              <ul className="space-y-2">
                {area.locations.map((location) => (
                  <li
                    key={location}
                    className="text-gray-600 text-sm flex items-center"
                  >
                    <svg
                      className="w-4 h-4 mr-2 text-[#1e3a5f]"
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
