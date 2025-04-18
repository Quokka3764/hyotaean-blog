"use client";

import React, { memo } from "react";

function PostCardSkeleton() {
  return (
    <div className="h-full">
      <div
        className="rounded-2xl overflow-hidden h-full flex flex-col
           backdrop-blur-sm bg-white/10 dark:bg-white/5 border border-white/20"
      >
        <div
          className="relative w-full animate-pulse
                     bg-gray-300 dark:bg-gray-700/50"
          style={{ aspectRatio: "16/9" }}
          aria-label="loading thumbnail"
        />
        <div className="w-full h-px" />
        <div className="p-6 flex flex-col flex-grow">
          <div className="h-6 w-full mb-3 rounded animate-pulse bg-gray-300 dark:bg-gray-700/50" />
          <div className="h-4 w-3/4 mb-4 rounded animate-pulse bg-gray-300 dark:bg-gray-700/50" />
          <div className="flex justify-between items-center mt-auto pt-2">
            <div className="h-4 w-1/4 rounded animate-pulse bg-gray-300 dark:bg-gray-700/50" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PostCardSkeleton);
