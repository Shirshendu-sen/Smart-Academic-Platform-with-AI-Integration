import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // ── API PROXY REWRITES ─────────────────────────────────────────
  // In development: /api/* → http://localhost:3001/api/*
  // This means the frontend can call /api/auth/login instead of
  // http://localhost:3001/api/auth/login, avoiding CORS issues in dev.
  //
  // In production: NEXT_PUBLIC_BACKEND_URL is used by the axios instance directly.
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
