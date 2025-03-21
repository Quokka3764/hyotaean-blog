"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

export default function MarkdownRender({ content }: { content: string }) {
  // Windows 줄바꿈(\r\n)을 Unix 스타일(\n)로 변환
  const normalizedContent = content.replace(/\r\n/g, "\n");

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => (
          <h1 className="text-2xl font-bold my-4" {...props} />
        ),
        h2: ({ node, ...props }) => (
          <h2 className="text-xl font-bold my-3" {...props} />
        ),
        h3: ({ node, ...props }) => (
          <h3 className="text-lg font-bold my-2" {...props} />
        ),
        p: ({ node, ...props }) => <p className="my-4" {...props} />,
        ul: ({ node, ...props }) => (
          <ul className="list-disc pl-5 my-2" {...props} />
        ),
        ol: ({ node, ...props }) => (
          <ol className="list-decimal pl-5 my-2" {...props} />
        ),
        li: ({ node, ...props }) => <li className="ml-2 my-1" {...props} />,
        a: ({ node, ...props }) => (
          <a className="text-blue-500 hover:underline" {...props} />
        ),
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-gray-200 pl-4 my-2 italic"
            {...props}
          />
        ),
        img: ({ node, src, alt, ...props }) => {
          // 외부 URL인지 확인
          if (src && src.startsWith("http")) {
            return (
              <img
                src={src}
                alt={alt || ""}
                className="max-w-full h-auto my-4 rounded"
                {...props}
              />
            );
          }

          const imgSrc = src?.startsWith("/public")
            ? src.replace("/public", "")
            : src;

          return (
            <img
              src={imgSrc || ""}
              alt={alt || ""}
              className="max-w-full h-auto my-4 rounded"
              {...props}
            />
          );
        },

        code: ({ node, className, children, ...props }: any) => {
          const match = /language-(\w+)/.exec(className || "");
          const language = match ? match[1] : "";
          const isInline = !className || !match;

          return isInline ? (
            <code
              className="bg-gray-800 px-1 rounded text-sm text-white"
              {...props}
            >
              {children}
            </code>
          ) : (
            <SyntaxHighlighter
              style={oneDark}
              language={language}
              PreTag="div"
              className="rounded overflow-auto my-4"
              showLineNumbers={true}
              wrapLongLines={false}
            >
              {String(children).replace(/\n$/, "")}
            </SyntaxHighlighter>
          );
        },
      }}
    >
      {normalizedContent}
    </ReactMarkdown>
  );
}
