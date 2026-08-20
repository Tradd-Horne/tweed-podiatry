import Image from "next/image";

export function About() {
  return (
    <section id="about" className="py-16 sm:py-24 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-semibold text-gray-900 mb-6">
              About Your Podiatrist
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                <strong className="text-gray-900">Tradd, B.HSc Pod</strong> is a
                qualified podiatrist bringing professional foot care directly to
                your home across Tweed Heads, the Northern Rivers and Northern
                NSW.
              </p>
              <p>
                With experience across multiple clinical settings, Tradd takes a
                patient-centred approach, assessing the entire body from the
                ground up using contemporary methods to deliver lasting value.
              </p>
              <p>
                Mobile podiatry removes the barriers of travel, parking and
                clinic waiting rooms. Whether you have mobility challenges, a
                busy schedule, or simply prefer the comfort of home, quality
                podiatric care comes to you.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-6">
              <div>
                <p className="text-2xl font-semibold text-[#1e3a5f]">B.HSc Pod</p>
                <p className="text-sm text-gray-500">Qualified Podiatrist</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#1e3a5f]">Mobile</p>
                <p className="text-sm text-gray-500">Home Visit Service</p>
              </div>
              <div>
                <p className="text-2xl font-semibold text-[#1e3a5f]">Local</p>
                <p className="text-sm text-gray-500">Northern NSW Based</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] bg-gray-200 relative overflow-hidden">
              <Image
                src="/website-images/Tradd_Podiatry.f3d84e3fa275.jpeg"
                alt="Tradd - Podiatrist"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
