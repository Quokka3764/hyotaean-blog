"use client";

import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { HeroMainTitleClientProps } from "./types";

function HeroMainTitleClient({
  textContent,
  gradients,
}: HeroMainTitleClientProps) {
  // 클라이언트 사이드 마운트 상태 추적
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  // 클라이언트 사이드에서만 렌더링되도록 설정
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // 기본값은 light 테마로 설정(서버 사이드와 일치시키기 위함)
  // 클라이언트에서 마운트된 후에만 실제 테마 값 사용
  const isDark = isMounted ? resolvedTheme === "dark" : false;

  // 메인 텍스트에 사용되는 그라데이션
  const mainGradient = useMemo(
    () => (isDark ? gradients.mainDark : gradients.mainLight),
    [isDark, gradients.mainDark, gradients.mainLight]
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

  // 기본 렌더링 (서버 사이드 및 초기 하이드레이션용)
  if (!isMounted) {
    return (
      <div className="relative py-4 h-24 md:h-32">
        <h1 className="relative z-10">{textMainJSX}</h1>
      </div>
    );
  }

  // 이하는 클라이언트 사이드에서만 실행되는 코드

  // 글리치 효과용 그라데이션 (클라이언트에서만 계산)
  const glitchGradient1 = gradients.glitch1Dark;
  const glitchGradient2 = gradients.glitch2Dark;

  // 글리치 효과 JSX 생성
  const textGlitchJSX1 = (
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
  );

  const textGlitchJSX2 = (
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

  // 클라이언트 사이드 렌더링용 전체 컴포넌트
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
