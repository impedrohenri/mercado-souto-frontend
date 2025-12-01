import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
    images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '162.243.70.61',
        port: '8080',
        pathname: '**',
      },
    ],
  },

};

export default nextConfig;
