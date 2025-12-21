import type { NextConfig } from "next";
import { withContentlayer } from "next-contentlayer2";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  turbopack: {},
  experimental: {
    serverComponentsExternalPackages: ["@auth/core"],
  },
};

export default withContentlayer(nextConfig);
