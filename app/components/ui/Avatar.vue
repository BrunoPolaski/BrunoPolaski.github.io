<script setup lang="ts">
const props = withDefaults(defineProps<{ name: string, src?: string, size?: number }>(), { size: 36 })
const initials = computed(() => props.name.split(/\s+/).map(w => w[0]).slice(0, 2).join('').toUpperCase())
</script>

<template>
  <span class="avatar" :style="{ '--size': `${size}px` }">
    <img v-if="src" :src="src" :alt="name">
    <span v-else aria-hidden="true">{{ initials }}</span>
    <span v-if="!src" class="sr-only">{{ name }}</span>
  </span>
</template>

<style scoped>
.avatar {
  display: inline-grid;
  place-items: center;
  flex: none;
  width: var(--size);
  height: var(--size);
  border-radius: 50%;
  overflow: hidden;
  background: var(--ink);
  color: var(--on-ink);
  font-size: calc(var(--size) * 0.36);
  font-weight: 700;
}
.avatar img { width: 100%; height: 100%; object-fit: cover; }
</style>
