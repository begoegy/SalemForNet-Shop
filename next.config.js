/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // اهم سطر: اقفل التايبد روتس
    typedRoutes: false,
  },
};

module.exports = nextConfig;
