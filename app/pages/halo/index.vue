<script setup lang="ts">
useSeoMeta({ title: 'Halo UI', description: 'A monochrome component library for Nuxt, with charts and pixel motion.' })
const last = (i: number) => revenue[i]!.values.at(-1)!
</script>

<template>
  <div class="stack overview">
    <section class="hero">
      <FxHorizonGlow :level="0.58" />
      <div class="hero__sphere"><FxPixelSphere /></div>
      <div class="hero__copy">
        <h1>Halo</h1>
        <p>Black-and-white components for Nuxt, built from native HTML wherever it works. Color is saved for charts and for the light in motion.</p>
        <div class="row">
          <UiButton to="/halo/buttons" variant="solid" size="lg">Browse components</UiButton>
          <UiButton to="/halo/foundations" variant="ghost" size="lg">See the tokens</UiButton>
        </div>
      </div>
    </section>

    <h2 class="overview__h">Everything in one screen</h2>
    <div class="grid-auto">
      <UiStat label="Monthly revenue" :value="last(0) + last(1) + last(2)" format="currency" :delta="8.4" :trend="revenue[0]!.values" />
      <UiStat label="Active clients" :value="1284" :delta="3.1" :trend="[1100, 1120, 1150, 1170, 1200, 1210, 1240, 1262, 1284]" />
      <UiStat label="Overdue invoices" :value="2" :delta="-50" period="last week" />
    </div>
    <div class="overview__split">
      <UiCard>
        <ChartLine title="Revenue by stream, last 9 months (USD)" :labels="months" :series="revenue" />
      </UiCard>
      <UiCard title="Latest invoices">
        <template #actions><UiButton size="sm" to="/halo/data" icon-right="lucide:arrow-up-right">All</UiButton></template>
        <ul class="mini">
          <li v-for="r in invoices.slice(0, 4)" :key="r.id">
            <UiAvatar :name="r.owner" :size="30" />
            <span class="mini__txt"><b>{{ r.client }}</b><small class="muted">{{ r.id }}</small></span>
            <UiBadge :tone="statusTone[r.status as 'Paid']" :icon="statusIcon[r.status as 'Paid']">{{ r.status }}</UiBadge>
          </li>
        </ul>
      </UiCard>
    </div>
  </div>
</template>

<style scoped>
.overview { gap: var(--s-5); }
.hero {
  position: relative;
  isolation: isolate;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
  align-items: center;
  min-height: 560px;
  border-radius: var(--r-card);
  overflow: hidden;
  /* the hero is always dark: invert the ink roles locally */
  --ink: #fff;
  --ink-2: #d9d9de;
  --on-ink: #000;
  --wash: rgb(255 255 255 / 0.1);
  color: var(--ink);
}
.hero__sphere { position: relative; grid-column: 2; grid-row: 1; align-self: stretch; min-height: 360px; }
.hero__copy { position: relative; grid-column: 1; grid-row: 1; align-self: end; display: flex; flex-direction: column; gap: var(--s-5); padding: clamp(var(--s-5), 5vw, var(--s-8)); }
.hero__copy h1 { font-size: clamp(4rem, 12vw, 9rem); letter-spacing: -0.04em; line-height: 0.85; }
.hero__copy p { color: #b9b9c4; font-size: var(--fs-lg); max-width: 40ch; }
.overview__h { font-size: var(--fs-xl); margin-top: var(--s-5); }
.overview__split { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); gap: var(--s-4); }
.mini { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; }
.mini li { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--line); }
.mini li:last-child { border: 0; }
.mini__txt { flex: 1; display: flex; flex-direction: column; font-size: var(--fs-sm); line-height: 1.3; }

@media (max-width: 1100px) {
  .overview__split { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 720px) {
  .hero { grid-template-columns: minmax(0, 1fr); }
  .hero__sphere { grid-column: 1; grid-row: 1; min-height: 260px; }
  .hero__copy { grid-row: 2; padding-top: 0; }
}
</style>
