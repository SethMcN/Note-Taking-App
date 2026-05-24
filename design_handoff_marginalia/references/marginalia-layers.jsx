// marginalia-layers.jsx — the Layers settings page (centerpiece of the
// progressive-disclosure system). Replaces dozens of granular toggles with a
// single coherent "grow with you" story.

const LAYER_DEFS = [
  {
    id: 'L0', name: 'Calm', subtitle: 'Just the editor',
    blurb: 'Open a folder, write. That\'s the whole app. Use ⌘K to do anything, ⌘P to switch notes.',
  },
  {
    id: 'L1', name: 'Files', subtitle: '+ file sidebar',
    blurb: 'See your vault. Click to switch notes. Useful once you stop remembering filenames.',
  },
  {
    id: 'L2', name: 'Worktable', subtitle: '+ tabs, status, search',
    blurb: 'Work across notes. Tabs for parallel context, status for word count, search for ⌘F.',
  },
  {
    id: 'L3', name: 'Studio', subtitle: '+ spine, margins, backlinks',
    blurb: 'The whole apparatus. Marginal annotations, document spine, right rail with backlinks and outline.',
  },
];

// Visual diagram of each layer's chrome. Drawn with positioned divs.
function LayerDiagram({ id, accent = 'oklch(0.62 0.13 35)' }) {
  // Geometry: titlebar always present. Then optional sidebar/tabs/status/spine/margins/rail.
  const has = {
    sidebar:  id !== 'L0',
    tabs:     id === 'L2' || id === 'L3',
    status:   id === 'L2' || id === 'L3',
    spine:    id === 'L3',
    margins:  id === 'L3',
    rail:     id === 'L3',
  };
  const tone = (k) => ({
    base: 'var(--bg)',
    fade: 'var(--bg-2)',
    deep: 'var(--bg-3)',
    line: 'var(--line-strong)',
    fg:   'var(--fg-4)',
  })[k];

  return (
    <div style={{
      position: 'relative', height: 110,
      borderRadius: 5, overflow: 'hidden',
      background: tone('base'), border: `1px solid ${tone('line')}`,
    }}>
      {/* titlebar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 12,
        background: tone('fade'), borderBottom: `1px solid ${tone('line')}`,
        display: 'flex', alignItems: 'center', gap: 2, padding: '0 4px',
      }}>
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#ff5f57' }} />
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#febc2e' }} />
        <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#28c840' }} />
      </div>

      {/* sidebar */}
      {has.sidebar && (
        <div style={{
          position: 'absolute', top: 12, left: 0, bottom: has.status ? 8 : 0, width: 22,
          background: tone('fade'), borderRight: `1px solid ${tone('line')}`,
          padding: '6px 4px', display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          <div style={{ height: 2, background: tone('fg'), opacity: 0.45 }} />
          <div style={{ height: 2, background: tone('fg'), opacity: 0.35, marginLeft: 4 }} />
          <div style={{ height: 2, background: accent, marginLeft: 4 }} />
          <div style={{ height: 2, background: tone('fg'), opacity: 0.35, marginLeft: 4 }} />
        </div>
      )}

      {/* tabs */}
      {has.tabs && (
        <div style={{
          position: 'absolute', top: 12, left: has.sidebar ? 22 : 0,
          right: has.rail ? 28 : 0, height: 8,
          borderBottom: `1px solid ${tone('line')}`, display: 'flex', gap: 1, padding: '1px 2px',
        }}>
          <div style={{ flex: 1, background: tone('base'), borderBottom: `1.5px solid ${accent}` }} />
          <div style={{ flex: 1, background: tone('fade') }} />
        </div>
      )}

      {/* editor body */}
      <div style={{
        position: 'absolute',
        top: 12 + (has.tabs ? 8 : 0),
        left: has.sidebar ? 22 : 0,
        right: has.rail ? 28 : 0,
        bottom: has.status ? 8 : 0,
        display: 'flex',
      }}>
        {has.spine && (
          <div style={{
            width: 1, marginLeft: 5, marginTop: 8,
            background: tone('fg'), opacity: 0.6,
          }} />
        )}
        <div style={{
          flex: 1, padding: '8px 8px 0', display: 'flex', flexDirection: 'column', gap: 2,
        }}>
          <div style={{ height: 3, width: '60%', background: tone('fg'), opacity: 0.65, borderRadius: 1 }} />
          <div style={{ height: 1.5, width: '90%', background: tone('fg'), opacity: 0.3, borderRadius: 1, marginTop: 3 }} />
          <div style={{ height: 1.5, width: '85%', background: tone('fg'), opacity: 0.3, borderRadius: 1 }} />
          <div style={{ height: 1.5, width: '70%', background: tone('fg'), opacity: 0.3, borderRadius: 1 }} />
        </div>
        {has.margins && (
          <div style={{
            width: 14, marginRight: 4, marginTop: 12,
            borderLeft: `1px solid ${tone('line')}`,
            paddingLeft: 3, display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            <div style={{ height: 1.5, background: accent, opacity: 0.7, width: '60%' }} />
            <div style={{ height: 1, background: tone('fg'), opacity: 0.4 }} />
          </div>
        )}
      </div>

      {/* right rail (backlinks) */}
      {has.rail && (
        <div style={{
          position: 'absolute', top: 12, right: 0,
          bottom: has.status ? 8 : 0, width: 28,
          background: tone('fade'), borderLeft: `1px solid ${tone('line')}`,
          padding: 4, display: 'flex', flexDirection: 'column', gap: 3,
        }}>
          <div style={{ height: 1.5, background: tone('fg'), opacity: 0.55, width: '70%' }} />
          <div style={{ height: 1, background: tone('fg'), opacity: 0.3 }} />
          <div style={{ height: 1, background: tone('fg'), opacity: 0.3, width: '85%' }} />
          <div style={{ height: 1.5, background: tone('fg'), opacity: 0.55, width: '70%', marginTop: 4 }} />
          <div style={{ height: 1, background: tone('fg'), opacity: 0.3 }} />
        </div>
      )}

      {/* status bar */}
      {has.status && (
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 8,
          background: tone('fade'), borderTop: `1px solid ${tone('line')}`,
          display: 'flex', alignItems: 'center', padding: '0 4px', gap: 2,
        }}>
          <div style={{ height: 1.5, width: 24, background: tone('fg'), opacity: 0.45 }} />
          <div style={{ height: 1.5, width: 10, marginLeft: 'auto', background: tone('fg'), opacity: 0.45 }} />
        </div>
      )}
    </div>
  );
}

function LayerCard({ def, current, isCurrent, onPick }) {
  return (
    <div
      onClick={onPick}
      style={{
        padding: 14,
        background: isCurrent ? 'var(--bg-2)' : 'transparent',
        border: `1px solid ${isCurrent ? 'var(--line-strong)' : 'var(--line)'}`,
        borderRadius: 10,
        cursor: 'pointer',
        position: 'relative',
        display: 'flex', flexDirection: 'column', gap: 10,
      }}>
      <LayerDiagram id={def.id} />
      <div>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--fg-4)', letterSpacing: '0.08em',
            }}>{def.id}</span>
            <span style={{
              fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 600,
              letterSpacing: '-0.01em', color: 'var(--fg)',
            }}>{def.name}</span>
          </div>
          {isCurrent && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--accent)', fontWeight: 500,
            }}>YOU ARE HERE</span>
          )}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: 10.5,
          color: 'var(--fg-3)', marginBottom: 6,
        }}>{def.subtitle}</div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 11.5,
          color: 'var(--fg-2)', lineHeight: 1.5,
        }}>{def.blurb}</div>
      </div>
    </div>
  );
}

