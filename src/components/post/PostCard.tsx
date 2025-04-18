"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ko } from "date-fns/locale";
import type { PostCardProps as BaseProps } from "@/types/posts";

const DEFAULT_IMAGE = "/harpSeal.jpg";

interface PostCardProps {
  post: BaseProps;
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const { theme, systemTheme } = useTheme();
  const isDark = (theme === "system" ? systemTheme : theme) === "dark";

  const cardStyles = isDark
    ? "backdrop-blur-sm bg-white/10 text-white"
    : "group backdrop-blur-sm bg-gray-50 text-gray-800";

  const thumbnail = post.thumbnail || DEFAULT_IMAGE;

  const formattedDate = formatInTimeZone(
    parseISO(post.date),
    "Asia/Seoul",
    "yyyy년 MM월 dd일",
    { locale: ko }
  );

  return (
    <div className="h-full w-full">
      <Link
        href={`/blog/${post.slug}`}
        className="block h-full"
        prefetch={false}
      >
        <div
          className={`${cardStyles} rounded-2xl overflow-hidden h-full flex flex-col transition-colors`}
        >
          <div
            className="relative w-full overflow-hidden"
            style={{ aspectRatio: "16/9" }}
          >
            <Image
              src={thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={index < 3} // Top 3개까지만 priority
              quality={80}
            />
          </div>
          <div className="w-full h-px" />
          <div className="p-6 flex flex-col flex-grow">
            <h2 className="text-xl font-semibold mb-3 line-clamp-1 leading-relaxed">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-sm line-clamp-2 mb-4 leading-relaxed">
                {post.excerpt}
              </p>
            )}
            <div className="flex justify-between items-center text-sm mt-auto pt-2">
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
