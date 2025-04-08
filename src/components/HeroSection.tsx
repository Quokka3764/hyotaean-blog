"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export default function HeroSection() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  const taglines = [
    "개발자의 성장 이야기",
    "프로젝트 코드 리뷰",
    "웹 개발 인사이트",
    "알고리즘 문제풀이",
    "기술 트렌드 분석",
  ];

  const tags = [
    "All",
    "JavaScript",
    "React",
    "Next.js",
    "TypeScript",
    "Design",
    "Performance",
  ];
  const [selectedTagIndex, setSelectedTagIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
    const taglineInterval = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(taglineInterval);
  }, [taglines.length]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  // 메인 텍스트에 사용되는 그라데이션
  const mainGradient = isDark
    ? "bg-gradient-to-r from-indigo-400 to-blue-600"
    : "bg-gradient-to-r from-blue-600 to-indigo-800";

  // 글리치 오버레이용 그라데이션
  const glitchGradient1 = isDark
    ? "bg-gradient-to-r from-teal-300 via-purple-400 to-pink-300"
    : "bg-gradient-to-r from-fuchsia-600 via-rose-400 to-orange-400";

  const glitchGradient2 = isDark
    ? "bg-gradient-to-r from-purple-300 via-pink-400 to-red-300"
    : "bg-gradient-to-r from-violet-600 via-indigo-400 to-slate-800";

  // 메인 텍스트 JSX
  const textMainJSX = (
    <div className="font-extrabold text-5xl md:text-7xl tracking-tight">
      <span
        className={`bg-clip-text text-transparent ${mainGradient}`}
        style={{
          textShadow: isDark
            ? "0 0 30px rgba(79, 70, 229, 0.2)"
            : "0 1px 3px rgba(59, 130, 246, 0.2)",
        }}
      >
        Hyotaean
      </span>
      <span
        className="ml-4"
        style={{
          textShadow: isDark
            ? "0 0 20px rgba(255, 255, 255, 0.1)"
            : "0 1px 2px rgba(30, 64, 175, 0.05)",
        }}
      >
        Blog
      </span>
    </div>
  );

  const textGlitchJSX1 = (
    <div className="font-extrabold text-5xl md:text-7xl tracking-tight">
      <span
        className={`bg-clip-text text-transparent ${glitchGradient1}`}
        style={{
          textShadow: isDark
            ? "0 0 30px rgba(79, 70, 229, 0.2)"
            : "0 1px 3px rgba(59, 130, 246, 0.2)",
        }}
      >
        Hyotaean
      </span>
      <span
        className="ml-4"
        style={{
          textShadow: isDark
            ? "0 0 20px rgba(255, 255, 255, 0.1)"
            : "0 1px 2px rgba(30, 64, 175, 0.05)",
        }}
      >
        Blog
      </span>
    </div>
  );

  const textGlitchJSX2 = (
    <div className="font-extrabold text-5xl md:text-7xl tracking-tight">
      <span
        className={`bg-clip-text text-transparent ${glitchGradient2}`}
        style={{
          textShadow: isDark
            ? "0 0 30px rgba(79, 70, 229, 0.2)"
            : "0 1px 3px rgba(59, 130, 246, 0.2)",
        }}
      >
        Hyotaean
      </span>
      <span
        className="ml-2"
        style={{
          textShadow: isDark
            ? "0 0 20px rgba(255, 255, 255, 0.1)"
            : "0 1px 2px rgba(30, 64, 175, 0.05)",
        }}
      >
        Blog
      </span>
    </div>
  );

  // 글리치 오버레이 1
  const glitchOverlayVariants1 = {
    rest: { opacity: 0, x: 3, y: -3 },
    glitch: {
      opacity: [0, 0.8, 0],
      x: [3, -2, 3],
      y: [-3, 2, -3],
    },
  };

  // 글리치 오버레이 2 (반대 방향)
  const glitchOverlayVariants2 = {
    rest: { opacity: 0, x: -3, y: 3 },
    glitch: {
      opacity: [0, 0.8, 0],
      x: [-3, 2, -3],
      y: [3, -2, 3],
    },
  };

  return (
    <section className="w-full py-12 md:py-20 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 text-center">
        {/* 메인 타이틀 영역 */}
        <div className="relative py-4">
          {/* 글리치 오버레이 1 */}
          <motion.div
            variants={glitchOverlayVariants1}
            initial="rest"
            animate="glitch"
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 7,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {textGlitchJSX1}
          </motion.div>

          {/* 글리치 오버레이 2 */}
          <motion.div
            variants={glitchOverlayVariants2}
            initial="rest"
            animate="glitch"
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              repeat: Infinity,
              repeatDelay: 7,
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {textGlitchJSX2}
          </motion.div>

          {/* 메인 텍스트 */}
          <motion.h1 className="relative z-10">{textMainJSX}</motion.h1>
        </div>

        {/* 태그라인 */}
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

        {/* 설명 텍스트 & 검색바 */}
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
            중요하게 생각하며, 동료들의 의견에 귀 기울이며 적극적으로 소통하고,
            함께 성장하는 것을 즐깁니다.
          </p>

          {/* 검색 바 */}
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
                placeholder="관심 있는 주제를 검색하세요..."
                className={`w-full py-3 px-5 ${
                  isDark ? "text-gray-200" : "text-gray-800"
                } bg-transparent focus:outline-none ${
                  isDark
                    ? "placeholder:text-gray-400"
                    : "placeholder:text-gray-500"
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

        {/* 필터링 카테고리 태그 */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {tags.map((tag, index) => (
            <motion.button
              key={tag}
              onClick={() => setSelectedTagIndex(index)}
              className={`py-1.5 px-4 text-sm rounded-full transition-all duration-200 shadow-sm ${
                selectedTagIndex === index
                  ? isDark
                    ? "bg-blue-500 text-white border border-blue-500"
                    : "bg-indigo-600 text-white border border-indigo-600"
                  : isDark
                  ? "border border-blue-500 text-blue-200 hover:bg-blue-500 hover:text-gray-200"
                  : "border border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-gray-200"
              }`}
            >
              {tag}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
