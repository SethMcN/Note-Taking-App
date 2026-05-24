# 03 · Screens

Screen-by-screen behavior. Each section describes layout, components, interactions, and edge cases. Reference HTML files in `references/` for visuals.

---

## 0. Settings · Layers (the centerpiece)

**Read `01_layered_system.md` first.** This page is the primary configuration surface in the app — replace any instinct to bury features in granular toggles spread across categories with this single screen.

### Anatomy

```
┌──────────────────────────────────────────────────────────────────┐
│  Search every setting…                              / to focus   │
├──────────────────────────────────────────────────────────────────┤
│  Layers                                       settings.layers     │
│  ───────────────────────────────────────────────────────────────  │
│  Marginalia grows with you. Start with just the editor;           │
│  turn things on as you need them.                                 │
│                                                                   │
│  ┌─ L0 Calm ─┐ ┌─ L1 Files ┐ ┌─ L2 Worktable ┐ ┌─ L3 Studio ─┐  │
│  │   ▢▢▢    │ │   ▢▢▢    │ │   ▢▢▢ YOU    │ │   ▢▢▢       │  │
│  │   [mini- │ │   [mini- │ │   [mini-     │ │   [mini-    │  │
│  │   diagram│ │   diagram│ │   diagram]   │ │   diagram]  │  │
│  │   of L0] │ │   of L1] │ │              │ │             │  │
│  │ Just     │ │ + files  │ │ + tabs,      │ │ + spine,    │  │
│  │ editor.  │ │ tree     │ │   status,    │ │   margins,  │  │
│  │          │ │          │ │   search     │ │   rail      │  │
│  └──────────┘ └──────────┘ └──────────────┘ └─────────────┘    │
│                                                                   │
│  ● Picking a layer is a shortcut — toggle individuals below.      │
│                                            saved automatically    │
│                                                                   │
│  LAYER  FEATURE                                            ON     │
│  ───── ──────────────────────────────────────────────── ──────   │
│  L0    Editor                                        built-in    │
│  L0    Command palette · ⌘K                          built-in    │
│  L1    File sidebar                                    ●○        │
│  L1    Quick switcher · ⌘P                            built-in    │
│  L2    Tabs                                            ●○        │
│  L2    Status bar                                      ●○        │
│  L2    Full-text search · ⌘F                          built-in    │
│  L3    Document spine                                  ○●        │
│  L3    Marginal annotations                            ○●        │
│  L3    Right rail (backlinks, outline)                ○●        │
│  L3    Focus mode · ⌘.                                ●○        │
│  L4    Daily notes                                     ○●        │
│  L4    Pinned notes                                    ○●        │
│  L4    Split editor                                    ○●        │
│  L4    Rebind keyboard                                ●○         │
│                                                                   │
│  Not sure where to start? Try L0 for a week. The app will         │
│  gently surface the next layer when you start hitting its edges.  │
└──────────────────────────────────────────────────────────────────┘
```

### Preset cards (top)

Four cards in a 4-column grid. Each card:
- Mini-diagram of the layout (CSS-drawn — see `marginalia-layers.jsx` `<LayerDiagram>` for the implementation). Show the titlebar at top, then conditionally the sidebar / tabs / editor / margins / status bar / right rail. Use the live `--accent` for the "active" elements (current tab underline, active tree row bar). 110px tall.
- Layer code (`L0`, `L1`, `L2`, `L3`) in mono 10/`--fg-4`.
- Name (Geist 14/600).
- Subtitle (mono 10.5/`--fg-3`).
- Blurb (Geist 11.5/`--fg-2`, line-height 1.5, ~3 lines).
- If this card matches the current toggle set: outline in `--line-strong` and show "YOU ARE HERE" in `--accent` mono 10/500 in the top-right.

Click → batch-update all the toggles below to match.

### Notice strip (between cards and feature list)

Single row, `--bg-2` background, 1px `--line`, 8px border-radius, 10-14px padding. Accent dot + Geist Mono 11/`--fg-2` text. Right-aligned status: "your current setup is custom · saved automatically" or "matches L2".

### Feature list

Three-column grid `32px 1fr 60px`. 12px vertical padding. 1px `--line` top border on each row.

| Column | Content | Type |
|---|---|---|
| Layer tag | `L0` / `L1` / … | Geist Mono 10/`--fg-4`/0.08em tracking |
| Name + description | name (Geist 13/500) above description (Geist 12/`--fg-2`) | — |
| Toggle | 30×18px pill OR "built-in" label | — |

Features that can't be turned off (Editor, Command palette, Quick switcher, Full-text search) show "built-in" in mono 10/`--fg-4`, right-aligned, in place of the toggle.

