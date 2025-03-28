import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/posts";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> } // Next.js 내부 타입에 맞게 params를 Promise로 선언
) {
  const resolvedParams = await params;

  try {
    const { slug } = resolvedParams;
    const post = await getPostBySlug(slug);
    return NextResponse.json(post);
  } catch (error) {
    console.error(`${resolvedParams.slug} 포스트 API 오류:`, error);
    return NextResponse.json(
      { error: "포스트를 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
