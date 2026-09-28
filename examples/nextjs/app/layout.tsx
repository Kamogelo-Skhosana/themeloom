import type { ReactNode } from 'react';
import { inlineBootScript } from '@themeloom/core';
import { Providers } from './providers';
import { DEFAULT_THEME, STORAGE_KEY } from '../theme.config';

import '@themeloom/core/preset.css';
import '@themeloom/themes-classic/flourishes.css';

export const metadata = {
  title: 'themeloom · Next.js',
  description: 'Themes as design contracts, applied before first paint.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-pt-construct="">
      <head>
        {/*
          The stored theme has to be on <html> before the browser paints, or the
          page flashes the default first. This runs synchronously in <head>,
          ahead of hydration — it is the one place an inline script earns its keep.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: inlineBootScript({ storageKey: STORAGE_KEY, default: DEFAULT_THEME }),
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
