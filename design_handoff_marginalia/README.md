# Marginalia — Developer Handoff

A minimalist markdown notes desktop app. Codename: **Marginalia**.

> "The markdown knowledge app Obsidian would become if redesigned today with ruthless minimalism and exceptional UX discipline."

---

## About these files

The HTML files in `references/` are **design references**, not production code. They show intended look, behavior, and interaction patterns. Your job is to **recreate them in Svelte + Rust + Tauri**, applying idiomatic patterns for that stack.

Render fidelity is **high**: colors, typography, spacing, border treatments, and animation timing in the references are final. Treat them as truth unless this spec says otherwise.

## Stack

| Layer | Choice | Notes |
|---|---|---|
| Frontend | **Svelte 5** (runes) | Component model fits the minimal philosophy — less framework boilerplate visible to the user. |
| Bundler | Vite | Tauri default. |
| Backend | **Rust** | Tauri commands; filesystem access; full-text search via tantivy. |
| Shell | **Tauri 2** | Native window chrome on macOS (traffic lights), custom on Windows/Linux. |
| Markdown | `markdown-it` + custom plugins for wikilinks | Or `pulldown-cmark` if rendering server-side. |
| Editor | CodeMirror 6 (Svelte wrapper) | Pluggable enough to do the marginal-rail features. |
| Search index | **tantivy** (Rust) | Local, fast, no daemon. |
| Sync (later) | iCloud Drive / file-watching only | No proprietary sync server. Local-first is non-negotiable. |

## Read order

1. **`README.md`** (this file) — overview, philosophy, file map.
2. **`01_layered_system.md`** — the progressive disclosure system. **The most important doc.** Read before implementing anything.
3. **`02_design_system.md`** — tokens, typography, color, spacing, components.
4. **`03_screens.md`** — screen-by-screen behavior spec.
5. **`04_keyboard.md`** — shortcut map (use as source-of-truth for `keymap.json`).
6. **`05_tauri_stack.md`** — Svelte/Rust/Tauri-specific implementation notes.
7. **`tokens.json`** / **`tokens.css`** — machine-readable design tokens.

## Files in `references/`

| File | What it shows |
|---|---|
| `Marginalia.html` | Top-level canvas. Loads everything below. |
| `marginalia.css` | **Source of truth for all visual tokens.** Read this first. |
| `marginalia-shell.jsx` | Window chrome, sidebar tree, tabs, status bar, editor body, margin rail, spine. |
| `marginalia-overlays.jsx` | Command palette, quick switcher, search panel, wikilink autocomplete. |
| `marginalia-settings.jsx` | Settings views (overview/search, appearance, keymap). |
| `marginalia-layers.jsx` | **The Layers settings page** + the `<LayerDiagram>` mini-preview component. |
| `marginalia-system.jsx` | Design system reference cards (type, color, components, spacing). |

To view the canvas, open `references/Marginalia.html` in a browser. Pan with two-finger scroll, zoom with pinch / ⌘-wheel. Toggle Tweaks to see the design respond to font/accent/density changes.

---

## Core philosophy — do not violate

1. **Markdown is the source of truth.** Notes are `.md` files on disk. There is no proprietary format. A user must be able to delete the app and keep working in any text editor.
2. **Layered surface area.** The default app is the bare editor. Every UI region (sidebar, tabs, status bar, spine, margins, right rail) is an opt-in *layer* the user adds when they're ready. See `01_layered_system.md`.
3. **Keyboard-first.** Every action has a shortcut. Every shortcut is rebindable. `⌘K` and `⌘P` work at every layer — they are how a user does anything in L0.
4. **Calm typography.** Editorial serif body (Newsreader), neutral UI sans (Geist), monospace for path/code/metadata (Geist Mono).
5. **No visual noise.** Hairlines only — 1px borders at `rgba(0,0,0,0.08)` or less. Shadows only for things that float (palettes, popovers).
6. **Local-first.** No telemetry. No accounts. No cloud sync. File-watching keeps the tree in sync if other apps edit files.

## What this design system does not do

- No emoji in UI (file icons are line glyphs).
- No gradient fills, no rainbow accents, no decorative illustration.
- No "AI suggestions" — this is a writing tool, not a co-pilot.
- No graph view. Backlinks list is enough.
- No plugin marketplace. Plugins, if shipped, are local-only and require dev mode.
- No multi-window. One window per vault.
- No first-run tutorial, no welcome modal, no "tour". The empty state is the welcome.
