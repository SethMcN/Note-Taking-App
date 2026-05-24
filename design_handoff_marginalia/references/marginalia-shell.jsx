// marginalia-shell.jsx — window chrome, sidebar tree, tabs, status bar, editor body

// ── Icon set (hairline strokes, 14px) ──
const Icon = ({ name, size = 14 }) => {
  const s = size;
  const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    chevR:    <path {...stroke} d="M5 3l4 4-4 4" />,
    chevD:    <path {...stroke} d="M3 5l4 4 4-4" />,
    folder:   <path {...stroke} d="M1.5 4.5V11a1 1 0 001 1h9a1 1 0 001-1V5a1 1 0 00-1-1H6.5L5 3H2.5a1 1 0 00-1 1z" />,
    doc:      <path {...stroke} d="M3.5 1.5h5l3 3V12a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5V2a.5.5 0 01.5-.5zM8.5 1.5V4.5h3" />,
    note:     <g {...stroke}><path d="M3.5 2h7v10h-7z" /><path d="M5 5h4M5 7h4M5 9h2.5" /></g>,
    search:   <g {...stroke}><circle cx="6" cy="6" r="3.5" /><path d="M8.6 8.6L11 11" /></g>,
    plus:     <path {...stroke} d="M7 3.5v7M3.5 7h7" />,
    settings: <g {...stroke}><circle cx="7" cy="7" r="2" /><path d="M7 1v2M7 11v2M13 7h-2M3 7H1M11.2 2.8L9.8 4.2M4.2 9.8l-1.4 1.4M11.2 11.2L9.8 9.8M4.2 4.2L2.8 2.8" /></g>,
    sidebar:  <g {...stroke}><rect x="1.5" y="2.5" width="11" height="9" rx="1" /><path d="M5.5 2.5v9" /></g>,
    cmd:      <path {...stroke} d="M5 2.5h4v9H5zM2.5 5v4M11.5 5v4M5 2.5a1.25 1.25 0 11-1.25 1.25M5 11.5a1.25 1.25 0 11-1.25-1.25M9 2.5a1.25 1.25 0 101.25 1.25M9 11.5a1.25 1.25 0 101.25-1.25" />,
    link:     <g {...stroke}><path d="M5.5 8.5L8.5 5.5" /><path d="M8 3.5L10 1.5a2 2 0 113 3l-2 2" /><path d="M6 10.5L4 12.5a2 2 0 11-3-3l2-2" /></g>,
    tag:      <g {...stroke}><path d="M1.5 6V2a.5.5 0 01.5-.5h4l7 7-4.5 4.5-7-7z" /><circle cx="4" cy="4" r=".7" fill="currentColor" stroke="none" /></g>,
    star:     <path {...stroke} d="M7 1.5l1.7 3.6 3.8.5-2.8 2.7.7 3.9L7 10.4 3.6 12.2l.7-3.9L1.5 5.6l3.8-.5z" />,
    inbox:    <g {...stroke}><path d="M1.5 7.5L3 2.5h8L12.5 7.5M1.5 7.5V12h11V7.5M1.5 7.5h3l1 2h3l1-2h3" /></g>,
    archive:  <g {...stroke}><rect x="1.5" y="2.5" width="11" height="3" rx=".5" /><path d="M2.5 5.5V12h9V5.5M5.5 8h3" /></g>,
    x:        <path {...stroke} d="M3 3l8 8M11 3l-8 8" />,
    ellipsis: <g fill="currentColor"><circle cx="3" cy="7" r="1.1" /><circle cx="7" cy="7" r="1.1" /><circle cx="11" cy="7" r="1.1" /></g>,
    panel:    <g {...stroke}><rect x="1.5" y="2.5" width="11" height="9" rx="1" /><path d="M9 2.5v9" /></g>,
    eye:      <g {...stroke}><path d="M1.5 7s2-4 5.5-4 5.5 4 5.5 4-2 4-5.5 4S1.5 7 1.5 7z" /><circle cx="7" cy="7" r="1.5" /></g>,
    list:     <g {...stroke}><path d="M2 4h10M2 7h10M2 10h6" /></g>,
    grip:     <g fill="currentColor"><circle cx="5" cy="3" r="1" /><circle cx="9" cy="3" r="1" /><circle cx="5" cy="7" r="1" /><circle cx="9" cy="7" r="1" /><circle cx="5" cy="11" r="1" /><circle cx="9" cy="11" r="1" /></g>,
    kbd:      <g {...stroke}><rect x="1.5" y="3.5" width="11" height="7" rx="1" /><path d="M3.5 6.5h.01M5.5 6.5h.01M7.5 6.5h.01M9.5 6.5h.01M3.5 8.5h6" /></g>,
    paint:    <g {...stroke}><path d="M2 11.5L9 4.5l2.5 2.5L4.5 14H2v-2.5z" /><path d="M9 4.5L10.5 3a1 1 0 011.4 0l.6.6a1 1 0 010 1.4L11 6.5" /></g>,
    layout:   <g {...stroke}><rect x="1.5" y="2.5" width="11" height="9" rx="1" /><path d="M1.5 5.5h11M5.5 5.5v6" /></g>,
    sync:     <g {...stroke}><path d="M2 4.5a4.5 4.5 0 018-2M12 9.5a4.5 4.5 0 01-8 2" /><path d="M2 1.5v3h3M12 12.5v-3H9" /></g>,
    sun:      <g {...stroke}><circle cx="7" cy="7" r="2" /><path d="M7 1v1.5M7 11.5V13M13 7h-1.5M2.5 7H1M11.2 2.8l-1.1 1.1M3.9 10.1l-1.1 1.1M11.2 11.2l-1.1-1.1M3.9 3.9L2.8 2.8" /></g>,
    moon:     <path {...stroke} d="M11.5 8.5a4.5 4.5 0 01-6-6 5 5 0 106 6z" />,
  };
  return <svg width={s} height={s} viewBox="0 0 14 14" style={{ display: 'block' }}>{paths[name] || null}</svg>;
};

