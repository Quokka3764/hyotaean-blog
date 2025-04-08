"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeroTaglineProps {
  isDark: boolean;
  taglines: string[];
  currentTaglineIndex: number;
}

function HeroTagline({
  isDark,
  taglines,
  currentTaglineIndex,
}: HeroTaglineProps) {
  return (
    <div className="h-8 md:h-10 mt-2 mb-6 overflow-hidden">
      <motion.p
        key={currentTaglineIndex}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className={
          isDark
            ? "text-gray-300 text-lg md:text-xl font-medium"
            : "text-gray-600 text-lg md:text-xl font-medium"
        }
      >
        {taglines[currentTaglineIndex]}
      </motion.p>
    </div>
  );
}

export default React.memo(HeroTagline);
