"use client";

import { ThemeProvider as NextThemeProvider } from "next-themes";
import React from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeProviderProps {
  children: React.ReactNode;
  initialTheme: Theme;
}

export default function ThemeProvider({
  children,
  initialTheme,
}: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      defaultTheme={initialTheme}
      enableSystem={initialTheme === "system"}
    >
      {children}
    </NextThemeProvider>
  );
}