const Kbd = ({ children }) => <span>{children}</span>;

const CodeLine = ({ tokens }) => (
  <>
    {tokens.map(([cls, txt], i) => (
      cls ? <span key={i} className={`tok-${cls}`}>{txt}</span> : <span key={i}>{txt}</span>
    ))}
    {'\n'}
  </>
);

// ── Window chrome ──
function Titlebar({ path = ['notes', 'philosophy'], file = 'On marginalia.md', dirty = false }) {
  return (
    <div className="titlebar">
      <div className="tl">
        <div className="tl-red" /><div className="tl-yellow" /><div className="tl-green" />
      </div>
      <div className="title-crumb">
        {path.map((p, i) => (
          <React.Fragment key={i}>
            <span>{p}</span><span className="sep">/</span>
          </React.Fragment>
        ))}
        <span className="cur">{file}</span>
        {dirty && <span style={{ color: 'var(--accent)', marginLeft: 4 }}>●</span>}
      </div>
      <div className="title-actions">
        <button title="Toggle sidebar"><Icon name="sidebar" /></button>
        <button title="Toggle right panel"><Icon name="panel" /></button>
      </div>
    </div>
  );
}

// ── Sidebar tree ──
function TreeRow({ depth = 0, name, icon = 'doc', active, open, leaf = false, kind = 'file', badge, onClick }) {
  const cls = `tree-row ${active ? 'active' : ''} ${leaf ? 'leaf' : ''} ${open ? 'open' : ''} ${kind === 'folder' ? 'folder' : ''}`;
  return (
    <div className={cls} style={{ paddingLeft: 6 + depth * 14 }} onClick={onClick}>
      <span className="chev"><Icon name="chevR" size={10} /></span>
      <span className="ic"><Icon name={icon} /></span>
      <span className="label">{name}</span>
      {badge != null && <span className="badge">{badge}</span>}
    </div>
  );
}

