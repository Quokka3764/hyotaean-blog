import { Metadata } from "next";
import { getInitialTheme } from "@/lib/theme";
import "../styles/globals.css";
import Navbar from "@/components/Navbar";
import ThemeProvider from "@/components/ThemeProvider";
import Providers from "./providers";
import StaticSpaceBackground from "@/components/background/StaticSpaceBackground";
import DynamicSpaceBackground from "@/components/background/DynamicSpaceBackground";

export const metadata: Metadata = {
  title: {
    default: "Hyotaean-Blog",
    template: "%s | Hyotaean-Blog",
  },
  description: "프론트엔드 개발 및 기술 관련 블로그",
  icons: {
    icon: "/my-favicon.png",
    shortcut: "/my-favicon.png",
    apple: "/my-favicon.png",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  metadataBase: new URL("https://hyotaean.dev"),
  alternates: {
    canonical: "/",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialTheme = await getInitialTheme();

  return (
    <html
      lang="ko"
      className={initialTheme === "dark" ? "dark" : ""}
      suppressHydrationWarning
    >
      <head />
      <body className="min-h-screen transition-colors duration-300">
        <Providers>
          <ThemeProvider initialTheme={initialTheme}>
            <div className="fixed inset-0 -z-20 overflow-hidden">
              <StaticSpaceBackground />
              <DynamicSpaceBackground />
            </div>
            <nav className="w-full backdrop-blur-md shadow-lg fixed top-0 left-0 z-50 p-4 bg-white/20 dark:bg-black/20 border-gray-200">
              <div className="max-w-[1440px] w-full mx-auto px-4 sm:px-6">
                <Navbar />
              </div>
            </nav>
            <main className="max-w-[1440px] w-full mx-auto pt-20 pb-10 flex-grow">
              {children}
            </main>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
