<script setup lang="ts">
const props = withDefaults(defineProps<{ title: string, labels: string[], values: number[], height?: number }>(), { height: 240 })

const root = ref<HTMLElement>()
const width = useWidth(root)
const pad = { t: 20, r: 8, b: 28, l: 44 }
const ticks = computed(() => niceTicks(Math.max(...props.values)))
const y = computed(() => linear(0, ticks.value.at(-1)!, props.height - pad.b, pad.t))
const band = computed(() => (width.value - pad.l - pad.r) / props.values.length)
const barW = computed(() => Math.min(24, band.value - 2))
const cx = (i: number) => pad.l + band.value * (i + 0.5)
const max = computed(() => props.values.indexOf(Math.max(...props.values)))
const hover = ref<number>()

/** Column with 4px rounded top, square at the baseline. */
function bar(i: number) {
  const x0 = cx(i) - barW.value / 2, x1 = x0 + barW.value, top = y.value(props.values[i]!), base = y.value(0)
  const r = Math.min(4, base - top)
  return `M${x0},${base}V${top + r}Q${x0},${top} ${x0 + r},${top}H${x1 - r}Q${x1},${top} ${x1},${top + r}V${base}Z`
}
</script>

<template>
  <figure ref="root" class="chart">
    <figcaption class="chart__title">{{ title }}</figcaption>
    <svg :width="width" :height="height" role="img" :aria-label="title">
      <g class="grid">
        <g v-for="t in ticks" :key="t">
          <line :x1="pad.l" :x2="width - pad.r" :y1="y(t)" :y2="y(t)" :class="{ base: t === 0 }" />
          <text :x="pad.l - 8" :y="y(t)" text-anchor="end" dominant-baseline="middle">{{ compact(t) }}</text>
        </g>
        <text v-for="(l, i) in labels" :key="l" :x="cx(i)" :y="height - 8" text-anchor="middle">{{ l }}</text>
      </g>
      <g v-for="(v, i) in values" :key="i" @pointerenter="hover = i" @pointerleave="hover = undefined">
        <rect :x="cx(i) - band / 2" :y="pad.t" :width="band" :height="height - pad.t - pad.b" fill="transparent" />
        <path :d="bar(i)" :class="['bar', { dim: hover != null && hover !== i }]" />
        <text v-if="i === max" :x="cx(i)" :y="y(v) - 6" text-anchor="middle" class="end">{{ compact(v) }}</text>
      </g>
    </svg>
    <div v-if="hover != null" class="chart__tip" :style="{ left: `${cx(hover)}px` }">
      <strong>{{ labels[hover] }}</strong>
      <span>{{ values[hover]!.toLocaleString('en') }}</span>
    </div>
    <table class="sr-only">
      <tbody>
        <tr v-for="(l, i) in labels" :key="l"><td>{{ l }}</td><td>{{ values[i] }}</td></tr>
      </tbody>
    </table>
  </figure>
</template>

<style scoped>
.bar { fill: var(--series-1); transition: opacity var(--dur); }
.bar.dim { opacity: 0.35; }
</style>
