import React, { useEffect, useCallback } from "react";
import { useAppState, useAppDispatch } from "@/store/AppContext";
import { TagBadge } from "./TagBadge";
import type { Tag } from "@/store/types";

export function TagPanel() {
  const { tags } = useAppState();
  const dispatch = useAppDispatch();

  const fetchTags = useCallback(async () => {
    const res = await fetch("/api/tags");
    const data: Tag[] = await res.json();
    dispatch({ type: "SET_TAGS", tags: data });
  }, [dispatch]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  if (tags.length === 0) {
    return (
      <div className="p-3 text-xs text-muted-foreground font-bold">
        No tags yet. Use #tag in your notes.
      </div>
    );
  }

  return (
    <div className="p-2 flex flex-wrap gap-1.5">
      {tags.map((tag) => (
        <TagBadge
          key={tag.id}
          name={tag.name}
          color={tag.color}
          count={tag.count}
        />
      ))}
    </div>
  );
}