function FeatureRow({ name, desc, layer, on, alwaysOn = false }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '32px 1fr 60px',
      gap: 14,
      padding: '12px 0',
      alignItems: 'center',
      borderTop: '1px solid var(--line)',
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 10,
        color: 'var(--fg-4)', letterSpacing: '0.08em', fontWeight: 500,
      }}>{layer}</span>
      <div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 500,
          color: 'var(--fg)', marginBottom: 2,
        }}>{name}</div>
        <div style={{
          fontFamily: 'var(--font-sans)', fontSize: 12,
          color: 'var(--fg-2)', lineHeight: 1.5,
        }}>{desc}</div>
      </div>
      {alwaysOn
        ? <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            color: 'var(--fg-4)', textAlign: 'right',
          }}>built-in</span>
        : <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div className={`toggle ${on ? 'on' : ''}`} />
          </div>}
    </div>
  );
}

function SettingsLayers({ current = 'L2' }) {
  const features = [
    { layer: 'L0', name: 'Editor',                  desc: 'Source-styled markdown. The only thing you really need.',                          alwaysOn: true,  on: true  },
    { layer: 'L0', name: 'Command palette · ⌘K',    desc: 'Type to run any action — even when nothing else is on screen.',                  alwaysOn: true,  on: true  },
    { layer: 'L1', name: 'File sidebar',            desc: 'Tree of your vault on the left. Hide it any time with ⌘\\.',                       alwaysOn: false, on: current !== 'L0' },
    { layer: 'L1', name: 'Quick switcher · ⌘P',     desc: 'Fuzzy jump to any note. Works without the sidebar.',                              alwaysOn: true,  on: true  },
    { layer: 'L2', name: 'Tabs',                    desc: 'Hold open more than one note. Off by default — many people prefer one at a time.', alwaysOn: false, on: current === 'L2' || current === 'L3' },
    { layer: 'L2', name: 'Status bar',              desc: 'File path, word count, mode, ⌘K hint. 24px tall.',                                 alwaysOn: false, on: current === 'L2' || current === 'L3' },
    { layer: 'L2', name: 'Full-text search · ⌘F',   desc: 'Index of every note. Always available; the panel just opens on ⌘F.',              alwaysOn: true,  on: true  },
    { layer: 'L3', name: 'Document spine',          desc: 'A hairline minimap of headings on the editor\'s left edge.',                       alwaysOn: false, on: current === 'L3' },
    { layer: 'L3', name: 'Marginal annotations',    desc: 'Mono annotations aligned to specific prose lines. The namesake feature.',          alwaysOn: false, on: current === 'L3' },
    { layer: 'L3', name: 'Right rail',              desc: 'Backlinks list and document outline. Toggle with ⌘⇧\\.',                            alwaysOn: false, on: current === 'L3' },
    { layer: 'L3', name: 'Focus mode · ⌘.',         desc: 'Hide all chrome; dim non-current paragraphs. Press ⌘. again to exit.',             alwaysOn: false, on: true  },
    { layer: 'L4', name: 'Daily notes',             desc: 'Auto-create today\'s `daily/YYYY-MM-DD.md`. ⌘⇧N to jump there.',                   alwaysOn: false, on: false },
    { layer: 'L4', name: 'Pinned notes',            desc: 'A "Pinned" group at the top of the sidebar.',                                      alwaysOn: false, on: false },
    { layer: 'L4', name: 'Split editor',            desc: 'Two editor panes side by side. ⌥↵ on a wikilink opens it in the split.',          alwaysOn: false, on: false },
    { layer: 'L4', name: 'Rebind keyboard',         desc: 'Custom keyboard shortcuts. The defaults are sturdy — most people never touch this.', alwaysOn: false, on: true  },
  ];

  return (
    <div className="settings-main">
      <div className="settings-search">
        <Icon name="search" size={16} />
        <input placeholder="Search every setting…" defaultValue="" />
        <span className="badge">/ to focus</span>
      </div>

      <section className="settings-section" id="layers">
        <div className="sec-head">
          <h2>Layers</h2>
          <span className="sec-anchor">settings.layers</span>
        </div>
        <p className="sec-desc">
          Marginalia grows with you. Start with just the editor; turn things on as you need them.
          Each layer is a step up in surface area, not in difficulty.
        </p>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12,
          marginBottom: 28,
        }}>
          {LAYER_DEFS.map((d) => (
            <LayerCard key={d.id} def={d} current={current} isCurrent={d.id === current} />
          ))}
        </div>

        <div style={{
          padding: '10px 14px',
          background: 'var(--bg-2)',
          border: '1px solid var(--line)',
          borderRadius: 8,
          marginBottom: 16,
          display: 'flex', alignItems: 'center', gap: 12,
          fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--fg-2)',
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)' }} />
          Picking a layer is a shortcut — you can also toggle individual features below.
          <span style={{ marginLeft: 'auto', color: 'var(--fg-3)' }}>your current setup is custom · saved automatically</span>
        </div>

        <div style={{ marginTop: 24 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '32px 1fr 60px',
            gap: 14,
            paddingBottom: 8,
            fontFamily: 'var(--font-mono)', fontSize: 9.5,
            color: 'var(--fg-4)', textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            <span>Layer</span>
            <span>Feature</span>
            <span style={{ textAlign: 'right' }}>On</span>
          </div>

          {features.map((f, i) => <FeatureRow key={i} {...f} />)}
        </div>

        <div style={{
          marginTop: 28,
          textAlign: 'center', color: 'var(--fg-3)', fontSize: 11.5,
          fontFamily: 'var(--font-mono)',
        }}>
          Not sure where to start? Try L0 for a week. The app will gently surface the next layer when you start hitting its edges.
        </div>
      </section>
    </div>
  );
}

Object.assign(window, { SettingsLayers, LayerDiagram, LayerCard, LAYER_DEFS });
