<script setup lang="ts">
const theme = useTheme()
const order = ['system', 'light', 'dark'] as const
const themeIcon = computed(() => ({ system: 'lucide:sun-moon', light: 'lucide:sun', dark: 'lucide:moon' })[theme.value])
const cycleTheme = () => { theme.value = order[(order.indexOf(theme.value) + 1) % order.length]! }

const nav = [
  { to: '/halo', label: 'Overview' },
  { to: '/halo/foundations', label: 'Foundations' },
  { to: '/halo/buttons', label: 'Buttons' },
  { to: '/halo/forms', label: 'Forms' },
  { to: '/halo/data', label: 'Data' },
  { to: '/halo/charts', label: 'Charts' },
  { to: '/halo/feedback', label: 'Feedback' },
  { to: '/halo/motion', label: 'Motion' },
  { to: '/', label: 'Portfolio' },
]
</script>

<template>
  <div>
    <header class="top acrylic">
      <NuxtLink to="/halo" class="brand">
        <FxPixelLoader label="Halo" />
        Halo
      </NuxtLink>
      <nav aria-label="Sections">
        <NuxtLink v-for="n in nav" :key="n.to" :to="n.to" class="top__link">{{ n.label }}</NuxtLink>
      </nav>
      <UiButton variant="ghost" size="sm" :icon="themeIcon" :label="`Theme: ${theme}. Switch theme`" @click="cycleTheme" />
    </header>
    <main class="main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.top {
  position: fixed;
  top: var(--s-3);
  left: 50%;
  translate: -50% 0;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: var(--s-4);
  width: calc(100% - 2 * var(--s-3));
  padding: 6px 6px 6px var(--s-4);
  border-radius: 16px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: var(--fs-lg);
  font-weight: 800;
  font-stretch: 125%;
  text-decoration: none;
}
nav {
  flex: 1;
  display: flex;
  justify-content: safe center;
  gap: 2px;
  overflow-x: auto;
  scrollbar-width: none;
}
.top__link {
  flex: none;
  padding: 7px 14px;
  border-radius: 10px;
  font-size: var(--fs-sm);
  font-weight: 600;
  color: var(--ink-2);
  text-decoration: none;
}
.top__link:hover { background: var(--wash); color: var(--ink); }
.top__link.router-link-exact-active { background: var(--ink); color: var(--on-ink); }
.main {
  width: calc(100% - 2 * var(--s-3));
  margin: 76px auto var(--s-3);
  padding: clamp(var(--s-4), 4vw, var(--s-7));
  border-radius: var(--r-shell);
  background: var(--surface);
  border: 1px solid var(--line);
}

@media (max-width: 640px) {
  .top { gap: var(--s-2); padding-left: var(--s-3); }
  .brand { font-size: var(--fs-md); }
  .top__link { padding: 7px 10px; }
}
</style>
