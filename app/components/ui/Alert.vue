<script setup lang="ts">
const props = withDefaults(defineProps<{ title: string, tone?: 'neutral' | 'good' | 'warning' | 'critical' }>(), { tone: 'neutral' })
const icon = computed(() => ({
  neutral: 'lucide:info',
  good: 'lucide:circle-check',
  warning: 'lucide:triangle-alert',
  critical: 'lucide:octagon-x',
})[props.tone])
</script>

<template>
  <div :class="['alert', `alert--${tone}`]" :role="tone === 'critical' ? 'alert' : 'status'">
    <Icon :name="icon" class="alert__icon" />
    <div>
      <strong>{{ title }}</strong>
      <p v-if="$slots.default"><slot /></p>
    </div>
  </div>
</template>

<style scoped>
.alert {
  display: flex;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-left-width: 3px;
  border-radius: 10px;
  background: var(--surface);
  font-size: var(--fs-sm);
}
.alert p { color: var(--ink-2); margin-top: 2px; }
.alert__icon { flex: none; font-size: 18px; margin-top: 1px; }
.alert--neutral { border-left-color: var(--ink); }
.alert--good { border-left-color: var(--good); }
.alert--good .alert__icon { color: var(--good); }
.alert--warning { border-left-color: var(--warning); }
.alert--warning .alert__icon { color: var(--warning); }
.alert--critical { border-left-color: var(--critical); }
.alert--critical .alert__icon { color: var(--critical); }
</style>
