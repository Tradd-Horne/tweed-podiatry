/** @type {import('next').NextConfig} */
const nextConfig = {
  // Static export so the whole site is plain HTML — it can then be previewed behind the
  // tradd.net login, and later deployed anywhere without a Node process.
  output: "export",
  // next/image optimisation needs a server; export has none.
  images: { unoptimized: true },
};

export default nextConfig;
