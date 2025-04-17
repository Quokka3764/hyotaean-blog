"use client";

import { useQuery } from "@tanstack/react-query";
import type { PostCardProps } from "@/types/posts";

const STALE_TIME = 5 * 60 * 1000;

export interface PostsByTagResponse {
  posts: PostCardProps[];
}

export async function fetchPostsByTag(tag: string): Promise<PostCardProps[]> {
  // 이미 초기 데이터가 하이드레이션 되어 있으면 API 호출 불필요
  // 필터링 시에만 새로운 API 호출
  if (tag === "All") {
    // 내부 캐시에서 가져오므로 실제 API 호출은 하지 않음
    return [];
  }

  const res = await fetch(`/api/posts?tag=${encodeURIComponent(tag)}`);
  if (!res.ok) {
    throw new Error(`포스트 조회 실패 (${res.status})`);
  }
  const data: PostsByTagResponse = await res.json();
  return data.posts;
}

export function usePostsByTag(tag: string) {
  return useQuery<PostCardProps[], Error>({
    queryKey: ["postsByTag", tag],
    queryFn: () => fetchPostsByTag(tag),
    staleTime: STALE_TIME,
    placeholderData: (prev) => prev,
  });
}
