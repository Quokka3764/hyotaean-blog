"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, systemTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  // 클라이언트 사이드에서만 마운트 (테마 로직에 필요)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const currentTheme = isMounted
    ? theme === "system"
      ? systemTheme
      : theme
    : undefined;

  const isDarkMode = isMounted && currentTheme === "dark";

  // 기본 스타일
  const defaultLinkClass = "transition-colors";

  // 테마 적용 스타일 - 마운트된 후에만 적용
  const themeSpecificClass = isMounted
    ? isDarkMode
      ? "text-white hover:text-blue-300"
      : "text-gray-800 hover:text-blue-500"
    : "text-gray-800 hover:text-blue-500";

  // 최종 스타일
  const linkClass = `${defaultLinkClass} ${themeSpecificClass}`;

  return (
    <div className="flex justify-between items-center w-full">
      <Link href="/" className={`text-xl font-bold ${linkClass}`}>
        hyotaean
      </Link>
      <div className="flex items-center space-x-4">
        {isMounted && <ThemeToggle />}
        <Link href="/about" className={linkClass}>
          About
        </Link>
      </div>
    </div>
  );
}
