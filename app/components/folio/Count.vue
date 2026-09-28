<script setup lang="ts">
/** A stat whose leading number counts up from 0 the first time it scrolls into view ("3+" keeps its "+"). Anything else renders as is. */
import { animate, onScroll } from 'animejs'

const props = defineProps<{ value: string }>()
const shown = ref(props.value)
watch(() => props.value, (v) => { shown.value = v })

const el = ref<HTMLElement>()
let anim: ReturnType<typeof animate> | undefined
onMounted(() => {
  const [, num, rest] = /^(\d+)(.*)$/.exec(props.value) ?? []
  if (!num || matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const o = { n: 0 }
  shown.value = `0${rest}` // held at zero until it scrolls in
  anim = animate(o, {
    n: Number(num),
    duration: 1600,
    ease: 'outExpo',
    onUpdate: () => { shown.value = `${Math.round(o.n)}${rest}` },
    // starts once the number is fully above the bottom 10% of the viewport
    autoplay: onScroll({ target: el.value, enter: '90% bottom', repeat: false }),
  })
})
onBeforeUnmount(() => anim?.revert())
</script>

<template>
  <strong ref="el">{{ shown }}</strong>
</template>
