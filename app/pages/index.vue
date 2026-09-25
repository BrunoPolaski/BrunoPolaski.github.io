<script setup lang="ts">
import type { Messages } from '~/i18n/pt-BR'

definePageMeta({ layout: false })
const { locale, t, setLocale, syncFromBrowser } = useLocale()
onMounted(syncFromBrowser) // no-op when a server already picked; the fix-up for the static build
useSeoMeta({ title: () => t.value.meta.title, description: () => t.value.meta.description })
useHead({ htmlAttrs: { lang: locale }, bodyAttrs: { style: 'background:#050507' } })
function onLanguage(e: Event) {
  const v = (e.target as HTMLSelectElement).value
  if (isLocale(v)) setLocale(v)
}

const me = {
  name: 'Bruno Polaski',
  email: 'polaskibruno03@gmail.com',
  github: 'https://github.com/BrunoPolaski',
  linkedin: 'https://www.linkedin.com/in/bruno-polaski',
}
// brand colours; MCP has none, so it stays neutral
const skills = [
  { name: 'Go', color: '#00ADD8' },
  { name: 'TypeScript', color: '#3178C6' },
  { name: 'NestJS', color: '#E0234E' },
  { name: 'Python', color: '#3776AB' },
  { name: 'C#', color: '#512BD4' },
  { name: 'AWS', color: '#FF9900' },
  { name: 'MySQL', color: '#4479A1' },
  { name: 'Docker', color: '#2496ED' },
  { name: 'MCP', color: '#C4C4C8' },
]
// same request as the hero sphere (useFetch dedupes by URL), so the repo count is live too
const { data: langs } = await useFetch<Record<string, number>>('/api/github-languages')
const repos = computed(() => Object.values(langs.value ?? {}).reduce((sum, n) => sum + n, 0))
const stats = computed(() => [
  { value: '3+', label: t.value.about.years },
  { value: t.value.about.degreeValue, label: t.value.about.degree },
  { value: repos.value ? String(repos.value) : '30+', label: t.value.about.repos },
])

