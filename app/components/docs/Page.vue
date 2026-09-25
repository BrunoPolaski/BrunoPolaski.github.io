<script setup lang="ts">
const props = defineProps<{ title: string, lead: string }>()
useSeoMeta({ title: () => `${props.title} · Halo UI`, description: () => props.lead })
</script>

<template>
  <article class="page">
    <header class="page__head">
      <h1>{{ title }}</h1>
      <p class="page__lead">{{ lead }}</p>
    </header>
    <slot />
  </article>
</template>

<style scoped>
.page { display: flex; flex-direction: column; gap: var(--s-7); }
.page__head { display: flex; flex-direction: column; gap: var(--s-3); }
.page__head h1 { font-size: var(--fs-2xl); }
.page__lead { color: var(--ink-2); font-size: var(--fs-lg); }
</style>
