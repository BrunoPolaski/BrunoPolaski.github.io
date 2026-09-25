<script setup lang="ts">
defineProps<{ label: string, options: string[] }>()
const model = defineModel<string>()
const id = useId()
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <div class="select">
      <select :id="id" v-model="model">
        <option v-for="o in options" :key="o" :value="o">{{ o }}</option>
      </select>
      <Icon name="lucide:chevrons-up-down" class="select__chev" />
    </div>
  </div>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 6px; font-size: var(--fs-sm); font-weight: 600; }
.select { position: relative; }
.select select {
  appearance: none;
  width: 100%;
  height: 38px;
  padding: 0 36px 0 12px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-control);
  background: var(--surface);
  font-weight: 400;
  font-size: var(--fs-md);
}
.select__chev { position: absolute; right: 12px; top: 50%; translate: 0 -50%; pointer-events: none; color: var(--ink-3); }
</style>
