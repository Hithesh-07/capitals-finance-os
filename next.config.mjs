/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false, // Prevents code structure exposure in production devtools
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: false, // Strict typechecking on build
  },
  eslint: {
    ignoreDuringBuilds: false, // Enforce lint checks on build
  },
};

export default nextConfig;
