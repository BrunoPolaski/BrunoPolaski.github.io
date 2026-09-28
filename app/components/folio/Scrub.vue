<script setup lang="ts">
/** A paragraph whose words light up one by one as it scrolls up through the screen, and dim again on the way back. */
import { gsap } from 'gsap'

const props = defineProps<{ text: string }>()
const words = computed(() => props.text.split(' '))

const el = ref<HTMLElement>()
let anim: gsap.core.Tween | undefined
function build() {
  anim?.revert()
  anim = gsap.fromTo(el.value!.children, { opacity: 0.18 }, {
    opacity: 1,
    ease: 'none',
    stagger: 0.06,
    // from its top at 80% of the screen until its bottom reaches the middle
    scrollTrigger: { trigger: el.value, start: 'top 80%', end: 'bottom 50%', scrub: 0.5 },
  })
}
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  build()
  watch(words, () => nextTick(build)) // new language: new spans to animate
})
onBeforeUnmount(() => anim?.revert())
</script>

<template>
  <p ref="el">
    <template v-for="(w, i) in words" :key="i">
      <span class="scrub__w">{{ w }}</span>{{ ' ' }}
    </template>
  </p>
</template>

