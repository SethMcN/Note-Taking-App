// marginalia-overlays.jsx — command palette, quick switcher, search, wikilink popover

function CommandPalette() {
  const cmds = [
    { ic: 'doc',     name: 'New note',                    meta: 'create in current folder',     keys: ['⌘','N'] },
    { ic: 'doc',     name: 'New daily note',              meta: 'daily/2026-05-24.md',           keys: ['⌘','⇧','N'] },
    { ic: 'search',  name: 'Search in all notes',         meta: 'full-text',                     keys: ['⌘','F'] },
    { ic: 'paint',   name: 'Toggle theme',                meta: 'system follows OS',             keys: ['⌘','⇧','L'] },
    { ic: 'eye',     name: 'Enter focus mode',            meta: 'distraction-free writing',      keys: ['⌘','.'] },
    { ic: 'list',    name: 'Show document outline',       meta: 'right rail',                    keys: ['⌘','⇧','O'] },
    { ic: 'link',    name: 'Insert wikilink',             meta: 'at cursor',                     keys: ['[','['] },
    { ic: 'kbd',     name: 'Edit keyboard shortcuts',     meta: 'settings → keymap',             keys: [] },
    { ic: 'settings',name: 'Open settings',               meta: '',                              keys: ['⌘',','] },
  ];
  return (
    <div className="overlay-backdrop">
      <div className="overlay" style={{ width: 580 }}>
        <div className="overlay-input">
          <span className="prompt">›</span>
          <input placeholder="Type a command…" defaultValue="new " />
          <span className="esc">esc</span>
        </div>
        <div className="overlay-list">
          {cmds.map((c, i) => (
            <div key={i} className={`overlay-row ${i === 0 ? 'sel' : ''}`}>
              <span className="ic"><Icon name={c.ic} /></span>
              <div className="label">
                <span className="name">
                  {c.name.toLowerCase().includes('new')
                    ? <><mark>New</mark>{c.name.slice(3)}</>
                    : c.name}
                </span>
                {c.meta && <span className="meta">{c.meta}</span>}
              </div>
              <span className="shortcut">{c.keys.map((k, j) => <span key={j}>{k}</span>)}</span>
            </div>
          ))}
        </div>
        <div className="overlay-foot">
          <span><span className="k">↑↓</span>navigate</span>
          <span><span className="k">↵</span>run</span>
          <span><span className="k">⌘P</span>files</span>
          <span style={{ marginLeft: 'auto' }}>9 of 142</span>
        </div>
      </div>
    </div>
  );
}

function QuickSwitcher() {
  const files = [
    { name: 'On marginalia',         path: 'philosophy/On marginalia.md',          edit: '2 min ago',  match: [3, 13] },
    { name: 'On reading slowly',     path: 'philosophy/essays/On reading slowly.md', edit: 'yesterday', match: [3, 11] },
    { name: 'On the gloss',          path: 'philosophy/On the gloss.md',           edit: '3 d ago',    match: [3, 8] },
    { name: 'Annotation systems',    path: 'references/Annotation systems.md',     edit: '1 w ago',    match: [0, 11] },
    { name: 'Reading log — 2026',    path: 'projects/reading-list/2026.md',        edit: '4 w ago',    match: [9, 18] },
    { name: 'Old notebook scans',    path: 'references/Old notebook scans.md',     edit: '2 mo ago',   match: [4, 13] },
  ];
  const highlight = (s, range) => {
    if (!range) return s;
    return <>{s.slice(0, range[0])}<mark>{s.slice(range[0], range[1])}</mark>{s.slice(range[1])}</>;
  };
  return (
    <div className="overlay-backdrop">
      <div className="overlay">
        <div className="overlay-input">
          <span className="prompt">⌘P</span>
          <input placeholder="Jump to a note…" defaultValue="on m" />
          <span className="esc">esc</span>
        </div>
        <div className="overlay-list">
          {files.map((f, i) => (
            <div key={i} className={`overlay-row ${i === 0 ? 'sel' : ''}`}>
              <span className="ic"><Icon name={i < 3 ? 'note' : i === 4 ? 'doc' : 'archive'} /></span>
              <div className="label">
                <span className="name">{highlight(f.name, f.match)}</span>
                <span className="meta">{f.path}</span>
              </div>
              <span className="shortcut" style={{ color: 'var(--fg-4)' }}>{f.edit}</span>
            </div>
          ))}
        </div>
        <div className="overlay-foot">
          <span><span className="k">↵</span>open</span>
          <span><span className="k">⌥↵</span>open in split</span>
          <span><span className="k">⌘↵</span>open in new tab</span>
          <span style={{ marginLeft: 'auto' }}>fuzzy · recents</span>
        </div>
      </div>
    </div>
  );
}

