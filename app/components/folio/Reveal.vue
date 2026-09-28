<script setup lang="ts">
/**
 * A heading whose letters stretch open and rise into place as it scrolls into view, each on its
 * own --t (0..1). Scrubbed by the scroll position, so it plays backwards on the way up.
 * Only transform and opacity move: animating the font's width axis instead re-laid out the page
 * every frame. Without JS (or with reduced motion) --t rests at 1.
 */
import { gsap } from 'gsap'

const props = withDefaults(defineProps<{ text: string, as?: string }>(), { as: 'h2' })

// running letter index across words, for the stagger
const words = computed(() => {
  let i = 0
  return props.text.split(' ').map(w => [...w].map(ch => ({ ch, i: i++ })))
})

const el = ref<HTMLElement>()
let ctx: gsap.Context | undefined
function build() {
  ctx?.revert()
  ctx = gsap.context(() => {
    gsap.fromTo('.reveal__ch', { '--t': 0 }, {
      '--t': 1,
      ease: 'power2.out',
      stagger: 0.05,
      // from the moment it peeks in at the bottom until it has risen to 60% of the screen
      scrollTrigger: { trigger: el.value, start: 'top bottom', end: 'top 60%', scrub: 0.5 },
    })
  }, el.value)
}
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  build()
  watch(words, () => nextTick(build)) // new language: new letters to animate
})
onBeforeUnmount(() => ctx?.revert())
</script>

<template>
  <component :is="as" ref="el" class="reveal">
    <span class="sr-only">{{ text }}</span>
    <span aria-hidden="true">
      <template v-for="(w, wi) in words" :key="wi">
        <span class="reveal__word"><span v-for="l in w" :key="l.i" class="reveal__ch">{{ l.ch }}</span></span>{{ ' ' }}
      </template>
    </span>
  </component>
</template>

<style scoped>
.reveal__word { display: inline-block; white-space: nowrap; }
.reveal__ch {
  --t: 1;
  display: inline-block;
  transform: translateY(calc((1 - var(--t)) * 0.25em)) scaleX(calc(0.4 + 0.6 * var(--t)));
  transform-origin: 50% 100%;
  opacity: calc(0.12 + 0.88 * var(--t));
}
</style>
