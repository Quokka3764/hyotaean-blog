"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import type { ComponentPropsWithoutRef } from "react";

type CodeComponentProps = ComponentPropsWithoutRef<"code"> & {
  inline?: boolean;
  className?: string;
};

const CodeComponent: React.FC<CodeComponentProps> = ({
  inline,
  className,
  children,
  ...props
}) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "";
  const isInline = inline || !className || !match;

  return isInline ? (
    <code className="bg-gray-800 px-1 rounded text-sm text-white" {...props}>
      {children}
    </code>
  ) : (
    <SyntaxHighlighter
      style={oneDark}
      language={language}
      PreTag="div"
      customStyle={{
        borderRadius: "0.25rem",
        margin: "1rem 0 2.5rem 0",
        fontSize: "0.875rem",
        lineHeight: "1.4",
      }}
      showLineNumbers
      wrapLongLines={false}
    >
      {String(children).replace(/\n$/, "")}
    </SyntaxHighlighter>
  );
};

export default function MarkdownRender({ content }: { content: string }) {
  const normalizedContent = content.replace(/\r\n/g, "\n");

  return (
    <div className="text-lg leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        components={{
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold my-4" {...props}>
              {children}
            </h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold my-3" {...props}>
              {children}
            </h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-bold my-2" {...props}>
              {children}
            </h3>
          ),
          p: ({ children, ...props }) => (
            <p className="my-8" {...props}>
              {children}
            </p>
          ),
          ul: ({ children, ...props }) => (
            <ul className="list-disc pl-5 my-2" {...props}>
              {children}
            </ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal pl-5 my-2" {...props}>
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="ml-2 my-1" {...props}>
              {children}
            </li>
          ),
          a: ({ children, ...props }) => (
            <a className="text-blue-500 hover:underline" {...props}>
              {children}
            </a>
          ),
          blockquote: ({ children, ...props }) => (
            <blockquote
              className="border-l-4 border-gray-200 pl-4 my-2 italic"
              {...props}
            >
              {children}
            </blockquote>
          ),
          img: ({ src, alt, ...props }) => {
            if (src && typeof src === "string" && src.startsWith("http")) {
              return (
                <img
                  src={src}
                  alt={alt || ""}
                  className="max-w-full h-auto my-4 rounded"
                  {...props}
                />
              );
            }
            const imgSrc =
              typeof src === "string" && src.startsWith("/public")
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
          code: CodeComponent,
        }}
      >
        {normalizedContent}
      </ReactMarkdown>
    </div>
  );
}
