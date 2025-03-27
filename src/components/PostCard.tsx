"use client";

import Link from "next/link";
import Image from "next/image";
import TiltCard from "./TiltCard";
import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";
import type { PostCardProps as BasePostCardProps } from "@/types/posts";

const defaultImagePath = "/hardSeal.jpg";

interface PostCardProps extends BasePostCardProps {
  readingTime?: number;
  excerpt?: string;
}

export default function PostCard({
  post,
}: {
  post: BasePostCardProps & { readingTime?: number; excerpt?: string };
}) {
  const { isDarkMode } = useThemeStore();
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 마운트
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const thumbnailSrc = post.thumbnail || defaultImagePath;

  if (!isMounted) {
    return (
      <div className="h-full">
        <div className="rounded-2xl overflow-hidden h-full flex flex-col backdrop-blur-sm bg-white/10 border border-white/20">
          <div className="aspect-square relative w-full bg-gray-800"></div>
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

  // 다크모드, glass가 좋아!
  if (isDarkMode) {
    return (
      <div className="h-full">
        <TiltCard
          maxTilt={10}
          perspective={800}
          transitionSpeed={0.3}
          className="h-full"
        >
          <Link href={`/blog/${post.slug}`} className="block h-full">
            <div className="backdrop-blur-sm bg-white/10 rounded-2xl overflow-hidden h-full flex flex-col transition-colors">
              <div className="aspect-square relative w-full overflow-hidden">
                <Image
                  src={thumbnailSrc}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
                  priority
                />
              </div>
              <div className="w-full h-px bg-white/10"></div>
              <div className="p-5 flex flex-col flex-grow">
                <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-white hover:text-blue-400 transition-colors">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                    {post.excerpt}
                  </p>
                )}
                <div className="flex justify-between items-center text-sm text-gray-300 mt-auto">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  {post.readingTime && <span>{post.readingTime} min read</span>}
                </div>
              </div>
            </div>
          </Link>
        </TiltCard>
      </div>
    );
  }

  // 라이트모드
  return (
    <div className="h-full">
      <TiltCard
        maxTilt={10}
        perspective={800}
        transitionSpeed={0.3}
        className="h-full"
      >
        <Link href={`/blog/${post.slug}`} className="block h-full">
          <div className="group backdrop-blur-sm rounded-2xl overflow-hidden h-full flex flex-col transition-colors">
            <div className="aspect-square relative w-full overflow-hidden">
              <Image
                src={thumbnailSrc}
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
                priority
              />
            </div>
            <div className="w-full h-px bg-gray-200"></div>
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-gray-800 transition-colors group-hover:text-blue-600">
                {post.title}
              </h2>
              {post.excerpt && (
                <p className="text-sm text-gray-600 line-clamp-2 mb-3 transition-colors group-hover:text-gray-800">
                  {post.excerpt}
                </p>
              )}
              <div className="flex justify-between items-center text-sm text-gray-500 mt-auto">
                <span>{new Date(post.date).toLocaleDateString()}</span>
                {post.readingTime && <span>{post.readingTime} min read</span>}
              </div>
            </div>
          </div>
        </Link>
      </TiltCard>
    </div>
  );
}
