/**
 * `<script src>` entry for the pack. Exposes `PolythemeSeasonal` globally and,
 * if `Polytheme.init()` already ran, registers itself with that engine.
 */
export * from './index.js';
import { seasonalThemes, seasonalCategories } from './index.js';

if (typeof window !== 'undefined') {
  const engine = (
    window as unknown as {
      __polytheme?: {
        register: (t: unknown) => void;
        registry: { describeCategory: (id: string, meta: unknown) => void };
      };
    }
  ).__polytheme;
  if (engine) {
    engine.register(seasonalThemes);
    for (const [id, meta] of Object.entries(seasonalCategories)) engine.registry.describeCategory(id, meta);
  }
}
