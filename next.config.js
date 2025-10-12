/** @type {import('next').NextConfig} */
const nextConfig = { typescript: { ignoreBuildErrors: true }, eslint: { ignoreDuringBuilds: true },
  output: "standalone",
  images: { unoptimized: true },
  experimental: { typedRoutes: true }
};
module.exports = nextConfig;
