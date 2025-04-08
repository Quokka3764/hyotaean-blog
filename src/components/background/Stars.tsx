"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Star, ThemeProps } from "./types";

interface StarsProps extends ThemeProps {
  windowWidth: number;
  windowHeight: number;
}

// 별 생성 함수를 별도로 분리
const generateStars = (
  isDark: boolean,
  windowWidth: number,
  windowHeight: number
): Star[] => {
  const count = isDark ? 70 : 25;
  const newStars: Star[] = [];

  for (let i = 0; i < count; i++) {
    const size = Math.random() * 0.15 + 0.05;
    const opacity = Math.random() * 0.5 + 0.5;
    const top = Math.random() * 100;
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 3 + 2;

    newStars.push({
      id: `star-${i}-${
        isDark ? "dark" : "light"
      }-${windowWidth}-${windowHeight}`,
      size,
      opacity,
      top,
      left,
      delay,
      duration,
    });
  }

  return newStars;
};

export default function Stars({
  isDark,
  windowWidth,
  windowHeight,
}: StarsProps) {
  // useMemo를 활용
  // 테마 변경 또는 윈도우 크기 변경 시에만 별을 재생성
  const stars = useMemo(
    () => generateStars(isDark, windowWidth, windowHeight),
    [isDark, windowWidth, windowHeight]
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className={`absolute rounded-full ${
            isDark ? "bg-white" : "bg-indigo-600"
          }`}
          animate={{
            opacity: [star.opacity * 0.3, star.opacity, star.opacity * 0.3],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: "easeInOut",
          }}
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}vw`,
            height: `${star.size}vw`,
          }}
        />
      ))}
    </div>
  );
}
