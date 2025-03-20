// src/app/api/posts/[slug]/route.ts
import { NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const post = await getPostBySlug(slug);
    return NextResponse.json(post);
  } catch (error) {
    console.error(`${params.slug} 포스트 API 오류:`, error);
    return NextResponse.json(
      { error: "포스트를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
