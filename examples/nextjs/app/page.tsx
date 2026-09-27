'use client';

import { useTheme } from '@themeloom/picker/react';

export default function Home() {
  const { theme, themes, setTheme, randomTheme } = useTheme();

  return (
    <main style={{ maxWidth: '60rem', margin: '0 auto', padding: '4rem 1.25rem' }}>
      <p className="pt-badge">{theme?.category ?? '—'}</p>
      <h1>{theme?.name ?? 'Loading…'}</h1>
      <p style={{ color: 'var(--pt-color-text-dim)', fontSize: '1.1rem', maxWidth: '42ch' }}>
        {theme?.description}
      </p>

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '2rem', flexWrap: 'wrap' }}>
        <button onClick={randomTheme}>Surprise me</button>
        <button className="pt-btn--ghost" onClick={() => setTheme('house')}>
          Back to house style
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(12rem, 1fr))',
          gap: 'var(--pt-shape-space)',
          marginTop: '3rem',
        }}
      >
        {themes.map((t) => (
          <button
            key={t.id}
            className="pt-card"
            data-pt-unstyled
            onClick={() => setTheme(t.id)}
            style={{ cursor: 'pointer', textAlign: 'left' }}
          >
            <span
              style={{
                display: 'block',
                height: '2rem',
                borderRadius: 'var(--pt-shape-radius)',
                background: t.swatch,
                marginBottom: '0.6rem',
              }}
            />
            <strong style={{ display: 'block' }}>{t.name}</strong>
            <small style={{ color: 'var(--pt-color-text-dim)' }}>{t.id}</small>
          </button>
        ))}
      </div>
    </main>
  );
}
