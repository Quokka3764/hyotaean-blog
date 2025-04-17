import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface TagState {
  /** 현재 선택된 태그 (All 포함) */
  selectedTag: string;
  /** 태그를 변경합니다 */
  setSelectedTag: (tag: string) => void;
}

export const useTagStore = create<TagState>()(
  persist(
    (set) => ({
      selectedTag: "All",
      setSelectedTag: (tag) => set({ selectedTag: tag }),
    }),
    {
      name: "tag-storage",
      // selectedTag만 로컬 스토리지에 저장
      partialize: (state) => ({ selectedTag: state.selectedTag }),
    }
  )
);
