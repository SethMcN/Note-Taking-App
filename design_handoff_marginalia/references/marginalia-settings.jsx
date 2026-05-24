// marginalia-settings.jsx — settings UX (single-page, searchable, live previews)

function SettingsNav({ active = 'layers' }) {
  const groups = [
    { title: 'Setup', items: [
      ['layers',    'Layers'],
      ['general',   'General'],
    ]},
    { title: 'Look', items: [
      ['appearance','Appearance'],
      ['fonts',     'Typography'],
    ]},
    { title: 'Writing', items: [
      ['editor',    'Editor'],
      ['markdown',  'Markdown'],
      ['files',     'Files & vault'],
    ]},
    { title: 'Behavior', items: [
      ['keymap',    'Keyboard'],
      ['sync',      'Sync'],
      ['privacy',   'Privacy'],
    ]},
    { title: 'About', items: [
      ['version',   'Version'],
      ['changelog', 'Changelog'],
    ]},
  ];
  return (
    <nav className="settings-nav">
      {groups.map((g, i) => (
        <React.Fragment key={i}>
          <div className="group-label">{g.title}</div>
          {g.items.map(([k, label]) => (
            <div key={k} className={`nv-row ${k === active ? 'active' : ''}`}>
              <span>{label}</span>
            </div>
          ))}
        </React.Fragment>
      ))}
    </nav>
  );
}

function SettingRow({ label, desc, anchor, children }) {
  return (
    <div className="setting-row">
      <div>
        <div className="lbl">{label}{anchor && <span style={{ marginLeft: 8, color: 'var(--fg-4)', fontFamily: 'var(--font-mono)', fontSize: 10.5, fontWeight: 400 }}>{anchor}</span>}</div>
        {desc && <div className="dsc">{desc}</div>}
      </div>
      <div className="ctrl">{children}</div>
    </div>
  );
}

function Toggle({ on = true }) { return <div className={`toggle ${on ? 'on' : ''}`} />; }

function SwatchPicker({ value = 'terracotta' }) {
  const swatches = [
    ['terracotta', 'oklch(0.62 0.13 35)'],
    ['slate',      'oklch(0.55 0.07 250)'],
    ['sage',       'oklch(0.58 0.07 150)'],
    ['plum',       'oklch(0.55 0.11 320)'],
    ['ink',        'oklch(0.32 0.01 80)'],
  ];
  return (
    <div className="swatches">
      {swatches.map(([k, c]) => (
        <button key={k} className={k === value ? 'sel' : ''} style={{ '--swatch': c, background: c }} />
      ))}
    </div>
  );
}

function RangeSetting({ value, unit = 'px' }) {
  return (
    <div className="range-row">
      <input type="range" min="560" max="900" defaultValue={value} />
      <span className="val">{value}{unit}</span>
    </div>
  );
}

