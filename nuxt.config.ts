export default defineNuxtConfig({
  compatibilityDate: '2026-09-01',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/fonts', '@nuxt/icon'],
  css: ['~/assets/css/tokens.css', '~/assets/css/base.css'],
  app: {
    head: {
      title: 'Halo UI',
      htmlAttrs: { lang: 'en' },
      meta: [{ name: 'description', content: 'Halo, a monochrome design system for Nuxt.' }],
      link: [{ rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    },
  },
  fonts: {
    // width axis powers the wide (125%) headings
    google: { experimental: { variableAxis: { Archivo: { wdth: [['62', '125']] } } } },
    families: [{ name: 'Archivo', provider: 'google', weights: ['400 800'], styles: ['normal'] }],
  },
  icon: {
    serverBundle: { collections: ['lucide'] },
  },
  // Static build for GitHub Pages: the portfolio at /, the Halo docs under /halo (crawled from there).
  nitro: { prerender: { routes: ['/', '/halo'] } },
  runtimeConfig: {
    githubToken: '', // NUXT_GITHUB_TOKEN: optional, lifts GitHub's 60 requests/hour limit at build time
  },
  typescript: { strict: true },
})
