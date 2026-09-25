<script setup lang="ts">
import { NuxtLink } from '#components'

const props = withDefaults(defineProps<{
  variant?: 'solid' | 'soft' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  icon?: string
  iconRight?: string
  loading?: boolean
  disabled?: boolean
  to?: string
  /** Accessible name for icon-only buttons. */
  label?: string
}>(), { variant: 'outline', size: 'md' })

const slots = useSlots()
const iconOnly = computed(() => !slots.default && !!props.icon)
</script>

<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to"
    :type="to ? undefined : 'button'"
    :disabled="disabled || loading || undefined"
    :aria-label="label"
    :aria-busy="loading || undefined"
    :class="['btn', `btn--${variant}`, `btn--${size}`, { 'btn--square': iconOnly }]"
  >
    <Icon v-if="loading" name="lucide:loader-circle" class="btn__spin" />
    <Icon v-else-if="icon" :name="icon" />
    <slot />
    <Icon v-if="iconRight" :name="iconRight" />
  </component>
</template>

<style scoped>
.btn {
  --h: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
  height: var(--h);
  padding: 0 calc(var(--h) * 0.4);
  border: 1px solid transparent;
  border-radius: var(--r-control);
  font-weight: 600;
  font-size: var(--fs-sm);
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease), transform var(--dur) var(--ease);
}
.btn:active:not(:disabled) { transform: translateY(1px); }
.btn:disabled { opacity: 0.45; cursor: not-allowed; }

.btn--xs { --h: 26px; font-size: 11px; border-radius: 6px; }
.btn--sm { --h: 30px; font-size: var(--fs-xs); }
.btn--lg { --h: 42px; font-size: var(--fs-md); }
.btn--xl { --h: 50px; font-size: var(--fs-lg); border-radius: 10px; }
.btn--square { width: var(--h); padding: 0; }

.btn--solid { background: var(--ink); color: var(--on-ink); }
.btn--solid:hover:not(:disabled) { background: var(--ink-2); }
.btn--soft { background: var(--wash); color: var(--ink); }
.btn--soft:hover:not(:disabled) { background: var(--line); }
.btn--outline { background: var(--surface); border-color: var(--line-strong); color: var(--ink); }
.btn--outline:hover:not(:disabled) { border-color: var(--ink); }
.btn--ghost { background: transparent; color: var(--ink); }
.btn--ghost:hover:not(:disabled) { background: var(--wash); }

.btn__spin { animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>
