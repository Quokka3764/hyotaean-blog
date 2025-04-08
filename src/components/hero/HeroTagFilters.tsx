"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeroTagFiltersProps {
  isDark: boolean;
  tags: string[];
  selectedTagIndex: number;
  setSelectedTagIndex: (index: number) => void;
}

function HeroTagFilters({
  isDark,
  tags,
  selectedTagIndex,
  setSelectedTagIndex,
}: HeroTagFiltersProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="flex flex-wrap justify-center gap-2 mb-12"
    >
      {tags.map((tag, index) => (
        <motion.button
          key={tag}
          onClick={() => setSelectedTagIndex(index)}
          className={`py-1.5 px-4 text-sm rounded-full transition-all duration-200 shadow-sm ${
            selectedTagIndex === index
              ? isDark
                ? "bg-blue-500 text-white border border-blue-500"
                : "bg-indigo-600 text-white border border-indigo-600"
              : isDark
              ? "border border-blue-500 text-blue-200 hover:bg-blue-500 hover:text-gray-200"
              : "border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-gray-200"
          }`}
        >
          {tag}
        </motion.button>
      ))}
    </motion.div>
  );
}

export default React.memo(HeroTagFilters);
