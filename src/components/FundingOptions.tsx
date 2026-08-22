import Image from "next/image";
import Link from "next/link";
import { SITE } from "@/lib/site";

/**
 * How people pay. Every card links to a page that sets out the real numbers — item
 * numbers, what the funder pays, what is left to pay — because "We accept Medicare" tells
 * a reader nothing they can act on.
 *
 * HICAPS and Medipass used to have a card each. Neither is a funder: HICAPS is a
 * countertop terminal and Medipass is now Tyro Health. A home-visit podiatrist has no
 * counter, so the honest card is "Private health", and the page behind it explains how
 * the claim actually gets made.
 */
const fundingOptions = [
  {
    name: "Medicare",
    description: "Up to five rebated visits a year on a GP plan",
    logo: "/logos/medicare.webp",
    alt: "",
    href: "/medicare-podiatry",
  },
  {
    name: "NDIS",
    description: "Registered provider — every plan type, $188.99/hr limit",
    logo: "/logos/ndis.png",
    alt: "",
    href: "/ndis-podiatry",
  },
  {
    name: "DVA",
    description: "Gold and White Card, billed straight to DVA",
    logo: "/logos/dva.webp",
    alt: "",
    href: "/dva-podiatry",
  },
  {
    name: "Private health",
    description: "Claim your extras on the spot — no terminal needed",
    logo: "/logos/private-health.svg",
    alt: "",
    href: "/private-health-podiatry",
  },
  {
    name: "Home Care Package",
    description: "Clinical support under Support at Home — funded in full",
    logo: "/logos/home-care.svg",
    alt: "",
    href: "/home-care-package-podiatry",
  },
  {
    name: "Privately",
    description: "No referral, no plan, no waiting — pay on the day",
    logo: "/logos/privately.svg",
    alt: "",
    href: "/paying-privately",
  },
];

export function FundingOptions() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            Payment options
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Every option below has its own page with the item numbers, the rebate and
            what you are left paying. No guessing before you book.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6">
          {fundingOptions.map((option) => (
            <Link
              key={option.name}
              href={option.href}
              className="bg-white p-6 flex flex-col items-center text-center border border-gray-100 hover:border-[#1e3a5f] hover:shadow-sm transition-all h-full"
            >
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {option.name}
              </h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-4">
                {option.description}
              </p>
              <div className="h-14 mt-auto flex items-center justify-center">
                <Image
                  src={option.logo}
                  alt={option.alt}
                  width={120}
                  height={56}
                  className="object-contain max-h-14"
                />
              </div>
              <span className="mt-4 text-xs font-medium text-[#1e3a5f]">
                See the prices
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Not sure which one applies to you?{" "}
            <a
              href={SITE.phoneHref} data-umami-event="phone-tap"
              className="text-[#1e3a5f] font-medium hover:underline"
            >
              Ring {SITE.phone}
            </a>{" "}
            and we will work it out with you.
          </p>
        </div>
      </div>
    </section>
  );
}
