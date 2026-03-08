/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    // Empty string means "use relative URLs", which works when the frontend is
    // served from the same domain as the Express backend (the default for this
    // project's unified-service deployment).  Set this env var to an absolute
    // URL (e.g. http://localhost:3001) only when running the Next.js dev server
    // separately from the backend.
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '',
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '',
  },
}
module.exports = nextConfig
