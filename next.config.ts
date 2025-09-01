import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['localhost'],
    // Add other image domains as needed
  },
  // Allow connections from all hosts when running in development
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  },
  // Explicitly allow Tailscale domain for development
  allowedDevOrigins: process.env.NEXT_PUBLIC_TAILSCALE_DOMAIN 
    ? [`https://${process.env.NEXT_PUBLIC_TAILSCALE_DOMAIN}`]
    : [],
};

export default nextConfig;
