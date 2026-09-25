<script setup lang="ts">
withDefaults(defineProps<{ width?: string, height?: string, round?: boolean }>(), { width: '100%', height: '14px' })
</script>

<template>
  <span class="sk" :style="{ width, height, borderRadius: round ? '50%' : '6px' }" aria-hidden="true" />
</template>

<style scoped>
.sk {
  display: block;
  background: linear-gradient(90deg, var(--wash) 30%, var(--line) 50%, var(--wash) 70%) 0 0 / 300% 100%;
  animation: shimmer 1.4s linear infinite;
}
@keyframes shimmer { to { background-position: -150% 0; } }
</style>
