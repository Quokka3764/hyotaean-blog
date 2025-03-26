"use client";

import { ReactNode, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number; // 최대 기울기
  perspective?: number; // 3D 원근감
  scale?: number; // 호버 시 확대 비율
  transitionSpeed?: number; // 트랜지션 속도 (낮을수록 빠름)
  className?: string; // 추가 스타일링을 위한 클래스
}

export default function TiltCard({
  children,
  maxTilt = 8,
  perspective = 1000,
  scale = 1.02,
  transitionSpeed = 0.5,
  className = "",
}: TiltCardProps) {
  const [isHovering, setIsHovering] = useState(false);

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

    // 중앙 기준 -1 ~ 1 범위로 변환, docs 참고
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

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ perspective }}
      initial="initial"
      whileHover="hover"
    >
      <motion.div
        style={{
          rotateX: springRotateX,
          rotateY: springRotateY,
          transformStyle: "preserve-3d",
          transition: `box-shadow ${transitionSpeed}s ease-out`,
        }}
        variants={{
          hover: { scale },
          initial: { scale: 1 },
        }}
        transition={{ duration: transitionSpeed }}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-full h-full"
        animate={{
          boxShadow: isHovering
            ? `0px 10px 20px rgba(0, 0, 0, 0.1)`
            : `0px 0px 0px rgba(0, 0, 0, 0)`,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
