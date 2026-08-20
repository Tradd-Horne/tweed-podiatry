export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-white font-semibold mb-4">
              Tweed Heads Podiatry
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Professional mobile podiatry services across Tweed Heads, Northern
              Rivers and Northern NSW.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  General Foot Care
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Ingrown Toenails
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Diabetic Foot Care
                </a>
              </li>
              <li>
                <a
                  href="#services"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Custom Orthotics
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Areas</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="#areas"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Tweed Heads
                </a>
              </li>
              <li>
                <a
                  href="#areas"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Northern Rivers
                </a>
              </li>
              <li>
                <a
                  href="#areas"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Byron Bay
                </a>
              </li>
              <li>
                <a
                  href="#areas"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Ballina
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="tel:0403643158"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  0403 643 158
                </a>
              </li>
              <li>
                <a
                  href="mailto:tradd@tweedheadspodiatry.com.au"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Email Us
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              &copy; {currentYear} Tweed Heads Podiatry. All rights reserved.
            </p>
            <p className="text-gray-500 text-sm">
              ABN: [Your ABN Here]
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
