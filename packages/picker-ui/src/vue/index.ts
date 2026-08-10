import {
  defineComponent,
  h,
  inject,
  onMounted,
  onUnmounted,
  provide,
  ref,
  shallowRef,
  watch,
  type InjectionKey,
  type PropType,
  type Ref,
} from 'vue';
import { ThemeEngine, type ThemeEngineOptions, type ThemeTokens } from '@polytheme/core';
import { definePicker, type PolythemePicker } from '../vanilla.js';

const ENGINE_KEY: InjectionKey<ThemeEngine> = Symbol('polytheme');

/**
 * Creates an engine and provides it to descendants.
 *
 * Call in a root component's `setup()`. Vue passes non-string props to custom
 * elements natively, so the wrapper below is even thinner than React's.
 */
export function providePolytheme(options: ThemeEngineOptions = {}): ThemeEngine {
  const engine = new ThemeEngine(options);
  if (typeof window !== 'undefined') window.__polytheme ??= engine;
  provide(ENGINE_KEY, engine);
  onUnmounted(() => engine.destroy());
  return engine;
}

export function usePolytheme(): ThemeEngine | null {
  return inject(ENGINE_KEY, null) ?? (typeof window !== 'undefined' ? window.__polytheme ?? null : null);
}

export interface UseThemeResult {
  theme: Ref<ThemeTokens | null>;
  setTheme: (id: string) => void;
  nextTheme: () => void;
  randomTheme: () => void;
  engine: ThemeEngine | null;
}

/** A reactive ref of the active theme. */
export function useTheme(): UseThemeResult {
  const engine = usePolytheme();
  const theme = shallowRef<ThemeTokens | null>(engine?.current ?? null);

  let stop: (() => void) | undefined;
  onMounted(() => {
    stop = engine?.subscribe((next) => (theme.value = next));
  });
  onUnmounted(() => stop?.());

  return {
    theme,
    setTheme: (id: string) => void engine?.set(id),
    nextTheme: () => void engine?.next(),
    randomTheme: () => void engine?.random(),
    engine,
  };
}

export const ThemePicker = defineComponent({
  name: 'ThemePicker',
  props: {
    themes: { type: Array as PropType<ThemeTokens[]>, default: undefined },
    engine: { type: Object as PropType<ThemeEngine>, default: undefined },
    position: { type: String, default: 'top-right' },
    variant: { type: String, default: 'auto' },
    categories: { type: Array as PropType<string[]>, default: undefined },
    label: { type: String, default: undefined },
    defaultOpen: { type: Boolean, default: false },
    hideSearch: { type: Boolean, default: false },
    keepOpen: { type: Boolean, default: false },
  },
  emits: ['select', 'open', 'close'],
  setup(props, { emit }) {
    const el = ref<PolythemePicker | null>(null);
    const injected = usePolytheme();

    onMounted(() => {
      definePicker();
      const node = el.value;
      if (!node) return;
      if (props.themes) node.themes = props.themes;
      node.engine = props.engine ?? injected ?? null;
    });

    watch(
      () => props.themes,
      (next) => {
        if (el.value && next) el.value.themes = next;
      },
    );
    watch(
      () => props.engine,
      (next) => {
        if (el.value) el.value.engine = next ?? injected ?? null;
      },
    );

    return () =>
      h('polytheme-picker', {
        ref: el,
        position: props.position,
        variant: props.variant,
        ...(props.label ? { label: props.label } : {}),
        ...(props.categories?.length ? { categories: props.categories.join(',') } : {}),
        ...(props.defaultOpen ? { open: '' } : {}),
        ...(props.hideSearch ? { 'hide-search': '' } : {}),
        ...(props.keepOpen ? { 'keep-open': '' } : {}),
        'onPicker-select': (event: CustomEvent<{ theme: ThemeTokens }>) => emit('select', event.detail.theme),
        'onPicker-open': () => emit('open'),
        'onPicker-close': () => emit('close'),
      });
  },
});

export default ThemePicker;