function Sidebar({ density = 'regular', activePath = 'philosophy/On marginalia', empty = false }) {
  const rowH = density === 'compact' ? 22 : density === 'comfy' ? 30 : 26;
  return (
    <aside className="sidebar" style={{ '--sidebar-row-h': rowH + 'px' }}>
      <div className="sidebar-head">
        <div className="vault">
          <span className="chev"><Icon name="chevD" size={10} /></span>
          <span>vault · field-notes</span>
        </div>
        <div className="icons">
          <button title="New note"><Icon name="plus" /></button>
          <button title="More"><Icon name="ellipsis" /></button>
        </div>
      </div>
      <div className="sidebar-search">
        <span className="icn"><Icon name="search" size={12} /></span>
        <input placeholder="Filter notes…" defaultValue="" />
      </div>

      {empty ? (
        <EmptyTree />
      ) : (
        <div className="tree">
          <div className="tree-section">Pinned</div>
          <TreeRow icon="star" name="Today" leaf badge="↩" />
          <TreeRow icon="inbox" name="Inbox" leaf badge="3" />

          <div className="tree-section">Vault</div>
          <TreeRow icon="folder" kind="folder" name="daily" open />
          <div className="tree-children">
            <TreeRow depth={1} icon="doc" leaf name="2026-05-24.md" />
            <TreeRow depth={1} icon="doc" leaf name="2026-05-23.md" />
            <TreeRow depth={1} icon="doc" leaf name="2026-05-22.md" />
          </div>

          <TreeRow icon="folder" kind="folder" name="philosophy" open />
          <div className="tree-children">
            <TreeRow depth={1} icon="note" leaf name="Attention as currency.md" />
            <TreeRow depth={1} icon="note" leaf active={activePath === 'philosophy/On marginalia'} name="On marginalia.md" />
            <TreeRow depth={1} icon="note" leaf name="Slow thinking.md" />
            <TreeRow depth={1} icon="folder" kind="folder" name="essays" />
          </div>

          <TreeRow icon="folder" kind="folder" name="projects" open />
          <div className="tree-children">
            <TreeRow depth={1} icon="folder" kind="folder" name="winter-residency" />
            <TreeRow depth={1} icon="folder" kind="folder" name="reading-list" />
          </div>

          <TreeRow icon="folder" kind="folder" name="references" />
          <TreeRow icon="archive" kind="folder" name="archive" />
        </div>
      )}

      <div className="sidebar-foot">
        <span className="dot" />
        <span>synced · 12s ago</span>
        <span style={{ marginLeft: 'auto', opacity: 0.7 }}>432 notes</span>
      </div>
    </aside>
  );
}

function EmptyTree() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', padding: '24px 20px',
      color: 'var(--fg-3)', textAlign: 'center', gap: 14,
    }}>
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
        <rect x="6" y="10" width="32" height="26" rx="2" stroke="currentColor" strokeWidth="1" opacity="0.4" />
        <path d="M6 17h32M14 24h16M14 28h10" stroke="currentColor" strokeWidth="1" opacity="0.35" />
      </svg>
      <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontStyle: 'italic', color: 'var(--fg-2)' }}>
        An empty vault.
      </div>
      <div style={{ fontSize: 11.5, lineHeight: 1.5, maxWidth: 200 }}>
        Start with a thought, a quote, or yesterday's weather. Notes are plain markdown on your disk.
      </div>
      <div style={{
        display: 'flex', gap: 6, marginTop: 4,
        fontFamily: 'var(--font-mono)', fontSize: 10.5,
      }}>
        <span style={{ border: '1px solid var(--line-strong)', padding: '2px 6px', borderRadius: 3 }}>⌘ N</span>
        <span style={{ color: 'var(--fg-3)', alignSelf: 'center' }}>new note</span>
      </div>
    </div>
  );
}

// ── Tabs ──
function Tabs({ tabs = [{ name: 'On marginalia.md', dirty: true, active: true }] }) {
  return (
    <div className="tabs">
      {tabs.map((t, i) => (
        <div key={i} className={`tab ${t.active ? 'active' : ''}`}>
          {t.dirty && <span className="dirty" />}
          <span className="name">{t.name}</span>
          <span className="x"><Icon name="x" size={10} /></span>
        </div>
      ))}
      <div style={{
        display: 'flex', alignItems: 'center', padding: '0 8px',
        color: 'var(--fg-3)', cursor: 'pointer',
      }}><Icon name="plus" size={12} /></div>
    </div>
  );
}

// ── Status bar ──
function StatusBar({ words = 1284, mode = 'edit', file = 'philosophy/On marginalia.md', backlinks = 7 }) {
  return (
    <div className="statusbar">
      <span>{file}</span>
      <span className="pill">md</span>
      <div className="right">
        <span>{backlinks} backlinks</span>
        <span>{words} words</span>
        <span>{mode}</span>
        <span className="kbd">⌘K</span>
      </div>
    </div>
  );
}

