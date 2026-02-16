import type { AppState } from "./types";
import type { Action } from "./actions";

export function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "SET_NOTES":
      return { ...state, notes: action.notes };
    case "ADD_NOTE":
      return { ...state, notes: [action.note, ...state.notes] };
    case "UPDATE_NOTE":
      return {
        ...state,
        notes: state.notes.map((n) =>
          n.id === action.note.id ? action.note : n,
        ),
      };
    case "DELETE_NOTE":
      return {
        ...state,
        notes: state.notes.filter((n) => n.id !== action.id),
        tabs: state.tabs.filter((t) => t.noteId !== action.id),
        activeNoteId:
          state.activeNoteId === action.id ? null : state.activeNoteId,
        activeContent:
          state.activeNoteId === action.id ? "" : state.activeContent,
      };
    case "SET_FOLDERS":
      return { ...state, folders: action.folders };
    case "ADD_FOLDER":
      return { ...state, folders: [...state.folders, action.folder] };
    case "UPDATE_FOLDER":
      return {
        ...state,
        folders: state.folders.map((f) =>
          f.id === action.folder.id ? action.folder : f,
        ),
      };
    case "DELETE_FOLDER":
      return {
        ...state,
        folders: state.folders.filter((f) => f.id !== action.id),
      };
    case "SET_TAGS":
      return { ...state, tags: action.tags };
    case "SET_ACTIVE_NOTE":
      return {
        ...state,
        activeNoteId: action.id,
        activeContent: action.content ?? "",
        showGraph: false,
      };
    case "SET_ACTIVE_CONTENT":
      return { ...state, activeContent: action.content };
    case "OPEN_TAB": {
      const exists = state.tabs.find((t) => t.noteId === action.tab.noteId);
      if (exists) return state;
      return { ...state, tabs: [...state.tabs, action.tab] };
    }
    case "CLOSE_TAB": {
      const newTabs = state.tabs.filter((t) => t.noteId !== action.noteId);
      let newActiveId = state.activeNoteId;
      let newContent = state.activeContent;
      if (state.activeNoteId === action.noteId) {
        const idx = state.tabs.findIndex((t) => t.noteId === action.noteId);
        const next = newTabs[Math.min(idx, newTabs.length - 1)];
        newActiveId = next ? next.noteId : null;
        newContent = "";
      }
      return {
        ...state,
        tabs: newTabs,
        activeNoteId: newActiveId,
        activeContent: newContent,
      };
    }
    case "SET_TAB_DIRTY":
      return {
        ...state,
        tabs: state.tabs.map((t) =>
          t.noteId === action.noteId ? { ...t, isDirty: action.isDirty } : t,
        ),
      };
    case "UPDATE_TAB_TITLE":
      return {
        ...state,
        tabs: state.tabs.map((t) =>
          t.noteId === action.noteId ? { ...t, title: action.title } : t,
        ),
      };
    case "TOGGLE_LEFT_SIDEBAR":
      return { ...state, leftSidebarOpen: !state.leftSidebarOpen };
    case "TOGGLE_RIGHT_SIDEBAR":
      return { ...state, rightSidebarOpen: !state.rightSidebarOpen };
    case "SET_SEARCH_QUERY":
      return { ...state, searchQuery: action.query };
    case "SET_SEARCH_RESULTS":
      return { ...state, searchResults: action.results };
    case "SET_GRAPH_DATA":
      return { ...state, graphData: action.data };
    case "SET_SHOW_GRAPH":
      return { ...state, showGraph: action.show };
    case "SET_COMMAND_PALETTE_OPEN":
      return { ...state, commandPaletteOpen: action.open };
    case "SET_SETTINGS":
      return { ...state, settings: action.settings };
    case "SET_LOADING":
      return { ...state, loading: action.loading };
    default:
      return state;
  }
}
