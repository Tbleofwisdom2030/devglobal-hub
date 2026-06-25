/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.devglobalhub.com', 'images.unsplash.com', 'avatars.githubusercontent.com'],
  },
  transpilePackages: ['@devglobal/shared', '@devglobal/ui'],
};

module.exports = nextConfig;
