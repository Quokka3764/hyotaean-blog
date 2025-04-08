"use client";

import { useMemo } from "react";

export default function NebulaTerrain() {
  // useMemo 활용
  const seed = useMemo(() => Math.random() * 100, []);

  return (
    <div className="absolute inset-0">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient
            id="nebula1"
            cx="30%"
            cy="70%"
            r="50%"
            fx="30%"
            fy="70%"
          >
            <stop offset="0%" stopColor="rgba(79, 70, 229, 0.08)" />
            <stop offset="40%" stopColor="rgba(79, 70, 229, 0.03)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
          <radialGradient
            id="nebula2"
            cx="70%"
            cy="30%"
            r="60%"
            fx="70%"
            fy="30%"
          >
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0.08)" />
            <stop offset="45%" stopColor="rgba(124, 58, 237, 0.03)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
          <radialGradient
            id="nebula3"
            cx="20%"
            cy="20%"
            r="40%"
            fx="20%"
            fy="20%"
          >
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.08)" />
            <stop offset="40%" stopColor="rgba(59, 130, 246, 0.03)" />
            <stop offset="100%" stopColor="rgba(0, 0, 0, 0)" />
          </radialGradient>
          <filter id="noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.65"
              numOctaves="3"
              stitchTiles="stitch"
              seed={seed}
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
            />
          </filter>
        </defs>
        <rect width="100%" height="100%" fill="url(#nebula1)" />
        <rect width="100%" height="100%" fill="url(#nebula2)" />
        <rect width="100%" height="100%" fill="url(#nebula3)" />
        <rect width="100%" height="100%" filter="url(#noise)" opacity="0.4" />
      </svg>
    </div>
  );
}
