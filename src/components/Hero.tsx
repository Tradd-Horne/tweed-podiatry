import { EnquiryForm } from "@/components/EnquiryForm";
import { SITE } from "@/lib/site";

/**
 * Hero with an aerial video behind the whole section.
 *
 * The video is decoration, not content: aria-hidden and tabIndex -1 keep it out of the
 * accessibility tree and off the tab order, and the h1 beside it carries the meaning.
 * `muted` and `playsInline` together are what make autoplay legal on iOS; without both,
 * Safari shows a frozen frame. The poster is a real frame of the clip, so a slow
 * connection still gets the coastline rather than a dark rectangle.
 *
 * The clip is one continuous drone move that cross-fades through three scenes and back
 * into the first, so `loop` has no visible cut.
 */
export function Hero() {
  return (
    <section className="hero-still relative overflow-hidden bg-[#0d1b2a]">
      <video
        className="hero-video absolute inset-0 w-full h-full object-cover pointer-events-none"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/video/hero-tweed-poster.webp"
        aria-hidden="true"
        tabIndex={-1}
      >
        <source src="/video/hero-tweed.mp4" type="video/mp4" />
      </video>

      {/* Two veils. The gradient runs top-to-bottom on a phone, where the text fills the
          width, and left-to-right on a wide screen, where the words sit on the left and the
          coastline should stay visible on the right. The flat veil under it lifts contrast
          so white text holds up when the clip passes over pale sand. */}
      <div
        className="absolute inset-0 pointer-events-none bg-gradient-to-b from-[#0d1b2a]/85 to-[#0d1b2a]/70 lg:bg-gradient-to-r lg:from-[#0d1b2a]/92 lg:via-[#0d1b2a]/68 lg:to-[#0d1b2a]/25"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 pointer-events-none bg-[#0d1b2a]/15"
        aria-hidden="true"
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid lg:grid-cols-[1.05fr_.95fr] gap-10 lg:gap-14 items-center">
          <div>
            <p className="text-[#9ec7e8] font-medium mb-4">
              Mobile podiatry · Tweed Heads &amp; Northern NSW
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-white leading-tight mb-6">
              Professional podiatry at your doorstep
            </h1>
            <p className="text-lg sm:text-xl text-blue-50/90 leading-relaxed mb-8 max-w-xl">
              Expert foot care delivered to your home across Tweed Heads, the Northern
              Rivers and Northern NSW. The same care you would get in a clinic, at your
              kitchen table, without the travel.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={SITE.phoneHref}
                className="inline-flex items-center justify-center bg-white text-[#1e3a5f] px-8 py-4 text-base font-medium hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                {SITE.phone}
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center border border-white/70 text-white px-8 py-4 text-base font-medium hover:bg-white/10 transition-colors"
              >
                View services
              </a>
            </div>

            <ul className="flex flex-wrap gap-2 mt-8 text-sm">
              {[
                "Home Care Packages",
                "DVA",
                "NDIS",
                "Medicare EPC",
              ].map((item) => (
                <li
                  key={item}
                  className="bg-white/10 border border-white/25 text-blue-50 px-3 py-1 rounded-full"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <EnquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
