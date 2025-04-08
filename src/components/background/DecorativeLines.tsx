"use client";

import { motion } from "framer-motion";
import { ThemeProps } from "./types";

export default function DecorativeLines({ isDark }: ThemeProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {isDark ? (
        // 다크 모드 장식
        <>
          <motion.div
            className="absolute top-1/4 left-1/3 w-[1px] h-24 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent"
            animate={{
              opacity: [0.2, 0.5, 0.2],
              height: ["6rem", "7rem", "6rem"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute top-1/3 right-1/4 w-[1px] h-28 bg-gradient-to-b from-transparent via-indigo-400/20 to-transparent"
            animate={{
              opacity: [0.15, 0.4, 0.15],
              height: ["7rem", "8rem", "7rem"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 3,
            }}
          />
          <motion.div
            className="absolute bottom-1/3 left-1/4 w-[1px] h-20 bg-gradient-to-b from-transparent via-purple-400/20 to-transparent"
            animate={{
              opacity: [0.1, 0.3, 0.1],
              height: ["5rem", "6rem", "5rem"],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1.5,
            }}
          />
        </>
      ) : (
        // 라이트 모드 장식
        <>
          <motion.div
            className="absolute top-0 left-1/4 w-[1px] h-24 bg-gradient-to-b from-transparent via-blue-300/30 to-transparent"
            animate={{
              opacity: [0.1, 0.3, 0.1],
              height: ["5rem", "6rem", "5rem"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-0 right-1/3 w-[1px] h-24 bg-gradient-to-b from-transparent via-indigo-300/30 to-transparent"
            animate={{
              opacity: [0.1, 0.25, 0.1],
              height: ["5rem", "7rem", "5rem"],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
        </>
      )}
    </div>
  );
}
