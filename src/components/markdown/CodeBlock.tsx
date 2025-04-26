"use client";

import React, { ComponentPropsWithoutRef, memo } from "react";
import dynamic from "next/dynamic";

// factory 적용해보기
const SyntaxHighlighter = dynamic(
  async () => {
    const PrismLight = (
      await import("react-syntax-highlighter/dist/esm/prism-light")
    ).default;
    const typescript = (
      await import(
        "react-syntax-highlighter/dist/esm/languages/prism/typescript"
      )
    ).default;
    const javascript = (
      await import(
        "react-syntax-highlighter/dist/esm/languages/prism/javascript"
      )
    ).default;
    PrismLight.registerLanguage("typescript", typescript);
    PrismLight.registerLanguage("javascript", javascript);
    const { oneDark } = await import(
      "react-syntax-highlighter/dist/esm/styles/prism"
    );
    // 반환할 컴포넌트 정의
    const Component: React.ComponentType<
      React.ComponentProps<typeof PrismLight>
    > = (props) => <PrismLight {...props} style={oneDark} />;
    return { default: Component };
  },
  { ssr: false }
);

const syntaxHighlighterStyle = {
  borderRadius: "0.25rem",
  margin: "1rem 0 2.5rem 0",
  fontSize: "0.875rem",
  lineHeight: "1.4",
  padding: "2rem",
};

type CodeBlockProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  className?: string;
};

export const CodeBlock = memo(function CodeBlock({
  inline,
  className,
  children,
  ...props
}: CodeBlockProps) {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const isInline = inline || !className || !match;

  if (isInline) {
    return (
      <code
        className="bg-gray-700 text-white dark:bg-indigo-600 dark:text-white px-1 py-1 rounded text-sm"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <SyntaxHighlighter
      language={language}
      PreTag="div"
      customStyle={syntaxHighlighterStyle}
      wrapLongLines={false}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
});
