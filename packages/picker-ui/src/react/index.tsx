import { useEffect, useRef } from 'react';
import type { ThemeEngine, ThemeTokens } from '@polytheme/core';
import { definePicker, type PolythemePicker } from '../vanilla.js';

export interface ThemePickerProps {
  /** Engine to drive. Falls back to `window.__polytheme`. */
  engine?: ThemeEngine | null;
  /** Themes to use when no engine is passed — the element creates one. */
  themes?: readonly ThemeTokens[];
  /** Screen corner, or `inline` to place it in normal flow. */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';
  /** Restrict and order the accordion, e.g. `['retro', 'arcade']`. */
  categories?: readonly string[];
  /** Panel chrome. `auto` follows the active theme's light/dark mode. */
  variant?: 'auto' | 'light' | 'dark';
  defaultOpen?: boolean;
  hideSearch?: boolean;
  /** Leave the panel open after a choice. */
  keepOpen?: boolean;
  label?: string;
  onSelect?: (theme: ThemeTokens) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Thin wrapper over `<polytheme-picker>`.
 *
 * The picker is one web component rather than one implementation per framework,
 * so this file only has to do the two things React can't do to a custom element
 * on its own: pass non-string props, and listen for non-`on*` events.
 */
export function ThemePicker({
  engine,
  themes,
  position = 'top-right',
  categories,
  variant = 'auto',
  defaultOpen = false,
  hideSearch = false,
  keepOpen = false,
  label,
  onSelect,
  onOpenChange,
  className,
  style,
}: ThemePickerProps): JSX.Element {
  const ref = useRef<PolythemePicker | null>(null);

  useEffect(() => {
    definePicker();
  }, []);

  // Properties, not attributes — arrays and object references don't survive
  // being stringified into the DOM.
  useEffect(() => {
    if (ref.current && themes) ref.current.themes = themes as ThemeTokens[];
  }, [themes]);

  useEffect(() => {
    if (ref.current && engine !== undefined) ref.current.engine = engine;
  }, [engine]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const handleSelect = (event: Event) => {
      onSelect?.((event as CustomEvent<{ theme: ThemeTokens }>).detail.theme);
    };
    const handleOpen = () => onOpenChange?.(true);
    const handleClose = () => onOpenChange?.(false);
    node.addEventListener('picker-select', handleSelect);
    node.addEventListener('picker-open', handleOpen);
    node.addEventListener('picker-close', handleClose);
    return () => {
      node.removeEventListener('picker-select', handleSelect);
      node.removeEventListener('picker-open', handleOpen);
      node.removeEventListener('picker-close', handleClose);
    };
  }, [onSelect, onOpenChange]);

  return (
    <polytheme-picker
      ref={ref as never}
      class={className}
      style={style}
      position={position}
      variant={variant}
      {...(label ? { label } : {})}
      {...(categories?.length ? { categories: categories.join(',') } : {})}
      {...(defaultOpen ? { open: '' } : {})}
      {...(hideSearch ? { 'hide-search': '' } : {})}
      {...(keepOpen ? { 'keep-open': '' } : {})}
    />
  );
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'polytheme-picker': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> &
        Record<string, unknown>;
    }
  }
}

export { useTheme, ThemeProvider, usePolytheme } from './useTheme.js';
