<script setup lang="ts">
/** Renders text, turning every known company name into a link with its mini logo. */
const props = defineProps<{ text: string }>()

const orgs = [
  { key: 'bairesdev', url: 'https://www.bairesdev.com/', logo: '/logos/bairesdev.png' },
  { key: 'adaga', url: 'https://adaga.cc/', logo: '/logos/adaga.svg' },
]
// capturing group, so split() keeps the names: odd indexes are matches
const names = /(bairesdev|adaga(?: digital)?)/i

const parts = computed(() => props.text.split(names).map((s, i) => ({
  s,
  org: i % 2 ? orgs.find(o => s.toLowerCase().startsWith(o.key)) : undefined,
})))
</script>

<template>
  <template v-for="(p, i) in parts" :key="i">
    <a v-if="p.org" :href="p.org.url" class="org" target="_blank" rel="noopener"><img :src="p.org.logo" alt="" class="org__logo"><span>{{ p.s }}</span></a>
    <template v-else>{{ p.s }}</template>
  </template>
</template>

<style scoped>
.org { display: inline-flex; align-items: center; gap: 0.3em; white-space: nowrap; color: inherit; text-decoration: none; }
.org span { text-decoration: underline; text-decoration-color: var(--line-strong); text-underline-offset: 0.15em; transition: text-decoration-color var(--dur) var(--ease); }
.org:hover span { text-decoration-color: currentColor; }
.org__logo { height: 0.9em; width: auto; }
</style>
