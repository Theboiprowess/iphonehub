import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'iphone-hub-masvingo.vercel.app',
      },
    ],
    unoptimized: false,
  },
  // Allow base64 images
  experimental: {
    optimizeCss: true,
  },
  // Allow CSS imports from components
  transpilePackages: [],
};

export default nextConfig;
