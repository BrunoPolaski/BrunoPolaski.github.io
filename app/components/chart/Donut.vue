<script setup lang="ts">
// ponytail: capped at 3 slices (palette validated all-pairs for 3); fold the rest into "Other"
const props = withDefaults(defineProps<{ title: string, items: { name: string, value: number }[], size?: number }>(), { size: 180 })

const total = computed(() => props.items.reduce((s, i) => s + i.value, 0))
const R = 50, W = 14, C = 2 * Math.PI * (R - W / 2)
const gap = 2
const arcs = computed(() => {
  let acc = 0
  return props.items.map((it, i) => {
    const len = (it.value / total.value) * C
    const a = { dash: `${Math.max(0, len - gap)} ${C}`, offset: -acc, color: `var(--series-${i + 1})` }
    acc += len
    return a
  })
})
</script>

<template>
  <figure class="chart donut">
    <figcaption class="chart__title">{{ title }}</figcaption>
    <div class="donut__body">
      <svg :width="size" :height="size" viewBox="0 0 100 100" role="img" :aria-label="title">
        <g transform="rotate(-90 50 50)">
          <circle
            v-for="(a, i) in arcs"
            :key="i"
            cx="50"
            cy="50"
            :r="R - W / 2"
            fill="none"
            :stroke="a.color"
            :stroke-width="W"
            :stroke-dasharray="a.dash"
            :stroke-dashoffset="a.offset"
          >
            <title>{{ items[i]!.name }}: {{ items[i]!.value.toLocaleString('en') }}</title>
          </circle>
        </g>
        <text x="50" y="48" text-anchor="middle" class="donut__total">{{ compact(total) }}</text>
        <text x="50" y="60" text-anchor="middle" class="donut__cap">total</text>
      </svg>
      <ul class="chart__legend donut__legend">
        <li v-for="(it, i) in items" :key="it.name">
          <span class="key" :style="{ background: `var(--series-${i + 1})` }" />
          {{ it.name }}
          <b>{{ Math.round((it.value / total) * 100) }}%</b>
        </li>
      </ul>
    </div>
  </figure>
</template>

<style scoped>
.donut__body { display: flex; align-items: center; gap: var(--s-5); flex-wrap: wrap; }
.donut__legend { flex-direction: column; font-size: var(--fs-sm); margin: 0; }
.donut__legend b { margin-left: auto; padding-left: 16px; color: var(--ink); font-variant-numeric: tabular-nums; }
.donut__total { font-size: 16px; font-weight: 700; fill: var(--ink); }
.donut__cap { font-size: 8px; fill: var(--ink-3); }
</style>
