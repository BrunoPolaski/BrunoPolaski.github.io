<script setup lang="ts">
defineProps<{ items: { title: string, body: string }[] }>()
const name = useId()
</script>

<template>
  <div class="acc">
    <details v-for="it in items" :key="it.title" :name="name">
      <summary>{{ it.title }} <Icon name="lucide:plus" /></summary>
      <p>{{ it.body }}</p>
    </details>
  </div>
</template>

<style scoped>
.acc { border-top: 1px solid var(--line); }
details { border-bottom: 1px solid var(--line); }
summary {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  font-weight: 600;
  cursor: pointer;
  list-style: none;
}
summary::-webkit-details-marker { display: none; }
summary .iconify { transition: rotate var(--dur) var(--ease); }
details[open] summary .iconify { rotate: 45deg; }
details p { padding-bottom: 14px; color: var(--ink-2); }
</style>