type Role = { key: keyof Messages['experience']['roles'], from: string, to?: string } // months as YYYY-MM
const experience: { company: string, roles: Role[] }[] = [
  { company: 'BairesDev', roles: [{ key: 'rd', from: '2026-07' }] },
  { company: 'Adaga Digital', roles: [
    { key: 'mid', from: '2024-05', to: '2026-07' },
    { key: 'junior', from: '2024-02', to: '2024-05' },
    { key: 'intern', from: '2023-08', to: '2024-02' },
  ] },
]
// month names come from Intl, so no locale file has to spell them
const month = (ym: string) => new Intl.DateTimeFormat(locale.value, { month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${ym}-01T00:00:00Z`))
const period = (r: Role) => `${month(r.from)} – ${r.to ? month(r.to) : t.value.experience.now}`

// Section tracker: the rail and the top bar both mark the section under the middle of the screen.
const sections: { id: keyof Messages['nav']['sections'], nav?: boolean }[] = [
  { id: 'top' },
  { id: 'about', nav: true },
  { id: 'experience', nav: true },
  { id: 'projects', nav: true },
  { id: 'process' },
  { id: 'contact', nav: true },
]
const active = ref('top')
let spy: IntersectionObserver | undefined
onMounted(() => {
  spy = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) active.value = e.target.id
  }, { rootMargin: '-45% 0px -54% 0px' }) // a thin band across the middle of the viewport
  for (const s of sections) spy.observe(document.getElementById(s.id)!)
})
onBeforeUnmount(() => spy?.disconnect())

/** Cursor spotlight: publish the pointer position as --mx/--my on the hovered element; CSS draws the glow. */
function spot(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement
  const b = el.getBoundingClientRect()
  el.style.setProperty('--mx', `${e.clientX - b.left}px`)
  el.style.setProperty('--my', `${e.clientY - b.top}px`)
}

// The background halo leans toward the cursor (-1..1 on each axis).
const halo = ref<HTMLElement>()
function lean(e: PointerEvent) {
  halo.value?.style.setProperty('--px', (e.clientX / innerWidth * 2 - 1).toFixed(3))
  halo.value?.style.setProperty('--py', (e.clientY / innerHeight * 2 - 1).toFixed(3))
}
onMounted(() => addEventListener('pointermove', lean, { passive: true }))
onBeforeUnmount(() => removeEventListener('pointermove', lean))
</script>

<template>
  <div class="folio">
    <div ref="halo" class="halo" aria-hidden="true">
      <div class="halo__lens"><FxHorizonGlow :level="0.34" /></div>
    </div>

    <header class="bar acrylic">
      <a href="#top" class="bar__brand">BP</a>
      <nav :aria-label="t.nav.label">
        <a v-for="s in sections.filter(x => x.nav)" :key="s.id" :href="`#${s.id}`" :aria-current="active === s.id ? 'location' : undefined">{{ t.nav.sections[s.id] }}</a>
      </nav>
      <select class="bar__lang" :value="locale" :aria-label="t.nav.language" @change="onLanguage">
        <option v-for="l in localeCodes" :key="l" :value="l">{{ l.slice(0, 2).toUpperCase() }}</option>
      </select>
      <UiButton variant="solid" size="sm" :to="`mailto:${me.email}`">{{ t.nav.getInTouch }}</UiButton>
    </header>

    <nav class="rail" :aria-label="t.nav.progress">
      <span class="rail__track" aria-hidden="true"><span class="rail__fill" /></span>
      <a
        v-for="(s, i) in sections"
        :key="s.id"
        :href="`#${s.id}`"
        :aria-label="t.nav.sections[s.id]"
        :aria-current="active === s.id ? 'location' : undefined"
        :data-tip="t.nav.sections[s.id]"
      >0{{ i + 1 }}</a>
    </nav>

    <section id="top" class="hero">
      <h1 class="hero__name">
        <span class="sr-only">{{ me.name }}</span>
        <FolioWordmark :text="me.name" />
      </h1>
      <FolioLanguages class="hero__visual" />
      <a href="#about" class="cue" :aria-label="t.hero.scrollLabel"><span class="cue__mouse" aria-hidden="true" />{{ t.hero.scroll }}</a>
      <div class="hero__copy">
        <p><FolioOrgText :text="t.hero.intro" /></p>
        <div class="row">
          <UiButton variant="solid" size="lg" :to="`mailto:${me.email}`">{{ t.hero.hire }}</UiButton>
          <UiButton variant="outline" size="lg" to="#projects">{{ t.hero.seeProjects }}</UiButton>
        </div>
      </div>
    </section>

    <section id="about" class="sec">
      <FolioReveal :text="t.about.title" />
      <div class="about">
        <div class="panel spot about__intro" @pointermove="spot">
          <p>{{ t.about.text }}</p>
          <ul class="chips">
            <li v-for="s in skills" :key="s.name" :style="{ '--c': s.color }">{{ s.name }}</li>
          </ul>
        </div>
        <div v-for="(s, i) in stats" :key="i" class="panel spot stat" @pointermove="spot">
          <strong>{{ s.value }}</strong>
          <span><FolioOrgText :text="s.label" /></span>
        </div>
      </div>
    </section>

    <section id="experience" class="sec">
      <FolioReveal :text="t.experience.title" />
      <div class="xp">
        <article v-for="c in experience" :key="c.company" class="panel spot" @pointermove="spot">
          <h3><FolioOrgText :text="c.company" /></h3>
          <ol class="xp__roles">
            <li v-for="r in c.roles" :key="r.key" :class="{ 'is-now': !r.to }">
              <b>{{ t.experience.roles[r.key] }}</b>
              <span class="muted">{{ period(r) }}</span>
            </li>
          </ol>
        </article>
      </div>
    </section>

    <section id="projects" class="sec">
      <FolioReveal :text="t.projects.title" />
      <p class="muted">{{ t.projects.lead }}</p>
      <FolioPatterns />
      <UiButton variant="outline" :to="me.github" icon-right="lucide:arrow-up-right" class="sec__more">{{ t.projects.more }}</UiButton>
    </section>

    <section id="process" class="sec">
      <FolioReveal :text="t.process.title" />
      <p class="muted">{{ t.process.lead }}</p>
      <FolioSaga />
    </section>

    <section id="contact" class="sec contact spot" @pointermove="spot">
      <FolioReveal :text="t.contact.title" />
      <p class="muted">{{ t.contact.lead }}</p>
      <UiButton variant="solid" size="xl" :to="`mailto:${me.email}`" icon-right="lucide:arrow-up-right">{{ me.email }}</UiButton>
    </section>

    <footer class="foot">
      <div class="foot__links">
        <a :href="me.github"><Icon name="lucide:github" />GitHub</a>
        <a :href="me.linkedin"><Icon name="lucide:linkedin" />LinkedIn</a>
        <a href="#top"><Icon name="lucide:arrow-up" />{{ t.footer.top }}</a>
      </div>
      <FolioWordmark :text="me.name" class="foot__mark" />
    </footer>
  </div>
</template>

<style scoped>
/* always dark: redefine the Halo roles once, every nested component follows */
.folio {
  color-scheme: dark;
  --canvas: #050507;
  --surface: #0d0d12;
  --ink: #fff;
  --ink-2: #c4c4c8;
  --ink-3: #8a8a90;
  --on-ink: #000;
  --line: #22222a;
  --line-strong: #3a3a42;
  --wash: rgb(255 255 255 / 0.08);
  --signal: #7a7aff;
  --signal-soft: rgb(122 122 255 / 0.22);
  --acrylic-tint: rgb(13 13 18 / 0.6);
  --acrylic-edge: rgb(255 255 255 / 0.08);
  isolation: isolate; /* keeps the z-index:-1 halo above this background */
  background: var(--canvas);
  color: var(--ink);
  overflow-x: clip;
}

/* anchor jumps (rail, top bar, buttons) glide; :has() keeps it to this page after client-side navigation */
@media (prefers-reduced-motion: no-preference) {
  :global(html:has(.folio)) { scroll-behavior: smooth; }
}

/*
 * Background halo. The shader renders into a canvas a quarter of the viewport and is
 * blown up 4x: it's blurred anyway, so this costs 1/16 of the pixels.
 */
.halo { position: fixed; inset: 0; z-index: -1; overflow: hidden; pointer-events: none; opacity: 0.6; }
.halo__lens { position: absolute; left: -10%; top: -10%; width: 30%; height: 30%; transform: scale(4); transform-origin: 0 0; }
.halo__lens > .horizon {
  filter: blur(14px) saturate(0.25);
  transform: translate(calc(var(--px, 0) * -10px), calc(var(--py, 0) * -6px));
  transition: transform 1.6s var(--ease);
}
@media (prefers-reduced-motion: no-preference) {
  .halo__lens > .horizon { animation: breathe 16s ease-in-out infinite alternate; }
  @supports (animation-timeline: scroll()) {
    /* the horizon rises as you scroll down the page */
    .halo__lens { animation: rise linear both; animation-timeline: scroll(root); }
  }
}
@keyframes breathe {
  from { scale: 1; rotate: -3deg; }
  to { scale: 1.15; rotate: 4deg; }
}
@keyframes rise { to { translate: 0 -38vh; } }

/* anything with .spot gets a glow that follows the cursor (see spot()) */
.spot { position: relative; isolation: isolate; }
.spot::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), var(--signal-soft), transparent 70%);
  opacity: 0;
  transition: opacity 0.4s var(--ease);
}
.spot:hover::after { opacity: 1; }

