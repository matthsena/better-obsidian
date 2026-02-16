import { getDB } from "../db/database";
import { extractWikiLinks, extractTags } from "../lib/markdown";

function syncLinksAndTags(noteId: number, content: string) {
  const db = getDB();

  // Sync wiki-links
  const wikiLinks = extractWikiLinks(content);
  db.run("DELETE FROM links WHERE source_note_id = ?", [noteId]);
  for (const linkTitle of wikiLinks) {
    const target = db.query("SELECT id FROM notes WHERE title = ? AND is_deleted = 0").get(linkTitle) as { id: number } | null;
    if (target) {
      db.run(
        "INSERT OR IGNORE INTO links (source_note_id, target_note_id) VALUES (?, ?)",
        [noteId, target.id],
      );
    }
  }

  // Sync tags
  const tagNames = extractTags(content);
  db.run("DELETE FROM note_tags WHERE note_id = ?", [noteId]);
  const TAG_COLORS = ["#FFD700", "#FF6B9D", "#4ECDC4", "#A8E6CF", "#9B59B6", "#FF9F43"];
  for (const name of tagNames) {
    db.run(
      "INSERT OR IGNORE INTO tags (name, color) VALUES (?, ?)",
      [name, TAG_COLORS[Math.abs(hashCode(name)) % TAG_COLORS.length]],
    );
    const tag = db.query("SELECT id FROM tags WHERE name = ?").get(name) as { id: number };
    db.run("INSERT OR IGNORE INTO note_tags (note_id, tag_id) VALUES (?, ?)", [noteId, tag.id]);
  }
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash + str.charCodeAt(i)) | 0;
  }
  return hash;
}

export const notesRoutes = {
  "/api/notes": {
    GET: () => {
      const db = getDB();
      const notes = db.query("SELECT * FROM notes WHERE is_deleted = 0 ORDER BY updated_at DESC").all();
      return Response.json(notes);
    },
    POST: async (req: Request) => {
      const db = getDB();
      const { title, content = "", folder_id = null } = await req.json();
      const result = db.run(
        "INSERT INTO notes (title, content, folder_id) VALUES (?, ?, ?)",
        [title, content, folder_id],
      );
      const noteId = Number(result.lastInsertRowid);
      syncLinksAndTags(noteId, content);
      const note = db.query("SELECT * FROM notes WHERE id = ?").get(noteId);
      return Response.json(note, { status: 201 });
    },
  },
  "/api/notes/:id": {
    GET: (req: Request & { params: { id: string } }) => {
      const db = getDB();
      const note = db.query("SELECT * FROM notes WHERE id = ? AND is_deleted = 0").get(req.params.id);
      if (!note) return new Response("Not found", { status: 404 });
      return Response.json(note);
    },
    PUT: async (req: Request & { params: { id: string } }) => {
      const db = getDB();
      const { title, content, folder_id, is_favorite } = await req.json();
      const existing = db.query("SELECT * FROM notes WHERE id = ?").get(req.params.id) as any;
      if (!existing) return new Response("Not found", { status: 404 });

      // Save version snapshot
      db.run(
        "INSERT INTO note_versions (note_id, title, content) VALUES (?, ?, ?)",
        [req.params.id, existing.title, existing.content],
      );

      const newTitle = title ?? existing.title;
      const newContent = content ?? existing.content;
      const newFolderId = folder_id !== undefined ? folder_id : existing.folder_id;
      const newFavorite = is_favorite !== undefined ? (is_favorite ? 1 : 0) : existing.is_favorite;

      db.run(
        "UPDATE notes SET title = ?, content = ?, folder_id = ?, is_favorite = ?, updated_at = datetime('now') WHERE id = ?",
        [newTitle, newContent, newFolderId, newFavorite, req.params.id],
      );

      syncLinksAndTags(Number(req.params.id), newContent);
      const note = db.query("SELECT * FROM notes WHERE id = ?").get(req.params.id);
      return Response.json(note);
    },
    DELETE: (req: Request & { params: { id: string } }) => {
      const db = getDB();
      db.run(
        "UPDATE notes SET is_deleted = 1, deleted_at = datetime('now') WHERE id = ?",
        [req.params.id],
      );
      return new Response(null, { status: 204 });
    },
  },
  "/api/notes/:id/versions": {
    GET: (req: Request & { params: { id: string } }) => {
      const db = getDB();
      const versions = db.query(
        "SELECT * FROM note_versions WHERE note_id = ? ORDER BY created_at DESC LIMIT 50",
      ).all(req.params.id);
      return Response.json(versions);
    },
  },
};
