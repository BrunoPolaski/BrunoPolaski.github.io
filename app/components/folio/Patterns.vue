<script setup lang="ts">
/**
 * Project cards that rearrange into a design pattern and act it out.
 * A pattern is plain data: a grid layout, a role per card, the wires between cards,
 * and frames (which cards light up, which wires carry a pulse, what each card says).
 */
const { t } = useLocale()

const projects = [
  { name: 'api-gateway', lang: 'Go' },
  { name: 'auth-service', lang: 'Go' },
  { name: 'url-shortener', lang: 'Go' },
  { name: 'mcp-servers', lang: 'Go' },
  { name: 'go-logger', lang: 'Go' },
  { name: 's3-bucket-listener', lang: 'Go' },
] as const
const repo = (name: string) => `https://github.com/BrunoPolaski/${name}`

// Structure only. The text (gist, roles, each frame's note and badges) lives in the locale
// files under projects.patterns[key], with frames matched by index.
interface Frame {
  lit: number[]
  done?: number
  off?: number[]
  links?: [number, number][]
}
interface Pattern {
  key: 'chain' | 'facade' | 'decorator' | 'observer'
  name: string // pattern names stay in English in every locale, as the literature uses them
  grid: string // desktop grid-template
  area: string[] // grid-area per card
  lvl?: number[] // nesting depth per card (Decorator)
  first?: number // card listed first on narrow screens
  wires: [number, number][]
  frames: Frame[]
}

const patterns: Pattern[] = [
  {
    key: 'chain',
    name: 'Chain of Responsibility',
    grid: '"a b c" "f e d" / 1fr 1fr 1fr',
    area: ['a', 'b', 'c', 'd', 'e', 'f'],
    wires: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5]],
    frames: [
      { lit: [0] },
      { lit: [1], links: [[0, 1]] },
      { lit: [2], links: [[1, 2]], done: 2 },
      { lit: [0] },
      { lit: [1], links: [[0, 1]], done: 1 },
      { lit: [0, 1, 2], links: [[0, 1], [1, 2]] },
      { lit: [3], links: [[2, 3]], done: 3 },
    ],
  },
  {
    key: 'facade',
    name: 'Facade',
    grid: '". f f f ." "a b c d e" / 1fr 1fr 1fr 1fr 1fr', // the areas form of grid-template allows no repeat()
    area: ['a', 'b', 'c', 'f', 'd', 'e'],
    first: 3,
    wires: [[3, 0], [3, 1], [3, 2], [3, 4], [3, 5]],
    frames: [
      { lit: [3] },
      { lit: [3, 0, 1, 2, 4, 5], links: [[3, 0], [3, 1], [3, 2], [3, 4], [3, 5]] },
      { lit: [3], links: [[0, 3], [1, 3], [2, 3], [4, 3], [5, 3]], done: 3 },
    ],
  },
  {
    key: 'decorator',
    name: 'Decorator',
    grid: '"core x" "core y" / 2fr 1fr',
    area: ['core', 'core', 'core', 'x', 'core', 'y'],
    lvl: [0, 1, 3, 0, 2, 0],
    wires: [],
    frames: [
      { lit: [0] },
      { lit: [1] },
      { lit: [4] },
      { lit: [2], done: 2 },
      { lit: [4, 1, 0] },
    ],
  },
  {
    key: 'observer',
    name: 'Observer',
    grid: '"a b c" "d s e" / 1fr 1fr 1fr',
    area: ['a', 'b', 'c', 'd', 'e', 's'],
    first: 5,
    wires: [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4]],
    frames: [
      { lit: [5] },
      { lit: [5, 0, 1, 2, 3, 4], links: [[5, 0], [5, 1], [5, 2], [5, 3], [5, 4]] },
      { lit: [4], off: [4] },
      { lit: [5, 0, 1, 2, 3], links: [[5, 0], [5, 1], [5, 2], [5, 3]], off: [4] },
    ],
  },
]

const picked = ref(patterns[0]!.name)
const pat = shallowRef(patterns[0]!)
const step = ref(0)
const frame = computed(() => pat.value.frames[step.value]!)
const text = computed(() => t.value.projects.patterns[pat.value.key])
const words = computed(() => text.value.frames[step.value]!) // this frame's note and badges
const playing = ref(true)
const moving = ref(false) // hide wires while the cards morph

const next = () => { step.value = (step.value + 1) % pat.value.frames.length }
const isHot = (a: number, b: number) => !!frame.value.links?.some(([x, y]) => (x === a && y === b) || (x === b && y === a))

