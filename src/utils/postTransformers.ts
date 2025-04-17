import type { PostWithTags } from "@/types/database";
import type { PostCardProps } from "@/types/posts";

/**
 * Supabase에서 가져온 포스트 데이터를 프론트엔드 표시용 포맷으로 변환
 */
export function postTransformers(
  posts: PostWithTags[] | null
): PostCardProps[] {
  if (!posts) {
    return [];
  }

  return posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    excerpt: post.excerpt ?? "",
    thumbnail: post.thumbnail ?? "",
    tags: Array.isArray(post.tags)
      ? post.tags.map((tag) => (typeof tag === "string" ? tag : String(tag)))
      : [],
  }));
}
