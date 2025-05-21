---
title: '에디터 만들기 - 상태관리'
date: '2025-05-21 19:04'
thumbnail: '/React.png'
tags: ["React", "State", "Editor"]
excerpt: '에디터를 만들면서 겪은 상태관리의 방법을 정리했습니다.'
---

# 📙 상태관리의 딜레마

에디터를 구현하면서 상태 관리가 이렇게 복잡해질 것 이라고는 생각도 못 했다. 대부분의 기능이 구현되어 있는 라이브러리를 가져다 쓰면서 빠르게 다른 작업을 하느라 간과하고 있었던 것 같다. 처음에는 빠른 MVP기능 구현을 위해서 store에 관련 데이터와 상태들을 모두 몰아넣고 그대로 각 컴포넌트들이 구독하게 하여 빠르게 기능을 구현하는 것에 집중했다.

하지만 진짜 문제는 **최적화**에 있었다. `Store`의 전체를 구독하다 보니 불필요한 리렌더링이 발생하고, 파일 갯수가 많아지면서 버벅거리고 도저히 사용할 수 없는 수준에 도달했다. Node.js의 zip파일로 직접 대용량 파일 테스트를 해보지 않았다면 절대 몰랐을 것이다. 이렇게 까지 성능저하가 발생할 줄도 몰랐고 늦게나마 Devtools를 활용하여 리렌더링이 전반적으로 일어나고 있는 것 까지 발견했기 때문이다.

최적화를 위한 여러가지 방법들을 검토했고, 가장 먼저 처리할 수 있는 것은 3가지로 정리가 됐다.
- store 의존성 줄이기
- 필요한 내용만 구독하기
- Props 사용으로 관심사 분리

## 📗 Store 사용 전략

기본적으로 에디터에서 필요로 하는 데이터의 상태, 로직은 모두 store에 집중한 것은 변함이 없다. 다만, **필요한 내용만 사용할 수 있도록 Selector 패턴으로 코드들을 분리시켜 놓았다.** 그리고 `useMemo` 와 `useCallback` 을 활용해서 불필요한 연산을 줄 일 수 있도록 했다.

## 💡 Selector 패턴으로 분리시켜 놓은 editorSelector의 일부분

```typescript

// 주어진 Map<T>이 바뀌지 않았다면 이전 정렬된 배열 재사용
function memoizeSorted<T>(compareFn: (a: T, b: T) => number) {
  // 메모이제이션 로직 생략
}

const getSortedItems = memoizeSorted<FileTreeItem>((a, b) => {
  // 정렬 로직 생략
});

export const editorSelectors = {
  fileTree: {
    // Map 전체를 받아 메모된 배열로 반환
    items: (state: EditorState) => , //로직들 생략
    sortedItems: (state: EditorState) => getSortedItems(state.fileTreeItems),
    size: (state: EditorState) => state.fileTreeItems.size,
    // ... 기타 fileTree 관련 selector들 생략
  },
  content: {
    getContent: (path: string) => (state: EditorState) =>
      state.fileContents.get(path) || "",
    // ... 기타 content 관련 selector들
  },
  // ... 다른 selector 그룹들
};
```

# 📗 Props 사용 전략

가장 문제를 일으켰던 파일트리는 성능개선이 시급했다. 파일트리 아이템 수가 많아질 수록 성능저하가 심각했고, 불필요한 리렌더링이 빈번하게 발생했기 때문이다. 그래서 `react-window` 를 통한 가상화와 각 노드들을 개별 컴포넌트로 분리하게 됐다. 
그리고, 개별 노드 컴포넌트들이 `Store` 를 직접 구독하며 발생하는 리렌더링 부담을 줄이기 위해서 상위 컴포넌트가 Store의 데이터를 받아 필요한 Props만 하위로 전달하는 전략을 선택했다. Store와의 의존성을 낮추고 불필요한 리렌더링을 줄일 수 있다고 생각했다. 하지만, 이 과정에서 전달해야 할 Props의 종류가 늘어나는 트레이트드 오프가 생겨서 아쉬움이 남는다.

## Props 상태관리의 흐름

1. 기본적으로 `Store` 에서 필요로하는 데이터들을 상위 컴포넌트에서 가져온다.
2. 그 데이터들을 그대로 하위 컴포넌트들의 Props로 전달한다.
3. 그 외에 로컬에서 간단하게 처리 가능한 부분들은 굳이 Props전달하지 않고 바로 그 컴포넌트에서 `useState` 나 `useEffect` 로 처리했다.

## 파일트리 컴포넌트 예시)

```typescript
// FileTree(index.tsx)
const FileTree: React.FC = () => {
  const { items, selected, expanded, toggleFolder, setSelectedFile, openTab } = useFileTree();

  const visibleNodes = useMemo<TreeNodeData[]>(() => {
    const list: TreeNodeData[] = [];
    const go = (parent: string, level: number) => {
      //treeStructure를 기반으로 visibleNodes 계산 로직 생략
    };
    go("", 0);
    return list;
  }, [treeStructure, expanded]);

  return (
    <FileTreePanel>
      <VirtualTreeNodeList
        visibleNodes={visibleNodes}
        selected={selected}
        expanded={expanded}
        editingPath={editingPath}
        toggleFolder={toggleFolder}
        setSelectedFile={setSelectedFile}
        openTab={openTab}
        // 기타 필요한 props 전달 생략
      />
    </FileTreePanel>
  );
};

// VirtualTreeNodeList.tsx 내부 Row 함수 (일부 예시)
const Row = ({ index, style }: { index: number; style: React.CSSProperties; }) => {
  const { item, level } = visibleNodes[index];
  const path = item.path;
  // isActive, isExpanded 등 TreeNode에 필요한 props 계산 생략

  return (
    <div style={style}>
      <TreeNode
        key={/* 생략 */}
        path={path}
        level={level}
        isActive={/* 계산된 값 */}
        isExpanded={/* 계산된 값 */}
        onSelect={setSelectedFile}
        onToggle={toggleFolder}
        // 기타 props 전달 생략
      />
    </div>
  );
};
```