import Image from "next/image";
import type { PostCardProps as BasePostCardProps } from "@/types/posts";
import PostCardClient from "./PostCardClient";
import { format } from "date-fns";
import { ko } from "date-fns/locale";

const defaultImagePath = "/hardSeal.jpg";

export default function PostCard({
  post,
  index = 0, // 인덱스 prop 추가 (기본값 0)
}: {
  post: BasePostCardProps & { excerpt?: string };
  index?: number;
}) {
  // 서버에서 미리 데이터 가공
  const thumbnailSrc = post.thumbnail || defaultImagePath;
  const formattedDate = format(new Date(post.date), "yyyy년 MM월 dd일", {
    locale: ko,
  });

  // 서버에서 정적 콘텐츠를 렌더링, 클라이언트 부분만 전달 (이제 index도 전달)
  return (
    <div className="h-full w-full">
      <PostCardClient slug={post.slug} index={index}>
        <div className="rounded-2xl overflow-hidden h-full flex flex-col">
          <div className="aspect-square relative w-full overflow-hidden">
            <Image
              src={thumbnailSrc}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
              priority={true}
            />
          </div>
          <div className="w-full h-px"></div>
          <div className="p-5 flex flex-col flex-grow">
            <h2 className="text-lg font-semibold mb-2 line-clamp-2">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-sm line-clamp-2 mb-3 ">{post.excerpt}</p>
            )}
            <div className="flex justify-between items-center text-sm mt-auto">
              <span>{formattedDate}</span>
            </div>
          </div>
        </div>
      </PostCardClient>
    </div>
  );
}
