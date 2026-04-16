import type { NextConfig } from 'next';

// On Vercel preview deployments the canonical origin isn't known ahead of time
// (each branch/PR gets a unique `*.vercel.app` host). Map Vercel's own
// VERCEL_URL system variable into NEXT_PUBLIC_BASE_URL so runtime-config and
// the SEO routes emit canonical URLs that match the actual preview origin.
// Production and local dev are unaffected — in both, NEXT_PUBLIC_BASE_URL is
// already set explicitly.
if (
  process.env.VERCEL_ENV === 'preview' &&
  !process.env.NEXT_PUBLIC_BASE_URL &&
  process.env.VERCEL_URL
) {
  process.env.NEXT_PUBLIC_BASE_URL = `https://${process.env.VERCEL_URL}`;
}

const nextConfig: NextConfig = {
  images: {
    // All <Image> usages currently pass `unoptimized` to support arbitrary
    // external avatar/icon URLs without host restrictions. This remotePatterns
    // entry is kept so it can be expanded (and `unoptimized` removed) once a
    // stable set of image origins is established.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },
};

export default nextConfig;
