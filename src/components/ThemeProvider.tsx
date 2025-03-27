"use client";

import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDarkMode } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // 마운트 상태 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 다크모드 토글 적용 (마운트 후에만)
  useEffect(() => {
    if (!mounted) return;

    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.classList.add(
        "bg-[#0f1729]",
        "bg-space-pattern",
        "text-gray-100"
      );
      document.body.classList.remove("bg-gray-50", "text-gray-900");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.classList.remove(
        "bg-[#0f1729]",
        "bg-space-pattern",
        "text-gray-100"
      );
      document.body.classList.add("bg-gray-50", "text-gray-900");
    }
  }, [isDarkMode, mounted]);

  return children;
}
