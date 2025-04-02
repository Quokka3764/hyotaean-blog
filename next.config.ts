// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
// };

// export default nextConfig;

// import type { NextConfig } from "next";

// const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE;
// const storageDomain = storageUrl ? new URL(storageUrl).host : "";

// const nextConfig: NextConfig = {
//   images: {
//     domains: storageDomain ? [storageDomain] : [],
//   },
// };

// export default nextConfig;

import type { NextConfig } from "next";

const storageUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE;
const storageDomain = storageUrl ? new URL(storageUrl).host : "";

const nextConfig: NextConfig = {
  images: storageDomain
    ? {
        remotePatterns: [
          {
            protocol: "https", // 항상 https로 설정
            hostname: storageDomain,
          },
        ],
      }
    : {}, // storageDomain이 없으면 remotePatterns 설정을 아예 하지 않음
};

export default nextConfig;
