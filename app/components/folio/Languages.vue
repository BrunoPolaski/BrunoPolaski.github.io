<script setup lang="ts">
/** The hero sphere as data: my public GitHub repos by language, one band per language. */
const { t } = useLocale()
const { data } = await useFetch<Record<string, number>>('/api/github-languages')

// Halo's dark-mode --series-1..3 (the page is always dark), validated against the dark surface.
const palette = ['#3987e5', '#d95926', '#199e70']

// top two languages by name, the long tail folded into "Other", so there are never more than three bands
const groups = computed(() => {
  const sorted = Object.entries(data.value ?? {}).sort((a, b) => b[1] - a[1])
  const top = sorted.length > 3 ? sorted.slice(0, 2) : sorted
  const rest = sorted.slice(top.length).reduce((sum, [, n]) => sum + n, 0)
  const rows = rest ? [...top, [t.value.langs.other, rest] as [string, number]] : top
  const total = rows.reduce((sum, [, n]) => sum + n, 0)
  return rows.map(([name, count], i) => ({ name, count, pct: Math.round(count / total * 100), color: palette[i]! }))
})
const total = computed(() => groups.value.reduce((sum, g) => sum + g.count, 0))
const focus = ref<number | null>(null)
</script>

<template>
  <figure class="langs">
    <div class="langs__sphere">
      <FxPixelSphere :count="4200" :bands="groups.map(g => ({ color: g.color, share: g.count }))" :focus="focus" />
    </div>
    <figcaption v-if="groups.length">
      <span class="langs__title">{{ t.langs.title(total) }}</span>
      <ul>
        <li
          v-for="(g, i) in groups"
          :key="g.name"
          tabindex="0"
          :class="{ 'is-dim': focus !== null && focus !== i }"
          @pointerenter="focus = i"
          @pointerleave="focus = null"
          @focus="focus = i"
          @blur="focus = null"
        >
          <i :style="{ background: g.color }" />
          <span>{{ g.name }}</span>
          <b>{{ g.count }}</b>
          <small>{{ g.pct }}%</small>
        </li>
      </ul>
    </figcaption>
  </figure>
</template>

<style scoped>
.langs { display: flex; align-items: center; gap: var(--s-5); margin: 0; }
.langs__sphere { position: relative; flex: none; width: clamp(200px, 22vw, 300px); aspect-ratio: 1; }
.langs__sphere > .sphere { position: absolute; inset: 0; } /* out of flow, so the canvas can't size its own box */
figcaption { display: flex; flex-direction: column; gap: var(--s-3); min-width: 0; }
.langs__title { font-size: var(--fs-xs); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-3); }
ul { display: flex; flex-direction: column; gap: 2px; margin: 0; padding: 0; list-style: none; }
li {
  display: grid;
  grid-template-columns: 10px 1fr auto 3.2em;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  border-radius: var(--r-control);
  font-size: var(--fs-sm);
  cursor: default;
  transition: opacity var(--dur) var(--ease), background var(--dur) var(--ease);
}
li:hover, li:focus-visible { background: var(--wash); }
li.is-dim { opacity: 0.45; }
li i { width: 10px; height: 10px; border-radius: 3px; }
li b { font-variant-numeric: tabular-nums; }
li small { color: var(--ink-3); text-align: right; font-variant-numeric: tabular-nums; }

@media (max-width: 720px) {
  .langs { flex-direction: column; align-items: stretch; }
  .langs__sphere { width: min(260px, 70vw); align-self: center; }
}
</style>
