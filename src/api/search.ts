import { getDB } from "../db/database";

export const searchRoutes = {
  "/api/search": {
    GET: (req: Request) => {
      const url = new URL(req.url);
      const q = url.searchParams.get("q");
      if (!q || q.trim().length === 0) return Response.json([]);

      const db = getDB();
      const results = db.query(`
        SELECT
          notes.id,
          notes.title,
          snippet(notes_fts, 1, '<mark>', '</mark>', '...', 40) as snippet
        FROM notes_fts
        JOIN notes ON notes.id = notes_fts.rowid
        WHERE notes_fts MATCH ?
          AND notes.is_deleted = 0
        ORDER BY rank
        LIMIT 20
      `).all(q + "*");
      return Response.json(results);
    },
  },
};
