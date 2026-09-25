<script setup lang="ts">
withDefaults(defineProps<{
  tone?: 'neutral' | 'solid' | 'good' | 'warning' | 'critical'
  icon?: string
}>(), { tone: 'neutral' })
</script>

<template>
  <span :class="['badge', `badge--${tone}`]">
    <Icon v-if="icon" :name="icon" />
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  padding: 0 8px;
  border-radius: var(--r-pill);
  font-size: var(--fs-xs);
  font-weight: 600;
  background: var(--wash);
  color: var(--ink-2);
}
.badge--solid { background: var(--ink); color: var(--on-ink); }
.badge--good { color: var(--good-text); }
.badge--good .iconify { color: var(--good); }
.badge--warning .iconify { color: var(--warning); }
.badge--critical { color: var(--critical); }
</style>