// ── Settings views ──
function SettingsAppearance() {
  return (
    <div className="settings-main">
      <div className="settings-search">
        <Icon name="search" size={16} />
        <input placeholder="Search every setting… try “line height” or ⌘," />
        <span className="badge">/ to focus</span>
      </div>

      <section className="settings-section" id="theme">
        <div className="sec-head">
          <h2>Appearance</h2>
          <span className="sec-anchor">settings.appearance</span>
        </div>
        <p className="sec-desc">
          How Marginalia looks. Changes apply instantly — nothing is staged.
        </p>

        <SettingRow label="Theme" desc="Follow your system, or pin one. Affects only this window.">
          <div style={{ display: 'flex', gap: 6 }}>
            {['Light', 'Dark', 'System'].map((m, i) => (
              <button key={m} style={{
                padding: '5px 10px',
                fontFamily: 'var(--font-sans)', fontSize: 12,
                background: i === 0 ? 'var(--bg-active)' : 'var(--bg-2)',
                color: i === 0 ? 'var(--fg)' : 'var(--fg-2)',
                border: '1px solid var(--line-strong)',
                borderRadius: 6,
                cursor: 'pointer',
                fontWeight: i === 0 ? 500 : 400,
              }}>{m}</button>
            ))}
          </div>
        </SettingRow>

        <SettingRow label="Accent color" desc="Used for the active note, links, and the caret. We keep it deliberately small.">
          <SwatchPicker />
        </SettingRow>

        <SettingRow label="Background warmth" desc="A subtle tint to the canvas. Try `paper` to read longer.">
          <div style={{ display: 'flex', gap: 6, fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            {['arctic', 'neutral', 'paper'].map((m, i) => (
              <button key={m} style={{
                padding: '5px 10px',
                background: i === 2 ? 'var(--bg-active)' : 'var(--bg-2)',
                color: i === 2 ? 'var(--fg)' : 'var(--fg-2)',
                border: '1px solid var(--line-strong)',
                borderRadius: 6,
                cursor: 'pointer',
              }}>{m}</button>
            ))}
          </div>
        </SettingRow>

        <SettingRow label="Show document spine" desc="A hairline minimap of your headings on the left edge of the editor.">
          <Toggle on />
        </SettingRow>

        <SettingRow label="Show marginal rail" desc="The right-hand column for annotations, todos, and backlinks. Hides on narrow windows.">
          <Toggle on />
        </SettingRow>
      </section>

      <LivePreviewCard />

      <section className="settings-section" id="typography">
        <div className="sec-head">
          <h2>Typography</h2>
          <span className="sec-anchor">settings.fonts</span>
        </div>
        <p className="sec-desc">Three fonts: one for prose, one for UI, one for code. Choose carefully.</p>

        <SettingRow label="Prose font" desc="The face you'll spend most of your day reading. Italic is used for emphasis.">
          <select className="select" defaultValue="Newsreader">
            <option>Newsreader</option><option>iA Writer Duo</option>
            <option>Source Serif 4</option><option>EB Garamond</option><option>System serif</option>
          </select>
        </SettingRow>

        <SettingRow label="Interface font" desc="Sidebar, tabs, settings. Should disappear.">
          <select className="select" defaultValue="Geist">
            <option>Geist</option><option>Inter</option>
            <option>SF Pro</option><option>System sans</option>
          </select>
        </SettingRow>

        <SettingRow label="Monospace" desc="Code blocks, file paths, the margin rail.">
          <select className="select" defaultValue="Geist Mono">
            <option>Geist Mono</option><option>JetBrains Mono</option>
            <option>IBM Plex Mono</option><option>SF Mono</option>
          </select>
        </SettingRow>

        <SettingRow label="Body size" desc="The size of your prose. Headings and code scale with this.">
          <div className="range-row">
            <input type="range" min="14" max="22" defaultValue="17" />
            <span className="val">17.5px</span>
          </div>
        </SettingRow>

        <SettingRow label="Line height" desc="More air on long-reading days; less for note-taking.">
          <div className="range-row">
            <input type="range" min="100" max="200" defaultValue="162" />
            <span className="val">1.62</span>
          </div>
        </SettingRow>

        <SettingRow label="Editor width" desc="Comfortable measure is ~66 characters. Use focus mode to override.">
          <RangeSetting value={680} />
        </SettingRow>
      </section>
    </div>
  );
}

function LivePreviewCard() {
  return (
    <div style={{
      margin: '0 -16px 40px',
      padding: 20,
      background: 'var(--bg-2)',
      border: '1px solid var(--line)',
      borderRadius: 10,
      position: 'relative',
    }}>
      <div style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'var(--fg-4)', marginBottom: 12,
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
        Live preview
        <span style={{ marginLeft: 'auto', color: 'var(--fg-3)' }}>updates as you change settings above</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: 24, alignItems: 'start' }}>
        <div style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 17.5,
          lineHeight: 1.62,
          color: 'var(--fg)',
        }}>
          <div style={{ fontWeight: 600, fontSize: 24, letterSpacing: '-0.012em', marginBottom: 4 }}>
            On marginalia
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 11,
            color: 'var(--fg-3)', marginBottom: 12,
          }}>2026-05-24 · 1284 words</div>
          <div>A book reads twice: once for what is written, and again for what the reader writes back. The notes scrawled in the gutter are not a corruption of the text — they are the only proof that the text was met by a mind.</div>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)', lineHeight: 1.5 }}>
          <div style={{ borderLeft: '1px solid var(--line-strong)', paddingLeft: 10 }}>
            <span style={{ color: 'var(--accent)', fontWeight: 500, display: 'block', marginBottom: 2 }}>@m</span>
            margin rail keeps pace with the line you're on
          </div>
        </div>
      </div>
    </div>
  );
}

