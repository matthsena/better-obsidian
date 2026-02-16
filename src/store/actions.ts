import type { Note, Folder, Tag, Tab, SearchResult, GraphData, Settings } from "./types";

export type Action =
  | { type: "SET_NOTES"; notes: Note[] }
  | { type: "ADD_NOTE"; note: Note }
  | { type: "UPDATE_NOTE"; note: Note }
  | { type: "DELETE_NOTE"; id: number }
  | { type: "SET_FOLDERS"; folders: Folder[] }
  | { type: "ADD_FOLDER"; folder: Folder }
  | { type: "UPDATE_FOLDER"; folder: Folder }
  | { type: "DELETE_FOLDER"; id: number }
  | { type: "SET_TAGS"; tags: Tag[] }
  | { type: "SET_ACTIVE_NOTE"; id: number | null; content?: string }
  | { type: "SET_ACTIVE_CONTENT"; content: string }
  | { type: "OPEN_TAB"; tab: Tab }
  | { type: "CLOSE_TAB"; noteId: number }
  | { type: "SET_TAB_DIRTY"; noteId: number; isDirty: boolean }
  | { type: "UPDATE_TAB_TITLE"; noteId: number; title: string }
  | { type: "TOGGLE_LEFT_SIDEBAR" }
  | { type: "TOGGLE_RIGHT_SIDEBAR" }
  | { type: "SET_SEARCH_QUERY"; query: string }
  | { type: "SET_SEARCH_RESULTS"; results: SearchResult[] }
  | { type: "SET_GRAPH_DATA"; data: GraphData | null }
  | { type: "SET_SHOW_GRAPH"; show: boolean }
  | { type: "SET_COMMAND_PALETTE_OPEN"; open: boolean }
  | { type: "SET_SETTINGS"; settings: Settings }
  | { type: "SET_LOADING"; loading: boolean };
