export function Hero() {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-16 sm:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-3xl">
          <p className="text-[#1e3a5f] font-medium mb-4">
            Mobile Podiatry Services
          </p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-gray-900 leading-tight mb-6">
            Professional Podiatry at Your Doorstep
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl">
            Expert foot care delivered to your home across Tweed Heads, Northern
            Rivers and Northern NSW. Convenient, professional podiatry services
            without the travel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="tel:0403643158"
              className="inline-flex items-center justify-center bg-[#1e3a5f] text-white px-8 py-4 text-base font-medium hover:bg-[#152a45] transition-colors"
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
              0403 643 158
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center border border-gray-300 text-gray-700 px-8 py-4 text-base font-medium hover:border-gray-400 hover:bg-gray-50 transition-colors"
            >
              View Services
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
