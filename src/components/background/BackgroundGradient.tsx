export default function BackgroundGradient() {
  return (
    <div
      className={`
        absolute inset-0
        bg-gradient-to-b
        from-blue-50 via-indigo-50/30 to-white
        dark:from-gray-800   /* 상단: Gray‑800 */
        dark:via-indigo-700/50 /* 중간: Indigo‑700 50% */
        dark:to-gray-900     /* 하단: Gray‑900 */
      `}
    />
  );
}