### Footer hint

Centered, Geist Mono 11.5/`--fg-3`, 28px top margin. The "Not sure where to start?" line.

### Behavior

- Clicking a preset card runs a batched settings update — animate the toggle transitions over 200ms (eased), then update the "YOU ARE HERE" tag.
- Individual toggles persist immediately to `settings.json`.
- If the toggle set stops matching any preset, the notice strip says "your current setup is custom".
- Search above (the page-level search) filters this list when the user types. Match a search term against feature name + description.

---

## 1. Main editor

At L0 it's the bare editor; at L3 it's sidebar · editor · right rail · status bar. Each region is gated by its layer toggle (see table below).

### Layer-conditional regions

| Region | Setting key | Layer | Default |
|---|---|---|---|
| Sidebar | `layers.sidebar` | L1 | off |
| Tabs | `layers.tabs` | L2 | off |
| Status bar | `layers.statusBar` | L2 | off |
| Document spine | `layers.spine` | L3 | off |
| Marginal annotations | `layers.margins` | L3 | off |
| Right rail | `layers.rightRail` | L3 | off |

When all of sidebar / tabs / statusBar are off (the L0 case), the editor adds ~96px extra top padding and the title-crumb shifts to render the active filename in italic serif at 13px instead of the mono breadcrumb. CSS class: `.app.calm`.

### Layout (at L3 — everything on)

```
┌─────────────────────────────────────────────┐
│  ●●●     vault/folder/file.md             ⊟ │  ← titlebar (36px)
├─────────────────────────────────────────────┤
│ vault ▾    ⊞ ⋯  │  file.md ●  file.md  +    │  ← sidebar head + tabs (32px)
│ ┌Filter…─────┐  ├─────────────────────────  │
│                 │                            │
│ ▸ Pinned        │                            │
│   ★ Today       │   # On marginalia          │
│   📥 Inbox      │                            │
│                 │   A book reads twice…      │
│ ▾ Vault         │                            │
│   ▸ daily       │                            │
│   ▾ philosophy  │                            │
│     • Note A    │                            │
│   ▸ projects    │                            │
│                 │                            │
├─────────────────┴────────────────────────────┤
│ ● synced · 12s ago         432 notes         │  ← sidebar footer (28px)
├─────────────────┬────────────────────────────┤
│ vault/folder/file.md  md   7 backlinks  ⌘K   │  ← status bar (24px)
└─────────────────────────────────────────────┘
```

Sidebar: 232px fixed (collapsible). Editor: flex-1. Right rail (when shown): 360px fixed.

### Editor content

- **Editor column** is grid `<editor-width>px 220px` with 40px gap.
  - Left column: prose at `var(--font-editor)`, max-width = `var(--editor-width)`.
  - Right column: marginal annotations rail (mono, 11px, hairline left border per note).
- **Document spine** is `position: absolute; left: 24px` — a 2px-wide vertical group of segments, one per heading.
  - h1 segment: 32px tall, color `var(--fg-4)`.
  - h2 segment: 18px tall, color `var(--line)`.
  - h3 segment: 10px tall, color `var(--line)`.
  - Active heading: color `var(--accent)`.
  - Click a segment → scroll to that heading.

### Interactions

| Trigger | Result |
|---|---|
| Click tree row (note) | Open in active tab. If already open in another tab, switch to it. |
| `⌘\\` | Toggle sidebar visibility (animate width over 200ms). |
| `⌘⇧\\` | Toggle right rail. |
| Drag right edge of sidebar | Resize sidebar 200-360px. Persists. |
| Drag right edge of editor scroll | Resize editor width when right rail is visible. |
| Click a wikilink | Open the linked note in active tab (`⌘↵` to open in split). |
| Click broken wikilink (dashed underline) | Create the note and open it. |
| Cmd-hover a wikilink | Show preview tooltip (out of scope for v0). |
| Cursor enters a markdown-syntax line | Reveal the `#`, `*`, `[[` tokens in `--fg-4`. Inactive lines stay rendered as styled-source. |

### Margin rail (post-v0, see §C in `01_minimal_core.md`)

When implemented, each margin note has:
- An `author` line (Geist Mono 10.5px, accent color, or `oklch(0.55 0.13 65)` amber for `todo`).
- A body line (Geist Mono 11px, `--fg-3`).
- A 1px left border in `--line-strong`.
- Absolute top position aligned to the prose line the note is anchored to.

Author tags:
- `@past-me` — self-annotation
- `@todo` — task
- `@cite` — citation
- `@q` — question
- Free-form `@anything` allowed.

### States

