import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    // Add other image domains as needed
  },
};

export default nextConfig;