.bar {
  position: fixed;
  top: var(--s-3);
  left: 50%;
  translate: -50% 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: var(--s-4);
  width: min(760px, calc(100% - 2 * var(--s-3)));
  padding: 6px 6px 6px var(--s-4);
  border-radius: 16px;
}
.bar__brand { font-weight: 800; font-stretch: 125%; text-decoration: none; }
.bar nav { flex: 1; display: flex; justify-content: center; gap: var(--s-4); overflow-x: auto; scrollbar-width: none; }
.bar nav a { font-size: var(--fs-sm); font-weight: 600; color: var(--ink-2); text-decoration: none; }
.bar nav a:hover, .bar nav a[aria-current] { color: var(--ink); }
.bar__lang {
  height: 30px;
  padding: 0 6px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-control);
  background: transparent;
  color: var(--ink-2);
  font-size: var(--fs-xs);
  font-weight: 700;
  cursor: pointer;
}
.bar__lang:hover { color: var(--ink); border-color: var(--ink-3); }
.bar__lang option { background: var(--surface); color: var(--ink); }
.bar nav a[aria-current] { text-decoration: underline 2px var(--signal); text-underline-offset: 6px; }

.hero {
  display: grid;
  grid-template: 'name name' auto 'copy visual' minmax(0, 1fr) / 1fr auto;
  gap: var(--s-5);
  height: 100svh;
  min-height: 640px;
  position: relative;
  padding: 96px clamp(var(--s-4), 5vw, var(--s-8)) 112px; /* bottom: room for the scroll cue */
  overflow: hidden;
}
.hero__name {
  grid-area: name;
  position: relative;
  font-size: clamp(3.2rem, 10vw, 9.5rem);
  line-height: 0.9;
  letter-spacing: -0.04em;
  --rest-wdth: 100;
  --rest-wght: 700;
  --rest-o: 1;
}
.hero__name .mark { justify-content: center; }
.hero__visual { grid-area: visual; align-self: end; }
.hero__copy { grid-area: copy; position: relative; display: flex; flex-direction: column; gap: var(--s-5); align-self: end; }
.hero__copy p { color: var(--ink-2); font-size: var(--fs-lg); max-width: 44ch; }

