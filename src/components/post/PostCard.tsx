import Image from "next/image";
import type { PostCardProps as BasePostCardProps } from "@/types/posts";
import PostCardClient from "./PostCardClient";
import { formatInTimeZone } from "date-fns-tz";
import { ko } from "date-fns/locale";
import { parseISO } from "date-fns";

const defaultImagePath = "/harpSeal.jpg";

export default function PostCard({
  post,
  index = 0,
}: {
  post: BasePostCardProps & { excerpt?: string };
  index?: number;
}) {
  const thumbnailSrc = post.thumbnail || defaultImagePath;

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
              src={thumbnailSrc}
              alt={post.title}
              className="object-cover"
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              priority={true}
              quality={80}
            />
          </div>

          <div className="w-full h-px"></div>
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
