export interface Note {
  id: number;
  title: string;
  content: string;
  folder_id: number | null;
  is_deleted: boolean;
  deleted_at: string | null;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface Folder {
  id: number;
  name: string;
  parent_folder_id: number | null;
  created_at: string;
  updated_at: string;
  children?: Folder[];
  notes?: Note[];
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  count?: number;
}

export interface Link {
  id: number;
  source_note_id: number;
  target_note_id: number;
  created_at: string;
}

export interface Backlink {
  id: number;
  title: string;
  snippet: string;
}

export interface NoteVersion {
  id: number;
  note_id: number;
  title: string;
  content: string;
  created_at: string;
}

export interface Template {
  id: number;
  name: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface Tab {
  noteId: number;
  title: string;
  isDirty: boolean;
}

export interface SearchResult {
  id: number;
  title: string;
  snippet: string;
}

export interface GraphNode {
  id: number;
  title: string;
  group: string;
}

export interface GraphEdge {
  source: number;
  target: number;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface Settings {
  [key: string]: string;
}

export interface AppState {
  notes: Note[];
  folders: Folder[];
  tags: Tag[];
  tabs: Tab[];
  activeNoteId: number | null;
  activeContent: string;
  leftSidebarOpen: boolean;
  rightSidebarOpen: boolean;
  searchQuery: string;
  searchResults: SearchResult[];
  graphData: GraphData | null;
  showGraph: boolean;
  commandPaletteOpen: boolean;
  settings: Settings;
  loading: boolean;
}

export const initialState: AppState = {
  notes: [],
  folders: [],
  tags: [],
  tabs: [],
  activeNoteId: null,
  activeContent: "",
  leftSidebarOpen: true,
  rightSidebarOpen: true,
  searchQuery: "",
  searchResults: [],
  graphData: null,
  showGraph: false,
  commandPaletteOpen: false,
  settings: {},
  loading: false,
};
