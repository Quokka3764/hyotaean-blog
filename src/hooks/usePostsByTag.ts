"use client";

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { PostCardProps } from "@/types/posts";
import { createClient } from "@supabase/supabase-js";

const STALE_TIME = 5 * 60 * 1000;

const supa = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // 브라우저 노출 OK
);

async function fetchPostsByTag(tag: string, fallback: PostCardProps[] = []) {
  if (tag === "All") return fallback; // 이미 받은 초기 데이터 재사용

  const { data, error } = await supa.rpc("get_posts_by_tag", { p_tag: tag });
  if (error) throw error;
  return data ?? [];
}

export function usePostsByTag(tag: string, initialPosts?: PostCardProps[]) {
  const opts: UseQueryOptions<PostCardProps[], Error> = {
    queryKey: ["postsByTag", tag],
    queryFn: () => fetchPostsByTag(tag, initialPosts),
    staleTime: STALE_TIME,
    placeholderData: (prev) => prev,
  };

  // All 리스트는 SSR 데이터를 그대로 사용하고 재요청 차단
  if (tag === "All" && initialPosts) {
    opts.initialData = initialPosts;
    opts.enabled = false;
  }

  return useQuery(opts);
}
