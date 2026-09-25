<script setup lang="ts">
/**
 * The footer links, drawn as hexagonal architecture: me as the domain, the application
 * hexagon around it, and each way to reach me as an adapter plugged into a port.
 * Email is a driving adapter (it calls in); GitHub and LinkedIn are driven (I call out),
 * so hovering one sends a pulse along its wire in that direction.
 * Desktop geometry is a fixed 680×200 stage; below 760px it becomes a plain list.
 */
const props = defineProps<{ email: string, github: string, linkedin: string }>()
const { t } = useLocale()

// pointy-top hexagons centred on (340, 100)
const hex = (r: number) => Array.from({ length: 6 }, (_, i) => {
  const a = Math.PI / 180 * (60 * i - 90)
  return `${(340 + r * Math.cos(a)).toFixed(1)},${(100 + r * Math.sin(a)).toFixed(1)}`
}).join(' ')

// wires run from where the flow starts to where it ends: in for driving, out for driven
const adapters = computed(() => [
  { key: 'email', name: 'Email', port: 'MessagePort', side: 'driving', icon: 'lucide:mail', href: `mailto:${props.email}`, wire: { x1: 210, y1: 100, x2: 265.5, y2: 100 } },
  { key: 'github', name: 'GitHub', port: 'RepositoryPort', side: 'driven', icon: 'lucide:github', href: props.github, wire: { x1: 377.3, y1: 35.5, x2: 470, y2: 50 } },
  { key: 'linkedin', name: 'LinkedIn', port: 'ProfilePort', side: 'driven', icon: 'lucide:linkedin', href: props.linkedin, wire: { x1: 377.3, y1: 164.5, x2: 470, y2: 150 } },
])
// the port sits at the hexagon end of each wire
const port = (w: { x1: number, y1: number, x2: number, y2: number }, side: string) =>
  side === 'driving' ? { cx: w.x2, cy: w.y2 } : { cx: w.x1, cy: w.y1 }

const hot = ref<string>()
</script>

<template>
  <div class="hexa" :data-hot="hot">
    <svg class="hexa__art" viewBox="0 0 680 200" aria-hidden="true">
      <polygon class="hexa__app" :points="hex(86)" />
      <polygon class="hexa__domain" :points="hex(50)" />
      <text x="340" y="100" class="hexa__me">Bruno</text>
      <text x="340" y="120" class="hexa__cap">{{ t.footer.domain }}</text>
      <g v-for="a in adapters" :key="a.key" :class="['hexa__wire', `is-${a.key}`, `is-${a.side}`]">
        <line v-bind="a.wire" />
        <line v-bind="a.wire" class="hexa__pulse" pathLength="100" />
        <circle v-bind="port(a.wire, a.side)" r="4.5" class="hexa__port" />
      </g>
    </svg>

    <nav class="hexa__adapters" :aria-label="t.footer.label">
      <a
        v-for="a in adapters"
        :key="a.key"
        :href="a.href"
        :class="['hexa__adapter', `is-${a.key}`]"
        @pointerenter="hot = a.key"
        @pointerleave="hot = undefined"
        @focus="hot = a.key"
        @blur="hot = undefined"
      >
        <Icon :name="a.icon" />
        <span><b>{{ a.name }}</b><small>{{ a.side }} · {{ a.port }}</small></span>
      </a>
    </nav>
  </div>
</template>

<style scoped>
.hexa { position: relative; width: 680px; height: 200px; margin: 0 auto; }
.hexa__art { position: absolute; inset: 0; width: 100%; height: 100%; max-width: none; overflow: visible; }

.hexa__app { fill: var(--panel); stroke: var(--line-strong); stroke-width: 1.5; transition: stroke var(--dur) var(--ease); }
.hexa__domain { fill: none; stroke: var(--line-strong); stroke-width: 1; stroke-dasharray: 3 5; }
.hexa__me { text-anchor: middle; fill: var(--ink); font-size: 22px; font-weight: 800; font-stretch: 125%; }
.hexa__cap { text-anchor: middle; fill: var(--ink-3); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; }

.hexa__wire line { stroke: var(--line-strong); stroke-width: 1.5; stroke-dasharray: 4 6; }
.hexa__wire .hexa__pulse { stroke: var(--signal); stroke-width: 2.5; stroke-linecap: round; stroke-dasharray: 14 200; stroke-dashoffset: 14; opacity: 0; }
.hexa__port { fill: var(--canvas); stroke: var(--line-strong); stroke-width: 1.5; transition: fill var(--dur) var(--ease), stroke var(--dur) var(--ease); }

/* the hovered adapter's wire carries a pulse, and its port lights up */
.hexa[data-hot] .hexa__app { stroke: var(--ink-3); }
.hexa[data-hot="email"] .is-email .hexa__port,
.hexa[data-hot="github"] .is-github .hexa__port,
.hexa[data-hot="linkedin"] .is-linkedin .hexa__port { fill: var(--signal); stroke: var(--signal); }
.hexa[data-hot="email"] .is-email .hexa__pulse,
.hexa[data-hot="github"] .is-github .hexa__pulse,
.hexa[data-hot="linkedin"] .is-linkedin .hexa__pulse { opacity: 1; stroke-dashoffset: -100; }
@media (prefers-reduced-motion: no-preference) {
  .hexa[data-hot="email"] .is-email .hexa__pulse,
  .hexa[data-hot="github"] .is-github .hexa__pulse,
  .hexa[data-hot="linkedin"] .is-linkedin .hexa__pulse { animation: travel 0.9s var(--ease) infinite; }
}
@keyframes travel {
  from { stroke-dashoffset: 14; }
  to { stroke-dashoffset: -100; }
}

.hexa__adapter {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  width: 210px;
  height: 56px;
  padding: 0 14px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--panel);
  color: var(--ink-2);
  text-decoration: none;
  transition: border-color var(--dur) var(--ease), color var(--dur) var(--ease);
}
.hexa__adapter:hover, .hexa__adapter:focus-visible { border-color: var(--signal); color: var(--ink); }
.hexa__adapter .iconify { flex: none; font-size: 1.25rem; }
.hexa__adapter span { display: flex; flex-direction: column; min-width: 0; }
.hexa__adapter b { font-size: var(--fs-sm); color: var(--ink); }
.hexa__adapter small { font-family: ui-monospace, monospace; font-size: 11px; color: var(--ink-3); white-space: nowrap; }
.is-email.hexa__adapter { left: 0; top: 72px; }
.is-github.hexa__adapter { left: 470px; top: 22px; }
.is-linkedin.hexa__adapter { left: 470px; top: 122px; }

/* narrow screens: the hexagon on top, the adapters as a list under it */
@media (max-width: 759px) {
  .hexa { width: auto; height: auto; display: flex; flex-direction: column; align-items: center; gap: var(--s-4); }
  .hexa__art { position: static; flex: none; width: 680px; height: 200px; } /* same scale, centred: the sides (only wires) spill out and are clipped by the page */
  .hexa__wire { display: none; }
  .hexa__adapters { display: flex; flex-direction: column; gap: var(--s-2); width: min(100%, 320px); }
  .hexa__adapter { position: static; width: auto; }
}
</style>
