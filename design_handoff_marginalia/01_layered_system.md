# 01 · The Layered System — what users see by default

The single most important decision in this product: **what does a new user see, and how does the app grow with them?**

Old answer: ship a v0 with limited features, add things in v1.
**New answer: ship every feature, but default every user to L0 (the bare editor). Users opt into surface area as they need it.**

The Layers settings page is the primary configuration surface. It replaces dozens of granular toggles with a single coherent "grow with you" story.

---

## The four layers

Every UI region in the app is assigned to a layer. Higher layers add surface area on top of lower ones.

### L0 · Calm — the default

What the user sees on first launch.

- Window chrome (traffic lights + filename in italic serif).
- The editor. Centered, max-width = current `editor-width` setting.
- **That's it.** No sidebar, no tabs, no status bar, no spine, no margins, no rail.

How they do everything:
- `⌘K` → command palette (always available — runs every action).
- `⌘P` → quick switcher (always available — jumps to any note).
- `⌘N` → new note. `⌘F` → search panel (opens as overlay). `⌘,` → settings.

This is the writing surface. It is the entire app to most people. It is also a beautiful demo when someone opens the binary cold.

### L1 · Files — adds the sidebar

For people who stop remembering filenames.

Adds:
- Left sidebar (file tree, vault name, search, pinned section).
- `⌘\` toggles it back off without leaving L1.

The quick switcher is still the primary nav tool; the sidebar is for orientation, not for clicking around.

### L2 · Worktable — adds tabs, status, search panel UI

For people working across multiple notes at once.

Adds:
- Tab bar (open multiple notes simultaneously).
- Status bar (24px — word count, mode, ⌘K hint).
- Full-text search panel (the index was always there; L2 just adds the panel UI).

### L3 · Studio — adds the apparatus

For knowledge-work users who annotate, cross-link, and reread.

Adds:
- Document spine (left edge minimap of headings).
- Marginal annotations rail (the namesake feature — `@author` notes anchored to prose lines).
- Right rail (backlinks + outline panel). Toggle with `⌘⇧\`.

### L4 · Power — explicit power-user features

For dailies, splits, and keymap customization.

Adds:
- Daily notes (`⌘⇧N` opens / creates `daily/YYYY-MM-DD.md`).
- Pinned notes group at the top of the sidebar.
- Split editor (two panes side by side).
- Custom keyboard shortcuts (the editor in Settings → Keyboard).

L4 is **not** "advanced" in the sense of being harder. It's just where features that don't pay rent in everyday use live until you ask for them.

---

## How the user moves between layers

### Two surfaces

1. **Settings → Layers** (the centerpiece). See `03_screens.md` § Layers.
   - Four preset cards at the top (L0/L1/L2/L3) with mini-diagrams of each layout.
   - Click a card → app reflows to that preset.
   - Below the cards, a single grouped list of features with toggles. Features tagged with their layer (`L0`, `L1`, `L2`, `L3`, `L4`) and an "always built-in" tag for non-toggleable things like the command palette.

2. **Inline nudges** (subtle, opt-in to dismiss).
   - When the user creates their 5th note, surface a one-time tooltip: "Want to see your notes in a sidebar? Open ⌘, → Layers and try L1."
   - When the user uses `⌘P` 20 times in a session, similar nudge for L2.
   - **Nudges never block writing.** They appear in the status bar (if present) or as a 2-second toast (if not) and never appear twice.

These nudges are the only "onboarding" the app has. There is no first-run tutorial, no welcome modal, no "tour".

### State persistence

The current layer config is just a set of toggles in `settings.json`:

```json
{
  "layers": {
    "sidebar": false,
    "tabs": false,
    "statusBar": false,
    "spine": false,
    "margins": false,
    "rightRail": false,
    "dailyNotes": false,
    "pinnedNotes": false,
    "splitEditor": false
  }
}
```

The preset cards in Settings → Layers are sugar over batched updates to these toggles. There is no "current layer" stored separately — if the toggles match L1 exactly, "you are here" highlights L1; if they don't match any preset, "you are here" reads "custom".

---

## What ships in the binary (regardless of layer)

The whole codebase. Layers are presentational. The same binary that defaults to L0 contains the marginal annotation system — it just doesn't render the rail unless `layers.margins` is true.

This means:
- No feature flags in code beyond the settings booleans.
- No "v0 vs v1" code branches.
- The binary you ship in week 4 is the binary you ship in month 6 — the difference is which defaults you tune.

---

## Sequencing recommendation

1. **Week 1-2.** Tauri shell, Svelte scaffold, file tree (loaded but hidden in L0), open a file, render markdown as plain text.
2. **Week 3-4.** CodeMirror editor with source-styled markdown. Autosave. Settings JSON load/save. **At this point L0 is shippable.**
3. **Week 5.** Quick switcher, command palette, search index, full-text search panel UI. The chrome (sidebar, tabs, status bar) renders — gated behind layer toggles.
4. **Week 6.** Settings UI — Layers page first, then Appearance, then Keyboard.
5. **Week 7.** Wikilinks (`[[` autocomplete + follow-link). Spine. Right rail (backlinks + outline).
6. **Week 8.** Marginal annotations rail. Polish nudges. Daily notes + pinned + split editor.
7. **v1 ship.** Default users to L0. Test the nudge cadence.

There's no "v0 release" anymore. You're shipping a single thing whose first impression is calm.

---

## What stays out — even at L4

These are explicit non-features. Resist them.

- **AI in the editor** — Marginalia is for the writer's voice, not the model's.
- **Cloud sync** — local-first is the differentiator. Users layer on iCloud / Dropbox / git themselves.
- **Graph view** — backlinks list is enough.
- **Plugin marketplace** — local-only plugin loading is fine for power users, but no marketplace, no store, no telemetry.
- **WYSIWYG mode** — Marginalia is a source-styled editor. WYSIWYG is a different product.
- **Mobile companion** — out of scope.
- **Multi-vault switcher** — one window, one vault. Multiple vaults = multiple windows = multiple binaries from the OS's point of view, which is fine.
- **Tags, tag pane, tag autocomplete** — wikilinks are enough.
- **Note templates** — your daily note already is the template.
- **Versioning beyond filesystem** — git exists.
- **Export to PDF / HTML** — `pandoc` exists.
- **Onboarding flows / welcome modals** — the empty state is the welcome.
