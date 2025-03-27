"use client";

import { ReactNode, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useThemeStore } from "@/store/themeStore";

interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number; // 최대 기울기
  perspective?: number; // 3D 원근감
  transitionSpeed?: number; // 트랜지션 속도 (낮을수록 빠름)
  className?: string; // 추가 스타일링을 위한 클래스
}

export default function TiltCard({
  children,
  maxTilt = 10, // 기울기 증가
  perspective = 800,
  transitionSpeed = 0.5,
  className = "",
}: TiltCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { isDarkMode } = useThemeStore();

  // 부드러운 모션을 위해 spring 설정
  const springConfig = { damping: 15, stiffness: 150 };

  // 회전 값 (spring 적용)
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // 부드러운 움직임을 위한 spring 변환
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // 마우스 움직임 이벤트
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isHovering) return;

    const rect = e.currentTarget.getBoundingClientRect();

    // 요소 내 마우스 위치 (0~1 범위로 정규화)
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // 중앙 기준 -1 ~ 1 범위로 변환
    const centerX = x - 0.5;
    const centerY = y - 0.5;

    // 회전 각도 계산 (Y축은 반대 방향으로 회전)
    rotateX.set(-centerY * maxTilt * 2); // Y 위치에 따라 X축 회전
    rotateY.set(centerX * maxTilt * 2); // X 위치에 따라 Y축 회전
  }

  // 마우스 진입/이탈 핸들러
  function handleMouseEnter() {
    setIsHovering(true);
  }

  function handleMouseLeave() {
    setIsHovering(false);
    rotateX.set(0);
    rotateY.set(0);
  }

  // 라이트모드일 때만 테두리 스타일 추가
  const borderStyle = !isDarkMode
    ? "border border-gray-200 shadow-sm bg-white"
    : "";

  // 배경색 설정 - 라이트모드에서는 공간 효과가 보이지 않도록 부모와 동일한 배경색 사용
  const bgColor = !isDarkMode ? "bg-gray-50" : "bg-[#0f1729]";

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${bgColor} ${className}`}
    >
      <motion.div
        style={{
          perspective,
          transformStyle: "preserve-3d",
        }}
        className="w-full h-full"
      >
        <motion.div
          style={{
            rotateX: springRotateX,
            rotateY: springRotateY,
            transformOrigin: "center center",
            transformStyle: "preserve-3d",
            transition: `all ${transitionSpeed}s ease-out`,
          }}
          // scale 효과 제거
          transition={{ duration: transitionSpeed }}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className={`w-full h-full rounded-2xl ${borderStyle}`}
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}