function SettingsKeymap() {
  const groups = [
    { name: 'Workspace', items: [
      ['Open command palette', 'Search every action.',          ['⌘', 'K']],
      ['Open quick switcher',  'Jump to a note by name.',        ['⌘', 'P']],
      ['Open settings',         '',                              ['⌘', ',']],
      ['Toggle left sidebar',   '',                              ['⌘', '\\']],
      ['Toggle right rail',     'Annotations & backlinks.',     ['⌘', '⇧', '\\']],
      ['Enter focus mode',      'Dim everything but the line.', ['⌘', '.']],
    ]},
    { name: 'Writing', items: [
      ['New note',              'Creates in the current folder.',     ['⌘', 'N']],
      ['New daily note',         '',                                   ['⌘', '⇧', 'N']],
      ['Insert wikilink',        '',                                   ['[', '[']],
      ['Toggle bold',            '',                                   ['⌘', 'B']],
      ['Toggle italic',          '',                                   ['⌘', 'I']],
      ['Insert code block',      '',                                   ['⌘', '⇧', 'C']],
      ['Format selection',       'Wikilink, callout, list, quote.',  ['⌘', '/']],
    ]},
    { name: 'Navigation', items: [
      ['Go to previous note',    'Through your recents.',              ['⌘', '[']],
      ['Go to next note',         '',                                   ['⌘', ']']],
      ['Show backlinks',         '',                                   ['⌘', '⇧', 'B']],
      ['Follow link under cursor','',                                  ['⌘', '↵']],
    ]},
  ];
  return (
    <div className="settings-main">
      <div className="settings-search">
        <Icon name="search" size={16} />
        <input placeholder="Search shortcuts… try “bold” or “⌘B”" defaultValue="" />
        <span className="badge">19 shortcuts</span>
      </div>

      <section className="settings-section">
        <div className="sec-head">
          <h2>Keyboard</h2>
          <span className="sec-anchor">settings.keymap</span>
        </div>
        <p className="sec-desc">
          Click a shortcut to rebind. Press the new key combination, or <code>esc</code> to cancel.
        </p>

        <div style={{
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
          borderRadius: 8,
          padding: '12px 16px',
          marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
          fontSize: 12.5, color: 'var(--fg-2)',
        }}>
          <Icon name="kbd" />
          <span>Conflict-aware — if a key is taken, you'll see who has it.</span>
          <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-3)' }}>
            keymap.json · 19 lines · 1 override
          </span>
        </div>

        {groups.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 28 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--fg-4)', marginBottom: 6,
            }}>{g.name}</div>
            {g.items.map(([name, desc, keys], i) => (
              <div key={i} className="shortcut-row">
                <span className="scn">{name}</span>
                <span className="scd">{desc}</span>
                <span className="sck">{keys.map((k, j) => <span key={j}>{k}</span>)}</span>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}

function SettingsOverview() {
  return (
    <div className="settings-main">
      <div className="settings-search">
        <Icon name="search" size={16} />
        <input placeholder="Search every setting… try “font”, “sync”, “wikilink”" defaultValue="line h" />
        <span className="badge">3 matches</span>
      </div>

      <div style={{
        marginBottom: 24,
        fontFamily: 'var(--font-mono)', fontSize: 11,
        color: 'var(--fg-3)',
      }}>3 results for <span style={{ color: 'var(--accent)' }}>"line h"</span></div>

      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        borderRadius: 10,
        marginBottom: 14,
        padding: '14px 18px',
      }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>
              <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '0 2px', borderRadius: 2 }}>Line h</span>eight
            </div>
            <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 3 }}>
              More air on long-reading days; less for note-taking.
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 10.5,
              color: 'var(--fg-4)', marginTop: 4,
            }}>Typography · settings.fonts.lineHeight</div>
          </div>
          <div className="range-row" style={{ width: 200, flexShrink: 0 }}>
            <input type="range" min="100" max="200" defaultValue="162" />
            <span className="val">1.62</span>
          </div>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        borderRadius: 10,
        marginBottom: 14,
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>
            Code block <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '0 2px', borderRadius: 2 }}>line h</span>eight
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 3 }}>
            Tighter for code; we recommend keeping this as is.
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5,
            color: 'var(--fg-4)', marginTop: 4,
          }}>Markdown · settings.markdown.code.lineHeight</div>
        </div>
        <div className="range-row" style={{ width: 200, flexShrink: 0 }}>
          <input type="range" min="100" max="180" defaultValue="155" />
          <span className="val">1.55</span>
        </div>
      </div>

      <div style={{
        background: 'var(--bg-2)',
        border: '1px solid var(--line)',
        borderRadius: 10,
        marginBottom: 14,
        padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--fg)' }}>
            Sidebar <span style={{ background: 'var(--accent-soft)', color: 'var(--accent)', padding: '0 2px', borderRadius: 2 }}>line h</span>eight
          </div>
          <div style={{ fontSize: 12, color: 'var(--fg-2)', marginTop: 3 }}>
            Controls the density of the file tree.
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)', fontSize: 10.5,
            color: 'var(--fg-4)', marginTop: 4,
          }}>Panes &amp; tabs · settings.panes.tree.lineHeight</div>
        </div>
        <select className="select" style={{ width: 200, flexShrink: 0 }} defaultValue="regular">
          <option>compact</option><option>regular</option><option>comfortable</option>
        </select>
      </div>

      <div style={{
        marginTop: 28,
        textAlign: 'center', color: 'var(--fg-3)', fontSize: 12,
        fontFamily: 'var(--font-mono)',
      }}>
        Press <span style={{ border: '1px solid var(--line-strong)', padding: '1px 5px', borderRadius: 3, margin: '0 2px' }}>esc</span> to clear, or browse by category on the left.
      </div>
    </div>
  );
}

Object.assign(window, {
  SettingsNav, SettingsAppearance, SettingsKeymap, SettingsOverview,
});
