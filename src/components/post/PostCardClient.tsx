"use client";

import Link from "next/link";
import TiltCard from "../TiltCard";
import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface PostCardClientProps {
  slug: string;
  children: React.ReactNode;
  index?: number;
}

export default function PostCardClient({
  slug,
  children,
  index = 0, // 기본값 0
}: PostCardClientProps) {
  const { isDarkMode } = useThemeStore();
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 마운트
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // 스켈레톤 UI 반환
    return (
      <div className="h-full">
        <div className="rounded-2xl overflow-hidden h-full flex flex-col backdrop-blur-sm bg-white/10 border border-white/20 animate-pulse">
          <div className="aspect-square relative w-full bg-gray-700"></div>
          <div className="p-5 flex flex-col flex-grow">
            <div className="h-6 w-full bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-3/4 bg-gray-700 rounded mb-3"></div>
            <div className="flex justify-between items-center mt-auto">
              <div className="h-4 w-1/4 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.1,
        ease: "easeOut",
      }}
      className="h-full"
    >
      <TiltCard
        maxTilt={10}
        perspective={800}
        transitionSpeed={0.3}
        className="h-full"
      >
        <Link href={`/blog/${slug}`} className="block h-full">
          <div
            className={`${
              isDarkMode
                ? "backdrop-blur-sm bg-white/10 text-white"
                : "group backdrop-blur-sm text-gray-800"
            } rounded-2xl overflow-hidden h-full flex flex-col transition-colors`}
          >
            {children}
          </div>
        </Link>
      </TiltCard>
    </motion.div>
  );
}
