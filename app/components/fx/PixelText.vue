<script setup lang="ts">
const props = withDefaults(defineProps<{ text: string, cell?: number }>(), { cell: 6 })
const canvas = ref<HTMLCanvasElement>()
let targets: { x: number, y: number, sx: number, sy: number, delay: number }[] = []
let builtFor = ''
let start = 0

/** Rasterises the text offscreen, then keeps one particle per lit cell. */
function build(w: number, h: number) {
  const off = document.createElement('canvas')
  off.width = w
  off.height = h
  const o = off.getContext('2d')!
  o.font = `800 ${Math.min(h * 0.8, (w / props.text.length) * 1.7)}px Archivo, sans-serif`
  o.textAlign = 'center'
  o.textBaseline = 'middle'
  o.fillText(props.text, w / 2, h / 2)
  const data = o.getImageData(0, 0, w, h).data
  targets = []
  for (let y = 0; y < h; y += props.cell) {
    for (let x = 0; x < w; x += props.cell) {
      if (data[(y * w + x) * 4 + 3]! > 128) {
        targets.push({ x, y, sx: Math.random() * w, sy: Math.random() * h, delay: Math.random() * 600 })
      }
    }
  }
  builtFor = `${w}x${h}${props.text}`
  start = 0
}

function replay() { start = 0 }

useCanvasLoop(canvas, (ctx, w, h, t) => {
  if (builtFor !== `${w}x${h}${props.text}`) build(w, h)
  ctx.clearRect(0, 0, w, h)
  ctx.fillStyle = getComputedStyle(canvas.value!).color
  // t = 0 is a still frame: show the assembled text. First live frame starts the animation.
  if (t && !start) start = t
  const elapsed = t ? t - start : 1e9
  const s = props.cell - 1
  for (const p of targets) {
    const k = Math.min(1, Math.max(0, (elapsed - p.delay) / 900))
    const e = 1 - (1 - k) ** 3
    ctx.fillRect(p.sx + (p.x - p.sx) * e, p.sy + (p.y - p.sy) * e, s, s)
  }
})
</script>

<template>
  <canvas ref="canvas" class="ptext" role="img" :aria-label="text" @click="replay" />
</template>

<style scoped>
.ptext { width: 100%; height: 100%; color: var(--ink); cursor: pointer; }
</style>
