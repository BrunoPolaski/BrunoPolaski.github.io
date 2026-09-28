<script setup lang="ts">
/**
 * Experience as a distributed trace: each company is a parent span, each role a child span,
 * laid out on one time axis from my first role to today. Newest first, like a CV, so the spans step
 * down to the left. Picking a role shows what I did there.
 */
import type { Messages } from '~/i18n/pt-BR'

const { t, locale } = useLocale()

type Key = keyof Messages['experience']['roles']
interface Role { key: Key, from: string, to?: string } // months as YYYY-MM; no `to` = current
const companies: { name: string, roles: Role[] }[] = [ // newest first, companies and roles alike
  { name: 'BairesDev', roles: [{ key: 'rd', from: '2026-07' }] },
  { name: 'Adaga Digital', roles: [
    { key: 'mid', from: '2024-05', to: '2026-07' },
    { key: 'junior', from: '2024-02', to: '2024-05' },
    { key: 'intern', from: '2023-08', to: '2024-02' },
  ] },
]
// what I did in each role, as icons; each one's text is experience.acts[role][key] in the locale files
const acts: Record<Key, Record<string, string>> = {
  rd: { building: 'lucide:construction' },
  mid: { components: 'lucide:component', features: 'lucide:hand-coins', devops: 'lucide:cloud-cog' },
  junior: { server: 'lucide:server-cog', products: 'lucide:package-plus' },
  intern: { mobile: 'lucide:smartphone', backoffice: 'lucide:layout-dashboard', api: 'lucide:braces' },
}

// "now" is fixed at render time and shipped in the payload, so the hydrated bars match the server's
const now = useState('trace-now', () => Date.now())
const ms = (ym: string) => Date.UTC(Number(ym.slice(0, 4)), Number(ym.slice(5, 7)) - 1)
const start = ms('2023-06')
const end = computed(() => now.value + 40 * 864e5) // a little room past today for the live edge
const pos = (at: number) => ((at - start) / (end.value - start)) * 100
const span = (from: string, to?: string) => {
  const a = pos(ms(from)), b = pos(to ? ms(to) : now.value)
  return { left: `${a}%`, width: `${b - a}%`, end: b }
}
const years = computed(() => {
  const out: { y: number, at: number }[] = []
  for (let y = 2024; Date.UTC(y, 0) < end.value; y++) out.push({ y, at: pos(Date.UTC(y, 0)) })
  return out
})

const month = (ym: string) => new Intl.DateTimeFormat(locale.value, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(ms(ym)))
const period = (r: Role) => `${month(r.from)} – ${r.to ? month(r.to) : t.value.experience.now}`
function length(r: Role) {
  const d = new Date(now.value)
  const to = r.to ? ms(r.to) : Date.UTC(d.getUTCFullYear(), d.getUTCMonth())
  const months = Math.max(1, Math.round((to - ms(r.from)) / (30.44 * 864e5)))
  const unit = (n: number, u: 'year' | 'month') => new Intl.NumberFormat(locale.value, { style: 'unit', unit: u, unitDisplay: 'narrow' }).format(n)
  const y = Math.floor(months / 12), m = months % 12
  return [y && unit(y, 'year'), m && unit(m, 'month')].filter(Boolean).join(' ')
}

const picked = ref<Key>('rd')
const pickedRole = computed(() => {
  for (const c of companies) for (const r of c.roles) if (r.key === picked.value) return { company: c.name, role: r }
  throw new Error(`unknown role ${picked.value}`)
})
const act = (role: Key, key: string) => (t.value.experience.acts[role] as Record<string, string>)[key] ?? ''
</script>

<template>
  <div class="trace">
    <div class="chart" role="group" :aria-label="t.experience.title">
      <div class="axis" aria-hidden="true">
        <span v-for="y in years" :key="y.y" class="axis__tick" :style="{ left: `${y.at}%` }">{{ y.y }}</span>
        <span class="axis__tick axis__tick--now" :style="{ left: `${pos(now)}%` }">{{ t.experience.now }}</span>
      </div>
      <div class="grid" aria-hidden="true">
        <i v-for="y in years" :key="y.y" :style="{ left: `${y.at}%` }" />
        <i class="grid__now" :style="{ left: `${pos(now)}%` }" />
      </div>

      <template v-for="c in companies" :key="c.name">
        <div class="row row--company">
          <span class="row__label"><FolioOrgText :text="c.name" /></span>
          <span class="row__track">
            <span class="bar bar--company" :style="span(c.roles.at(-1)!.from, c.roles[0]!.to)" />
          </span>
        </div>
        <button
          v-for="r in c.roles"
          :key="r.key"
          type="button"
          class="row row--role"
          :class="{ 'is-now': !r.to, 'is-picked': picked === r.key }"
          :aria-pressed="picked === r.key"
          @click="picked = r.key"
        >
          <span class="row__label">
            <b>{{ t.experience.roles[r.key] }}</b>
            <small>{{ period(r) }}</small>
          </span>
          <span class="row__track">
            <span class="bar" :style="span(r.from, r.to)" />
            <span class="bar__len" :class="{ 'is-before': span(r.from, r.to).end > 80 }" :style="span(r.from, r.to).end > 80 ? { right: `${100 - pos(ms(r.from))}%` } : { left: `${span(r.from, r.to).end}%` }">{{ length(r) }}</span>
          </span>
        </button>
      </template>
      <p class="chart__hint">{{ t.experience.hint }}</p>
    </div>

    <div class="detail" aria-live="polite">
      <Transition name="swap" mode="out-in">
        <div :key="picked">
          <h3>{{ t.experience.roles[picked] }}</h3>
          <p class="detail__meta"><FolioOrgText :text="pickedRole.company" /> <span>{{ period(pickedRole.role) }}</span></p>
          <ul>
            <li v-for="(icon, k) in acts[picked]" :key="k">
              <Icon :name="icon" />
              <span>{{ act(picked, k) }}</span>
            </li>
          </ul>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.trace { display: grid; grid-template-columns: minmax(0, 1fr) 340px; gap: clamp(var(--s-6), 5vw, 72px); align-items: start; }

