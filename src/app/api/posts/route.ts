import { NextRequest, NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";
import type { PostCardProps } from "@/types/posts";

export async function GET(request: NextRequest) {
  try {
    // URL 쿼리 파라미터에서 태그 가져오기
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    console.log("API 요청 - 태그:", tag);

    // 모든 포스트 가져오기 (flat 구조의 PostCardProps[])
    const allPosts: PostCardProps[] = await getAllPosts();

    // 태그 기반 필터링
    let filteredPosts: PostCardProps[] = allPosts;
    if (tag && tag !== "All") {
      filteredPosts = allPosts.filter(
        (post) =>
          Array.isArray(post.tags) &&
          post.tags.some((t) => t.toLowerCase() === tag.toLowerCase())
      );
      console.log(`태그 '${tag}'로 필터링된 포스트: ${filteredPosts.length}개`);
    }

    // 클라이언트에 반환할 형식 변환
    const formatted = filteredPosts.map((post) => ({
      id: String(post.slug),
      slug: post.slug,
      title: post.title,
      content: "",
      excerpt: post.excerpt || null,
      thumbnail: post.thumbnail || null,
      created_at: post.date,
      updated_at: post.date,
      date: post.date,
      tags: post.tags ?? [],
    }));

    return NextResponse.json({ posts: formatted });
  } catch (error) {
    console.error("API 오류:", error);
    return NextResponse.json(
      { error: "포스트 목록을 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
