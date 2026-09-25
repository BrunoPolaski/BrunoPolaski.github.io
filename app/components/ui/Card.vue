<script setup lang="ts">
withDefaults(defineProps<{ title?: string, subtitle?: string, tone?: 'surface' | 'ink' }>(), { tone: 'surface' })
</script>

<template>
  <section :class="['card', `card--${tone}`]">
    <header v-if="title || $slots.actions" class="card__head">
      <div>
        <h3 v-if="title">{{ title }}</h3>
        <p v-if="subtitle" class="card__sub">{{ subtitle }}</p>
      </div>
      <div class="row"><slot name="actions" /></div>
    </header>
    <slot />
    <footer v-if="$slots.footer" class="card__foot"><slot name="footer" /></footer>
  </section>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  gap: var(--s-4);
  padding: var(--s-5);
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  background: var(--surface);
  min-width: 0;
}
.card--ink {
  /* always dark: invert ink roles so nested components follow */
  --ink: #fff;
  --ink-2: #d9d9de;
  --ink-3: #9a9aa0;
  --on-ink: #000;
  --wash: rgb(255 255 255 / 0.14);
  --line: #2a2a2e;
  --surface: #000;
  background: #000;
  color: var(--ink);
  border-color: #000;
}
.card__head { display: flex; justify-content: space-between; align-items: flex-start; gap: var(--s-3); }
.card__sub { color: var(--ink-3); font-size: var(--fs-sm); margin-top: 2px; }
.card__foot { border-top: 1px solid var(--line); padding-top: var(--s-4); margin-top: auto; }
</style>
