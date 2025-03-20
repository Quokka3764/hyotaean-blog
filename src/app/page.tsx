"use client";

import { useEffect, useState } from "react";
import PostCard from "@/components/PostCard";
import { useRouter } from "next/navigation";

// Post 인터페이스 정의
interface Post {
  slug: string;
  frontmatter: {
    title: string;
    date: string;
    excerpt?: string;
    thumbnail?: string;
    tags?: string[];
  };
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/posts");

        if (!response.ok) {
          throw new Error(
            `포스트 목록을 불러오는 데 실패했습니다: ${response.status}`
          );
        }

        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setPosts(data.posts || []);
      } catch (err) {
        console.error("포스트 목록을 가져오는 중 오류 발생:", err);
        setError(
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // 로딩 상태 표시
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-white border-r-transparent"></div>
          <p className="mt-4 text-white">포스트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 오류 표시
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-red-500 mb-4">오류 발생</h2>
          <p className="text-white">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
            onClick={() => router.refresh()}
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  // 포스트가 없는 경우
  if (posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-white mb-4">
            아직 작성된 포스트가 없습니다.
          </h2>
          <p className="text-gray-300">나중에 다시 확인해 주세요!</p>
        </div>
      </div>
    );
  }

  // 포스트 목록 표시
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-white">
        Blog
      </h1>

      {/* 포스트 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <PostCard
            key={post.slug}
            post={{
              slug: post.slug,
              title: post.frontmatter.title,
              date: post.frontmatter.date,
              excerpt: post.frontmatter.excerpt,
              thumbnail: post.frontmatter.thumbnail,
              tags: post.frontmatter.tags,
            }}
          />
        ))}
      </div>
    </div>
  );
}
