import { useCallback } from "react";
import { useAppState, useAppDispatch } from "../store/AppContext";
import type { Note } from "../store/types";

export function useNotes() {
  const state = useAppState();
  const dispatch = useAppDispatch();

  const fetchNotes = useCallback(async () => {
    const res = await fetch("/api/notes");
    const notes: Note[] = await res.json();
    dispatch({ type: "SET_NOTES", notes });
  }, [dispatch]);

  const createNote = useCallback(
    async (title: string, folderId?: number | null, content?: string) => {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, folder_id: folderId ?? null, content: content ?? "" }),
      });
      const note: Note = await res.json();
      dispatch({ type: "ADD_NOTE", note });
      return note;
    },
    [dispatch],
  );

  const updateNote = useCallback(
    async (id: number, data: Partial<Pick<Note, "title" | "content" | "folder_id" | "is_favorite">>) => {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const note: Note = await res.json();
      dispatch({ type: "UPDATE_NOTE", note });
      return note;
    },
    [dispatch],
  );

  const deleteNote = useCallback(
    async (id: number) => {
      await fetch(`/api/notes/${id}`, { method: "DELETE" });
      dispatch({ type: "DELETE_NOTE", id });
    },
    [dispatch],
  );

  const openNote = useCallback(
    async (id: number) => {
      const res = await fetch(`/api/notes/${id}`);
      const note: Note = await res.json();
      dispatch({ type: "SET_ACTIVE_NOTE", id: note.id, content: note.content });
      dispatch({
        type: "OPEN_TAB",
        tab: { noteId: note.id, title: note.title, isDirty: false },
      });
    },
    [dispatch],
  );

  return { notes: state.notes, fetchNotes, createNote, updateNote, deleteNote, openNote };
}
