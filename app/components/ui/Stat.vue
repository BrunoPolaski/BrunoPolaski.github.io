<script setup lang="ts">
const props = defineProps<{ label: string, value: number, format?: 'number' | 'currency', delta?: number, period?: string, trend?: number[] }>()
const shown = computed(() => (props.format === 'currency' ? '$' : '') + compact(props.value))
</script>

<template>
  <div class="stat">
    <span class="stat__label">{{ label }}</span>
    <span class="stat__value">{{ shown }}</span>
    <span v-if="delta != null" :class="['stat__delta', delta >= 0 ? 'up' : 'down']">
      <Icon :name="delta >= 0 ? 'lucide:trending-up' : 'lucide:trending-down'" />
      {{ delta >= 0 ? '+' : '' }}{{ delta }}% <span class="muted">vs {{ period ?? 'last month' }}</span>
    </span>
    <ChartSparkline v-if="trend" :values="trend" :label="`${label} trend`" class="stat__spark" />
  </div>
</template>

<style scoped>
.stat { display: grid; align-content: start; gap: 4px; padding: var(--s-5); border: 1px solid var(--line); border-radius: var(--r-card); background: var(--surface); }
.stat__label { font-size: var(--fs-sm); color: var(--ink-2); }
.stat__value { font-size: var(--fs-2xl); font-weight: 700; line-height: 1.1; }
.stat__delta { display: inline-flex; align-items: center; gap: 4px; font-size: var(--fs-xs); font-weight: 600; }
.stat__delta.up { color: var(--good-text); }
.stat__delta.down { color: var(--critical); }
.stat__spark { margin-top: var(--s-2); }
</style>