/* scroll cue: a mouse whose wheel keeps rolling; fades out over the first 30vh of scroll */
.cue {
  position: absolute;
  left: 50%;
  bottom: var(--s-5);
  translate: -50% 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: var(--ink-3);
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  text-decoration: none;
  transition: color var(--dur) var(--ease);
}
.cue:hover { color: var(--ink); }
.cue__mouse { position: relative; width: 22px; height: 34px; border: 2px solid currentColor; border-radius: 12px; }
.cue__mouse::before { content: ''; position: absolute; left: 50%; top: 6px; width: 4px; height: 7px; margin-left: -2px; border-radius: 2px; background: var(--ink); }
@media (prefers-reduced-motion: no-preference) {
  .cue__mouse::before { animation: wheel 1.8s var(--ease) infinite; }
}
@keyframes wheel {
  0% { opacity: 0; translate: 0 0; }
  25% { opacity: 1; }
  80%, 100% { opacity: 0; translate: 0 12px; }
}
@supports (animation-timeline: scroll()) {
  .cue { animation: cue-out linear both; animation-timeline: scroll(root); animation-range: 0 30vh; }
}
@keyframes cue-out { to { opacity: 0; visibility: hidden; } }

/* page progress: one stop per section, the current one lit, the track filling as you scroll */
.rail {
  position: fixed;
  left: var(--s-3);
  top: 50%;
  translate: 0 -50%;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px;
  border-radius: var(--r-pill);
  background: var(--acrylic-tint);
  border: 1px solid var(--line);
}
.rail__track { position: absolute; left: 50%; top: 19px; bottom: 19px; width: 2px; margin-left: -1px; background: var(--line); }
.rail__fill { position: absolute; inset: 0; background: var(--signal); transform-origin: top; scale: 1 0; }
@supports (animation-timeline: scroll()) {
  .rail__fill { animation: fill linear both; animation-timeline: scroll(root); }
}
@keyframes fill { to { scale: 1 1; } }
.rail a {
  position: relative;
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--surface);
  font-size: 11px;
  font-weight: 700;
  color: var(--ink-3);
  text-decoration: none;
  transition: background var(--dur) var(--ease), color var(--dur) var(--ease);
}
.rail a:hover { color: var(--ink); }
.rail a[aria-current] { background: var(--signal); color: #fff; }
.rail a::after {
  content: attr(data-tip);
  position: absolute;
  left: calc(100% + 10px);
  top: 50%;
  translate: -6px -50%;
  padding: 3px 10px;
  border-radius: var(--r-pill);
  background: var(--ink);
  color: var(--on-ink);
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity var(--dur) var(--ease), translate var(--dur) var(--ease);
}
.rail a:hover::after, .rail a:focus-visible::after { opacity: 1; translate: 0 -50%; }
/* only where the page margin is wide enough that the rail never covers content */
@media (max-width: 1359px) {
  .rail { display: none; }
}

.sec { display: flex; flex-direction: column; gap: var(--s-6); width: min(1200px, 100% - 2 * var(--s-4)); margin: 0 auto; padding: clamp(var(--s-7), 10vw, 140px) 0 0; }
.sec h2 { font-size: clamp(2.2rem, 6vw, 4.5rem); letter-spacing: -0.03em; }
.sec > .muted { margin-top: calc(-1 * var(--s-4)); font-size: var(--fs-lg); }
.sec__more { align-self: flex-start; }

.panel { border: 1px solid var(--line); border-radius: var(--r-card); background: rgb(14 14 20 / 0.72); padding: var(--s-5); }
.about { display: grid; grid-template-columns: 2fr 1fr; gap: var(--s-4); }
.about__intro { grid-row: span 3; display: flex; flex-direction: column; justify-content: space-between; gap: var(--s-6); }
.about__intro p { font-size: clamp(1.2rem, 1.9vw, 1.6rem); line-height: 1.4; }
.chips { list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; gap: var(--s-2); }
.chips li {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 5px 12px 5px 10px;
  border-radius: var(--r-pill);
  border: 1px solid color-mix(in srgb, var(--c) 50%, transparent);
  background: color-mix(in srgb, var(--c) 12%, transparent);
  font-size: var(--fs-sm);
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}
/* lifted toward white so the darker brands (Python, C#) still read on the dark panel */
.chips li::before { content: ''; width: 8px; height: 8px; border-radius: 50%; background: color-mix(in oklab, var(--c) 75%, white); box-shadow: 0 0 8px var(--c); }
.chips li:hover { border-color: var(--c); box-shadow: 0 0 20px -6px var(--c); }
.stat { display: flex; flex-direction: column; justify-content: flex-end; gap: 4px; min-height: 120px; }
.stat strong { font-size: clamp(2rem, 4vw, 3rem); font-stretch: 125%; line-height: 1; }
.stat span { color: var(--ink-3); font-size: var(--fs-sm); }

.xp { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--s-4); align-items: start; }
.xp h3 { font-size: clamp(1.5rem, 6.5vw, var(--fs-2xl)); margin-bottom: var(--s-5); }
.xp__roles { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: var(--s-5); }
.xp__roles li { position: relative; display: flex; flex-direction: column; padding-left: 26px; }
/* timeline dot, plus a line up to the previous (newer) role */
.xp__roles li::before { content: ''; position: absolute; left: 0; top: 6px; width: 11px; height: 11px; border-radius: 50%; border: 2px solid var(--line-strong); background: var(--canvas); }
.xp__roles li + li::after { content: ''; position: absolute; left: 5px; bottom: calc(100% - 4px); height: calc(var(--s-5) + 4px); border-left: 1px solid var(--line-strong); }
.xp__roles li.is-now::before { border-color: var(--signal); background: var(--signal); animation: ping 2s var(--ease) infinite; }
@keyframes ping {
  from { box-shadow: 0 0 0 0 var(--signal); }
  to { box-shadow: 0 0 0 10px transparent; }
}


