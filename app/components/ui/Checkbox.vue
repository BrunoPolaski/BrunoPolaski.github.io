<script setup lang="ts">
defineProps<{ label: string, type?: 'checkbox' | 'radio', name?: string, value?: string }>()
const model = defineModel<boolean | string>()
</script>

<template>
  <label class="check">
    <input v-model="model" :type="type ?? 'checkbox'" :name="name" :value="value">
    <span>{{ label }}</span>
  </label>
</template>

<style scoped>
.check { display: inline-flex; align-items: center; gap: 8px; cursor: pointer; font-size: var(--fs-md); }
.check input { width: 18px; height: 18px; margin: 0; accent-color: var(--ink); }
</style>
