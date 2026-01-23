/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/framer-motion-showcase',
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
