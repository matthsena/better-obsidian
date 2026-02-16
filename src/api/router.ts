import { notesRoutes } from "./notes";
import { foldersRoutes } from "./folders";
import { searchRoutes } from "./search";
import { tagsRoutes } from "./tags";
import { linksRoutes } from "./links";
import { graphRoutes } from "./graph";
import { settingsRoutes } from "./settings";
import { templatesRoutes } from "./templates";
import { dailyNotesRoutes } from "./daily-notes";

export const apiRoutes = {
  ...notesRoutes,
  ...foldersRoutes,
  ...searchRoutes,
  ...tagsRoutes,
  ...linksRoutes,
  ...graphRoutes,
  ...settingsRoutes,
  ...templatesRoutes,
  ...dailyNotesRoutes,
} as Record<string, any>;
