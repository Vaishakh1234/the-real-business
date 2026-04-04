import type { NextConfig } from "next";
import { IMAGE_OPTIMIZE_EXACT_HOSTS } from "./lib/public-image-hosts";

/**
 * Do not set `search: ""` — in Next.js that means "no query string only", so URLs
 * like `images.unsplash.com/...?w=800` fail to match and Image reports the host
 * as unconfigured. Omit `search` to allow any query (or none).
 */
const imageRemotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] =
  [
    ...IMAGE_OPTIMIZE_EXACT_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
      pathname: "/**" as const,
    })),
    // Allow `<Image src={supabasePublicUrl} />`; use `unoptimized` for storage (see `public-image-hosts`).
    {
      protocol: "https",
      hostname: "*.supabase.co",
      pathname: "/**",
    },
  ];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageRemotePatterns,
  },
  async redirects() {
    return [
      {
        source: "/postproperty",
        destination: "/post-property",
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"],
    },
  },
};

export default nextConfig;
