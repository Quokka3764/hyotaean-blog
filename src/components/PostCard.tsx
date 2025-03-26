"use client";

import Link from "next/link";
import Image from "next/image";
import TiltCard from "./TiltCard";
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
  // thumbnail이 존재하는지 확인하고, 없으면 defaultImagePath 사용
  const thumbnailSrc = post.thumbnail || defaultImagePath;

  return (
    <div className="h-full">
      <TiltCard
        maxTilt={10} // 더 큰 기울기 효과
        perspective={800} // 더 강한 원근감
        scale={1.02} // 호버 시 약간만 확대
        transitionSpeed={0.3} // 빠른 전환 속도
        className="h-full"
      >
        <Link href={`/blog/${post.slug}`} className="block h-full">
          <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl overflow-hidden h-full flex flex-col transition-all hover:bg-white/20">
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

            {/* 텍스트 영역 */}
            <div className="p-5 flex flex-col flex-grow">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-white">
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
