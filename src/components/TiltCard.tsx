// "use client";

// import { ReactNode, useState } from "react";
// import { motion, useMotionValue, useSpring } from "framer-motion";
// import { useTheme } from "next-themes";

// interface TiltCardProps {
//   children: ReactNode;
//   maxTilt?: number; // 최대 기울기
//   perspective?: number; // 3D 원근감
//   transitionSpeed?: number; // 트랜지션 속도 (낮을수록 빠름)
//   className?: string; // 추가 스타일링을 위한 클래스
// }

// export default function TiltCard({
//   children,
//   maxTilt = 10,
//   perspective = 800,
//   transitionSpeed = 0.5,
//   className = "",
// }: TiltCardProps) {
//   const [isHovering, setIsHovering] = useState(false);
//   const { theme, systemTheme } = useTheme();
//   const currentTheme = theme === "system" ? systemTheme : theme;
//   const isDarkMode = currentTheme === "dark";

//   // 부드러운 모션을 위해 spring 설정
//   const springConfig = { damping: 15, stiffness: 150 };

//   // 회전 값 (spring 적용)
//   const rotateX = useMotionValue(0);
//   const rotateY = useMotionValue(0);

//   // 부드러운 움직임을 위한 spring 변환
//   const springRotateX = useSpring(rotateX, springConfig);
//   const springRotateY = useSpring(rotateY, springConfig);

//   // 마우스 움직임 이벤트
//   function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
//     if (!isHovering) return;

//     const rect = e.currentTarget.getBoundingClientRect();
//     const x = (e.clientX - rect.left) / rect.width;
//     const y = (e.clientY - rect.top) / rect.height;
//     const centerX = x - 0.5;
//     const centerY = y - 0.5;

//     rotateX.set(-centerY * maxTilt * 2);
//     rotateY.set(centerX * maxTilt * 2);
//   }

//   // 마우스 진입/이탈 핸들러
//   function handleMouseEnter() {
//     setIsHovering(true);
//   }

//   function handleMouseLeave() {
//     setIsHovering(false);
//     rotateX.set(0);
//     rotateY.set(0);
//   }

//   // 라이트모드일 때만 테두리 스타일 추가
//   const borderStyle = !isDarkMode ? "border border-gray-200 shadow-sm" : "";

//   const bgColor = !isDarkMode ? "bg-light-bg" : "bg-dark-bg";

//   return (
//     <div
//       className={`relative rounded-2xl overflow-hidden ${bgColor} ${className}`}
//     >
//       <motion.div
//         style={{
//           perspective,
//           transformStyle: "preserve-3d",
//         }}
//         className="w-full h-full"
//       >
//         <motion.div
//           style={{
//             rotateX: springRotateX,
//             rotateY: springRotateY,
//             transformOrigin: "center center",
//             transformStyle: "preserve-3d",
//             transition: `all ${transitionSpeed}s ease-out`,
//           }}
//           onMouseMove={handleMouseMove}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleMouseLeave}
//           className={`w-full h-full rounded-2xl ${borderStyle}`}
//         >
//           {children}
//         </motion.div>
//       </motion.div>
//     </div>
//   );
// }

//최적화 버전 - 수정이 더 필요함, 디자인 불일치

"use client";

import {
  ReactNode,
  useState,
  useMemo,
  useCallback,
  memo,
  useRef,
  useEffect,
} from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useTheme } from "next-themes";

interface TiltCardProps {
  children: ReactNode;
  maxTilt?: number; // 최대 기울기
  perspective?: number; // 3D 원근감
  transitionSpeed?: number; // 트랜지션 속도 (낮을수록 빠름)
  className?: string; // 추가 스타일링을 위한 클래스
}

function TiltCard({
  children,
  maxTilt = 10,
  perspective = 800,
  transitionSpeed = 0.5,
  className = "",
}: TiltCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 클라이언트 사이드에서만 마운트되도록 처리
  useEffect(() => {
    setMounted(true);
  }, []);

  // 다크모드 상태 (클라이언트 사이드에서만 결정)
  const isDarkMode =
    mounted && (theme === "system" ? systemTheme : theme) === "dark";

  // useRef를 사용하여 DOM 요소 참조
  const cardRef = useRef<HTMLDivElement>(null);

  // 부드러운 모션을 위해 spring 설정 - 값을 메모이제이션
  const springConfig = useMemo(() => ({ damping: 15, stiffness: 150 }), []);

  // 회전 값 (spring 적용)
  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  // 부드러운 움직임을 위한 spring 변환
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  // 테마 기반 스타일 메모이제이션
  const { borderStyle, bgColor } = useMemo(
    () => ({
      borderStyle: !isDarkMode ? "border border-gray-200 shadow-sm" : "",
      bgColor: !isDarkMode ? "bg-light-bg" : "bg-dark-bg",
    }),
    [isDarkMode]
  );

  // 마우스 이동 이벤트 핸들러 최적화 (useCallback으로 메모이제이션)
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!isHovering || !cardRef.current) return;

      try {
        const rect = cardRef.current.getBoundingClientRect();

        // 마우스 위치를 비율로 계산 (0~1)
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;

        // 중앙을 기준으로 -0.5 ~ 0.5 범위로 변환
        const centerX = x - 0.5;
        const centerY = y - 0.5;

        // rotateX와 rotateY 값 설정
        rotateX.set(-centerY * maxTilt * 2);
        rotateY.set(centerX * maxTilt * 2);
      } catch (error) {
        // 오류가 발생해도 앱이 중단되지 않도록 함
        console.error("Error calculating tilt:", error);
      }
    },
    [isHovering, maxTilt, rotateX, rotateY]
  );

  // 마우스 진입/이탈 핸들러 메모이제이션
  const handleMouseEnter = useCallback(() => {
    setIsHovering(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovering(false);
    rotateX.set(0);
    rotateY.set(0);
  }, [rotateX, rotateY]);

  // 컨테이너 스타일 메모이제이션 - GPU 가속 설정
  const containerStyle = useMemo(
    () => ({
      perspective,
      willChange: "transform" as const, // GPU 가속 힌트
    }),
    [perspective]
  );

  // 카드 스타일 메모이제이션 - transformStyle은 여기만 정의
  const cardStyle = useMemo(
    () => ({
      rotateX: springRotateX,
      rotateY: springRotateY,
      transformOrigin: "center center" as const,
      transformStyle: "preserve-3d" as const,
      transition: `all ${transitionSpeed}s ease-out` as const,
      backfaceVisibility: "hidden" as const, // 추가 GPU 가속
    }),
    [springRotateX, springRotateY, transitionSpeed]
  );

  // 서버에서 렌더링될 때는 기본 스타일 사용 (클래스 없음)
  if (!mounted) {
    return (
      <div className={`relative rounded-2xl overflow-hidden ${className}`}>
        <div className="w-full h-full">
          <div className="w-full h-full rounded-2xl">{children}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-2xl overflow-hidden ${bgColor} ${className}`}
    >
      <motion.div style={containerStyle} className="w-full h-full">
        <motion.div
          ref={cardRef}
          style={cardStyle}
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

// React.memo로 컴포넌트 감싸서 불필요한 리렌더링 방지
export default memo(TiltCard);
