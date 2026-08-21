import Image from "next/image";

const fundingOptions = [
  {
    name: "Medicare",
    description: "Eligible services covered under Medicare CDM plans",
    logo: "/logos/medicare.webp",
  },
  {
    name: "NDIS",
    description: "Registered NDIS provider for eligible participants",
    logo: "/logos/ndis.png",
  },
  {
    name: "DVA",
    description: "Department of Veterans' Affairs accepted",
    logo: "/logos/dva.webp",
  },
  {
    name: "HICAPS",
    description: "Claim on the spot with your health fund",
    logo: "/logos/hicaps.webp",
  },
  {
    name: "Medipass",
    description: "Digital health claims processing",
    logo: "/logos/medipass.webp",
  },
];

export function FundingOptions() {
  return (
    <section className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            Payment Options
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We accept a range of payment and funding options to make podiatry
            care accessible for everyone.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {fundingOptions.map((option) => (
            <div
              key={option.name}
              className="bg-white p-6 flex flex-col items-center text-center border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all h-full"
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
                  alt={`${option.name} logo`}
                  width={120}
                  height={56}
                  className="object-contain max-h-14"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Not sure about your coverage?{" "}
            <a
              href="tel:0403643158"
              className="text-[#1e3a5f] font-medium hover:underline"
            >
              Contact us
            </a>{" "}
            and we'll help you understand your options.
          </p>
        </div>
      </div>
    </section>
  );
}
