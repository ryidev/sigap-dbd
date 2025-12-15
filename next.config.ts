import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  // Modern browser configuration - removes ~20KB of legacy polyfills
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Enable source maps in production for better debugging
  productionBrowserSourceMaps: true,

  // Optimize for modern browsers (ES2020+)
  experimental: {
    optimizePackageImports: ['@supabase/supabase-js'],
  },
};

export default nextConfig;