.contact { align-items: flex-start; margin-top: clamp(var(--s-7), 10vw, 140px); padding: clamp(var(--s-6), 6vw, var(--s-8)); border-radius: var(--r-shell); border: 1px solid var(--line); background: rgb(14 14 20 / 0.6); }

.foot { margin-top: clamp(var(--s-7), 10vw, 140px); padding: 0 var(--s-4) var(--s-4); border-top: 1px solid var(--line); background: rgb(5 5 7 / 0.6); }
.foot__links { display: flex; justify-content: center; gap: var(--s-5); padding: var(--s-5) 0; font-size: var(--fs-sm); }
.foot__links a { display: inline-flex; align-items: center; gap: 6px; color: var(--ink-2); text-decoration: none; }
.foot__links .iconify { font-size: 1.15em; }
.foot__links a:hover { color: var(--ink); }
.foot__mark { justify-content: center; font-size: clamp(3rem, 12vw, 12rem); line-height: 1; letter-spacing: -0.03em; overflow: hidden; }

@media (max-width: 900px) {
  .about { grid-template-columns: repeat(3, 1fr); }
  .about__intro { grid-column: 1 / -1; grid-row: auto; }
  .xp { grid-template-columns: minmax(0, 1fr); }
}
@media (max-width: 720px) {
  .panel { padding: var(--s-4); }
  .contact { padding: var(--s-6) var(--s-5); }
  .contact > .btn { max-width: 100%; font-size: var(--fs-md); } /* the email is wider than the panel at xl */
  .cue { display: none; } /* the hero outgrows the screen here; content already runs past the fold */
  .hero { height: auto; min-height: 100svh; padding-bottom: var(--s-7); grid-template: 'name' auto 'visual' auto 'copy' auto / minmax(0, 1fr); }
  .hero__name .mark { justify-content: start; }
  .bar nav { justify-content: start; gap: var(--s-3); }
  .about { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  /* room for all four links and the language picker: Contact is in the nav, the name is in the hero */
  .bar > .btn, .bar__brand { display: none; }
  .bar { gap: var(--s-2); padding-left: var(--s-3); }
  .bar nav { gap: 10px; }
  .bar nav a { font-size: var(--fs-xs); }
  .bar__lang { appearance: none; padding: 0 6px; border-color: transparent; text-decoration: underline dotted; text-underline-offset: 3px; }
}
</style>
