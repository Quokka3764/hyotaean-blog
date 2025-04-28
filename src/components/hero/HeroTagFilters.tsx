"use client";

import React from "react";
import { motion } from "framer-motion";
import type { HeroTagFiltersProps } from "./types";

export default function HeroTagFilters({
  tags = [],
  selectedTagIndex,
  setSelectedTagIndex,
}: Omit<HeroTagFiltersProps, "isDark">) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="flex flex-wrap justify-center gap-2"
    >
      {tags.map((tag, i) => {
        const isActive = selectedTagIndex === i;

        return (
          <motion.button
            key={tag}
            onClick={() => setSelectedTagIndex(i)}
            whileTap={{ scale: 0.95 }}
            className={`
              py-1.5 px-4 text-sm font-medium rounded-full transition-colors duration-200 shadow-sm
              ${
                isActive
                  ? "bg-indigo-600 text-white border-transparent dark:bg-indigo-500"
                  : "bg-transparent text-indigo-600 border border-indigo-600 hover:bg-indigo-600 hover:text-white dark:bg-indigo-900/20 dark:text-indigo-200 dark:border-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white"
              }
            `}
          >
            {tag}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
