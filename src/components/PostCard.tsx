"use client";

import Link from "next/link";
import Image from "next/image";

// Post 인터페이스 정의
interface Post {
  slug: string;
  title: string;
  date: string;
  excerpt?: string;
  thumbnail?: string;
  tags?: string[];
}
const defaultSrc = "/harp seal.jpg";

export default function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/blog/${post.slug}`}>
      <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-2xl overflow-hidden transition-all hover:bg-white/20 hover:scale-[1.02] hover:shadow-lg max-w-[320px] mx-auto h-full">
        {/* 정사각형 썸네일 영역 */}
        <div className="aspect-square relative">
          <Image
            src={post.thumbnail || defaultSrc}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
            priority
          />
        </div>

        {/* 텍스트 영역 */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-2 line-clamp-2 text-white">
            {post.title}
          </h2>
          <div className="flex justify-between items-center text-sm text-gray-300">
            <span>{new Date(post.date).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
