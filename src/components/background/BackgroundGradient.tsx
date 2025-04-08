"use client";

import { ThemeProps } from "./types";

export default function BackgroundGradient({ isDark }: ThemeProps) {
  return (
    <>
      {/* 기본 배경색 그라디언트 */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-b from-gray-900 via-indigo-950/90 to-gray-900"
            : "bg-gradient-to-b from-blue-50 via-indigo-50/30 to-white"
        }`}
      />

      {/* 글로우 효과 */}
      <div
        className="absolute inset-0"
        style={{
          background: isDark
            ? "radial-gradient(circle at 50% 50%, rgba(79, 70, 229, 0.08) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% 50%, rgba(219, 234, 254, 0.4) 0%, transparent 70%)",
        }}
      />
    </>
  );
}
