<script setup lang="ts">
defineProps<{ options: string[], label: string }>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="seg" role="group" :aria-label="label">
    <button
      v-for="o in options"
      :key="o"
      type="button"
      :aria-pressed="model === o"
      @click="model = o"
    >
      {{ o }}
    </button>
  </div>
</template>

<style scoped>
.seg { display: inline-flex; align-self: flex-start; gap: 2px; padding: 3px; border-radius: 10px; background: var(--wash); max-width: 100%; overflow-x: auto; }
.seg button {
  height: 30px;
  padding: 0 14px;
  border: 0;
  border-radius: 7px;
  background: none;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--ink-2);
  cursor: pointer;
  white-space: nowrap;
}
.seg button[aria-pressed='true'] { background: var(--ink); color: var(--on-ink); }
</style>
