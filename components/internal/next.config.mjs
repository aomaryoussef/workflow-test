import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: { ignoreBuildErrors: true },
  experimental: {
    instrumentationHook: true,
    serverActions: { allowedOrigins: process.env.ALLOWED_ORIGIN.split(',') },
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: true,
        aggregateTimeout: 20, // Default webpack's value, just to be explicit
        ignored: ['**/node_modules/**', '**/.git/**', '**/.next/**'],
      };
    }

    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/locale/api/:path*',
      },
    ];
  },
};

export default withNextIntl(nextConfig);
