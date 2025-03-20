"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="flex justify-between items-center w-full">
      <Link href="/" className="text-xl font-bold text-white">
        hyotaean
      </Link>

      {/* 모바일 메뉴 토글 버튼 */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-white"
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* 데스크톱 네비게이션 링크 */}
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="text-white hover:text-blue-300">
          Home
        </Link>
        <Link href="/blog" className="text-white hover:text-blue-300">
          Blog
        </Link>
        <Link href="/about" className="text-white hover:text-blue-300">
          About
        </Link>
      </div>

      {/* 모바일 메뉴 (반응형) */}
      {isMenuOpen && (
        <div className="absolute top-16 right-0 left-0 bg-black/80 backdrop-blur-md p-4 md:hidden">
          <div className="flex flex-col space-y-4">
            <Link href="/" className="text-white hover:text-blue-300">
              Home
            </Link>
            <Link href="/blog" className="text-white hover:text-blue-300">
              Blog
            </Link>
            <Link href="/about" className="text-white hover:text-blue-300">
              About
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
