"use client";

import { useThemeStore } from "@/store/themeStore";
import { useEffect, useState } from "react";

//추후 확장할거임 ㅠㅠ
interface HeroSectionProps {
  title?: string;
  subtitle?: string;
  backgroundImage?: string;
  className?: string;
}

export default function HeroSection({
  title = "Blog",
  subtitle,
  backgroundImage,
  className = "",
}: HeroSectionProps) {
  const { isDarkMode } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  // 마운트 상태 확인
  useEffect(() => {
    setMounted(true);
  }, []);

  // 테마에 따른 클래스 동적 결정
  const titleClassName = mounted
    ? `text-3xl md:text-4xl font-bold mb-8 text-center ${
        isDarkMode ? "text-gray-200" : "text-gray-800"
      }`
    : "text-3xl md:text-4xl font-bold mb-8 text-center opacity-0";

  const subtitleClassName = mounted
    ? `text-lg text-center max-w-3xl mx-auto mb-6 ${
        isDarkMode ? "text-gray-300" : "text-gray-600"
      }`
    : "text-lg text-center max-w-3xl mx-auto mb-6 opacity-0";

  return (
    <div className={`w-full py-8 ${className}`}>
      <h1 className={titleClassName}>{title}</h1>

      {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
    </div>
  );
}