.chart { --label: 250px; position: relative; display: flex; flex-direction: column; }
.axis { position: relative; height: 28px; margin-left: var(--label); }
.axis__tick { position: absolute; top: 0; translate: -50% 0; font-size: var(--fs-sm); font-stretch: 75%; font-weight: 600; color: var(--ink-3); }
.axis__tick--now { color: var(--signal); }
/* year lines and the "now" line run behind every row */
.grid { position: absolute; top: 28px; bottom: 36px; left: var(--label); right: 0; pointer-events: none; }
.grid i { position: absolute; top: 0; bottom: 0; border-left: 1px dashed var(--line); }
.grid .grid__now { border-left: 1px solid color-mix(in srgb, var(--signal) 55%, transparent); }

.row { display: grid; grid-template-columns: var(--label) minmax(0, 1fr); align-items: center; min-height: 52px; }
.row--company { min-height: 44px; margin-top: var(--s-4); }
.grid + .row--company { margin-top: 0; }
.row--company .row__label { padding-left: 0; font-size: var(--fs-lg); font-weight: 800; font-stretch: 125%; }
.row--role {
  position: relative;
  width: 100%;
  padding: 0;
  border: 0;
  border-radius: 10px;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: background-color var(--dur) var(--ease);
}
.row--role:hover { background: var(--wash); }
.row__label { display: flex; flex-direction: column; min-width: 0; padding: 6px 16px 6px 20px; }
.row__label b { font-size: var(--fs-md); font-weight: 600; color: var(--ink-2); transition: color var(--dur) var(--ease); }
.row__label small { font-size: var(--fs-sm); font-stretch: 75%; color: var(--ink-3); }
.row--role:hover b, .row--role.is-picked b { color: var(--ink); }
.row__track { position: relative; align-self: stretch; }

.bar { position: absolute; top: 50%; height: 14px; translate: 0 -50%; border-radius: 4px; background: var(--ink-3); transform-origin: left; transition: background-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease); }
.bar--company { height: 4px; border-radius: 2px; background: var(--line-strong); }
.row--role:hover .bar { background: var(--ink-2); }
.row--role.is-picked .bar { background: var(--ink); box-shadow: 0 0 0 3px var(--canvas), 0 0 0 4px var(--ink); }
.row--role.is-now .bar { background: var(--signal); }
.row--role.is-now.is-picked .bar { box-shadow: 0 0 0 3px var(--canvas), 0 0 0 4px var(--signal); }
/* the open span's live edge */
.is-now .bar::after { content: ''; position: absolute; right: -4px; top: 50%; width: 8px; height: 8px; margin-top: -4px; border-radius: 50%; background: var(--signal); animation: ping 2s var(--ease) infinite; }
@keyframes ping {
  from { box-shadow: 0 0 0 0 var(--signal); }
  to { box-shadow: 0 0 0 12px transparent; }
}
.bar__len { position: absolute; top: 50%; translate: 0 -50%; padding: 0 10px; font-size: var(--fs-sm); font-stretch: 75%; font-weight: 600; color: var(--ink-3); white-space: nowrap; }
.chart__hint { margin: var(--s-4) 0 0 var(--label); font-size: var(--fs-sm); color: var(--ink-3); }

/* the spans grow in with the scroll: see the page's scroll scope */
.detail { position: sticky; top: 96px; padding-left: var(--s-5); border-left: 2px solid var(--signal); }
.detail h3 { font-size: var(--fs-xl); }
.detail__meta { display: flex; flex-wrap: wrap; gap: 4px 12px; margin-top: 6px; color: var(--ink-3); font-size: var(--fs-sm); }
.detail ul { list-style: none; display: flex; flex-direction: column; gap: var(--s-4); margin: var(--s-5) 0 0; padding: 0; }
.detail li { display: grid; grid-template-columns: 20px 1fr; gap: 12px; color: var(--ink-2); }
.detail li .iconify { margin-top: 3px; font-size: 18px; color: var(--signal); }
.swap-enter-active, .swap-leave-active { transition: opacity 0.25s var(--ease), translate 0.25s var(--ease); }
.swap-enter-from { opacity: 0; translate: 0 8px; }
.swap-leave-to { opacity: 0; translate: 0 -4px; }

@media (max-width: 1000px) {
  .trace { grid-template-columns: minmax(0, 1fr); }
  .detail { position: static; }
}
/* narrow: each label sits over its own full-width track */
@media (max-width: 640px) {
  .chart { --label: 0px; }
  .row { grid-template-columns: minmax(0, 1fr); }
  .row--role { padding-bottom: 12px; }
  .row__label { padding: 8px 12px 4px; }
  .row__track { min-height: 16px; margin: 0 12px; }
  .row--company .row__track { display: none; }
  .grid { display: none; }
  .axis { margin: 0 12px; }
  .chart__hint { margin-left: 0; }
}
</style>
