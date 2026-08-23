import { SITE } from "@/lib/site";

export function Contact() {
  /*
    Split at the @ so the address breaks where a person reads a break. Left to itself the
    browser either overflows the box or chops mid-domain — "contact@tweedheadsp /
    odiatry.com.au" — which reads as a typo. Derived from SITE.email rather than typed out,
    so the address cannot drift from the one the rest of the site uses.
  */
  const [emailLocal, emailDomain] = SITE.email.split("@");

  return (
    <section id="contact" className="py-16 sm:py-24 bg-[#1e3a5f]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-semibold text-white mb-4">
            Book Your Home Visit
          </h2>
          <p className="text-lg text-blue-100 mb-8">
            Ready to receive professional podiatry care in the comfort of your
            own home? Get in touch to arrange your appointment.
          </p>

          <a
            href={SITE.phoneHref} data-umami-event="phone-tap"
            className="inline-flex items-center justify-center bg-white text-[#1e3a5f] px-8 py-4 text-lg font-semibold hover:bg-gray-100 transition-colors mb-8"
          >
            <svg
              className="w-6 h-6 mr-3"
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

          <div className="grid sm:grid-cols-2 gap-6 text-left">
            <div className="bg-white/10 p-6">
              <h3 className="text-white font-semibold mb-2">Phone</h3>
              <a
                href={SITE.phoneHref} data-umami-event="phone-tap"
                className="text-blue-100 hover:text-white transition-colors"
              >
                {SITE.phone}
              </a>
            </div>
            <div className="bg-white/10 p-6">
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <a
                href={`mailto:${SITE.email}`}
                className="text-blue-100 hover:text-white transition-colors text-sm break-words"
              >
                {emailLocal}@<wbr />
                {emailDomain}
              </a>
            </div>
            <div className="bg-white/10 p-6">
              <h3 className="text-white font-semibold mb-2">Hours</h3>
              <p className="text-blue-100 text-sm">
                Monday – Friday
                <br />
                Appointments available
              </p>
            </div>
            {/*
              Podiatry is a regulated profession, and this is the point on the page where
              somebody decides to let a stranger into their house. AHPRA's register is public
              and searchable by this number, so the box is not a badge — it is the means to
              check him before he arrives.
            */}
            <div className="bg-white/10 p-6">
              <h3 className="text-white font-semibold mb-2">Provider details</h3>
              <p className="text-blue-100 text-sm">
                {SITE.practitioner} {SITE.qualification}
                <br />
                AHPRA {SITE.ahpra}
                {SITE.providerNumber && (
                  <>
                    <br />
                    Provider number {SITE.providerNumber}
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
