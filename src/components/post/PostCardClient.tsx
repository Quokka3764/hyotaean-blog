"use client";

import Link from "next/link";
import PostCardSkeleton from "./PostCardSkeleton";
import { useTheme } from "next-themes";
import { useMemo, memo, useRef, useEffect, useState } from "react";

interface PostCardClientProps {
  slug: string;
  children: React.ReactNode;
  index?: number;
}

function PostCardClient({ slug, children }: PostCardClientProps) {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 마운트되도록 처리
  useEffect(() => {
    setMounted(true);
  }, []);

  // 다크모드
  const isDarkMode =
    mounted && (theme === "system" ? systemTheme : theme) === "dark";

  const cardRef = useRef<HTMLDivElement>(null);

  //메모이제이션
  const cardStyles = useMemo(() => {
    return isDarkMode
      ? "backdrop-blur-sm bg-white/10 text-white"
      : "group backdrop-blur-sm bg-gray-50 text-gray-800";
  }, [isDarkMode]);

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
