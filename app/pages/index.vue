<script setup lang="ts">
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import type { Messages } from '~/i18n/pt-BR'

definePageMeta({ layout: false })
const { locale, t, setLocale, syncFromBrowser } = useLocale()
onMounted(syncFromBrowser) // no-op when a server already picked; the fix-up for the static build
useSeoMeta({ title: () => t.value.meta.title, description: () => t.value.meta.description })
// Dark by default (the brand). The toggle saves an explicit pick in the shared theme cookie;
// the static build always renders dark, so the saved pick applies once mounted.
const theme = useTheme()
const light = ref(false)
onMounted(() => { light.value = theme.value === 'light' })
/** The new theme spreads out in a circle from the toggle (a view transition); a plain swap without one. */
function toggleTheme(e: MouseEvent) {
  const flip = async () => {
    light.value = !light.value
    theme.value = light.value ? 'light' : 'dark'
    await nextTick()
  }
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return flip()
  const b = (e.currentTarget as HTMLElement).getBoundingClientRect()
  const x = b.left + b.width / 2, y = b.top + b.height / 2
  const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  const html = document.documentElement
  html.classList.add('is-theming') // only this transition drops the default crossfade
  const vt = document.startViewTransition(flip)
  vt.ready.then(() => html.animate(
    { clipPath: [`circle(0 at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
    { duration: 700, easing: 'cubic-bezier(0.2, 0.7, 0.2, 1)', pseudoElement: '::view-transition-new(root)' },
  ))
  vt.finished.finally(() => html.classList.remove('is-theming'))
}
useHead({ htmlAttrs: { lang: locale }, bodyAttrs: { style: () => `background:${light.value ? '#f4f5f7' : '#0a0b0e'}` } })
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
// "Hire me" opens a WhatsApp chat with a message in the visitor's language, or email without a number
const { whatsapp } = useRuntimeConfig().public
const hire = computed(() => whatsapp ? whatsappUrl(whatsapp, t.value.hero.hireText) : `mailto:${me.email}`)
const stack = ['Go', 'TypeScript', 'NestJS', 'Python', 'C#', 'AWS', 'MySQL', 'Docker', 'MCP']
// live public repo count, from the GitHub API (at build time on the static site)
const { data: langs } = await useFetch<Record<string, number>>('/api/github-languages')
const repos = computed(() => Object.values(langs.value ?? {}).reduce((sum, n) => sum + n, 0))
const facts = computed(() => [
  { value: '3+', label: t.value.about.years },
  { value: t.value.about.degreeValue, label: t.value.about.degree },
  { value: repos.value ? String(repos.value) : '30+', label: t.value.about.repos },
])

// Section tracker: the top bar marks the section under the middle of the screen.
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

// Smooth, eased scrolling (anchor jumps included), stepped by GSAP's ticker so ScrollTrigger
// and Lenis read the same scroll position on the same frame.
let lenis: Lenis | undefined
const step = (time: number) => lenis?.raf(time * 1000)
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  lenis = new Lenis({ anchors: true })
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add(step)
  gsap.ticker.lagSmoothing(0)
})
onBeforeUnmount(() => {
  gsap.ticker.remove(step)
  lenis?.destroy()
})

// the top bar turns solid once the landing is done, so the name docks onto a clear bar
const solid = ref(false)
const onPageScroll = () => { solid.value = scrollY > innerHeight * 0.9 }
onMounted(() => {
  onPageScroll()
  addEventListener('scroll', onPageScroll, { passive: true })
})
onBeforeUnmount(() => removeEventListener('scroll', onPageScroll))

// Scroll-driven motion, scrubbed by the scroll position (it runs backwards on the way up).
// Reduced motion: none of it, and the landing is a plain first screen.
const root = ref<HTMLElement>()
let mm: gsap.MatchMedia | undefined
onMounted(() => {
  mm = gsap.matchMedia(root.value)
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // The landing holds for one screen while About slides up under it: the intro steps aside,
    // and the name shrinks into the top bar, where the brand takes over as the logo.
    const name = root.value!.querySelector<HTMLElement>('.hero__name')!
    const brand = root.value!.querySelector<HTMLElement>('.bar__brand')!
    // measured from layout, not the screen: offsets ignore the transform this very tween applies
    const dock = () => {
      const hero = name.offsetParent as HTMLElement, b = brand.getBoundingClientRect()
      return {
        x: b.left - (hero.getBoundingClientRect().left + name.offsetLeft),
        y: b.top - name.offsetTop, // pinned at the top of the screen, the hero's top is 0
        scale: parseFloat(getComputedStyle(brand).fontSize) / parseFloat(getComputedStyle(name).fontSize),
      }
    }
    gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=100%', pin: true, pinSpacing: false, scrub: 0.6, invalidateOnRefresh: true } })
      // explicit start: at this point the CSS load-in still holds them at opacity 0, which .to() would record
      .fromTo('.hero__span, .hero__foot', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -48, stagger: 0.06, duration: 0.3, ease: 'power1.in' }, 0)
      .to(name, { x: () => dock().x, y: () => dock().y, scale: () => dock().scale, transformOrigin: '0 0', duration: 0.85, ease: 'power3.inOut' }, 0)
      .to(name, { autoAlpha: 0, duration: 0.1 }, 0.85)
      .fromTo(brand, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.1 }, 0.85)
      .to('.aurora', { opacity: 0.5, duration: 1, ease: 'none' }, 0)
    // reading progress along the bottom of the top bar
    gsap.fromTo('.bar__progress', { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.value, start: 'top top', end: 'bottom bottom', scrub: true } })
    // blocks rise into place as they come up the screen
    for (const el of gsap.utils.toArray<HTMLElement>('[data-rise]')) {
      gsap.from(el, { y: 90, autoAlpha: 0, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 70%', scrub: 0.5 } })
    }
    // the trace: every span grows out of its start date, then its length fades in
    gsap.timeline({ scrollTrigger: { trigger: '.chart', start: 'top bottom', end: 'top 45%', scrub: 0.5 } })
      .from('.chart .bar', { scaleX: 0, ease: 'power3.out', duration: 0.7, stagger: 0.09 })
      .from('.chart .bar__len', { opacity: 0, duration: 0.3, stagger: 0.06 }, '-=0.3')
    // contact: the block swells into place and its corners settle
    gsap.from('.contact', { scale: 0.86, borderRadius: 72, ease: 'power2.out', scrollTrigger: { trigger: '.contact', start: 'top bottom', end: 'top 45%', scrub: 0.5 } })
  })
})
onBeforeUnmount(() => mm?.revert())
</script>

<template>
  <div ref="root" :class="['folio', { 'is-light': light }]">
    <FolioAurora :light="light" />

    <header class="bar" :class="{ 'is-solid': solid }">
      <span class="bar__progress" aria-hidden="true" />
      <!-- the logo: the hero's name, docked (the landing flies it here) -->
      <a href="#top" class="bar__brand" :aria-label="me.name"><span v-for="w in me.name.split(' ')" :key="w">{{ w }}</span></a>
      <nav :aria-label="t.nav.label">
        <a v-for="s in sections.filter(x => x.nav)" :key="s.id" :href="`#${s.id}`" :class="`is-${s.id}`" :aria-current="active === s.id ? 'location' : undefined">{{ t.nav.sections[s.id] }}</a>
      </nav>
      <div class="bar__tools">
        <select class="bar__lang" :value="locale" :aria-label="t.nav.language" @change="onLanguage">
          <option v-for="l in localeCodes" :key="l" :value="l">{{ l.slice(0, 2).toUpperCase() }}</option>
        </select>
        <UiButton variant="ghost" size="sm" :icon="light ? 'lucide:moon' : 'lucide:sun'" :label="light ? t.nav.toDark : t.nav.toLight" @click="toggleTheme" />
      </div>
    </header>

    <section id="top" class="hero">
      <h1 class="hero__name">
        <span class="sr-only">{{ me.name }}</span>
        <FolioWordmark :text="me.name" />
      </h1>
      <!-- the career as one open span: it opens up into the trace in Experience -->
      <div class="hero__span" aria-hidden="true">
        <span>2023</span><i /><span>{{ t.experience.now }}</span>
      </div>
      <div class="hero__foot">
        <p class="hero__intro"><FolioOrgText :text="t.hero.intro" /></p>
        <div class="row hero__cta">
          <UiButton variant="solid" size="lg" :to="hire" :icon="whatsapp ? 'lucide:message-circle' : undefined" target="_blank" rel="noopener">{{ t.hero.hire }}</UiButton>
          <UiButton variant="outline" size="lg" to="#projects">{{ t.hero.seeProjects }}</UiButton>
        </div>
      </div>
    </section>

    <section id="about" class="sec">
      <FolioReveal :text="t.about.title" />
      <div class="about">
        <FolioScrub :text="t.about.text" class="about__text" />
        <dl class="facts" data-rise>
          <div v-for="(f, i) in facts" :key="i">
            <dt>{{ f.label }}</dt>
            <dd><FolioCount :value="f.value" /></dd>
          </div>
        </dl>
        <ul class="skills">
          <li v-for="s in stack" :key="s">{{ s }}</li>
        </ul>
      </div>
    </section>

    <section id="experience" class="sec">
      <FolioReveal :text="t.experience.title" />
      <FolioTrace data-rise />
    </section>

    <section id="projects" class="sec">
      <FolioReveal :text="t.projects.title" />
      <p class="sec__lead">{{ t.projects.lead }}</p>
      <FolioPatterns data-rise />
      <UiButton variant="outline" :to="me.github" icon-right="lucide:arrow-up-right" class="sec__more">{{ t.projects.more }}</UiButton>
    </section>

    <section id="process" class="sec">
      <FolioReveal :text="t.process.title" />
      <p class="sec__lead">{{ t.process.lead }}</p>
      <FolioSaga data-rise />
    </section>

    <section id="contact" class="sec">
      <div class="contact">
        <div>
          <FolioReveal :text="t.contact.title" />
          <p class="sec__lead">{{ t.contact.lead }}</p>
        </div>
        <FolioContact :email="me.email" />
      </div>
    </section>

    <footer class="foot">
      <FolioHexagon :email="me.email" :github="me.github" :linkedin="me.linkedin" />
      <a href="#top" class="foot__top"><Icon name="lucide:arrow-up" />{{ t.footer.top }}</a>
    </footer>
  </div>
</template>

<style>
/* the theme toggle's circle reveal replaces the default crossfade */
html.is-theming::view-transition-old(root),
html.is-theming::view-transition-new(root) { animation: none; mix-blend-mode: normal; }
</style>

<style scoped>
/* Dark by default. Redefining the Halo roles here restyles every nested component;
   the contact block always wears the opposite theme. */
.folio, .folio.is-light .contact {
  color-scheme: dark;
  --canvas: #0a0b0e;
  --surface: #121419;
  --surface-sunken: #07080a;
  --card: #121419;
  --panel: #121419;
  --ink: #eeeff3;
  --ink-2: #a6aab6;
  --ink-3: #7c8190;
  --on-ink: #0a0b0e;
  --line: #1f222a;
  --line-strong: #2f333d;
  --wash: rgb(255 255 255 / 0.06);
  --signal: #6e6bff;
  --signal-soft: rgb(110 107 255 / 0.18);
}
.folio.is-light, .folio:not(.is-light) .contact {
  color-scheme: light;
  --canvas: #f4f5f7;
  --surface: #ffffff;
  --surface-sunken: #eceef1;
  --card: #ffffff;
  --panel: #ffffff;
  --ink: #0b0d12;
  --ink-2: #4a4f5c;
  --ink-3: #6b7080;
  --on-ink: #ffffff;
  --line: #dfe2e8;
  --line-strong: #c8ccd5;
  --wash: rgb(0 0 0 / 0.05);
  --signal: #3a3af4;
  --signal-soft: rgb(58 58 244 / 0.12);
}
.folio {
  isolation: isolate; /* keeps the z-index:-1 mesh above this background */
  --gutter: clamp(16px, 4vw, 48px);
  --col: min(1200px, 100% - 2 * var(--gutter));
  background: var(--canvas);
  color: var(--ink);
  overflow-x: clip;
}
/* the Adaga mark is white-on-transparent */
.folio.is-light :deep(img[src$='adaga.svg']) { filter: invert(1); }

/* top bar: transparent over the hero, solid once the page moves */
.bar {
  position: fixed;
  inset: 0 0 auto;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: var(--s-6);
  height: 64px;
  padding: 0 var(--gutter);
  border-bottom: 1px solid transparent;
  transition: background-color 0.4s var(--ease), border-color 0.4s var(--ease);
}
.bar.is-solid {
  border-bottom-color: var(--line);
  background: color-mix(in srgb, var(--canvas) 78%, transparent);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  backdrop-filter: blur(16px) saturate(160%);
}
.bar__progress { position: absolute; inset: auto 0 -1px; height: 2px; background: linear-gradient(90deg, transparent, var(--signal)); transform-origin: left; transform: scaleX(0); }
.bar__brand { display: flex; flex-direction: column; margin-left: -0.04em; font-size: 17px; font-weight: 900; font-stretch: 125%; line-height: 0.82; letter-spacing: -0.035em; text-decoration: none; }
@media (prefers-reduced-motion: no-preference) {
  .bar__brand { visibility: hidden; } /* the landing hands the name over; until then the hero shows it */
}
.bar nav { display: flex; gap: var(--s-5); margin-left: auto; }
.bar nav a { position: relative; font-size: var(--fs-sm); font-weight: 600; color: var(--ink-2); text-decoration: none; transition: color var(--dur) var(--ease); }
.bar nav a:hover, .bar nav a[aria-current] { color: var(--ink); }
.bar nav a::after { content: ''; position: absolute; inset: auto 0 -6px; height: 2px; background: var(--signal); scale: 0 1; transform-origin: left; transition: scale 0.35s var(--ease); }
.bar nav a[aria-current]::after { scale: 1 1; }
.bar__tools { display: flex; align-items: center; gap: 4px; }
.bar__lang {
  appearance: none;
  height: 30px;
  padding: 0 10px;
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

/* hero: the name fills the column, set in the widest cut; everything sits on the bottom edge */
.hero {
  position: relative; /* the name's offsets, for docking, are measured from here */
  container-type: inline-size;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: clamp(20px, 3vw, 36px);
  width: var(--col);
  min-height: max(100svh, 620px);
  margin: 0 auto;
  padding: 112px 0 clamp(32px, 7vh, 72px);
}
.hero__name { margin-left: -0.04em; font-size: 22.4cqi; line-height: 0.82; letter-spacing: -0.035em; --hot-wdth: 62; --hot-wght: 500; }
.hero__name :deep(.mark) { flex-direction: column; }
.hero__span { display: flex; align-items: center; gap: 14px; font-size: var(--fs-sm); font-weight: 600; font-stretch: 75%; color: var(--ink-3); }
.hero__span span:last-child { color: var(--signal); }
.hero__span i { position: relative; flex: 1; height: 2px; border-radius: 1px; background: linear-gradient(90deg, var(--line-strong), var(--signal)); }
.hero__span i::after { content: ''; position: absolute; right: -4px; top: -3px; width: 8px; height: 8px; border-radius: 50%; background: var(--signal); animation: ping 2s var(--ease) infinite; }
/* a request running down the career line, over and over */
.hero__span i::before { content: ''; position: absolute; top: -2px; left: -120px; width: 120px; height: 6px; border-radius: 3px; background: linear-gradient(90deg, transparent, var(--signal) 85%, #fff); filter: blur(1px); opacity: 0; }
.hero__foot { display: flex; flex-wrap: wrap; align-items: flex-end; justify-content: space-between; gap: var(--s-5) var(--s-7); }
.hero__intro { max-width: 46ch; font-size: clamp(1.05rem, 1.4vw, 1.2rem); color: var(--ink-2); }
.hero__intro :deep(.org) { color: var(--ink); }
@media (prefers-reduced-motion: no-preference) {
  /* load: the letters widen in (Wordmark), then the span draws to "now" and the rest rises in */
  .hero__span i { animation: draw 1.4s var(--ease) 0.7s backwards; }
  .hero__span i::before { animation: run 3.6s cubic-bezier(0.6, 0, 0.3, 1) 2.2s infinite; }
  .hero__span, .hero__foot { animation: rise 0.9s var(--ease) 0.8s backwards; }
}
@keyframes draw { from { clip-path: inset(-6px 100% -6px 0); } to { clip-path: inset(-6px -12px -6px 0); } }
@keyframes rise { from { opacity: 0; translate: 0 12px; } }
@keyframes run {
  0% { left: -120px; opacity: 0; }
  10% { opacity: 1; }
  55%, 100% { left: 100%; opacity: 0; }
}
@keyframes ping {
  from { box-shadow: 0 0 0 0 var(--signal); }
  to { box-shadow: 0 0 0 12px transparent; }
}

.sec { display: flex; flex-direction: column; gap: var(--s-6); width: var(--col); margin: 0 auto; padding-top: clamp(96px, 13vw, 176px); }
.sec h2 { font-size: clamp(2rem, 4.6vw, 3.4rem); font-weight: 900; line-height: 1; letter-spacing: -0.025em; }
.sec__lead { margin-top: calc(-1 * var(--s-3)); max-width: 56ch; font-size: var(--fs-lg); color: var(--ink-2); }
.sec__more { align-self: flex-start; }

.about { display: grid; grid-template-columns: minmax(0, 8fr) minmax(0, 4fr); grid-template-rows: auto 1fr; gap: var(--s-6) clamp(32px, 6vw, 96px); align-items: start; } /* 1fr: the facts' extra height goes under the stack list, not between it and the text */
.about__text { max-width: none; font-size: clamp(1.3rem, 2.3vw, 1.95rem); line-height: 1.32; letter-spacing: -0.01em; text-wrap: pretty; }
.facts { grid-row: span 2; margin: 0; } /* beside the paragraph and the stack list under it */
.facts div { display: flex; flex-direction: column-reverse; gap: 4px; padding: var(--s-4) 0; border-top: 1px solid var(--line); }
.facts div:last-child { border-bottom: 1px solid var(--line); }
.facts dd { margin: 0; font-size: clamp(2rem, 3.4vw, 2.75rem); font-weight: 800; font-stretch: 62%; line-height: 1; }
.facts dt { font-size: var(--fs-sm); color: var(--ink-3); }
.skills { display: flex; flex-wrap: wrap; gap: 4px 22px; margin: 0; padding: 0; list-style: none; font-weight: 600; font-stretch: 75%; color: var(--ink-3); }

/* contact: the one inverted block, heading beside the form */
.contact { transform-origin: 50% 100%; display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: var(--s-6) clamp(32px, 6vw, 96px); padding: clamp(28px, 6vw, 72px); border-radius: 24px; background: var(--canvas); color: var(--ink); }
.contact h2 { font-size: clamp(2.4rem, 5.4vw, 4.2rem); }
.contact .sec__lead { margin-top: var(--s-4); }

.foot { margin-top: clamp(56px, 7vw, 96px); padding: var(--s-7) var(--s-4) var(--s-6); border-top: 1px solid var(--line); }
.foot__top { display: flex; width: fit-content; margin: var(--s-6) auto 0; align-items: center; gap: 6px; font-size: var(--fs-sm); color: var(--ink-2); text-decoration: none; }
.foot__top:hover { color: var(--ink); }

@media (max-width: 900px) {
  .about, .contact { grid-template-columns: minmax(0, 1fr); }
  .about { grid-template-rows: none; }
  .facts { grid-row: auto; }
}
@media (max-width: 640px) {
  .bar { gap: var(--s-4); }
  .bar nav a:not(.is-contact) { display: none; } /* one page, one scroll: the brand and Contact are enough */
  .hero { min-height: 88svh; }
  .hero__cta { width: 100%; }
  .hero__cta > * { flex: 1; }
}
</style>