// Card boxes in stage coordinates, so wires run edge to edge and never cross a card.
const stage = ref<HTMLElement>()
const cards: HTMLElement[] = []
const boxes = ref<{ x: number, y: number, w: number, h: number }[]>([])
function measure() {
  const s = stage.value!.getBoundingClientRect()
  boxes.value = cards.map((c) => {
    const r = c.getBoundingClientRect()
    return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, w: r.width, h: r.height }
  })
}
function segment(a: number, b: number) {
  const p = boxes.value[a], q = boxes.value[b]
  if (!p || !q) return null
  const dx = q.x - p.x, dy = q.y - p.y
  // fraction of the centre-to-centre vector spent inside a box before reaching its edge
  const inside = (r: typeof p) => Math.min(dx ? r.w / 2 / Math.abs(dx) : Infinity, dy ? r.h / 2 / Math.abs(dy) : Infinity)
  const t1 = inside(p), t2 = 1 - inside(q)
  if (!(t1 < t2)) return null // same centre (NaN) or overlapping boxes: nothing to draw
  return { x1: p.x + dx * t1, y1: p.y + dy * t1, x2: p.x + dx * t2, y2: p.y + dy * t2 }
}

watch(picked, (name) => {
  const swap = async () => {
    pat.value = patterns.find(p => p.name === name)!
    step.value = 0
    await nextTick()
    measure()
  }
  if (!('startViewTransition' in document) || matchMedia('(prefers-reduced-motion: reduce)').matches) return swap()
  moving.value = true
  document.startViewTransition(swap).finished.finally(() => { moving.value = false })
})

let timer: ReturnType<typeof setInterval> | undefined
let ro: ResizeObserver | undefined
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) playing.value = false
  timer = setInterval(() => { if (playing.value) next() }, 1700)
  ro = new ResizeObserver(measure)
  ro.observe(stage.value!)
})
onBeforeUnmount(() => {
  clearInterval(timer)
  ro?.disconnect()
})
</script>

<template>
  <div class="pat">
    <UiSegmented v-model="picked" :label="t.projects.patternLabel" :options="patterns.map(p => p.name)" />
    <p class="pat__gist">{{ text.gist }}</p>

    <div ref="stage" class="stage" :class="{ 'stage--nest': pat.lvl, 'is-moving': moving }" :style="{ '--grid': pat.grid }">
      <article
        v-for="(p, i) in projects"
        :key="p.name"
        :ref="el => { if (el) cards[i] = el as HTMLElement }"
        class="card"
        :class="{
          'is-idle': !text.roles[i],
          'is-lit': frame.lit.includes(i),
          'is-done': frame.done === i,
          'is-off': frame.off?.includes(i),
        }"
        :style="{ '--area': pat.area[i], '--lvl': pat.lvl?.[i] ?? 0, '--o': pat.first === i ? -1 : 0, viewTransitionName: `pcard-${i}` }"
      >
        <span class="card__role">{{ text.roles[i] || t.projects.notInPattern }}</span>
        <Transition name="pop">
          <span v-if="words.say?.[i]" :key="`${pat.name}-${step}`" class="card__say">{{ words.say[i] }}</span>
        </Transition>
        <h3><a :href="repo(p.name)" target="_blank" rel="noopener">{{ p.name }}</a> <small>{{ p.lang }}</small></h3>
        <p>{{ t.projects.blurbs[p.name] }}</p>
      </article>

      <svg class="wires" aria-hidden="true">
        <template v-for="([a, b], k) in pat.wires" :key="`${pat.name}-${k}`">
          <line v-if="segment(a, b)" v-bind="segment(a, b)!" :class="{ 'is-hot': isHot(a, b) }" />
        </template>
      </svg>
      <template v-for="([a, b], k) in frame.links ?? []" :key="`${pat.name}-${step}-${k}`">
        <span
          v-if="segment(a, b)"
          class="pulse"
          aria-hidden="true"
          :style="{ '--x1': `${segment(a, b)!.x1}px`, '--y1': `${segment(a, b)!.y1}px`, '--x2': `${segment(a, b)!.x2}px`, '--y2': `${segment(a, b)!.y2}px` }"
        />
      </template>
    </div>

    <div class="pat__foot">
      <p :key="`${pat.name}-${step}`" class="pat__note"><span class="muted">{{ step + 1 }}/{{ pat.frames.length }}</span> {{ words.note }}</p>
      <UiButton variant="ghost" size="sm" :icon="playing ? 'lucide:pause' : 'lucide:play'" :label="playing ? t.projects.pause : t.projects.play" @click="playing = !playing" />
      <UiButton variant="ghost" size="sm" icon="lucide:step-forward" :label="t.projects.next" @click="next" />
    </div>
  </div>
