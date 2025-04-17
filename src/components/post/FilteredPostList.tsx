import React from "react";
import type { PostCardProps } from "@/types/posts";
import { getPostsByTagServer } from "@/lib/posts";
import { PostList } from "./PostList";

interface FilteredPostListProps {
  tag: string;
}

export async function FilteredPostList({ tag }: FilteredPostListProps) {
  const posts: PostCardProps[] = await getPostsByTagServer(tag);

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400">
          선택한 태그 “{tag}”에 해당하는 포스트가 없습니다.
        </p>
      </div>
    );
  }

  return <PostList posts={posts} />;
}
