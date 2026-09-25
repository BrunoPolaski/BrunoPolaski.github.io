<script setup lang="ts">
defineProps<{ value: number, label: string }>()
</script>

<template>
  <div class="prog">
    <div class="prog__top"><span>{{ label }}</span><span class="muted">{{ Math.round(value) }}%</span></div>
    <div class="prog__track" role="progressbar" :aria-valuenow="value" aria-valuemin="0" aria-valuemax="100" :aria-label="label">
      <div class="prog__fill" :style="{ width: `${value}%` }" />
    </div>
  </div>
</template>

<style scoped>
.prog { display: flex; flex-direction: column; gap: 6px; font-size: var(--fs-sm); }
.prog__top { display: flex; justify-content: space-between; font-variant-numeric: tabular-nums; }
.prog__track { height: 6px; border-radius: var(--r-pill); background: var(--wash); overflow: hidden; }
.prog__fill { height: 100%; border-radius: inherit; background: var(--ink); transition: width 400ms var(--ease); }
</style>
