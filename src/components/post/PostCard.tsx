import React from "react";
import Image from "next/image";
import PostCardClient from "./PostCardClient";
import type { PostCardProps as BaseProps } from "@/types/posts";
import { parseISO } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ko } from "date-fns/locale";

const DEFAULT_IMAGE = "/harpSeal.jpg";

interface PostCardProps {
  post: BaseProps & { excerpt?: string };
  index?: number;
}

export function PostCard({ post, index = 0 }: PostCardProps) {
  const thumbnail = post.thumbnail || DEFAULT_IMAGE;
  const formattedDate = formatInTimeZone(
    parseISO(post.date),
    "Asia/Seoul",
    "yyyy년 MM월 dd일",
    { locale: ko }
  );

  return (
    <div className="h-full w-full">
      <PostCardClient slug={post.slug} index={index}>
        <div className="rounded-2xl overflow-hidden h-full flex flex-col">
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
              priority
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
      </PostCardClient>
    </div>
  );
}
