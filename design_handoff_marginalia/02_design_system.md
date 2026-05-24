# 02 · Design System

The complete visual vocabulary. All values here come from `references/marginalia.css`. When the two disagree, the CSS file is canon.

---

## Typography

Three typefaces. Each has exactly one job.

| Role | Family | Usage |
|---|---|---|
| **Prose** | Newsreader (Google Fonts) | Editor body, h1–h3 in notes, blockquote, inline emphasis. The voice you read. |
| **UI** | Geist (Google Fonts) | Sidebar, tabs, settings labels, buttons, palette/switcher rows. Must disappear. |
| **Mono** | Geist Mono (Google Fonts) | File paths, captions, code blocks, inline code, keyboard hints, status bar, settings anchors (`settings.appearance.accent`). |

Bundle the fonts as woff2 in the Tauri build — don't load from Google at runtime.

### Type scale (editor body)

| Element | Family | Size | Line-height | Weight | Letter-spacing |
|---|---|---|---|---|---|
| h1 | Newsreader | 34px | 1.18 | 600 | -0.018em |
| h2 | Newsreader | 22px | 1.3 | 600 | -0.012em |
| h3 | Newsreader | 17px | 1.4 | 600 | normal |
| body | Newsreader | 17.5px | 1.62 | 400 | -0.003em |
| blockquote | Newsreader italic | 17.5px | 1.62 | 400 | -0.003em |
| code (inline) | Geist Mono | 0.88em of body | 1.5 | 400 | normal |
| code (block) | Geist Mono | 13px | 1.55 | 400 | normal |
| doc meta | Geist Mono | 11.5px | 1.5 | 400 | normal |

### Type scale (UI)

| Element | Family | Size | Weight |
|---|---|---|---|
| Window title (crumb) | Geist Mono | 11.5px | 400 |
| Tab label | Geist | 12px | 400 (500 active) |
| Sidebar row | Geist | 12.5px | 400 (500 if folder) |
| Sidebar section header | Geist Mono · uppercase · 0.08em | 10px | 500 |
| Status bar | Geist Mono | 10.5px | 400 |
| Settings h2 | Geist | 20px | 600 (letter-spacing -0.015em) |
| Settings row label | Geist | 13.5px | 500 |
| Settings description | Geist | 12.5px | 400 |
| Settings anchor | Geist Mono | 10.5px | 400 |
| Palette/switcher item name | Geist | 13.5px | 500 |
| Palette/switcher meta | Geist Mono | 10.5px | 400 |

Enable Geist's stylistic alternates: `font-feature-settings: 'cv11', 'ss01'`. Antialiased smoothing on macOS.

---

## Color

All colors expressed in `oklch()` to keep chroma even across hue. The default warmth is **paper**.

### Light theme · paper warmth

| Token | OKLCH | Approx hex | Usage |
|---|---|---|---|
| `--bg`         | `oklch(0.985 0.004 80)` | `#FAF8F2` | Editor canvas, palette body |
| `--bg-2`       | `oklch(0.975 0.004 80)` | `#F5F2EC` | Sidebar, settings nav, code preview cards |
| `--bg-3`       | `oklch(0.96 0.004 80)`  | `#EDEAE3` | Inline code, code blocks |
| `--bg-titlebar`| `oklch(0.97 0.004 80)`  | `#F3F0E9` | Window title bar |
| `--bg-hover`   | `oklch(0.94 0.004 80)`  | `#EAE5DC` | Hover state on rows |
| `--bg-active`  | `oklch(0.92 0.005 35 / 0.6)` | — | Active tree row, active settings nav row |
| `--fg`         | `oklch(0.21 0.01 80)`   | `#262421` | Primary text |
| `--fg-2`       | `oklch(0.42 0.008 80)`  | `#5C5853` | Secondary text |
| `--fg-3`       | `oklch(0.58 0.008 80)`  | `#87827B` | Tertiary / placeholders |
| `--fg-4`       | `oklch(0.72 0.006 80)`  | `#AEA8A0` | Quaternary / line numbers / chevrons |
| `--line`       | `oklch(0.21 0.01 80 / 0.08)` | — | Hairline borders |
| `--line-strong`| `oklch(0.21 0.01 80 / 0.14)` | — | Stronger borders (inputs, palette edges) |
| `--selection`  | accent @ 18% | — | Text selection |
| `--highlight`  | `oklch(0.92 0.07 90)` | — | Search match highlight (briefly, on navigation) |

