/** @type {import('next').NextConfig} */

// Use dynamic require to prevent issues if this is bundled incorrectly in some environments
if (process.env.NODE_ENV === 'development') {
  try {
    const { initOpenNextCloudflareForDev } = require('@opennextjs/cloudflare');
    initOpenNextCloudflareForDev();
  } catch (e) {
    console.warn('OpenNext Cloudflare dev init skipped:', e);
  }
}

const nextConfig = {
  
  //optimizeFonts: false,
  // Exclude server-only packages that use native Node modules from bundling
  serverExternalPackages: [
    '@prisma/client', 
    '.prisma/client',
    'next-auth',
  ],

  // Redirects
  async redirects() {
    return [
      {
        source: '/watch/:slug(.+)_:id([A-Za-z0-9]+).html',
        destination: '/ads/:slug',
        permanent: true,
      },
    ];
  },

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    unoptimized: true, 
    remotePatterns: [
      { protocol: 'https', hostname: 'i.ytimg.com' },
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'i3.ytimg.com' },
      { protocol: 'https', hostname: 'yt3.ggpht.com' },
      { protocol: 'https', hostname: 'yt3.googleusercontent.com' },
      { protocol: 'https', hostname: 'tivoads.com' },
      { protocol: 'https', hostname: '*.tivoads.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'http', hostname: 'localhost' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,PATCH,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type,Authorization' },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
    ];
  },
};

module.exports = nextConfig;