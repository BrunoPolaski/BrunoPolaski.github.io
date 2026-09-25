<script setup lang="ts">
/** Letters blur in one by one the first time the heading scrolls into view. Remount (`:key`) to replay. */
const props = withDefaults(defineProps<{ text: string, as?: string }>(), { as: 'h2' })

// running letter index across words, for the stagger delay
const words = computed(() => {
  let i = 0
  return props.text.split(' ').map(w => [...w].map(ch => ({ ch, i: i++ })))
})

const el = ref<HTMLElement>()
const state = ref<'idle' | 'armed' | 'in'>('idle') // idle = SSR / no JS: text simply visible
let io: IntersectionObserver | undefined

onMounted(() => {
  state.value = 'armed'
  io = new IntersectionObserver(([e]) => {
    if (!e?.isIntersecting) return
    state.value = 'in'
    io?.disconnect()
  }, { threshold: 0.3 })
  io.observe(el.value!)
})
onBeforeUnmount(() => io?.disconnect())
</script>

<template>
  <component :is="as" ref="el" class="reveal" :data-state="state">
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">
      <template v-for="(w, wi) in words" :key="wi">
        <span class="reveal__word"><span v-for="l in w" :key="l.i" class="reveal__ch" :style="{ '--i': l.i }">{{ l.ch }}</span></span>{{ ' ' }}
      </template>
    </span>
  </component>
</template>

<style scoped>
.reveal__word { display: inline-block; white-space: nowrap; }
.reveal__ch {
  display: inline-block;
  transition: opacity 0.7s var(--ease), filter 0.7s var(--ease), translate 0.7s var(--ease);
  transition-delay: calc(var(--i) * 40ms);
}
.reveal[data-state='armed'] .reveal__ch { opacity: 0; filter: blur(14px); translate: 0 0.25em; }
@media (prefers-reduced-motion: reduce) {
  .reveal__ch { transition-delay: 0s; }
}
</style>
