<script setup lang="ts">
const props = withDefaults(defineProps<{ values: number[], label: string, width?: number, height?: number }>(), { width: 160, height: 36 })
const pts = computed(() => {
  const x = linear(0, props.values.length - 1, 2, props.width - 4)
  const y = linear(Math.min(...props.values), Math.max(...props.values), props.height - 4, 4)
  return props.values.map((v, i) => [x(i), y(v)] as const)
})
</script>

<template>
  <svg :width="width" :height="height" role="img" :aria-label="label" class="spark">
    <polyline :points="pts.map(p => p.join(',')).join(' ')" />
    <circle :cx="pts.at(-1)![0]" :cy="pts.at(-1)![1]" r="3" />
  </svg>
</template>

<style scoped>
.spark { overflow: visible; }
.spark polyline { fill: none; stroke: var(--ink-3); stroke-width: 1.5; stroke-linejoin: round; }
.spark circle { fill: var(--ink); stroke: var(--surface); stroke-width: 2; }
</style>
