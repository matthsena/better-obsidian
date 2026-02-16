import React, { useMemo } from "react";
import { marked } from "marked";

interface Props {
  content: string;
  onWikiLinkClick?: (title: string) => void;
  onTagClick?: (tag: string) => void;
}

export function MarkdownPreview({ content, onWikiLinkClick, onTagClick }: Props) {
  const html = useMemo(() => {
    // Replace wiki-links with clickable spans
    let processed = content.replace(
      /\[\[([^\]]+)\]\]/g,
      '<span class="wiki-link" data-link="$1">$1</span>',
    );

    // Replace tags with clickable spans
    processed = processed.replace(
      /(?:^|\s)(#([a-zA-Z][a-zA-Z0-9_-]*))/gm,
      ' <span class="tag-link" data-tag="$2">$1</span>',
    );

    return marked.parse(processed, { async: false }) as string;
  }, [content]);

  function handleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const wikiLink = target.closest("[data-link]");
    if (wikiLink) {
      onWikiLinkClick?.(wikiLink.getAttribute("data-link")!);
      return;
    }
    const tagLink = target.closest("[data-tag]");
    if (tagLink) {
      onTagClick?.(tagLink.getAttribute("data-tag")!);
    }
  }

  return (
    <div
      className="markdown-preview overflow-auto h-full"
      onClick={handleClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
