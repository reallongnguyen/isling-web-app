import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'localhost',
      },
      {
        hostname: 'storage.googleapis.com',
      },
      {
        hostname: 'api.dev.isling.me',
      },
      {
        hostname: 'api.isling.me',
      },
    ],
  },
};

export default nextConfig;
