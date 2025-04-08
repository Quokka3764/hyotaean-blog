"use client";

import React from "react";
import { motion } from "framer-motion";

interface HeroDescriptionSearchProps {
  isDark: boolean;
}

function HeroDescriptionSearch({ isDark }: HeroDescriptionSearchProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.8 }}
      className="max-w-3xl mx-auto mb-8 md:mb-10"
    >
      <p
        className={
          isDark
            ? "text-gray-100 text-sm md:text-base max-w-2xl mx-auto mb-6 leading-relaxed"
            : "text-gray-800 text-sm md:text-base max-w-2xl mx-auto mb-6 leading-relaxed"
        }
      >
        사용자 경험을 최우선으로 고민하는 프론트엔드 개발자입니다. 협업을
        중요하게 생각하며, 동료들의 의견에 귀 기울이며 적극적으로 소통하고, 함께
        성장하는 것을 즐깁니다.
      </p>

      <div className="w-full max-w-lg mx-auto relative mt-6">
        <div
          className={`relative flex items-center border ${
            isDark ? "border-gray-700" : "border-gray-200"
          } rounded-full overflow-hidden ${
            isDark ? "bg-gray-900/30" : "bg-white/80"
          } backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300`}
        >
          <input
            type="text"
            placeholder="검색"
            className={`w-full py-3 px-5 ${
              isDark ? "text-gray-200" : "text-gray-800"
            } bg-transparent focus:outline-none ${
              isDark ? "placeholder:text-gray-400" : "placeholder:text-gray-500"
            }`}
            aria-label="검색"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`absolute right-1 p-2 rounded-full ${
              isDark
                ? "bg-blue-500 hover:bg-blue-700"
                : "bg-indigo-600 hover:bg-indigo-700"
            } text-white flex items-center justify-center`}
            aria-label="검색"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default React.memo(HeroDescriptionSearch);
