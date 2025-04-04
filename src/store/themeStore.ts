// import { create } from "zustand";
// import { persist } from "zustand/middleware";

// type ThemeState = {
//   isDarkMode: boolean;
//   toggleTheme: () => void;
// };

// export const useThemeStore = create<ThemeState>()(
//   persist(
//     (set) => ({
//       isDarkMode: true, // 기본값은 다크모드
//       toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
//     }),
//     {
//       name: "theme-storage",
//     }
//   )
// );

//

import { create } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

interface ThemeState {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

interface MyPersistedState {
  isDarkMode: boolean;
}

interface MyPersistOptions<T> extends PersistOptions<T, MyPersistedState> {
  serialize?: (state: { state: MyPersistedState; version: number }) => string;
  deserialize?: (str: string) => { state: MyPersistedState; version: number };
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: true, // 기본값: 다크모드
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: "theme-storage",
      // 저장할 때 필요한 부분만 선택 (함수는 저장하지 않음)
      partialize: (state: ThemeState): MyPersistedState => ({
        isDarkMode: state.isDarkMode,
      }),
      // 단순 문자열("dark" 또는 "light")로 저장하도록 serialize 지정
      serialize: (store: {
        state: MyPersistedState;
        version: number;
      }): string => (store.state.isDarkMode ? "dark" : "light"),
      // deserialize 시에는 반드시 state와 version 정보를 포함한 객체 반환
      deserialize: (
        str: string
      ): { state: MyPersistedState; version: number } => ({
        state: { isDarkMode: str === "dark" },
        version: 0,
      }),
    } as MyPersistOptions<ThemeState>
  )
);
