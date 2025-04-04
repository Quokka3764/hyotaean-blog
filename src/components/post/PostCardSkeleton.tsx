"use client";

import React, { memo } from "react";

function PostCardSkeleton() {
  return (
    <div className="h-full">
      <div className="rounded-2xl overflow-hidden h-full flex flex-col backdrop-blur-sm bg-white/10 border border-white/20">
        <div
          className="relative w-full bg-gray-700 animate-pulse"
          style={{ aspectRatio: "16/9" }}
        ></div>
        <div className="w-full h-px"></div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="h-6 w-full bg-gray-700 rounded mb-3 animate-pulse"></div>
          <div className="h-4 w-3/4 bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="flex justify-between items-center mt-auto pt-2">
            <div className="h-4 w-1/4 bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(PostCardSkeleton);
