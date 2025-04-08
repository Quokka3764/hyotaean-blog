"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { HeroMainTitleClientProps } from "./types";

function HeroMainTitleClient({
  textContent,
  gradients,
}: HeroMainTitleClientProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  // 메인 텍스트에 사용되는 그라데이션
  const mainGradient = useMemo(
    () => (isDark ? gradients.mainDark : gradients.mainLight),
    [isDark, gradients.mainDark, gradients.mainLight]
  );

  // 글리치 오버레이용 그라데이션
  const glitchGradient1 = useMemo(
    () => (isDark ? gradients.glitch1Dark : gradients.glitch1Light),
    [isDark, gradients.glitch1Dark, gradients.glitch1Light]
  );

  const glitchGradient2 = useMemo(
    () => (isDark ? gradients.glitch2Dark : gradients.glitch2Light),
    [isDark, gradients.glitch2Dark, gradients.glitch2Light]
  );

  // 그림자 스타일 계산
  const mainShadow = useMemo(
    () =>
      isDark
        ? "0 0 30px rgba(79, 70, 229, 0.2)"
        : "0 1px 3px rgba(59, 130, 246, 0.2)",
    [isDark]
  );

  const subShadow = useMemo(
    () =>
      isDark
        ? "0 0 20px rgba(255, 255, 255, 0.1)"
        : "0 1px 2px rgba(30, 64, 175, 0.05)",
    [isDark]
  );

  // 메인 텍스트 JSX 생성
  const textMainJSX = useMemo(
    () => (
      <div className="font-extrabold text-5xl md:text-7xl tracking-tight">
        <span
          className={`bg-clip-text text-transparent ${mainGradient}`}
          style={{ textShadow: mainShadow }}
        >
          {textContent.main}
        </span>
        <span className="ml-4" style={{ textShadow: subShadow }}>
          {textContent.sub}
        </span>
      </div>
    ),
    [mainGradient, mainShadow, subShadow, textContent]
  );

  // 글리치 효과 JSX 생성
  const textGlitchJSX1 = useMemo(
    () => (
      <div className="font-extrabold text-5xl md:text-7xl tracking-tight">
        <span
          className={`bg-clip-text text-transparent ${glitchGradient1}`}
          style={{ textShadow: mainShadow }}
        >
          {textContent.main}
        </span>
        <span className="ml-4" style={{ textShadow: subShadow }}>
          {textContent.sub}
        </span>
      </div>
    ),
    [glitchGradient1, mainShadow, subShadow, textContent]
  );

  const textGlitchJSX2 = useMemo(
    () => (
      <div className="font-extrabold text-5xl md:text-7xl tracking-tight">
        <span
          className={`bg-clip-text text-transparent ${glitchGradient2}`}
          style={{ textShadow: mainShadow }}
        >
          {textContent.main}
        </span>
        <span className="ml-2" style={{ textShadow: subShadow }}>
          {textContent.sub}
        </span>
      </div>
    ),
    [glitchGradient2, mainShadow, subShadow, textContent]
  );

  // 글리치 오버레이 애니메이션 variant
  const glitchOverlayVariants1 = {
    rest: { opacity: 0, x: 3, y: -3 },
    glitch: {
      opacity: [0, 0.8, 0],
      x: [3, -2, 3],
      y: [-3, 2, -3],
    },
  };

  const glitchOverlayVariants2 = {
    rest: { opacity: 0, x: -3, y: 3 },
    glitch: {
      opacity: [0, 0.8, 0],
      x: [-3, 2, -3],
      y: [3, -2, 3],
    },
  };

  // 애니메이션 설정
  const glitchAnimation = {
    duration: 0.3,
    ease: "easeInOut",
    repeat: Infinity,
    repeatDelay: 7,
  };

  return (
    <div className="relative py-4 h-24 md:h-32">
      {/* 글리치 오버레이 1 */}
      <motion.div
        variants={glitchOverlayVariants1}
        initial="rest"
        animate="glitch"
        transition={glitchAnimation}
        className="absolute inset-0 flex items-center justify-center"
      >
        {textGlitchJSX1}
      </motion.div>

      {/* 글리치 오버레이 2 */}
      <motion.div
        variants={glitchOverlayVariants2}
        initial="rest"
        animate="glitch"
        transition={glitchAnimation}
        className="absolute inset-0 flex items-center justify-center"
      >
        {textGlitchJSX2}
      </motion.div>

      {/* 메인 텍스트 */}
      <motion.h1 className="relative z-10">{textMainJSX}</motion.h1>
    </div>
  );
}

export default React.memo(HeroMainTitleClient);
