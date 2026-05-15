import { Decoration, EditorView, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';

export default ViewPlugin.fromClass(
	class {
		decorations = Decoration.none;

		constructor(view: EditorView) {
			this.build(view);
		}

		update(u: ViewUpdate) {
			if (u.docChanged || u.viewportChanged) this.build(u.view);
		}

		build(view: EditorView) {
			const b = new RangeSetBuilder<Decoration>();
			const cursor = view.state.selection.main.head;

			syntaxTree(view.state).iterate({
				enter: ({ name, from, to }) => {
					if (name === 'HeaderMark') b.add(from, to, Decoration.mark({ class: 'cm-hidden-mark' }));
					if (name === 'ATXHeading1') {
						const line = view.state.doc.lineAt(from);
						if (line.from > cursor || line.to < cursor)
							b.add(from, to, Decoration.line({ class: 'cm-h1' }));
					}
				}
			});
			this.decorations = b.finish();
		}
	},
	{ decorations: (v) => v.decorations }
);
