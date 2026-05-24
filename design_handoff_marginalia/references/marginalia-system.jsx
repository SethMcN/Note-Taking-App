// marginalia-system.jsx — design system reference cards

function TypeCard() {
  return (
    <div className="ds-card" style={{ background: '#f7f5f0', color: '#21201d', justifyContent: 'space-between' }}>
      <div>
        <h3>Typography</h3>
        <div className="ds-title">Aa — the calmer voice</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 4 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Prose · Newsreader
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 600, letterSpacing: '-0.018em', lineHeight: 1.1, marginBottom: 2 }}>Margin</div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 19, fontStyle: 'italic', color: '#46443f', lineHeight: 1.4 }}>
            a small adjacent place
          </div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 14, color: '#46443f', lineHeight: 1.55, marginTop: 8 }}>
            A book reads twice: once for what is written, again for what the reader writes back.
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            UI · Geist · Mono · Geist Mono
          </div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 18, fontWeight: 600, letterSpacing: '-0.015em', marginBottom: 2 }}>Settings</div>
          <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: '#46443f', marginBottom: 8 }}>The interface should disappear.</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: '#46443f' }}>vault/notes/2026-05-24.md</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#7a7570', marginTop: 2 }}>1284 words · ⌘K</div>
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(0,0,0,0.08)', paddingTop: 12, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7a7570' }}>
        {[
          ['H1', '34 / -1.8%', 600],
          ['H2', '22 / -1.2%', 600],
          ['body', '17.5 / 162', 400],
          ['caption', '11 mono', 500],
        ].map(([k, v, w]) => (
          <div key={k} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <span style={{ color: '#21201d', fontWeight: 600 }}>{k}</span>
            <span>{v}</span>
            <span>{w}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ColorCard() {
  const lights = [
    ['bg',     'oklch(0.985 .004 80)',  '#FAF8F2'],
    ['bg-2',   'oklch(0.975 .004 80)',  '#F5F2EC'],
    ['bg-3',   'oklch(0.96 .004 80)',   '#EDEAE3'],
    ['fg',     'oklch(0.21 .010 80)',   '#262421'],
    ['fg-2',   'oklch(0.42 .008 80)',   '#5C5853'],
    ['fg-3',   'oklch(0.58 .008 80)',   '#87827B'],
  ];
  const darks = [
    ['bg',     'oklch(0.18 .008 250)',  '#1B1D22'],
    ['bg-2',   'oklch(0.165 .008 250)', '#181A1F'],
    ['bg-3',   'oklch(0.22 .008 250)',  '#22252B'],
    ['fg',     'oklch(0.92 .006 250)',  '#E8EAEC'],
    ['fg-2',   'oklch(0.68 .008 250)',  '#9CA0A5'],
    ['fg-3',   'oklch(0.54 .008 250)',  '#797D82'],
  ];
  const accents = [
    ['terracotta', 'oklch(0.62 .13 35)'],
    ['slate',      'oklch(0.55 .07 250)'],
    ['sage',       'oklch(0.58 .07 150)'],
    ['plum',       'oklch(0.55 .11 320)'],
    ['ink',        'oklch(0.32 .01 80)'],
  ];

  const Swatch = ({ data, dark }) => (
    <div style={{
      borderRadius: 6, overflow: 'hidden',
      border: `0.5px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
    }}>
      {data.map(([n, , hx], i) => (
        <div key={i} style={{
          height: 28, background: hx,
          display: 'flex', alignItems: 'center',
          padding: '0 10px', gap: 8,
          fontFamily: 'var(--font-mono)', fontSize: 10,
          color: i < 3 ? (dark ? '#9CA0A5' : '#5C5853') : (dark ? '#1B1D22' : '#F5F2EC'),
          borderTop: i ? `0.5px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'}` : 'none',
        }}>
          <span style={{ width: 38 }}>{n}</span>
          <span style={{ opacity: 0.65, marginLeft: 'auto' }}>{hx}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div className="ds-card" style={{ background: '#f7f5f0', justifyContent: 'flex-start' }}>
      <div>
        <h3>Color</h3>
        <div className="ds-title">Two voices · five accents</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginTop: 4 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Light · warm paper
          </div>
          <Swatch data={lights} />
        </div>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
            Dark · cool ink
          </div>
          <Swatch data={darks} dark />
        </div>
      </div>

      <div style={{ marginTop: 8 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Accent (used sparingly)
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {accents.map(([n, c], i) => (
            <div key={n} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: c, outline: i === 0 ? '1.5px solid #21201d' : 'none', outlineOffset: 3 }} />
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#46443f' }}>{n}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{
        marginTop: 4, paddingTop: 12,
        borderTop: '1px solid rgba(0,0,0,0.08)',
        display: 'flex', gap: 16,
        fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7a7570',
      }}>
        <span>chroma ≤ 0.13</span>
        <span>hairlines only — no shadows for hierarchy</span>
      </div>
    </div>
  );
}

function ComponentsCard() {
  return (
    <div className="ds-card" style={{ background: '#f7f5f0', justifyContent: 'flex-start' }}>
      <div>
        <h3>Components</h3>
        <div className="ds-title">Quiet primitives</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Buttons
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button style={{ background: 'oklch(0.62 0.13 35)', color: '#fff', border: 'none', borderRadius: 6, padding: '6px 14px', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500 }}>Save</button>
            <button style={{ background: 'transparent', color: '#21201d', border: '1px solid rgba(0,0,0,0.14)', borderRadius: 6, padding: '6px 14px', fontFamily: 'var(--font-sans)', fontSize: 12, fontWeight: 500 }}>Cancel</button>
            <button style={{ background: 'transparent', color: '#46443f', border: 'none', borderRadius: 6, padding: '6px 10px', fontFamily: 'var(--font-sans)', fontSize: 12 }}>Ghost</button>
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Inputs
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input style={{ flex: 1, background: '#FAF8F2', border: '1px solid rgba(0,0,0,0.14)', borderRadius: 6, padding: '6px 10px', fontFamily: 'var(--font-sans)', fontSize: 12 }} defaultValue="On marginalia" />
            <select style={{ background: '#FAF8F2', border: '1px solid rgba(0,0,0,0.14)', borderRadius: 6, padding: '6px 24px 6px 10px', fontFamily: 'var(--font-sans)', fontSize: 12, appearance: 'none' }}>
              <option>md</option>
            </select>
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Pills / tags / keys
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap', fontFamily: 'var(--font-mono)', fontSize: 11 }}>
            <span style={{ background: 'oklch(0.62 0.13 35 / 0.12)', color: 'oklch(0.62 0.13 35)', padding: '2px 7px', borderRadius: 3 }}>#philosophy</span>
            <span style={{ background: 'rgba(0,0,0,0.05)', color: '#46443f', padding: '2px 7px', borderRadius: 3 }}>draft</span>
            <span style={{ background: 'rgba(0,0,0,0.05)', color: '#46443f', padding: '2px 7px', borderRadius: 3 }}>md</span>
            <span style={{ border: '1px solid rgba(0,0,0,0.14)', padding: '1px 5px', borderRadius: 3, color: '#46443f' }}>⌘</span>
            <span style={{ border: '1px solid rgba(0,0,0,0.14)', padding: '1px 5px', borderRadius: 3, color: '#46443f' }}>K</span>
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Tree row
          </div>
          <div style={{ background: '#fff', borderRadius: 6, padding: '4px 0', border: '1px solid rgba(0,0,0,0.06)' }}>
            {[
              { ic: 'folder', name: 'philosophy', open: true },
              { ic: 'note',   name: 'On marginalia.md', active: true, depth: 1 },
              { ic: 'note',   name: 'Slow thinking.md', depth: 1 },
            ].map((r, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 6,
                height: 24, padding: '0 10px',
                paddingLeft: 10 + (r.depth || 0) * 14,
                color: r.active ? '#21201d' : '#46443f',
                background: r.active ? 'oklch(0.92 0.005 35 / 0.7)' : 'transparent',
                margin: '0 6px', borderRadius: 4,
                fontFamily: 'var(--font-sans)', fontSize: 12,
                position: 'relative',
              }}>
                {r.active && <span style={{ position: 'absolute', left: -6, top: 4, bottom: 4, width: 2, background: 'oklch(0.62 0.13 35)' }} />}
                <span style={{ color: r.active ? 'oklch(0.62 0.13 35)' : '#7a7570', display: 'flex' }}><Icon name={r.ic} size={12} /></span>
                <span style={{ fontWeight: r.ic === 'folder' ? 500 : 400 }}>{r.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Toggles & range
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{ width: 30, height: 18, borderRadius: 999, background: 'oklch(0.62 0.13 35)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 2, left: 14, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
            </div>
            <div style={{ width: 30, height: 18, borderRadius: 999, background: 'rgba(0,0,0,0.14)', position: 'relative' }}>
              <div style={{ position: 'absolute', top: 2, left: 2, width: 14, height: 14, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }} />
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ flex: 1, height: 4, background: 'rgba(0,0,0,0.12)', borderRadius: 999, position: 'relative' }}>
                <div style={{ position: 'absolute', left: '60%', top: -5, width: 14, height: 14, borderRadius: '50%', background: 'oklch(0.62 0.13 35)' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: '#46443f' }}>17.5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SpacingCard() {
  const scale = [
    ['1', '4'],
    ['2', '8'],
    ['3', '12'],
    ['4', '16'],
    ['5', '24'],
    ['6', '32'],
    ['7', '48'],
    ['8', '64'],
  ];
  return (
    <div className="ds-card" style={{ background: '#f7f5f0', justifyContent: 'flex-start' }}>
      <div>
        <h3>Spacing &amp; rhythm</h3>
        <div className="ds-title">4px base · few rounded corners</div>
      </div>

      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Scale
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 14, height: 80 }}>
          {scale.map(([k, v]) => (
            <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
              <div style={{ width: Number(v), background: 'oklch(0.62 0.13 35)', height: Number(v), borderRadius: 1 }} />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#46443f' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginTop: 10 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Radius
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
            {[
              ['none', 0],
              ['xs', 3],
              ['sm', 6],
              ['md', 10],
              ['lg', 14],
            ].map(([k, r]) => (
              <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 32, height: 32, background: '#21201d', borderRadius: r }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#46443f' }}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9.5, color: '#7a7570', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
            Lines &amp; shadows
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ height: 28, background: '#FAF8F2', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7a7570', display: 'flex', alignItems: 'center', padding: '0 10px' }}>hairline · rgba 0.08</div>
            <div style={{ height: 28, background: '#FAF8F2', border: '1px solid rgba(0,0,0,0.14)', borderRadius: 6, fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7a7570', display: 'flex', alignItems: 'center', padding: '0 10px' }}>strong · rgba 0.14</div>
            <div style={{ height: 28, background: '#FAF8F2', borderRadius: 6, boxShadow: '0 8px 24px rgba(0,0,0,0.08)', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7a7570', display: 'flex', alignItems: 'center', padding: '0 10px' }}>shadow · overlays only</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 4, paddingTop: 12, borderTop: '1px solid rgba(0,0,0,0.08)', fontFamily: 'var(--font-mono)', fontSize: 10, color: '#7a7570' }}>
        rule: a shadow means "this floats" — palettes, popovers, tooltips. Nothing else.
      </div>
    </div>
  );
}

Object.assign(window, { TypeCard, ColorCard, ComponentsCard, SpacingCard });
