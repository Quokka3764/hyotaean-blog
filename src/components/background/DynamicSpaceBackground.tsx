"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

import Stars from "./Stars";
import LightEffects from "./LightEffects";
import NebulaTerrain from "./NebulaTerrain";
import DecorativeLines from "./DecorativeLines";

export default function DynamicSpaceBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const resizeTimerRef = useRef<NodeJS.Timeout | null>(null);

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
    setMounted(true);
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      if (resizeTimerRef.current) {
        clearTimeout(resizeTimerRef.current);
      }
    };
  }, [handleResize]);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <>
      <Stars
        isDark={isDark}
        windowWidth={dimensions.width}
        windowHeight={dimensions.height}
      />
      {isDark && (
        <>
          <LightEffects />
          <NebulaTerrain />
        </>
      )}
      <DecorativeLines isDark={isDark} />
    </>
  );
}
