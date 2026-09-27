<script setup lang="ts">
import { ThemePicker, provideThemeloom, useTheme } from '@themeloom/picker/vue';
import { classicThemes, classicCategories } from '@themeloom/themes-classic';

provideThemeloom({
  themes: classicThemes,
  categories: classicCategories,
  persist: 'localStorage',
  storageKey: 'vite-vue-theme',
  default: 'basic-corporate',
});

// Reactive: `theme` updates on every change, wherever it was triggered from.
const { theme, randomTheme, setTheme } = useTheme();
</script>

<template>
  <main>
    <p class="pt-badge">{{ theme?.category ?? '—' }}</p>
    <h1>{{ theme?.name ?? 'Loading…' }}</h1>
    <p class="lede">{{ theme?.description }}</p>

    <div class="actions">
      <button @click="randomTheme">Surprise me</button>
      <button class="pt-btn--ghost" @click="setTheme('basic-corporate')">Reset</button>
    </div>

    <div class="grid">
      <article v-for="t in classicThemes" :key="t.id" class="pt-card">
        <span class="swatch" :style="{ background: t.swatch }" />
        <strong>{{ t.name }}</strong>
        <small>{{ t.description }}</small>
        <button class="pt-btn--ghost" @click="setTheme(t.id)">Apply</button>
      </article>
    </div>

    <ThemePicker position="top-right" />
  </main>
</template>

<style scoped>
main { max-width: 60rem; margin: 0 auto; padding: 4rem 1.25rem; }
.lede { color: var(--pt-color-text-dim); font-size: 1.1rem; max-width: 42ch; }
.actions { display: flex; gap: 0.75rem; margin-top: 2rem; flex-wrap: wrap; }
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
  gap: var(--pt-shape-space);
  margin-top: 3rem;
}
.pt-card { display: grid; gap: 0.5rem; align-content: start; }
.swatch { height: 2.5rem; border-radius: var(--pt-shape-radius); }
small { color: var(--pt-color-text-dim); }
</style>
