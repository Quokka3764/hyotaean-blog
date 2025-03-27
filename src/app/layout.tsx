import { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";

// 메타데이터 설정
export const metadata: Metadata = {
  title: "기술 블로그",
  description: "개발 및 기술 관련 블로그",
};

// viewport 설정을 별도로 export
export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning 속성 추가
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // 기본값으로 isDarkMode: true를 적용 (themeStore의 기본값과 일치)
                let isDarkMode = true;

                // 로컬 스토리지 확인
                const storedTheme = localStorage.getItem('theme-storage');
                if (storedTheme) {
                  const theme = JSON.parse(storedTheme);
                  isDarkMode = theme.state && theme.state.isDarkMode;
                } else {
                  // 사용자 시스템 설정 확인
                  isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
                }

                // 클래스 적용
                if (isDarkMode) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                // 오류 발생 시 기본값(dark) 적용
                document.documentElement.classList.add('dark');
                console.error('Failed to apply theme:', e);
              }
            `,
          }}
        />
      </head>
      <body className="min-h-screen transition-colors duration-300">
        <ThemeProvider>
          <nav
            className="w-full backdrop-blur-md shadow-lg fixed top-0 left-0 z-50 p-4 border-b 
                         dark:bg-white/40 dark:border-white/40 
                         bg-gray-800/15 border-gray-200/20"
          >
            <div className="max-w-[1200px] w-full mx-auto px-4">
              <Navbar />
            </div>
          </nav>
          <main className="max-w-[1200px] w-full mx-auto pt-24 pb-10 px-4 flex-grow">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
