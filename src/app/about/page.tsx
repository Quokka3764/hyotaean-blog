import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* 프로필 섹션 */}
      <section className="mb-16 md:mb-20">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 md:gap-12">
          <div className="flex-shrink-0">
            <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 relative rounded-full overflow-hidden shadow-md dark:shadow-gray-700/50">
              <Image
                src="/my-favicon.png"
                alt="안효태 프로필"
                fill
                sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 192px"
                className="object-cover"
                priority
              />
            </div>
          </div>

          <div className="text-center sm:text-left flex-grow pt-2">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-1">
              안효태
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-6">
              프론트엔드 개발자
            </p>
            {/* 연락처 정보 */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {/* 이메일 */}
              <a href="mailto:ansagi3@naver.com">
                <img
                  src="https://img.shields.io/badge/Email-ansagi3@naver.com-005FF9?style=flat-square&logo=mail.ru&logoColor=white"
                  alt="Email"
                  className="h-6"
                />
              </a>
              {/* GitHub */}
              <Link
                href="https://github.com/Quokka3764"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="https://img.shields.io/badge/GitHub-Quokka3764-181717?style=flat-square&logo=github&logoColor=white"
                  alt="GitHub"
                  className="h-6"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 자기소개 섹션 */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-5 border-b border-gray-300 dark:border-gray-700 pb-2">
          소개
        </h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
          사용자 경험을 최우선으로 고민하는 프론트엔드 개발자입니다. 협업을
          중요하게 생각하며, 동료들의 의견에 귀 기울이며 적극적으로 소통하고,
          함께 성장하는 것을 즐깁니다. 새로운 기술 학습에 대한 열정이 높으며,
          문제 해결 과정에서 깊이 파고드는 것을 좋아합니다.
        </p>
      </section>

      {/* 기술 스택 섹션 */}
      <section className="mb-16 md:mb-20">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8 border-b border-gray-300 dark:border-gray-700 pb-2">
          기술 스택
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10">
          {[
            {
              title: "언어",
              badges: [
                {
                  alt: "JavaScript",
                  src: "https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black",
                },
                {
                  alt: "TypeScript",
                  src: "https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white",
                },
                {
                  alt: "HTML5",
                  src: "https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white",
                },
                {
                  alt: "CSS3",
                  src: "https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white",
                },
              ],
            },
            {
              title: "프레임워크 & 라이브러리",
              badges: [
                {
                  alt: "React",
                  src: "https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black",
                },
                {
                  alt: "Next.js",
                  src: "https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white",
                },
                {
                  alt: "Vue.js",
                  src: "https://img.shields.io/badge/Vue.js-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white",
                },
              ],
            },
            {
              title: "상태 관리 & 데이터 호출",
              badges: [
                {
                  alt: "TanStack Query",
                  src: "https://img.shields.io/badge/TanStack_Query-FF4154?style=for-the-badge&logo=react-query&logoColor=white",
                },
                {
                  alt: "Zustand",
                  src: "https://img.shields.io/badge/Zustand-brown?style=for-the-badge&logo=npm&logoColor=white",
                },
                {
                  alt: "Axios",
                  src: "https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white",
                },
              ],
            },
            {
              title: "스타일링 & 시각화",
              badges: [
                {
                  alt: "Tailwind CSS",
                  src: "https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white",
                },
                {
                  alt: "D3.js",
                  src: "https://img.shields.io/badge/D3.js-F9A03C?style=for-the-badge&logo=d3.js&logoColor=white",
                },
              ],
            },
            {
              title: "협업 & 도구",
              badges: [
                {
                  alt: "GitHub",
                  src: "https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white",
                },
                {
                  alt: "Figma",
                  src: "https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white",
                },
              ],
            },
          ].map((category) => (
            <div key={category.title}>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
                {category.title}
              </h3>
              <div className="flex flex-wrap gap-2">
                {category.badges.map((badge) => (
                  <img
                    key={badge.alt}
                    src={badge.src.replace("for-the-badge", "flat-square")}
                    alt={badge.alt}
                    className="h-6"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 프로젝트 섹션 */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-8 border-b border-gray-300 dark:border-gray-700 pb-2">
          주요 프로젝트
        </h2>

        <div className="mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              PawEver (반려동물 커뮤니티)
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
              2025.02 - 2025.03 (4주)
            </span>
          </div>

          {/* GitHub 링크 */}
          <div className="mb-6">
            <Link
              href="https://github.com/prgrms-web-devcourse-final-project/WEB2_3_pawEver_FE"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              {/* SVG 아이콘 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
              PawEver 프론트
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
            {[
              {
                title: "프로젝트 기획 및 총괄",
                points: [
                  "9명 규모 팀의 PO 역할 수행 (기획, 요구사항 분석, 아키텍처 설계, 일정 관리)",
                  "개발 직접 참여 및 4주 내 성공적 프로젝트 완료 기여",
                ],
              },
              {
                title: "JWT 기반 소셜 로그인 구축",
                points: [
                  "보안성을 고려한 토큰(Access/Refresh) 저장 전략 설계 (메모리/HttpOnly 쿠키)",
                  "토큰 자동 갱신 로직 구현으로 사용자 세션 유지 및 로그인 요청 최소화",
                ],
              },
              {
                title: "무한 스크롤을 활용한 패칭 최적화",
                points: [
                  "Tanstack Query(useInfiniteQuery)와 Intersection Observer 활용",
                  "효율적인 데이터 로딩 및 초기 로딩 시간 단축",
                ],
              },
              {
                title: "낙관적 업데이트 기반 UX 개선",
                points: [
                  "useMutation을 활용하여 사용자 액션에 대한 즉각적인 UI 피드백 제공",
                  "네트워크 오류 발생 시 데이터 일관성을 위한 롤백 로직 구현",
                ],
              },
              {
                title: "반응형 UI 개발",
                points: [
                  "Tailwind CSS를 활용하여 모바일 환경 포함 다양한 디바이스 대응",
                  "사용자 편의성을 고려한 UI/UX 제안 및 구현",
                ],
              },
            ].map((item) => (
              <div key={item.title}>
                <h4 className="text-md font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {item.title}
                </h4>
                <ul className="list-disc pl-5 text-gray-600 dark:text-gray-400 space-y-1.5 text-sm leading-relaxed">
                  {item.points.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
