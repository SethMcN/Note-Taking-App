# 05 · Stack — Svelte + Rust + Tauri

Implementation notes specific to the chosen stack.

---

## Project layout

```
marginalia/
├── src/                          # Svelte 5 frontend
│   ├── lib/
│   │   ├── commands.ts           # command registry (palette + keymap)
│   │   ├── ipc.ts                # typed wrappers around Tauri invoke
│   │   ├── stores/
│   │   │   ├── settings.svelte.ts
│   │   │   ├── vault.svelte.ts   # tree state, watcher
│   │   │   ├── tabs.svelte.ts
│   │   │   └── ui.svelte.ts      # palette/switcher/search open state
│   │   ├── components/
│   │   │   ├── chrome/
│   │   │   │   ├── Titlebar.svelte
│   │   │   │   ├── Tabs.svelte
│   │   │   │   └── StatusBar.svelte
│   │   │   ├── sidebar/
│   │   │   │   ├── Sidebar.svelte
│   │   │   │   ├── TreeRow.svelte
│   │   │   │   └── EmptyVault.svelte
│   │   │   ├── editor/
│   │   │   │   ├── Editor.svelte            # CodeMirror host
│   │   │   │   ├── Spine.svelte
│   │   │   │   └── MarginRail.svelte        # post-v0
│   │   │   ├── overlays/
│   │   │   │   ├── CommandPalette.svelte
│   │   │   │   ├── QuickSwitcher.svelte
│   │   │   │   ├── SearchPanel.svelte
│   │   │   │   └── WikiPopover.svelte
│   │   │   └── settings/
│   │   │       ├── Settings.svelte
│   │   │       ├── Appearance.svelte
│   │   │       ├── Editor.svelte
│   │   │       └── Keymap.svelte
│   │   ├── codemirror/
│   │   │   ├── markdown.ts                  # syntax extensions
│   │   │   ├── wikilink.ts                  # `[[autocomplete]]`
│   │   │   ├── source-styling.ts            # dim/reveal markdown tokens
│   │   │   └── theme.ts                     # binds to CSS vars
│   │   └── styles/
│   │       ├── tokens.css                   # the tokens from 02_design_system.md
│   │       └── app.css                      # everything else
│   ├── App.svelte
│   └── main.ts
│
├── src-tauri/                    # Rust backend
│   ├── src/
│   │   ├── main.rs               # tauri::Builder, command registry
│   │   ├── vault/
│   │   │   ├── mod.rs            # commands: list_tree, read_note, write_note, watch
│   │   │   └── watcher.rs        # notify crate
│   │   ├── search/
│   │   │   ├── mod.rs            # tantivy wrapper
│   │   │   └── index.rs
│   │   ├── settings.rs           # load/save settings + keymap JSON
│   │   └── ipc.rs                # typed command signatures (ts-rs export)
│   ├── Cargo.toml
│   ├── tauri.conf.json
│   └── icons/
│
├── package.json
├── vite.config.ts
├── tsconfig.json
└── README.md
```

---

## Svelte 5 patterns

Use **runes**. The store files end in `.svelte.ts` so runes work.

```ts
// stores/settings.svelte.ts
import { invoke } from '@tauri-apps/api/core';

export const settings = $state({
  theme: 'system' as 'light' | 'dark' | 'system',
  accent: 'terracotta' as 'terracotta' | 'slate' | 'sage' | 'plum' | 'ink',
  fontFamily: 'serif' as 'serif' | 'sans' | 'mono',
  editorWidth: 680,
  sidebarDensity: 'regular' as 'compact' | 'regular' | 'comfy',
  bgWarmth: 'paper' as 'paper' | 'neutral' | 'arctic',
});

// Persist on change
$effect.root(() => {
  $effect(() => {
    invoke('save_settings', { settings });
  });
});

export async function loadSettings() {
  const s = await invoke<typeof settings>('load_settings');
  Object.assign(settings, s);
}
```

For derived UI state (tree expanded set, palette query, etc.), local `$state` in the component is usually right. Lift to a store only when more than one component needs it.

### Theme application

Apply tokens by setting CSS custom properties on `<html>`:

```ts
// in App.svelte
$effect(() => {
  document.documentElement.dataset.theme = resolvedTheme();
  document.documentElement.style.setProperty('--accent', ACCENT_MAP[settings.accent]);
  // ...
});

function resolvedTheme() {
  if (settings.theme !== 'system') return settings.theme;
  return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}
```

---

## CodeMirror integration

Use CodeMirror 6 directly — no Svelte wrapper library, the integration is ~50 lines.

```svelte
<!-- Editor.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import { EditorState } from '@codemirror/state';
  import { EditorView, keymap } from '@codemirror/view';
  import { defaultKeymap, history, historyKeymap } from '@codemirror/commands';
  import { markdown } from '@codemirror/lang-markdown';
  import { marginaliaTheme } from '$lib/codemirror/theme';
  import { wikilink } from '$lib/codemirror/wikilink';
  import { sourceStyling } from '$lib/codemirror/source-styling';

  let { value = $bindable(''), onSave }: { value: string; onSave?: (v: string) => void } = $props();
  let host: HTMLDivElement;
  let view: EditorView;

  onMount(() => {
    view = new EditorView({
      parent: host,
      state: EditorState.create({
        doc: value,
        extensions: [
          history(),
          keymap.of([...defaultKeymap, ...historyKeymap]),
          markdown(),
          wikilink(),
          sourceStyling(),
          marginaliaTheme,
          EditorView.updateListener.of((u) => {
            if (u.docChanged) {
              value = u.state.doc.toString();
              debouncedSave(value);
            }
          }),
        ],
      }),
    });
    return () => view.destroy();
  });

  let saveTimer: number;
  function debouncedSave(v: string) {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => onSave?.(v), 400);
  }
</script>

<div bind:this={host} class="editor-host"></div>
```

