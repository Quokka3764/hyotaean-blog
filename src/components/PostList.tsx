"use client";

import { motion } from "framer-motion";
import PostCard from "@/components/PostCard";
import type { PostCardProps } from "@/types/posts";

interface PostListProps {
  posts: PostCardProps[];
}

// 부모 컨테이너에 적용할 애니메이션
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1, // 자식이 0.1초 간격으로 순차 애니메이션
    },
  },
};

// 각 카드 아이템에 적용할 애니메이션
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

export default function PostList({ posts }: PostListProps) {
  return (
    // 부모를 motion.div로 감싸고 variants 적용
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {posts.map((post) => (
        // 각 카드도 motion.div로 감싸고, itemVariants 적용
        <motion.div key={post.slug} variants={itemVariants}>
          <PostCard post={post} />
        </motion.div>
      ))}
    </motion.div>
  );
}