function SearchPanel() {
  const results = [
    {
      path: 'philosophy/On marginalia.md', hits: 6,
      snips: [
        'a corruption of the text — they are the only proof that the text was **met** by a mind.',
        'the **margin**, by contrast, is small, irregular, and adjacent — and in that smallness',
        'a **margin** big enough that what you say about a thing can sit beside the thing itself.',
      ],
    },
    {
      path: 'philosophy/On the gloss.md', hits: 4,
      snips: [
        'the **margin** is where the text becomes a conversation; without it a book is a monologue',
        'a printer\'s **margin** is generous; ours should be too — a fifth of the page, at least',
      ],
    },
    {
      path: 'references/Annotation systems.md', hits: 3,
      snips: [
        'Wittgenstein wrote in the **margin** in pencil so he could revise; the lead is now barely',
      ],
    },
    {
      path: 'daily/2026-05-22.md', hits: 1,
      snips: [
        'asked B. about her **margin**alia practice — she keeps three colours of pen, one for each',
      ],
    },
  ];
  const mark = (s) => {
    const parts = s.split(/\*\*([^*]+)\*\*/g);
    return parts.map((p, i) => (i % 2 ? <mark key={i}>{p}</mark> : p));
  };
  return (
    <div className="overlay-backdrop" style={{ paddingTop: 64 }}>
      <div className="overlay" style={{ width: 620, maxHeight: 540 }}>
        <div className="overlay-input">
          <span className="prompt"><Icon name="search" /></span>
          <input placeholder="Search all notes…" defaultValue="margin" />
          <span className="esc">esc</span>
        </div>
        <div className="overlay-list" style={{ padding: '4px 0 0' }}>
          {results.map((r, i) => (
            <div key={i} style={{ padding: '8px 14px 12px', borderBottom: i < results.length - 1 ? '1px solid var(--line)' : 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'baseline', gap: 8,
                marginBottom: 6, cursor: 'pointer',
              }}>
                <Icon name="note" />
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, color: 'var(--fg)', fontSize: 13 }}>
                  {r.path.split('/').pop().replace('.md', '')}
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10.5, color: 'var(--fg-3)' }}>
                  {r.path}
                </span>
                <span style={{
                  marginLeft: 'auto',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10.5,
                  color: 'var(--fg-3)',
                  background: 'var(--bg-3)',
                  padding: '0 5px',
                  borderRadius: 3,
                }}>
                  {r.hits}
                </span>
              </div>
              {r.snips.map((s, j) => (
                <div key={j} className="search-result-snip" style={{ paddingLeft: 22 }}>
                  <span style={{ color: 'var(--fg-4)' }}>{12 + j * 4}:</span>{' '}
                  {mark(s)}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="overlay-foot">
          <span><span className="k">⌥M</span>match case</span>
          <span><span className="k">⌥R</span>regex</span>
          <span><span className="k">↵</span>open</span>
          <span style={{ marginLeft: 'auto' }}>14 results · 4 files</span>
        </div>
      </div>
    </div>
  );
}

// inline wikilink autocomplete — shown anchored near the cursor
function WikiPopover({ left = 220, top = 280 }) {
  const items = [
    { name: 'Attention as currency', path: 'philosophy/Attention as currency.md', edit: '3 d' },
    { name: 'Attention residue',     path: 'references/Attention residue.md',     edit: '2 w' },
    { name: 'Attentive reading',     path: 'philosophy/essays/Attentive reading.md', edit: '1 mo' },
    { name: 'Attendance (poem)',     path: 'archive/Attendance.md',               edit: '4 mo' },
  ];
  const mark = (s) => <><mark>Att</mark>{s.slice(3)}</>;
  return (
    <div className="wiki-pop" style={{ left, top }}>
      {items.map((it, i) => (
        <div key={i} className={`wiki-pop-row ${i === 0 ? 'sel' : ''}`}>
          <span style={{ color: 'var(--fg-3)' }}><Icon name="note" /></span>
          <span className="nm">{mark(it.name)}</span>
          <span className="pth">{it.path.split('/')[0]}</span>
        </div>
      ))}
      <div className="wiki-pop-row" style={{ color: 'var(--fg-3)', borderTop: '1px solid var(--line)' }}>
        <span><Icon name="plus" /></span>
        <span className="nm" style={{ color: 'var(--fg-2)' }}>Create <strong style={{ color: 'var(--accent)' }}>"Att"</strong></span>
        <span className="pth">⏎ to confirm</span>
      </div>
      <div className="wiki-pop-foot">
        <span>↑↓ select</span>
        <span>↵ insert</span>
        <span style={{ marginLeft: 'auto' }}>4 matches</span>
      </div>
    </div>
  );
}

Object.assign(window, { CommandPalette, QuickSwitcher, SearchPanel, WikiPopover });
