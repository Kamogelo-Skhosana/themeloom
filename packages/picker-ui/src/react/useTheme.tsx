import { createContext, createElement, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ThemeEngine, type ThemeEngineOptions, type ThemeTokens } from '@themeloom/core';

const EngineContext = createContext<ThemeEngine | null>(null);

export interface ThemeProviderProps extends ThemeEngineOptions {
  children?: ReactNode;
  /** Use an engine you already own instead of letting the provider create one. */
  engine?: ThemeEngine;
}

/**
 * Creates (or adopts) an engine and shares it through context.
 *
 * `autoMount` is left on: the engine no-ops on the server and mounts on the
 * client, so this is safe in an RSC tree as long as the provider is a client
 * component.
 */
export function ThemeProvider({ children, engine: provided, ...options }: ThemeProviderProps) {
  const engine = useMemo(() => provided ?? new ThemeEngine(options), [provided]);

  useEffect(() => {
    engine.mount();
    if (typeof window !== 'undefined') window.__themeloom ??= engine;
    return () => {
      if (!provided) engine.destroy();
    };
  }, [engine, provided]);

  return createElement(EngineContext.Provider, { value: engine }, children);
}

/** The engine from the nearest `ThemeProvider`, or `window.__themeloom`. */
export function useThemeloom(): ThemeEngine | null {
  const fromContext = useContext(EngineContext);
  return fromContext ?? (typeof window !== 'undefined' ? window.__themeloom ?? null : null);
}

export interface UseThemeResult {
  theme: ThemeTokens | null;
  themes: ThemeTokens[];
  setTheme: (id: string) => void;
  nextTheme: () => void;
  randomTheme: () => void;
  engine: ThemeEngine | null;
}

/** Subscribes to theme changes and re-renders on each one. */
export function useTheme(): UseThemeResult {
  const engine = useThemeloom();
  const [theme, setThemeState] = useState<ThemeTokens | null>(() => engine?.current ?? null);

  useEffect(() => {
    if (!engine) return;
    return engine.subscribe(setThemeState);
  }, [engine]);

  return {
    theme,
    themes: engine?.list() ?? [],
    setTheme: (id: string) => void engine?.set(id),
    nextTheme: () => void engine?.next(),
    randomTheme: () => void engine?.random(),
    engine,
  };
}
