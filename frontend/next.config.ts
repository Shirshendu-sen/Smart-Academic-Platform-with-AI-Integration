import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── API PROXY REWRITES ─────────────────────────────────────────
  // In development: /api/* → http://localhost:3001/api/*
  // This means the frontend can call /api/auth/login instead of
  // http://localhost:3001/api/auth/login, avoiding CORS issues in dev.
  //
  // In production: These rewrites still apply (Next.js server acts as proxy).
  // To bypass the proxy and call the backend directly, set NEXT_PUBLIC_BACKEND_URL
  // and change the axios baseURL in lib/api.ts to use it.
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/api/:path*`
      }
    ];
  },

  // Allow images from Cloudinary and other external sources
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' }
    ]
  }
};

export default nextConfig;
