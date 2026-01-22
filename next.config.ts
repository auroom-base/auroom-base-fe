import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
  openAnalyzer: true,
  analyzerMode: "static",
});

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Performance optimizations
  compress: true,
  reactStrictMode: true,
  // CSS optimization (experimental feature for critical CSS inlining)
  experimental: {
    optimizeCss: true,
  },
};

export default withBundleAnalyzer(nextConfig);
