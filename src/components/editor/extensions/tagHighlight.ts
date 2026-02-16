import {
  Decoration,
  DecorationSet,
  ViewPlugin,
  ViewUpdate,
  EditorView,
  MatchDecorator,
} from "@codemirror/view";

const tagDeco = Decoration.mark({ class: "cm-tag-highlight" });

const tagMatcher = new MatchDecorator({
  regexp: /(?:^|\s)(#[a-zA-Z][a-zA-Z0-9_-]*)/g,
  decoration: () => tagDeco,
});

export const tagHighlightPlugin = ViewPlugin.fromClass(
  class {
    decorations: DecorationSet;
    constructor(view: EditorView) {
      this.decorations = tagMatcher.createDeco(view);
    }
    update(update: ViewUpdate) {
      this.decorations = tagMatcher.updateDeco(update, this.decorations);
    }
  },
  { decorations: (v) => v.decorations },
);