- **Empty vault.** Tree replaces folder list with a centered prompt: small placeholder icon, "An empty vault." in italic serif, then 11.5px copy, then `⌘N new note` keyboard hint.
- **Many tabs.** Tabs overflow horizontally with a scroll arrow. Min tab width 140px, max 220px.
- **Conflicted file** (external edit mid-typing). Show a non-blocking status-bar message: "modified on disk — `⌘R` reload, `⌘S` overwrite". 5s timeout.

---

## 2. Split editor with backlinks & outline

When the right rail is on, the third column shows two stacked sections.

### Backlinks
- Section header (mono uppercase 11px): "Backlinks" — count badge in `--fg-4`.
- Each row: note title (Geist 12.5/500), snippet line (Geist Mono 10.5/`--fg-2`) with the `[[wikilink]]` highlighted in `--accent-soft`.
- Hover: pointer cursor. Click: open in active tab.

### Outline (under backlinks)
- Section header: "Outline" (mono uppercase 10px / `--fg-4`).
- Each heading: serif 13px, indented by depth (12px per level).
- Active heading: `--accent`.

---

## 3. Focus mode (`⌘.`)

A "typewriter" mode. Hides titlebar, sidebar, tabs, status bar. Editor centered with extra top padding (120px).

- Body font scales to 19px, line-height 1.7.
- All paragraphs at `opacity: 0.36`. Current paragraph at `opacity: 1`.
- Transition: 200ms.
- Single HUD at the bottom: keyboard hints + session timer ("2 sessions today · 47 min").
- `⌘.` again to exit. `Esc` also exits.

---

## 4. Command palette (`⌘K`)

Overlay centered horizontally, 96px from top. Width 580px.

### Anatomy

```
┌──────────────────────────────────────────────┐
│ ›  Type a command…                       esc │
├──────────────────────────────────────────────┤
│ 📄 New note                              ⌘N  │
│    create in current folder                  │
│ 📄 New daily note                       ⌘⇧N │
│    daily/2026-05-24.md                       │
│ 🔍 Search in all notes                  ⌘F   │
│ ...                                          │
├──────────────────────────────────────────────┤
│ ↑↓ navigate · ↵ run · ⌘P files     9 of 142  │
└──────────────────────────────────────────────┘
```

- Prompt char is `›` in `--accent`. Geist Mono 13px.
- Input is Geist 15px, transparent background.
- Rows are 38-42px tall. Active row has `var(--bg-active)` + 2px accent left bar.
- Each row: leading icon (`--fg-3`), name (Geist 13.5/500), meta line (Geist Mono 10.5/`--fg-3`), trailing keyboard shortcut (mono kbd hints).
- Footer: hints + result count (`9 of 142`).

### Behavior

- Open: `⌘K`. Close: `Esc` or click backdrop.
- Type: fuzzy-match across action name + tags.
- ↑↓ navigate. `↵` runs the selected action.
- The list is the command registry — every menu item, every settings action, every keyboard shortcut is here. Source of truth for actions.

---

## 5. Quick switcher (`⌘P`)

Same overlay shape as palette, but for files. Prompt char is `⌘P` instead of `›`.

- Sort: matches first, then recents within ties.
- Each row: name (with `<mark>` around fuzzy-matched chars in accent color), path (Geist Mono 10.5/`--fg-3`), edit-time hint right-aligned ("2 min ago", "yesterday").
- Footer hints: `↵ open` · `⌥↵ open in split` · `⌘↵ open in new tab`.

---

## 6. Full-text search

Same overlay shape, wider (620px) and taller (max-height 540px). Prompt char is the search glyph.

### Result grouping

Group by file. Each group:
- Header row: file icon, title (Geist 13/500), path (Geist Mono 10.5/`--fg-3`), hit count pill (Geist Mono 10.5 in `--bg-3`).
- Up to 3 snippet rows: line number (`--fg-4`), then the line with the search term highlighted using `<mark>` (background `--accent-soft`, text `--accent`).

### Behavior

- Real-time search as the user types (debounce 100ms).
- `⌘F` opens with the current selection as the initial query, else empty.
- `↵` opens the top result.
- Footer toggles: `⌥M` match case, `⌥R` regex.
- Tantivy on the Rust side; pass query + return `{file, line_no, snippet}[]` over IPC.

---

## 7. Wikilink autocomplete (inline)

Triggered by typing `[[`. A 320px popover anchored just below the cursor.

- Each row: file icon (`--fg-3`), name (Geist 12.5 with matched prefix in `<mark>`/accent), folder hint right-aligned (Geist Mono 10.5/`--fg-3`).
- Last row (separator above): "Create '<query>'" — `--fg-2` body, accent quoted query, `⏎ to confirm` hint.
- Footer: `↑↓ select` · `↵ insert` · result count.

