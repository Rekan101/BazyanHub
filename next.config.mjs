/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    qualities: [60, 75, 80],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      /*
       * Supabase Storage. The project ref is not known at build time and
       * differs per environment, so the subdomain is wildcarded rather
       * than pinned to one project.
       */
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;