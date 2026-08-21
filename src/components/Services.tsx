import Image from "next/image";
const SERVICE_IMAGES: Record<string, { src: string; alt: string }> = {
  'General Foot Care': { src: "/img/services/general-foot-care.webp", alt: 'An older couple standing together looking out over a coastal walking track' },
  'Ingrown Toenails': { src: "/img/services/ingrown-toenails.webp", alt: 'Bare feet on a rug beside a pair of red lace-up shoes' },
  'Diabetic Foot Care': { src: "/img/services/diabetic-foot-care.webp", alt: 'An older man walking his dog along a sandy coastal track' },
  'Sports Podiatry': { src: "/img/services/sports-podiatry.webp", alt: 'Running shoes mid-stride on a treadmill' },
  'Custom Orthotics': { src: "/img/services/custom-orthotics.webp", alt: 'White trainers worn on a concrete ramp' },
  'Paediatric Podiatry': { src: "/img/services/paediatric-podiatry.webp", alt: "Two young children running through a sprinkler on a back lawn" },
};

const services = [
  {
    title: "General Foot Care",
    description:
      "A full foot health assessment — circulation, sensation, skin and nails — then the nail care, callus and corn treatment that follows from it.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
  {
    title: "Ingrown Toenails",
    description:
      "Assessment and treatment of ingrown toenails. If the nail needs surgery, that is assessed first and arranged separately.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
        />
      </svg>
    ),
  },
  {
    title: "Diabetic Foot Care",
    description:
      "Specialised assessments and ongoing care for patients with diabetes to prevent complications.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
    ),
  },
  {
    title: "Sports Podiatry",
    description:
      "Assessment and treatment of sports-related foot and lower limb injuries. Biomechanical analysis included.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M13 10V3L4 14h7v7l9-11h-7z"
        />
      </svg>
    ),
  },
  {
    title: "Custom Orthotics",
    description:
      "Prescription orthotics tailored to your feet to address pain, improve function and enhance comfort.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
        />
      </svg>
    ),
  },
  {
    title: "Paediatric Podiatry",
    description:
      "Specialised care for children's feet, addressing developmental concerns and growing pains.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
    ),
  },
];

export function Services() {
  return (
    <section id="services" className="py-16 sm:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mb-12">
          <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-4">
            Services
          </h2>
          <p className="text-lg text-gray-600">
            Comprehensive podiatry services delivered to your home with the same
            professional standards as a clinic visit.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="p-6 border border-gray-100 hover:border-gray-200 transition-colors"
            >
              {SERVICE_IMAGES[service.title] && (
                <div className="relative mb-5 aspect-[16/9] overflow-hidden rounded-lg">
                  <Image
                    src={SERVICE_IMAGES[service.title].src}
                    alt={SERVICE_IMAGES[service.title].alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
              )}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
