"use client";

import PostCard from "@/components/PostCard";
import type { PostCardProps } from "@/types/posts";

interface PostListProps {
  posts: PostCardProps[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
