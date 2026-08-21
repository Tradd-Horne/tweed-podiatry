import { SITE } from "@/lib/site";

export function Contact() {
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
            href="tel:0403643158"
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
            0403 643 158
          </a>

          <div className="grid sm:grid-cols-3 gap-6 text-left">
            <div className="bg-white/10 p-6">
              <h3 className="text-white font-semibold mb-2">Phone</h3>
              <a
                href="tel:0403643158"
                className="text-blue-100 hover:text-white transition-colors"
              >
                0403 643 158
              </a>
            </div>
            <div className="bg-white/10 p-6">
              <h3 className="text-white font-semibold mb-2">Email</h3>
              <a
                href={`mailto:${SITE.email}`}
                className="text-blue-100 hover:text-white transition-colors text-sm break-all"
              >
                {SITE.email}
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
          </div>
        </div>
      </div>
    </section>
  );
}
