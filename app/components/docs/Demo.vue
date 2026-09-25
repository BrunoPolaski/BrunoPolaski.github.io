<script setup lang="ts">
defineProps<{ title: string, usage?: string }>()
</script>

<template>
  <section class="demo">
    <h2>{{ title }}</h2>
    <div class="demo__stage"><slot /></div>
    <pre v-if="usage" class="demo__code"><code>{{ usage }}</code></pre>
  </section>
</template>

<style scoped>
.demo { display: flex; flex-direction: column; gap: var(--s-3); }
.demo h2 { font-size: var(--fs-lg); }
.demo__stage { padding: var(--s-5); border: 1px solid var(--line); border-radius: var(--r-card); background: var(--surface-sunken); }
.demo__code {
  margin: 0;
  padding: var(--s-3) var(--s-4);
  border-radius: 10px;
  background: #000;
  color: #e6e6e6;
  font-size: var(--fs-xs);
  overflow-x: auto;
}
</style>