Disappears on `Esc`, on space, or when the cursor moves outside the open `[[`.

---

## 8. Settings · search-first overview

Default view of `⌘,`. A 1200×800 split: left nav (220px), right scrollable main.

### Top of main

- Sticky search bar: search icon, large input (Geist 16px) with placeholder "Search every setting…", trailing badge ("/ to focus" or "{N} matches").

### As the user types

- Show "{N} results for '<query>'" line (Geist Mono 11/`--fg-3`).
- Render each matched setting as a card (10px border-radius, `--bg-2` background, 1px `--line`, 18px padding):
  - Setting label with matched substring highlighted in `--accent-soft` background.
  - Description (Geist 12, `--fg-2`).
  - Anchor crumb: "Typography · settings.fonts.lineHeight" (Geist Mono 10.5, `--fg-4`).
  - The actual live control on the right (range, select, toggle, color swatches).

When the search is empty, show the full settings page (see §9-11 below) grouped into anchored sections.

### Footer hint

If results are visible: "Press `esc` to clear, or browse by category on the left."

---

## 9. Settings · Appearance

Section heading: "Appearance" (Geist 20/600, -0.015em). Anchor "settings.appearance" (Geist Mono 10.5/`--fg-4`) right-aligned.

Section description: Geist 13, `--fg-2`, max-width 560px.

Each setting row is a CSS grid `1fr 280px`, 18px vertical padding, with a 1px `--line` top border (and bottom on the last row).

| Setting | Control type | Description |
|---|---|---|
| Theme | Segment of `Light / Dark / System` | "Follow your system, or pin one." |
| Accent color | 5 swatches (28px circles) | "Used for the active note, links, and the caret. We keep it deliberately small." |
| Background warmth | Segment of `arctic / neutral / paper` | "A subtle tint to the canvas. Try `paper` to read longer." |
| Show document spine | Toggle | "A hairline minimap of your headings on the left edge of the editor." |
| Show marginal rail | Toggle | "The right-hand column for annotations, todos, and backlinks. Hides on narrow windows." |

### Live preview card

Below Appearance rows, before Typography: a `--bg-2` card with "LIVE PREVIEW" caption (mono uppercase, accent dot) showing a small sample of the editor exactly as the settings would make it look. This card mirrors the editor's prose-rail layout in miniature.

### Typography section follows

Same row format. Items: Prose font (Select), Interface font (Select), Monospace (Select), Body size (Range 14-22px), Line height (Range 1.0-2.0), Editor width (Range 560-880px).

---

## 10. Settings · Keyboard

Section heading: "Keyboard". Anchor "settings.keymap".

### Info banner (top)

`--bg-2` card with the keyboard glyph: "Conflict-aware — if a key is taken, you'll see who has it." Right-aligned: `keymap.json · 19 lines · 1 override` in mono 11/`--fg-3`.

### Shortcut groups

Three groups: Workspace, Writing, Navigation. Each group:
- Mono uppercase header (Geist Mono 10/`--fg-4`, 0.08em tracking).
- Rows: name (Geist 13/`--fg`), description (Geist 12/`--fg-3` italic-feel), keys (kbd pills right-aligned).
- 1px `--line` between rows; first row in a group has no top border.

### Rebind interaction

Click a key cluster → it becomes a single "Press the new shortcut, or `esc`" pill. Listen for the next key combination. On commit:
- If unused → write to `keymap.json` and show the new chord.
- If in use → show inline "Already bound to '<action>'. Replace?" with Replace / Cancel buttons.

### Source of truth

`keymap.json` lives in the app's config directory. The default shortcuts ship in the binary. User overrides merge on top. This page is the only UI for editing keys.

---

## 11. Settings · Editor

Not pictured in the canvas; build it from the design system. Single section heading + rows.

| Setting | Control | Default |
|---|---|---|
| Auto-save delay | Range 0-2000ms | 400 |
| Soft wrap | Toggle | on |
| Spell check | Toggle | on |
| Show invisible characters | Toggle | off |
| Markdown source styling | Segment: `dim / hide / show` | dim |
| Default new-note location | Folder picker | vault root |

---

## 12. File explorer — empty state

When the vault has no notes:

- Sidebar tree area centers a vertical column:
  1. A small line-icon placeholder (44×44px) — a stylized empty document.
  2. Italic serif headline 16px: "An empty vault."
  3. Body Geist 11.5/1.5/`--fg-3`, max-width 200px: "Start with a thought, a quote, or yesterday's weather. Notes are plain markdown on your disk."
  4. Kbd hint: `⌘ N` + "new note".

The rest of the chrome (titlebar, status bar) renders normally.
