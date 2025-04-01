// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

import type { NextConfig } from "next";

const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE;
const storageDomain = storageUrl ? new URL(storageUrl).host : "";

const nextConfig: NextConfig = {
  images: {
    domains: storageDomain ? [storageDomain] : [],
  },
};

export default nextConfig;
