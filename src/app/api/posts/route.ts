// src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("API 오류:", error);
    return NextResponse.json(
      { error: "포스트 목록을 가져오는 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
