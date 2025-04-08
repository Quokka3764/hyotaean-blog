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

export interface HeroTagFiltersProps {
  isDark: boolean;
  tags: string[];
  selectedTagIndex: number;
  setSelectedTagIndex: (index: number) => void;
}

export interface HeroTaglineProps {
  isDark: boolean;
  taglines: string[];
  currentTaglineIndex: number;
}
