import Image from "next/image";
import type { PostCardProps as BasePostCardProps } from "@/types/posts";
import PostCardClient from "./PostCardClient";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const defaultImagePath = "/harpSeal.jpg";

export default function PostCard({
  post,
  index = 0,
}: {
  post: BasePostCardProps & { excerpt?: string };
  index?: number;
}) {
  // 서버에서 미리 데이터 가공
  const thumbnailSrc = post.thumbnail || defaultImagePath;
  const formattedDate = format(new Date(post.date), "yyyy년 MM월 dd일", {
    locale: ko,
  });

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
