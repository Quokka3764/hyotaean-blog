import { Metadata } from "next";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";

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
    <html lang="ko">
      <body className="bg-[#0f1729] bg-space-pattern min-h-screen text-gray-100">
        <nav className="w-full backdrop-blur-md bg-white/10 shadow-lg border-b border-white/10 p-4 fixed top-0 left-0 z-50">
          <div className="max-w-[1200px] w-full mx-auto px-4">
            <Navbar />
          </div>
        </nav>
        <main className="max-w-[1200px] w-full mx-auto pt-24 pb-10 px-4 flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
