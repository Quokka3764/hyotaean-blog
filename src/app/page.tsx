import React from "react";
import HeroSection from "@/components/hero/HeroSection";
import { PostsContainer } from "@/components/post/PostsContainer";
import { FilteredPostList } from "@/components/post/FilteredPostList";
import { getAllPosts } from "@/lib/posts";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { ClientFilterIndicator } from "@/components/post/ClientFilterIndicator";

export default async function BlogPage() {
  // 서버에서 초기 데이터 페칭
  const initialPosts = await getAllPosts();
  const tags = Array.from(
    new Set(["All", ...initialPosts.flatMap((post) => post.tags ?? [])])
  );

  // QueryClient 생성 및 초기 데이터 설정
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["postsByTag", "All"],
    queryFn: () => initialPosts,
  });

  // 상태 직렬화
  const dehydratedState = dehydrate(queryClient);

  return (
    <main className="w-full px-4 sm:px-6">
      <HeroSection tags={tags} />
      <section className="mt-10">
        {/* 서버 컴포넌트 - 초기 렌더링 */}
        <div id="server-posts">
          <FilteredPostList tag="All" />
        </div>

        {/* 클라이언트 필터링 상태 표시 및 서버 컴포넌트 숨김 처리 */}
        <HydrationBoundary state={dehydratedState}>
          <ClientFilterIndicator />
          <PostsContainer initialTag="All" />
        </HydrationBoundary>
      </section>
    </main>
  );
}
