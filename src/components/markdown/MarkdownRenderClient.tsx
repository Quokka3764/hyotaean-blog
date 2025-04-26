"use client";

import React, { memo, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { markdownComponents } from "./MarkdownElements";
import { CodeBlock } from "./CodeBlock";

// 타입은 react-markdown이 제공하는 타입을 사용
interface MarkdownRendererClientProps {
  content: string;
}

// remarkPlugins를 컴포넌트 외부로 분리하여 불필요한 재생성 방지
const remarkPlugins = [remarkGfm, remarkBreaks];

export const MarkdownRendererClient = memo(function MarkdownRendererClient({
  content,
}: MarkdownRendererClientProps) {
  // 줄바꿈 정규화
  const normalizedContent = content.replace(/\r\n/g, "\n");

  // components 객체를 useMemo로 최적화
  const components = useMemo(
    () => ({
      ...markdownComponents,
      code: CodeBlock,
    }),
    []
  );

  return (
    <div className="text-lg leading-relaxed">
      <ReactMarkdown remarkPlugins={remarkPlugins} components={components}>
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
});