// ── Editor body — the prose ──
function EditorBody({ showCaret = true, currentLine = 4, focusMode = false }) {
  const lineCls = (n) => (focusMode && n === currentLine ? 'here' : '') + (n === currentLine && !focusMode ? ' cur-line' : '');
  return (
    <article className="editor-body">
      <h1 className={lineCls(0)}>On marginalia</h1>
      <div className="doc-meta">
        <span>2026-05-24</span>
        <span>·</span>
        <span>1284 words</span>
        <span>·</span>
        <span>draft</span>
      </div>

      <p className={lineCls(1)}>
        A book reads twice: once for what is written, and again for what the reader writes back.
        The notes scrawled in the gutter are not a corruption of the text — they are the only proof
        that the text was met by a mind.
      </p>

      <h2 className={lineCls(2)}><span className="md-tok">## </span>The empty margin is hostile</h2>

      <p className={lineCls(3)}>
        We have built knowledge tools that mistake the act of capture for the act of thought. A blank
        page promises a great deal and demands almost nothing. The <strong>margin</strong>, by
        contrast, is small, irregular, and adjacent — and in that smallness it asks a precise
        question: <em>what, exactly, do you have to say about this?</em>
      </p>

      <p className={lineCls(4)}>
        See also <span className="wikilink">[[<span className="wikilink-tok"></span>Attention as currency<span className="wikilink-tok"></span>]]</span>{' '}
        and <span className="wikilink">[[Slow thinking#deliberate]]</span>. The link between them is{' '}
        <span className="wikilink broken">[[unwritten yet]]</span>
        {showCaret && <span className="caret" />}
      </p>

      <h2 className={lineCls(5)}><span className="md-tok">## </span>A vocabulary</h2>
      <p className={lineCls(6)}>The shapes I keep returning to:</p>

      <ul>
        <li className={lineCls(7)}><strong>Gloss</strong> — a translation in miniature; the note that says <em>this means&hellip;</em></li>
        <li className={lineCls(8)}><strong>Sigla</strong> — a private symbol; the punctuation of a habit</li>
        <li className={lineCls(9)}><strong>Cross</strong> — a thread from this page to another, made of nothing but intent</li>
      </ul>

      <blockquote className={lineCls(10)}>
        "The only books that influence us are those for which we are ready, and which have gone a
        little farther down our particular path than we have yet got ourselves."
      </blockquote>

      <h3 className={lineCls(11)}>A small example</h3>
      <pre>
        <span className="lang">js</span>
        <code>
          <CodeLine tokens={[['cmt', '// reading-as-conversation.js']]} />
          <CodeLine tokens={[['kw','function '],['fn','annotate'],['', '(text, mind) {']]} />
          <CodeLine tokens={[['', '  '],['kw','const '],['', 'trace = []']]} />
          <CodeLine tokens={[['', '  '],['kw','for '],['', '('],['kw','const '],['','line '],['kw','of '],['', 'text) {']]} />
          <CodeLine tokens={[['', '    '],['cmt', "// don't summarize; argue back"]]} />
          <CodeLine tokens={[['', '    '],['kw','if '],['', '(mind.disagrees(line)) trace.'],['fn','push'],['', '('],['str',"'!'"],['', ')']]} />
          <CodeLine tokens={[['', '    '],['kw','else if '],['', '(mind.recognizes(line)) trace.'],['fn','push'],['', '('],['str',"'~'"],['', ')']]} />
          <CodeLine tokens={[['', '  }']]} />
          <CodeLine tokens={[['', '  '],['kw','return '],['', 'trace']]} />
          <CodeLine tokens={[['', '}']]} />
          <CodeLine tokens={[['', '']]} />
          <CodeLine tokens={[['fn','annotate'],['', '(book, me) '],['cmt', "// → ['~', '!', '!', '~', '?', ...]"]]} />
        </code>
      </pre>

      <p className={lineCls(13)}>
        I want a tool whose entire shape is the gutter. Not a database. Not a graph. A wall to write
        on, with a margin big enough that what you say about a thing can sit beside the thing itself.
      </p>
    </article>
  );
}

// ── Marginal annotations rail (right side) ──
function MarginRail({ notes }) {
  return (
    <div className="margin-rail">
      {notes.map((n, i) => (
        <div key={i} className={`margin-note ${n.kind || ''}`} style={{ top: n.top }}>
          <span className="author">{n.author}</span>
          {n.text}
        </div>
      ))}
    </div>
  );
}

// ── Document spine ──
function Spine({ items }) {
  return (
    <div className="spine">
      {items.map((it, i) => <div key={i} className={`seg ${it.lvl} ${it.active ? 'active' : ''}`} />)}
    </div>
  );
}

Object.assign(window, {
  Icon, Kbd,
  Titlebar, Sidebar, EmptyTree, Tabs, StatusBar,
  EditorBody, MarginRail, Spine,
});
