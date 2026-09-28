<script setup lang="ts">
/** A paragraph whose words light up one by one as it scrolls up through the screen, and dim again on the way back. */
import { animate, onScroll, stagger } from 'animejs'

const props = defineProps<{ text: string }>()
const words = computed(() => props.text.split(' '))

const el = ref<HTMLElement>()
const armed = ref(false) // dim until scrolled; without JS (or with reduced motion) the text is simply lit
let anim: ReturnType<typeof animate> | undefined
function build() {
  anim?.revert()
  anim = animate(el.value!.children, {
    opacity: [0.18, 1],
    duration: 300,
    delay: stagger(60),
    ease: 'linear',
    // from its top at 80% of the screen until its bottom reaches the middle
    autoplay: onScroll({ target: el.value, enter: '80% top', leave: '50% bottom', sync: 0.5 }),
  })
}
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  armed.value = true
  build()
  watch(words, () => nextTick(build)) // new language: new spans to animate
})
onBeforeUnmount(() => anim?.revert())
</script>

<template>
  <p ref="el" :class="{ 'is-armed': armed }">
    <template v-for="(w, i) in words" :key="i">
      <span class="scrub__w">{{ w }}</span>{{ ' ' }}
    </template>
  </p>
</template>

<style scoped>
.is-armed .scrub__w { opacity: 0.18; } /* words the scroll hasn't reached yet */
</style>
