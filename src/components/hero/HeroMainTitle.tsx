import HeroMainTitleClient from "./HeroMainTitleClient";

export default function HeroMainTitle() {
  // 정적 데이터만 정의하고 클라이언트 컴포넌트에 전달
  const textContent = {
    main: "Hyotaean",
    sub: "Blog",
  };

  // 그라데이션 스타일 사전 정의
  const gradients = {
    mainDark: "bg-gradient-to-r from-indigo-400 to-blue-600",
    mainLight: "bg-gradient-to-r from-blue-600 to-indigo-800",
    glitch1Dark: "bg-gradient-to-r from-teal-300 via-purple-400 to-pink-300",
    glitch1Light:
      "bg-gradient-to-r from-fuchsia-600 via-rose-400 to-orange-400",
    glitch2Dark: "bg-gradient-to-r from-purple-300 via-pink-400 to-red-300",
    glitch2Light:
      "bg-gradient-to-r from-violet-600 via-indigo-400 to-slate-800",
  };

  return (
    <HeroMainTitleClient textContent={textContent} gradients={gradients} />
  );
}
