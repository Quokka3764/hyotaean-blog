import React from "react";
import Image from "next/image";
import MarkdownRender from "@/components/MarkdownRender";
import { getAllPosts, getPostBySlug } from "@/lib/posts";
import FadeInContent from "@/components/FadeInContent";

// 정적 경로 생성을 위한 함수
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error("Static params 생성 오류:", error);
    return [];
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }> | Promise<{ slug: string }>;
}) {
  try {
    // params를 await로 언래핑
    const resolvedParams = params instanceof Promise ? await params : params;
    const slug = resolvedParams.slug;

    // API 호출 대신 직접 데이터 가져오기
    const { frontmatter, content } = await getPostBySlug(slug);

    return (
      <article className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {frontmatter.title}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date(frontmatter.date).toLocaleDateString()}
          </p>
          {frontmatter.tags && (
            <div className="mt-4 flex flex-wrap gap-2">
              {frontmatter.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full bg-gray-800 text-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 썸네일 이미지 (존재하는 경우) */}
        {frontmatter.thumbnail && (
          <div className="mb-8 relative w-full h-64 md:h-96">
            <Image
              src={frontmatter.thumbnail}
              alt={frontmatter.title}
              fill
              className="object-cover rounded-lg"
              priority
            />
          </div>
        )}

        {/* 마크다운 내용: 텍스트는 좌측 정렬, 이미지의 사이즈를 강제로 조절 */}
        <FadeInContent>
          <div className="max-w-full text-left [&_img]:mx-0 [&_img]:w-full [&_img]:h-auto">
            <MarkdownRender content={content} />
          </div>
        </FadeInContent>
      </article>
    );
  } catch (error) {
    // 에러 처리
    return (
      <div className="text-center py-8 text-red-500">
        오류:{" "}
        {error instanceof Error
          ? error.message
          : "알 수 없는 오류가 발생했습니다."}
      </div>
    );
  }
}
