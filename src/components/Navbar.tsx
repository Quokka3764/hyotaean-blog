"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "./ThemeToggle";
import { useThemeStore } from "@/store/themeStore";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isDarkMode } = useThemeStore();
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 마운트
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 모바일 메뉴가 열렸을 때 스크롤 방지
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  // 초기 렌더링에서는 서버/클라이언트 불일치를 피하기 위해 기본 스타일 사용
  const linkClass = isMounted
    ? `${
        isDarkMode ? "text-white" : "text-gray-800"
      } hover:text-blue-500 transition-colors`
    : "text-white hover:text-blue-300";

  return (
    <div className="flex justify-between items-center w-full">
      <Link
        href="/"
        className={`text-xl font-bold ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        hyotaean
      </Link>

      <div className="flex items-center space-x-4">
        {/* 테마 토글 버튼 */}
        <ThemeToggle />

        {/* 모바일 메뉴 토글 버튼 */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={isDarkMode ? "text-white" : "text-gray-800"}
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? "✕" : "☰"}
            </motion.div>
          </button>
        </div>

        {/* 데스크톱 네비게이션 링크 */}
        <div className="hidden md:flex space-x-6">
          <Link href="/" className={linkClass}>
            Home
          </Link>
          <Link href="/blog" className={linkClass}>
            Blog
          </Link>
          <Link href="/about" className={linkClass}>
            About
          </Link>
        </div>
      </div>

      {/* 모바일 메뉴 (반응형) */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={`absolute top-16 right-0 left-0 ${
              isDarkMode ? "bg-black/80" : "bg-white/90"
            } backdrop-blur-md p-4 md:hidden shadow-lg`}
          >
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className={linkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/blog"
                className={linkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                href="/about"
                className={linkClass}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
