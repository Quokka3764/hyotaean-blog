import type { PostCardProps } from "@/types/posts";
import PostCard from "./PostCard";

interface PostListProps {
  posts: PostCardProps[];
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <div key={post.slug} className="h-full">
          <PostCard post={post} index={index} />
        </div>
      ))}
    </div>
  );
}
