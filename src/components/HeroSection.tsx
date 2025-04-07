"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
}

export default function HeroSection({
  title = "Blog",
  subtitle,
  className = "",
}: HeroSectionProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 서버 렌더링 시 또는 클라이언트 하이드레이션 전에는 기본 스타일 사용
  if (!mounted) {
    return (
      <div className={`w-full py-8 ${className}`}>
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-gray-800">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-center max-w-3xl mx-auto mb-6 text-gray-600">
            {subtitle}
          </p>
        )}
      </div>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className={`w-full py-8 ${className}`}>
      <h1
        className={`text-3xl md:text-4xl font-bold mb-8 text-center ${
          isDark ? "text-gray-200" : "text-gray-800"
        }`}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          className={`text-lg text-center max-w-3xl mx-auto mb-6 ${
            isDark ? "text-gray-300" : "text-gray-600"
          }`}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
