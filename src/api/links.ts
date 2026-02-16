import { getDB } from "../db/database";

export const linksRoutes = {
  "/api/links": {
    GET: () => {
      const db = getDB();
      const links = db.query("SELECT * FROM links").all();
      return Response.json(links);
    },
  },
  "/api/notes/:id/backlinks": {
    GET: (req: Request & { params: { id: string } }) => {
      const db = getDB();
      const backlinks = db.query(`
        SELECT n.id, n.title, substr(n.content, 1, 200) as snippet
        FROM links l
        JOIN notes n ON l.source_note_id = n.id
        WHERE l.target_note_id = ? AND n.is_deleted = 0
        ORDER BY n.updated_at DESC
      `).all(req.params.id);
      return Response.json(backlinks);
    },
  },
};
