/**
 * `<script src>` entry for the pack. Exposes `PolythemeClassic` globally and,
 * if `Polytheme.init()` already ran, registers itself with that engine.
 */
export * from './index.js';
import { classicThemes, classicCategories } from './index.js';

if (typeof window !== 'undefined') {
  const engine = (window as unknown as { __polytheme?: { register: (t: unknown) => void; registry: { describeCategory: (id: string, meta: unknown) => void } } }).__polytheme;
  if (engine) {
    engine.register(classicThemes);
    for (const [id, meta] of Object.entries(classicCategories)) engine.registry.describeCategory(id, meta);
  }
}
