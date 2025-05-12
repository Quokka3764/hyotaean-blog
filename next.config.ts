import type { NextConfig } from "next";

const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE;
const storageDomain = storageUrl ? new URL(storageUrl).host : "";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: storageDomain
      ? [
          {
            protocol: "https",
            hostname: storageDomain,
            port: "",
            pathname: "/storage/v1/object/public/blog-images/**",
          },
        ]
      : [],
  },
};

export default nextConfig;
