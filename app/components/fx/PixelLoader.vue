<script setup lang="ts">
defineProps<{ label?: string }>()
// 3×3 grid lit in a clockwise loop; centre stays dark
const order = [0, 1, 2, 5, 8, 7, 6, 3]
</script>

<template>
  <span class="ploader" role="status" :aria-label="label ?? 'Loading'">
    <i v-for="n in 9" :key="n" :style="{ '--d': order.indexOf(n - 1) }" :class="{ off: n === 5 }" />
  </span>
</template>

<style scoped>
.ploader { display: inline-grid; grid-template-columns: repeat(3, 6px); gap: 2px; }
.ploader i { width: 6px; height: 6px; background: var(--ink); opacity: 0.15; animation: lit 0.8s steps(1) infinite; animation-delay: calc(var(--d) * 0.1s); }
.ploader i.off { animation: none; opacity: 0; }
@keyframes lit { 0%, 20% { opacity: 1; } 21%, 100% { opacity: 0.15; } }
</style>
