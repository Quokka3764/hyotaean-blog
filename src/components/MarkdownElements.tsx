"use client";

import React from "react";
import type { Components } from "react-markdown";

// react-markdown의 Components 타입을 직접 사용
export const markdownComponents: Partial<Components> = {
  h1: ({ children, ...props }) => (
    <h1 className="text-3xl font-bold my-4" {...props}>
      {children}
    </h1>
  ),

  h2: ({ children, ...props }) => (
    <h2 className="text-2xl font-bold my-4" {...props}>
      {children}
    </h2>
  ),

  h3: ({ children, ...props }) => (
    <h3 className="text-xl font-bold my-4" {...props}>
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
    <li className="ml-2 my-2" {...props}>
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
      className="border-l-4 border-gray-200 pl-4 my-8 italic"
      {...props}
    >
      {children}
    </blockquote>
  ),

  del: ({ children, ...props }) => (
    <del className="line-through" {...props}>
      {children}
    </del>
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
};
