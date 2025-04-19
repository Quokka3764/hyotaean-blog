import { cookies, headers } from "next/headers";

export type Theme = "light" | "dark" | "system";

function isTheme(v: string | undefined): v is Theme {
  return v === "light" || v === "dark" || v === "system";
}

export async function getInitialTheme(): Promise<Theme> {
  // 쿠키에서 읽기
  const cookieStore = await cookies();
  const cookie = cookieStore.get("theme")?.value;
  if (isTheme(cookie)) return cookie;

  //헤더
  const headerStore = await headers();
  const hint = headerStore.get("sec-ch-prefers-color-scheme");
  if (hint === "light" || hint === "dark") return hint;

  return "system";
}
