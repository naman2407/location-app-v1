/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3845',
        pathname: '/assets/**',
      },
    ],
    unoptimized: true,
  },
  // Prevent webpack chunk loading issues
  webpack: (config, { dev }) => {
    if (dev) {
      // Avoid stale disk cache/chunk mismatch in dev.
      config.cache = false
      // Ensure consistent chunk naming across recompiles.
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        chunkIds: 'deterministic',
      }
    }
    return config
  },
}

module.exports = nextConfig