</template>

<style scoped>
.pat { display: flex; flex-direction: column; gap: var(--s-4); }
.pat__gist { color: var(--ink-2); font-size: var(--fs-lg); }

.stage { position: relative; isolation: isolate; display: grid; grid-template: var(--grid); gap: 56px 72px; margin-top: var(--s-4); }
.card {
  grid-area: var(--area);
  position: relative;
  z-index: var(--lvl);
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 150px;
  margin: calc(var(--lvl) * 66px) calc(var(--lvl) * 18px) calc(var(--lvl) * 18px);
  padding: 14px 18px 18px;
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  background: var(--card);
  transition: border-color 0.4s var(--ease), box-shadow 0.4s var(--ease), opacity 0.4s var(--ease), background-color 0.4s var(--ease);
}
.card__role { font-size: var(--fs-xs); font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; color: var(--ink-3); }
.card h3 { font-size: var(--fs-lg); font-stretch: 100%; }
.card h3 a { text-decoration: none; }
.card h3 a:hover { text-decoration: underline; }
.card h3 small { font-size: var(--fs-xs); font-weight: 600; color: var(--ink-3); }
.card p { color: var(--ink-2); font-size: var(--fs-sm); }
/* the badge hangs on the card's top edge, out of flow: showing it never reflows the card */
.card__say {
  position: absolute;
  top: -11px;
  right: 12px;
  padding: 2px 10px;
  border-radius: var(--r-pill);
  background: var(--signal);
  color: #fff;
  font-size: var(--fs-xs);
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 0 0 3px var(--card); /* a gap ring where it crosses the border */
}
.pop-enter-active { transition: opacity 0.35s var(--ease), translate 0.35s var(--ease), scale 0.35s var(--ease); }
.pop-leave-active { transition: opacity 0.25s var(--ease), scale 0.25s var(--ease); }
.pop-enter-from { opacity: 0; translate: 0 6px; scale: 0.85; }
.pop-leave-to { opacity: 0; scale: 0.9; }
@keyframes say-in { from { opacity: 0; translate: 0 6px; filter: blur(6px); } }

.card.is-idle { opacity: 0.3; }
.card.is-off { opacity: 0.4; border-style: dashed; }
.card.is-lit { border-color: var(--signal); box-shadow: 0 0 0 1px var(--signal), 0 0 48px -10px var(--signal); }
.card.is-lit .card__role { color: var(--signal); }
.card.is-done { background: color-mix(in srgb, var(--signal) 24%, var(--card)); }

.wires { position: absolute; inset: 0; z-index: -1; /* under cards and badges; isolation on .stage keeps it above the page */ width: 100%; height: 100%; overflow: visible; pointer-events: none; transition: opacity 0.3s; }
.wires line { stroke: var(--line-strong); stroke-width: 1.5; stroke-dasharray: 4 6; transition: stroke 0.3s; }
.wires line.is-hot { stroke: var(--signal); animation: flow 0.6s linear infinite; }
@keyframes flow { to { stroke-dashoffset: -10; } }
.stage.is-moving .wires { opacity: 0; }

.pulse {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 11;
  width: 10px;
  height: 10px;
  margin: -5px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px 3px var(--signal);
  pointer-events: none;
  animation: travel 0.8s var(--ease) both;
}
@keyframes travel {
  from { translate: var(--x1) var(--y1); opacity: 0; }
  20% { opacity: 1; }
  to { translate: var(--x2) var(--y2); opacity: 0; }
}

.pat__foot { display: flex; align-items: center; gap: var(--s-2); margin-top: var(--s-3); }
.pat__note { flex: 1; max-width: none; animation: say-in 0.4s var(--ease); }

@media (max-width: 900px) {
  .pat > .seg { flex-wrap: wrap; } /* every pattern visible, instead of one hidden off the edge */
  .stage { grid-template: none; grid-template-columns: minmax(0, 1fr); gap: 20px; }
  .card { grid-area: auto; order: var(--o); }
  .stage--nest { grid-template: 'core' 'x' 'y' / minmax(0, 1fr); }
  .stage--nest .card { grid-area: var(--area); }
  .wires, .pulse { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .wires line.is-hot { animation: none; }
  .pulse { display: none; }
}
</style>
