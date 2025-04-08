"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

// 개별 컴포넌트들 명시적 임포트
import Stars from "./Stars";
import BackgroundGradient from "./BackgroundGradient";
import LightEffects from "./LightEffects";
import NebulaTerrain from "./NebulaTerrain";
import GridPattern from "./GridPattern";
import DecorativeLines from "./DecorativeLines";

export default function SpaceBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 커스텀 디바운스 처리
  const handleResize = useCallback(() => {
    if (resizeTimerRef.current) {
      clearTimeout(resizeTimerRef.current);
    }

    resizeTimerRef.current = setTimeout(() => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }, 200);
  }, []);

  useEffect(() => {
    // 클라이언트 사이드에서 마운트 시 초기 크기 설정
    setMounted(true);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // 리사이즈 이벤트 리스너 설정
    window.addEventListener("resize", handleResize);

    // 클린업 함수
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [handleResize]);

  // 서버 사이드 렌더링 대응
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <BackgroundGradient isDark={isDark} />

      <Stars
        isDark={isDark}
        windowWidth={dimensions.width}
        windowHeight={dimensions.height}
      />

      {isDark ? (
        <>
          <LightEffects />
          <NebulaTerrain />
        </>
      ) : (
        <GridPattern />
      )}

      <DecorativeLines isDark={isDark} />
    </>
  );
}
