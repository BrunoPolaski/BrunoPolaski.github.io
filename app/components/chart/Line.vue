<script setup lang="ts">
const props = withDefaults(defineProps<{
  title: string
  labels: string[]
  series: { name: string, values: number[] }[]
  height?: number
}>(), { height: 260 })

const root = ref<HTMLElement>()
const width = useWidth(root)
const pad = { t: 12, r: 72, b: 28, l: 44 }
const multi = computed(() => props.series.length > 1)

const ticks = computed(() => niceTicks(Math.max(...props.series.flatMap(s => s.values))))
const x = computed(() => linear(0, props.labels.length - 1, pad.l, width.value - pad.r))
const y = computed(() => linear(0, ticks.value.at(-1)!, props.height - pad.b, pad.t))
const path = (v: number[]) => v.map((n, i) => `${i ? 'L' : 'M'}${x.value(i)},${y.value(n)}`).join('')
const area = (v: number[]) => `${path(v)}L${x.value(v.length - 1)},${y.value(0)}L${x.value(0)},${y.value(0)}Z`

const hover = ref<number>()
function onMove(e: PointerEvent) {
  const box = (e.currentTarget as SVGElement).getBoundingClientRect()
  const i = Math.round((e.clientX - box.left - pad.l) / ((width.value - pad.l - pad.r) / (props.labels.length - 1)))
  hover.value = Math.min(props.labels.length - 1, Math.max(0, i))
}
</script>

<template>
  <figure ref="root" class="chart">
    <figcaption class="chart__title">{{ title }}</figcaption>
    <ul v-if="multi" class="chart__legend">
      <li v-for="(s, i) in series" :key="s.name"><span class="key" :style="{ background: `var(--series-${i + 1})` }" />{{ s.name }}</li>
    </ul>
    <svg :width="width" :height="height" role="img" :aria-label="title" @pointermove="onMove" @pointerleave="hover = undefined">
      <g class="grid">
        <g v-for="t in ticks" :key="t">
          <line :x1="pad.l" :x2="width - pad.r" :y1="y(t)" :y2="y(t)" :class="{ base: t === 0 }" />
          <text :x="pad.l - 8" :y="y(t)" text-anchor="end" dominant-baseline="middle">{{ compact(t) }}</text>
        </g>
        <text v-for="(l, i) in labels" :key="l" :x="x(i)" :y="height - 8" text-anchor="middle">{{ l }}</text>
      </g>
      <path v-if="!multi" :d="area(series[0]!.values)" class="area" />
      <g v-for="(s, i) in series" :key="s.name" :style="{ '--c': `var(--series-${i + 1})` }">
        <path :d="path(s.values)" class="line" />
        <circle :cx="x(s.values.length - 1)" :cy="y(s.values.at(-1)!)" r="4" class="dot" />
        <text :x="x(s.values.length - 1) + 10" :y="y(s.values.at(-1)!)" dominant-baseline="middle" class="end">
          {{ multi ? s.name : compact(s.values.at(-1)!) }}
        </text>
      </g>
      <g v-if="hover != null">
        <line :x1="x(hover)" :x2="x(hover)" :y1="pad.t" :y2="height - pad.b" class="cross" />
        <circle v-for="(s, i) in series" :key="s.name" :cx="x(hover)" :cy="y(s.values[hover]!)" r="4" class="dot" :style="{ '--c': `var(--series-${i + 1})` }" />
      </g>
    </svg>
    <div v-if="hover != null" class="chart__tip" :style="{ left: `${x(hover)}px` }">
      <strong>{{ labels[hover] }}</strong>
      <span v-for="(s, i) in series" :key="s.name"><span class="key" :style="{ background: `var(--series-${i + 1})` }" />{{ s.name }} <b>{{ s.values[hover]?.toLocaleString('en') }}</b></span>
    </div>
    <table class="sr-only">
      <tbody>
        <tr><th>Period</th><th v-for="s in series" :key="s.name">{{ s.name }}</th></tr>
        <tr v-for="(l, i) in labels" :key="l"><td>{{ l }}</td><td v-for="s in series" :key="s.name">{{ s.values[i] }}</td></tr>
      </tbody>
    </table>
  </figure>
</template>

<style>
/* shared chart chrome (unscoped so every chart component uses it) */
.chart { position: relative; margin: 0; min-width: 0; }
.chart svg { overflow: visible; touch-action: pan-y; }
.chart__title { font-weight: 600; font-size: var(--fs-sm); margin-bottom: var(--s-2); }
.chart__legend { display: flex; flex-wrap: wrap; gap: 4px 16px; list-style: none; margin: 0 0 var(--s-3); padding: 0; font-size: var(--fs-xs); color: var(--ink-2); }
.chart__legend li, .chart__tip > span { display: flex; align-items: center; gap: 6px; }
.chart .key { width: 10px; height: 10px; border-radius: 3px; flex: none; }
.chart .grid line { stroke: var(--grid); stroke-width: 1; }
.chart .grid line.base { stroke: var(--axis); }
.chart .grid text, .chart text.end { fill: var(--ink-3); font-size: 11px; font-variant-numeric: tabular-nums; }
.chart text.end { fill: var(--ink-2); font-weight: 600; }
.chart__tip {
  position: absolute;
  top: 40px;
  translate: -50% 0;
  display: grid;
  gap: 4px;
  padding: 8px 10px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: var(--surface);
  box-shadow: var(--shadow-pop);
  font-size: var(--fs-xs);
  white-space: nowrap;
  pointer-events: none;
}
.chart__tip b { margin-left: auto; padding-left: 12px; font-variant-numeric: tabular-nums; }
</style>

<style scoped>
.line { fill: none; stroke: var(--c); stroke-width: 2; stroke-linejoin: round; stroke-linecap: round; }
.area { fill: var(--series-1); opacity: 0.1; }
.dot { fill: var(--c); stroke: var(--surface); stroke-width: 2; }
.cross { stroke: var(--axis); }
</style>