Custom extensions to build:

1. **`source-styling.ts`** — a `ViewPlugin` that decorates `#`, `*`, `_`, `[[`, `]]`, `>`, `-`, fence markers. Dims them with `--fg-4` when the cursor isn't on that line. Reveals them when the cursor enters the line. Use `Decoration.mark` with a CSS class.

2. **`wikilink.ts`** — a syntax node + autocomplete source. Triggers on `[[`. Calls the Rust side `search_notes_by_name(prefix)` for results.

3. **`theme.ts`** — `EditorView.theme()` binding to the CSS vars defined in tokens.css. Don't hardcode colors here.

CodeMirror's font sizing: set on `.cm-content`. Inherit from `--font-editor` and the body-size setting.

---

## Tauri 2 — Rust side

### Commands (IPC surface)

```rust
// src/vault/mod.rs
#[tauri::command]
async fn list_tree(path: PathBuf) -> Result<TreeNode, String> { /* ... */ }

#[tauri::command]
async fn read_note(path: PathBuf) -> Result<String, String> { /* ... */ }

#[tauri::command]
async fn write_note(path: PathBuf, content: String) -> Result<(), String> { /* ... */ }

#[tauri::command]
async fn rename_note(from: PathBuf, to: PathBuf) -> Result<(), String> { /* ... */ }

#[tauri::command]
async fn delete_note(path: PathBuf) -> Result<(), String> { /* ... */ }

// search
#[tauri::command]
async fn search(query: String, opts: SearchOpts) -> Result<Vec<SearchHit>, String> { /* tantivy */ }

#[tauri::command]
async fn search_notes_by_name(prefix: String) -> Result<Vec<NoteRef>, String> { /* prefix scan */ }
```

Export TypeScript bindings with [`ts-rs`](https://docs.rs/ts-rs/latest/ts_rs/) or [`specta`](https://docs.rs/specta/). They eliminate handwritten IPC type drift.

### File watcher

Use the `notify` crate. Watch the vault root recursively. Coalesce events with a 100ms debounce. Emit a Tauri event `vault://change` carrying `{ path, kind }`:

```rust
app.emit("vault://change", VaultChange { path, kind })?;
```

Svelte side subscribes via `listen('vault://change', …)` and updates the tree store. If the changed file is the currently-open one and it differs from the editor buffer, surface the conflict pill in the status bar (see screens spec).

### Search — tantivy

Index schema:

```rust
let mut schema = SchemaBuilder::new();
schema.add_text_field("path", STRING | STORED);
schema.add_text_field("name", TEXT | STORED);   // filename without extension
schema.add_text_field("body", TEXT | STORED);   // note contents
schema.add_text_field("links", TEXT | STORED);  // extracted wikilink targets
schema.add_date_field("mtime", INDEXED | STORED);
```

- Build the index on first launch by walking the vault.
- Update incrementally via the file watcher (delete + insert on each change).
- Persist the index in `~/Library/Application Support/com.marginalia.app/index/` (etc.).
- `search()` returns hits grouped client-side (or server-side; either works for v0).
- `search_notes_by_name()` does a prefix query on `name` for the wikilink popover.

### Window

```jsonc
// tauri.conf.json (excerpt)
{
  "app": {
    "windows": [{
      "title": "Marginalia",
      "width": 1240, "height": 800,
      "minWidth": 800, "minHeight": 500,
      "decorations": true,
      "titleBarStyle": "Overlay",          // macOS — show traffic lights only
      "hiddenTitle": true,
      "transparent": false
    }]
  }
}
```

On macOS, use `Overlay` so the traffic lights float above your custom title row. On Windows/Linux, render a custom titlebar (the design includes one).

### Settings persistence

Store as JSON in `app_config_dir()`:

```
~/Library/Application Support/com.marginalia.app/
├── settings.json   # the settings object
├── keymap.json     # only user overrides (not the full default map)
├── recents.json    # MRU file list, MRU folder list
└── index/          # tantivy data
```

Keep `keymap.json` as **overrides only** — never inline the defaults. That way upgrading the app picks up new default chords without dropping user changes.

---

## Styling

- Ship the `tokens.css` from the handoff as `src/lib/styles/tokens.css` verbatim.
- Import it once in `App.svelte`. CSS variables cascade everywhere.
- Component styles use `<style>` blocks with `:global` only when needed (e.g. CodeMirror's `.cm-line`).
- No Tailwind. The token system is small enough that utility classes don't pay for themselves here.
- Font loading: bundle Newsreader, Geist, Geist Mono as woff2 next to `tokens.css` and declare `@font-face` once. Don't fetch from Google.

---

## Build & dev

```bash
pnpm install
pnpm tauri dev        # hot-reload Svelte, restart Rust on change
pnpm tauri build      # production binary
```

Targets to test:
- macOS 12+ (Apple Silicon + Intel)
- Windows 11
- Ubuntu 22.04+

---

## Things to refuse

Future-you will ask for these. Decline them in v0.

- WYSIWYG markdown editing. Marginalia is a source-styled editor. The market for WYSIWYG is saturated.
- Bidirectional sync to any cloud. Local-first is the differentiator.
- A "Home" or "Today" dashboard view. The empty state is enough.
- Animated transitions between routes. There are no routes.
- Onboarding flows. The empty-vault state replaces them.
