import { useCallback } from "react";
import { useAppState, useAppDispatch } from "../store/AppContext";
import type { Folder } from "../store/types";

export function useFolders() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const fetchFolders = useCallback(async () => {
    const res = await fetch("/api/folders");
    const folders: Folder[] = await res.json();
    dispatch({ type: "SET_FOLDERS", folders });
  }, [dispatch]);

  const createFolder = useCallback(
    async (name: string, parentId?: number | null) => {
      const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, parent_folder_id: parentId ?? null }),
      });
      const folder: Folder = await res.json();
      dispatch({ type: "ADD_FOLDER", folder });
      // Refresh full tree to get nesting right
      await fetchFolders();
      return folder;
    },
    [dispatch, fetchFolders],
  );

  const updateFolder = useCallback(
    async (id: number, data: { name?: string; parent_folder_id?: number | null }) => {
      const res = await fetch(`/api/folders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const folder: Folder = await res.json();
      dispatch({ type: "UPDATE_FOLDER", folder });
      await fetchFolders();
      return folder;
    },
    [dispatch, fetchFolders],
  );

  const deleteFolder = useCallback(
    async (id: number) => {
      await fetch(`/api/folders/${id}`, { method: "DELETE" });
      dispatch({ type: "DELETE_FOLDER", id });
      await fetchFolders();
    },
    [dispatch, fetchFolders],
  );

  return { folders: state.folders, fetchFolders, createFolder, updateFolder, deleteFolder };
}