### Dark theme · paper warmth

| Token | OKLCH | Approx hex |
|---|---|---|
| `--bg`         | `oklch(0.18 0.008 60)` | `#1F1C18` |
| `--bg-2`       | `oklch(0.165 0.008 60)` | `#1C1916` |
| `--bg-3`       | `oklch(0.22 0.008 60)` | `#2A2722` |
| `--bg-titlebar`| `oklch(0.21 0.008 60)` | `#27241F` |
| `--bg-hover`   | `oklch(0.24 0.008 60)` | `#2D2A25` |
| `--bg-active`  | `oklch(0.28 0.02 35 / 0.6)` | — |
| `--fg`         | `oklch(0.92 0.006 250)` | `#E8EAEC` |
| `--fg-2`       | `oklch(0.68 0.008 250)` | `#9CA0A5` |
| `--fg-3`       | `oklch(0.54 0.008 250)` | `#797D82` |
| `--fg-4`       | `oklch(0.42 0.008 250)` | `#5F6266` |
| `--line`       | `oklch(0.92 0.006 250 / 0.08)` | — |
| `--line-strong`| `oklch(0.92 0.006 250 / 0.14)` | — |

### Warmth variants

The `paper` values above are the default. `neutral` shifts hue to 250 (cool gray) with chroma 0.001. `arctic` shifts hue to 240 with chroma 0.006 (very subtle cool tint). See the `WARMTH_MAP` table in `Marginalia.html` for exact alternative values.

### Accent (used sparingly)

Five curated accents. Default is **terracotta**. Used for:
- Active tree row left bar (2px wide)
- Wikilinks (text + dotted underline)
- Caret
- Palette prompt char + active row left bar
- Toggle "on" state
- Text selection (at 18% opacity)

Do not use accent for buttons-at-rest, hover states, or borders. The accent is a finger pointing at things; it loses meaning if it fills surfaces.

| Name | OKLCH |
|---|---|
| terracotta (default) | `oklch(0.62 0.13 35)` |
| slate | `oklch(0.55 0.07 250)` |
| sage | `oklch(0.58 0.07 150)` |
| plum | `oklch(0.55 0.11 320)` |
| ink | `oklch(0.32 0.01 80)` |

Derived tokens:
- `--accent-soft` = accent at 12% alpha — selection highlight in search snippets, accent-tinted backgrounds
- `--accent-line` = accent at 35% alpha — wikilink dotted underline

### Syntax highlighting (code blocks)

Subtle, low-saturation. Italic comments. Light theme:

```
.tok-kw  { color: oklch(0.45 0.13 280); }  /* keyword: function, const, if, return */
.tok-str { color: oklch(0.5  0.09 145); }  /* string literal */
.tok-num { color: oklch(0.55 0.13 35);  }  /* number */
.tok-cmt { color: oklch(0.62 0.008 80); font-style: italic; }
.tok-fn  { color: oklch(0.5  0.11 240); }  /* function name */
```

Dark theme uses the same hues at ~0.74-0.78 lightness. See `marginalia.css`.

---

## Spacing

4px base scale. Most spacing is in the {4, 8, 12, 16, 24} range. Larger values appear only in editor padding (64px top) and section padding.

| Token | Value | Common uses |
|---|---|---|
| 1 | 4px | Tight inline gaps |
| 2 | 8px | Default flex gap, button vertical padding |
| 3 | 12px | Row padding, tab horizontal padding |
| 4 | 16px | Content gutter, settings card padding |
| 5 | 24px | Section padding between rows |
| 6 | 32px | Editor horizontal padding |
| 7 | 48px | Settings page padding (top/bottom) |
| 8 | 64px | Editor top padding |

## Border radius

| Token | Value | Used for |
|---|---|---|
| `none` | 0 | Hairlines, page bg |
| `xs` | 3px | Pills, keyboard kbd hints, badges |
| `sm` | 6px | Buttons, inputs, sidebar rows, code blocks |
| `md` | 10px | Cards, overlays |
| `lg` | 14px | (Reserved — not used in v0) |

## Borders & lines

