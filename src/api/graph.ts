import { getDB } from "../db/database";

export const graphRoutes = {
  "/api/graph": {
    GET: () => {
      const db = getDB();
      const nodes = db.query(`
        SELECT id, title, COALESCE(
          (SELECT f.name FROM folders f WHERE f.id = notes.folder_id),
          'root'
        ) as "group"
        FROM notes WHERE is_deleted = 0
      `).all();

      const edges = db.query(`
        SELECT source_note_id as source, target_note_id as target
        FROM links l
        JOIN notes ns ON l.source_note_id = ns.id AND ns.is_deleted = 0
        JOIN notes nt ON l.target_note_id = nt.id AND nt.is_deleted = 0
      `).all();

      return Response.json({ nodes, edges });
    },
  },
};
