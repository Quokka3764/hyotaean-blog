"use client";

import Link from "next/link";
import PostCardSkeleton from "./PostCardSkeleton";
import { useTheme } from "next-themes";
import { useState, useEffect, useMemo, useRef, memo } from "react";

interface PostCardClientProps {
  slug: string;
  children: React.ReactNode;
  index?: number;
}

function PostCardClient({ slug, children }: PostCardClientProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const isDarkMode = (theme === "system" ? systemTheme : theme) === "dark";
  const cardStyles = useMemo(
    () =>
      // useMemo
      isDarkMode
        ? "backdrop-blur-sm bg-white/10 text-white"
        : "group backdrop-blur-sm bg-gray-50 text-gray-800",
    [isDarkMode]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <PostCardSkeleton />;
  }

  return (
    <div ref={cardRef} className="h-full">
      <Link href={`/blog/${slug}`} className="block h-full" prefetch={false}>
        <div
          className={`${cardStyles} rounded-2xl overflow-hidden h-full flex flex-col transition-colors`}
        >
          {children}
        </div>
      </Link>
    </div>
  );
}

export default memo(PostCardClient);