Only two line weights, both 1px:
- `var(--line)` — alpha 0.08, virtually everywhere
- `var(--line-strong)` — alpha 0.14, on inputs and overlay edges

There are **no decorative dividers**. Lines are functional — they bound a container or separate two regions that need separation.

## Shadows

Shadows mean **this thing floats**. Nothing else gets a shadow.

```
--shadow-sm: 0 1px 0 oklch(0.21 0.01 80 / 0.04);          /* footers / tab strip bottom */
--shadow-md: 0 8px 32px oklch(0.21 0.01 80 / 0.08),       /* popovers, wikilink autocomplete */
             0 1px 0 oklch(0.21 0.01 80 / 0.04);
--shadow-lg: 0 20px 64px oklch(0.21 0.01 80 / 0.18),      /* palette, switcher, search */
             0 2px 0 oklch(0.21 0.01 80 / 0.06);
```

In dark theme, replace tinted shadows with pure black at increased opacity (0.3 / 0.4 / 0.5).

---

## Component patterns

Each component is described in `03_screens.md` in context. Here are the cross-cutting rules.

### Buttons

Three variants only:

| Variant | Background | Text | Border |
|---|---|---|---|
| Primary | `var(--accent)` | `#fff` | none |
| Secondary | transparent | `var(--fg)` | 1px `var(--line-strong)` |
| Ghost | transparent | `var(--fg-2)` | none |

Height: 28px. Horizontal padding: 14px (primary/secondary), 10px (ghost). Border radius: 6px. Font: Geist 12px / 500.

### Inputs

Height: 26-28px. Border: 1px `var(--line-strong)`. Background: `var(--bg-2)`. Border radius: 6px. Font: Geist 12-12.5px (or Geist Mono 12.5px for path-style inputs). Padding: 5px 10px.

Focus: border becomes 1px `var(--line-strong)` at higher alpha. No focus rings. No glow.

### Toggles

30px × 18px pill. Off: `var(--line-strong)`. On: `var(--accent)`. Knob: 14px white circle, 1px subtle shadow. Animates `transform: translateX(12px)` over 150ms.

### Pills / tags / keyboard hints

Single line, 1px border `var(--line-strong)`, padding `1px 5px`, border-radius 3px, font Geist Mono 10.5-11px.

For tags: background `var(--accent-soft)`, text `var(--accent)`, no border.

### Tree rows

| Element | Property |
|---|---|
| Height | 26px (compact: 22, comfy: 30) |
| Padding | 6px left + (14px × depth), 14px right |
| Active state | `background: var(--bg-active)` + 2px accent bar inset 6px on the left |
| Hover state | `background: var(--bg-hover)` |
| Indent guides | 1px `var(--line)` rule from top to bottom of each `.tree-children` container, at left:16px |

### Overlays (palette, switcher, search)

- Backdrop: `oklch(0.18 0.008 250 / 0.32)` with `backdrop-filter: blur(2px)`. Dark theme: pure black at 50%.
- Container width: 560–620px depending on overlay. `max-height: 480-540px`.
- Border: 1px `var(--line-strong)`. Border radius: 10px. Shadow: `var(--shadow-lg)`.
- Input area: 12-14px padding, 1px bottom border, mono-prompt-char (`›`, `⌘P`, search-icon) in accent color.
- Result row height: ~38-44px (varies by overlay). Active row: `var(--bg-active)` + 2px accent bar on the left.
- Footer: 1px top border, 8-14px padding, Geist Mono 10.5px hints.

---

## Motion

Minimal, never showy. Use cubic-bezier(0.4, 0, 0.2, 1) (Material-equivalent) unless otherwise stated.

| Where | Duration | Property |
|---|---|---|
| Tree row hover | 0 (instant) | background |
| Sidebar collapse | 200ms | width |
| Folder expand/collapse | 150ms | height (auto-grow) + chevron rotate |
| Overlay appear | 120ms ease-out | opacity + 4px translateY |
| Overlay backdrop | 120ms | opacity |
| Toggle | 150ms | transform |
| Tab switch | 0 | (instant) |
| Focus mode dimming | 200ms | opacity |
| Caret blink | 1s step | opacity 1 → 0 |
| Search match flash | 600ms | background fade |

No bouncy springs. No staggered children. No parallax. The app should feel **immediately responsive**, not animated.
