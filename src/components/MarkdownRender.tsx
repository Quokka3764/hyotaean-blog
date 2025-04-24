import React from "react";
import { MarkdownRendererClient } from "./MarkdownRenderClient";

interface MarkdownRenderProps {
  content: string;
}

export function MarkdownRender({ content }: MarkdownRenderProps) {
  return <MarkdownRendererClient content={content} />;
}

export default MarkdownRender;
