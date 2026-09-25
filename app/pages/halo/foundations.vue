<script setup lang="ts">
const colors = [
  { token: '--ink', use: 'Text, solid buttons, active states' },
  { token: '--ink-2', use: 'Secondary text' },
  { token: '--ink-3', use: 'Hints, axis labels' },
  { token: '--line', use: 'Hairlines and card borders' },
  { token: '--canvas', use: 'App background' },
  { token: '--surface', use: 'Panels and cards' },
  { token: '--signal', use: 'Focus ring and motion only' },
]
const status = [
  { token: '--good', label: 'Good', icon: 'lucide:circle-check' },
  { token: '--warning', label: 'Warning', icon: 'lucide:triangle-alert' },
  { token: '--critical', label: 'Critical', icon: 'lucide:octagon-x' },
]
const scale = [
  { token: '--fs-3xl', sample: 'Display', wide: true },
  { token: '--fs-2xl', sample: 'Page title', wide: true },
  { token: '--fs-lg', sample: 'Section heading', wide: true },
  { token: '--fs-md', sample: 'Body text for reading and forms' },
  { token: '--fs-sm', sample: 'Buttons, table cells, labels' },
  { token: '--fs-xs', sample: 'Hints and captions' },
]
const radii = ['--r-shell', '--r-card', '--r-control', '--r-pill']
</script>

<template>
  <DocsPage title="Foundations" lead="Tokens live in one CSS file. Components read roles like --ink and --surface, so dark mode is a second set of values, not a second set of components.">
    <DocsDemo title="Color roles">
      <div class="grid-auto">
        <div v-for="c in colors" :key="c.token" class="swatch">
          <span class="swatch__chip" :style="{ background: `var(${c.token})` }" />
          <code>{{ c.token }}</code>
          <small class="muted">{{ c.use }}</small>
        </div>
      </div>
    </DocsDemo>
    <DocsDemo title="Status colors" usage="Status never travels alone: always pair it with an icon and a label.">
      <div class="row">
        <UiBadge v-for="s in status" :key="s.token" :tone="s.label.toLowerCase() as 'good'" :icon="s.icon">{{ s.label }}</UiBadge>
      </div>
    </DocsDemo>
    <DocsDemo title="Type scale" usage="Archivo throughout. Headings use the wide axis (font-stretch: 125%) at weight 800.">
      <div class="stack">
        <div v-for="t in scale" :key="t.token" class="type-row">
          <code class="muted">{{ t.token }}</code>
          <span :style="{ fontSize: `var(${t.token})`, fontWeight: t.wide ? 800 : 400, fontStretch: t.wide ? '125%' : '100%', lineHeight: 1.1 }">{{ t.sample }}</span>
        </div>
      </div>
    </DocsDemo>
    <DocsDemo title="Acrylic" usage='<div class="acrylic">…</div>  (tint + backdrop blur + grain; used by the top bar, menus and dialogs)'>
      <div class="acrylic-stage">
        <FxHorizonGlow />
        <div class="acrylic acrylic-panel">
          <strong>Now playing</strong>
          <span class="acrylic-sub">Back to Black, Amy Winehouse</span>
          <UiProgress :value="38" label="1:34 of 4:01" />
        </div>
      </div>
    </DocsDemo>
    <DocsDemo title="Radius" usage="Radius steps down with depth: the shell is roundest, controls are tightest.">
      <div class="row">
        <div v-for="r in radii" :key="r" class="radius" :style="{ borderRadius: `var(${r})` }"><code>{{ r }}</code></div>
      </div>
    </DocsDemo>
  </DocsPage>
</template>

<style scoped>
.swatch { display: grid; gap: 4px; }
.swatch__chip { height: 64px; border-radius: 10px; border: 1px solid var(--line); }
.type-row { display: grid; grid-template-columns: 90px minmax(0, 1fr); align-items: baseline; gap: var(--s-4); overflow-wrap: anywhere; }
.acrylic-stage { position: relative; display: grid; place-items: center; height: 300px; border-radius: 10px; overflow: hidden; }
.acrylic-panel { position: relative; display: grid; gap: 6px; width: min(320px, 85%); padding: var(--s-5); border-radius: var(--r-card); }
.acrylic-sub { color: var(--ink-2); }
.radius { display: grid; place-items: center; width: 132px; height: 72px; border: 2px solid var(--ink); font-size: var(--fs-xs); }
</style>
