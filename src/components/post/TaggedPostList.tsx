"use client";

import React from "react";
import { usePostsByTag } from "@/hooks/usePostsByTag";
import { useTagStore } from "@/store/useTagStore";
import { motion } from "framer-motion";
import { PostCard } from "./PostCard";

export function TaggedPostList() {
  const selectedTag = useTagStore((state) => state.selectedTag);
  const {
    data: posts = [],
    isLoading,
    isError,
  } = usePostsByTag(selectedTag || "All");

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 animate-pulse">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 bg-gray-200 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500">
          포스트를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500 dark:text-gray-400">
          선택한 태그 "{selectedTag}"에 해당하는 포스트가 없습니다.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8"
    >
      {posts.map((post, index) => (
        <div key={post.slug} className="h-full">
          <PostCard post={post} index={index} />
        </div>
      ))}
    </motion.div>
  );
}
