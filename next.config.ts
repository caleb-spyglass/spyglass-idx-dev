import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.repliers.io',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
