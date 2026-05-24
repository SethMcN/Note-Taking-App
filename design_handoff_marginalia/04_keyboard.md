# 04 · Keyboard

The default keymap. Ship this as the seed for `keymap.json`. Every binding is rebindable from Settings → Keyboard.

Symbols: `⌘` = Cmd (mac) / Ctrl (Win/Linux), `⌥` = Alt/Opt, `⇧` = Shift, `↵` = Enter.

---

## Workspace

| Action | Default chord | v0? |
|---|---|---|
| Open command palette | `⌘K` | ✅ |
| Open quick switcher | `⌘P` | ✅ |
| Open settings | `⌘,` | ✅ |
| Toggle left sidebar | `⌘\\` | ✅ |
| Toggle right rail | `⌘⇧\\` | post-v0 |
| Enter / exit focus mode | `⌘.` | nice-to-have |
| Toggle theme (light ↔ dark) | `⌘⇧L` | ✅ |
| Reload current note from disk | `⌘R` | ✅ |
| Quit application | `⌘Q` | ✅ |

## Writing

| Action | Default chord | v0? |
|---|---|---|
| New note (in current folder) | `⌘N` | ✅ |
| New daily note | `⌘⇧N` | nice-to-have |
| Save (no-op — autosave is on) | `⌘S` | ✅ |
| Insert wikilink prefix | `[[` | ✅ |
| Toggle bold | `⌘B` | ✅ |
| Toggle italic | `⌘I` | ✅ |
| Insert inline code | `⌘E` | ✅ |
| Insert code block | `⌘⇧C` | ✅ |
| Toggle blockquote on selection | `⌘⇧Q` | ✅ |
| Toggle bullet list | `⌘⇧-` | ✅ |
| Toggle ordered list | `⌘⇧7` | ✅ |
| Format selection (wikilink, list, …) | `⌘/` | post-v0 |

## Navigation

| Action | Default chord | v0? |
|---|---|---|
| Search in all notes | `⌘F` | ✅ |
| Find in current note | `⌘⇧F` | ✅ |
| Go to previous note (recents) | `⌘[` | ✅ |
| Go to next note | `⌘]` | ✅ |
| Open link under cursor | `⌘↵` | ✅ |
| Open link under cursor in split | `⌥↵` | post-v0 |
| Show backlinks | `⌘⇧B` | post-v0 |
| Show outline | `⌘⇧O` | post-v0 |
| Close tab | `⌘W` | ✅ |
| New tab | `⌘T` | ✅ |
| Next tab | `⌘⇧]` | ✅ |
| Prev tab | `⌘⇧[` | ✅ |
| Reopen closed tab | `⌘⇧T` | ✅ |

## File explorer

| Action | Default chord | v0? |
|---|---|---|
| Focus file tree | `⌘1` | ✅ |
| Focus editor | `⌘2` | ✅ |
| Rename selected note | `↵` (when tree focused) | ✅ |
| Delete selected note | `⌫` (when tree focused, with confirm) | ✅ |
| Move selected note | drag, or `⌘↑/↓` to siblings | post-v0 |

---

## Implementation notes

- Use a single `commands` registry on the Svelte side:
  ```ts
  type Command = {
    id: string;          // 'workspace.openPalette'
    label: string;
    description?: string;
    group: 'Workspace' | 'Writing' | 'Navigation' | 'Explorer';
    defaultChord?: string;
    run(): void;
  };
  ```
- The command palette renders from this registry.
- The keyboard settings page also renders from this registry, merged with user overrides from `keymap.json`.
- Conflict detection: when binding a new chord, check `commands.find(c => userChord(c.id) === newChord)`. If found, prompt to replace.
- Use `tinykeys` or `@svelteuidev/composables` for chord parsing.

## Platform variants

- On Windows/Linux, `⌘` becomes `Ctrl` everywhere. Display `Ctrl` in the UI, but store the chord canonically as `Mod+K` so the keymap file is portable.
- On macOS, render `⌘` `⌥` `⇧` `⌃` glyphs. Otherwise spell out `Ctrl` `Alt` `Shift`.
- Reserve `⌘Q` on macOS only.

## Reserved combinations (never bindable)

- `Esc` — always closes the topmost overlay or exits focus mode.
- `Tab` — focus traversal within forms.
- `⌘C` / `⌘V` / `⌘X` / `⌘Z` / `⌘⇧Z` — system clipboard / undo / redo.
- `⌘+` / `⌘-` / `⌘0` — zoom (controls editor font size at runtime, scoped to current note).
