<script setup lang="ts">
/** `wide`: for a sentence instead of a label; wraps and grows rightward from the trigger. */
defineProps<{ text: string, wide?: boolean }>()
const id = useId()
</script>

<template>
  <span class="tip" :aria-describedby="id">
    <slot />
    <span :id="id" role="tooltip" :class="['tip__bubble', { 'tip__bubble--wide': wide }]">{{ text }}</span>
  </span>
</template>

<style scoped>
.tip { position: relative; display: inline-flex; }
.tip__bubble {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  translate: -50% 4px;
  padding: 5px 8px;
  border-radius: 6px;
  background: var(--ink);
  color: var(--on-ink);
  font-size: var(--fs-xs);
  font-weight: 500;
  white-space: nowrap;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--dur) var(--ease), translate var(--dur) var(--ease);
  z-index: 10;
}
.tip:hover .tip__bubble, .tip:focus-within .tip__bubble { opacity: 1; translate: -50% 0; }
.tip__bubble--wide { left: 0; translate: 0 4px; width: max-content; max-width: min(260px, 70vw); padding: 8px 10px; white-space: normal; line-height: 1.45; }
.tip:hover .tip__bubble--wide, .tip:focus-within .tip__bubble--wide { translate: 0 0; }
</style>
