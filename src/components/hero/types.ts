export interface TextContent {
  main: string;
  sub: string;
}

export interface Gradients {
  mainDark: string;
  mainLight: string;
  glitch1Dark: string;
  glitch1Light: string;
  glitch2Dark: string;
  glitch2Light: string;
}

export interface HeroMainTitleProps {
  isDark: boolean;
}

export interface HeroMainTitleClientProps {
  textContent: TextContent;
  gradients: Gradients;
}
