<script setup lang="ts">
/**
 * Letters widen into place on load, then move along Archivo's width and weight axes as the cursor nears.
 * Each frame: measure every letter, then write each letter's --k (0 far, 1 under the cursor),
 * eased toward its target; CSS maps --k from the rest axes to the hot ones.
 * The parent sets --rest-wdth / --rest-wght (look at rest) and --hot-wdth / --hot-wght (under the cursor).
 */
const props = defineProps<{ text: string }>()

const words = computed(() => {
  let i = 0
  return props.text.split(' ').map(w => [...w].map(ch => ({ ch, i: i++ })))
})

const root = ref<HTMLElement>()
let raf = 0, px = -1e4, py = -1e4, ease = 0.2, visible = false
const k: number[] = []

function frame() {
  raf = 0
  const els = [...root.value!.querySelectorAll<HTMLElement>('.mark__ch')]
  // read all boxes before writing any --k: interleaving forces a layout per letter
  const target = els.map((el) => {
    const b = el.getBoundingClientRect()
    return Math.max(0, 1 - Math.hypot(px - b.left - b.width / 2, py - b.top - b.height / 2) / (b.height * 1.1)) // reach scales with the type: a dent around the cursor, not the whole word
  })
  let moving = false
  els.forEach((el, i) => {
    const t = target[i]!, cur = k[i] ?? 0
    const next = Math.abs(t - cur) < 0.002 ? t : cur + (t - cur) * ease
    if (next !== t) moving = true
    k[i] = next
    el.style.setProperty('--k', next.toFixed(3))
  })
  if (moving) raf = requestAnimationFrame(frame)
}
const schedule = () => { if (visible) raf ||= requestAnimationFrame(frame) }
function onMove(e: PointerEvent) {
  if (e.pointerType !== 'mouse') return
  px = e.clientX
  py = e.clientY
  schedule()
}

let io: IntersectionObserver | undefined
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) ease = 1
  io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting })
  io.observe(root.value!)
  addEventListener('pointermove', onMove, { passive: true })
})
onBeforeUnmount(() => {
  io?.disconnect()
  removeEventListener('pointermove', onMove)
  cancelAnimationFrame(raf)
})
</script>

<template>
  <span ref="root" class="mark" aria-hidden="true">
    <span v-for="(w, wi) in words" :key="wi" class="mark__word">
      <span v-for="l in w" :key="l.i" class="mark__ch"><span class="mark__in" :style="{ '--i': l.i }">{{ l.ch }}</span></span>
    </span>
  </span>
</template>

<style scoped>
.mark { display: flex; flex-wrap: wrap; column-gap: 0.22em; user-select: none; }
.mark__word { display: inline-flex; white-space: nowrap; }
.mark__ch {
  --k: 0;
  --w: var(--rest-wdth, 125);
  --g: var(--rest-wght, 900);
  font-variation-settings: 'wdth' calc(var(--w) + (var(--hot-wdth, 62) - var(--w)) * var(--k)), 'wght' calc(var(--g) + (var(--hot-wght, 500) - var(--g)) * var(--k));
}
/* the entrance runs on an inner span, so it never fights the cursor: each letter starts condensed and light, then widens */
.mark__in { display: inline-block; animation: mark-in 1.1s var(--ease) backwards; animation-delay: calc(var(--i) * 55ms); }
@keyframes mark-in { from { opacity: 0; font-variation-settings: 'wdth' 62, 'wght' 300; translate: 0 0.12em; } }
@media (prefers-reduced-motion: reduce) {
  .mark__in { animation: none; }
}
</style>
