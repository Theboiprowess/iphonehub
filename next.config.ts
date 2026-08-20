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
    ],
    unoptimized: false,
  },
  // Allow base64 images
  experimental: {
    optimizeCss: true,
  },
  // Allow CSS imports from components
  transpilePackages: [],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
