<script setup lang="ts">
defineProps<{ label: string }>()
const model = defineModel<boolean>({ default: false })
</script>

<template>
  <label class="switch">
    <input v-model="model" type="checkbox" role="switch">
    <span class="switch__track" aria-hidden="true" />
    <span>{{ label }}</span>
  </label>
</template>

<style scoped>
.switch { display: inline-flex; align-items: center; gap: 10px; cursor: pointer; }
.switch input { position: absolute; opacity: 0; width: 1px; height: 1px; }
.switch__track {
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: var(--r-pill);
  background: var(--line-strong);
  transition: background var(--dur) var(--ease);
}
.switch__track::after {
  content: '';
  position: absolute;
  inset: 2px auto 2px 2px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--surface);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
  transition: translate var(--dur) var(--ease);
}
.switch input:checked + .switch__track { background: var(--ink); }
.switch input:checked + .switch__track::after { translate: 16px 0; }
.switch input:focus-visible + .switch__track { outline: 2px solid var(--signal); outline-offset: 2px; }
</style>
