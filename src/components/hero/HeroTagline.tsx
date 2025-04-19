"use client";

import React from "react";
import { motion } from "framer-motion";
import { HeroTaglineProps } from "./types";

function HeroTagline({
  taglines,
  currentTaglineIndex,
}: Omit<HeroTaglineProps, "isDark">) {
  return (
    <div className="h-8 md:h-10 mt-2 mb-6 overflow-hidden">
      <motion.p
        key={currentTaglineIndex}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -20, opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="text-lg md:text-xl font-medium text-gray-600 dark:text-gray-300"
      >
        {taglines[currentTaglineIndex]}
      </motion.p>
    </div>
  );
}

export default React.memo(HeroTagline);
