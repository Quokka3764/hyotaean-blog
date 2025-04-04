"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 마운트
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // 마운트 전 기본 형태 표시
    return <div className="w-14 h-7 rounded-full bg-gray-700"></div>;
  }

  // system일 경우 systemTheme를 사용
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-7 rounded-full flex items-center justify-center ${
        isDark ? "bg-gray-700" : "bg-blue-100"
      } transition-colors duration-300`}
      aria-label={isDark ? "라이트 모드로 전환" : "다크 모드로 전환"}
    >
      {/* 슬라이딩 원 */}
      <motion.div
        className={`absolute w-5 h-5 rounded-full flex items-center justify-center ${
          isDark ? "bg-indigo-200" : "bg-yellow-400"
        }`}
        initial={false}
        animate={{ x: isDark ? -12 : 12 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {/* 다크모드 아이콘 */}
        {isDark && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-indigo-800"
          >
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
          </svg>
        )}
        {/* 라이트모드 아이콘 */}
        {!isDark && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-yellow-800"
          >
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
          </svg>
        )}
      </motion.div>

      {/* 배경의 작은 별들 (다크모드일 때만 보임) */}
      {isDark && (
        <>
          <motion.div
            className="absolute w-1 h-1 rounded-full bg-white"
            style={{ left: "20%", top: "30%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2,
              repeatType: "reverse",
              delay: 0.5,
            }}
          />
          <motion.div
            className="absolute w-0.5 h-0.5 rounded-full bg-white"
            style={{ right: "20%", top: "60%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              repeatType: "reverse",
              delay: 0.2,
            }}
          />
          <motion.div
            className="absolute w-0.5 h-0.5 rounded-full bg-white"
            style={{ right: "30%", top: "40%" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{
              repeat: Infinity,
              duration: 2.5,
              repeatType: "reverse",
              delay: 0.8,
            }}
          />
        </>
      )}
    </button>
  );
}
