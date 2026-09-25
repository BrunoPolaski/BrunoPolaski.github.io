<script setup lang="ts">
const open = ref(false)
const progress = ref(64)
const { push } = useToast()
const faq = [
  { title: 'Can I use Halo without Nuxt?', body: 'The components are plain Vue SFCs. Copy them into any Vue 3 app and import the two CSS files.' },
  { title: 'How do I theme it?', body: 'Override the custom properties in tokens.css. Components only read roles, never raw hex.' },
  { title: 'Does it support dark mode?', body: 'Yes. It follows the OS by default, and the theme switch in the sidebar stores your choice in a cookie.' },
]
</script>

<template>
  <DocsPage title="Feedback" lead="Alerts, toasts, dialogs and progress tell people what changed and what to do next.">
    <DocsDemo title="Alerts">
      <div class="stack">
        <UiAlert title="Sync scheduled">Your data refreshes every night at 02:00.</UiAlert>
        <UiAlert tone="good" title="Payment received">INV-1045 was paid in full.</UiAlert>
        <UiAlert tone="warning" title="Card expires in 5 days">Update the card to keep your plan active.</UiAlert>
        <UiAlert tone="critical" title="Export failed">The file is over 50 MB. Narrow the date range and try again.</UiAlert>
      </div>
    </DocsDemo>
    <DocsDemo title="Toasts" usage="const { push } = useToast(); push('Saved', 'good')">
      <div class="row">
        <UiButton @click="push('Draft saved')">Save draft</UiButton>
        <UiButton icon="lucide:check" @click="push('Invoice sent to Globex', 'good')">Send invoice</UiButton>
        <UiButton icon="lucide:x" @click="push('Couldn’t reach the server. Check your connection.', 'critical')">Trigger error</UiButton>
      </div>
    </DocsDemo>
    <DocsDemo title="Dialog" usage='<UiModal v-model="open" title="Delete project">…</UiModal>'>
      <UiButton variant="solid" icon="lucide:trash-2" @click="open = true">Delete project</UiButton>
      <UiModal v-model="open" title="Delete project">
        <p class="muted">Crafty Theme and its 14 files will be removed. This can’t be undone.</p>
        <template #footer>
          <UiButton variant="ghost" @click="open = false">Keep project</UiButton>
          <UiButton variant="solid" @click="open = false; push('Project deleted')">Delete project</UiButton>
        </template>
      </UiModal>
    </DocsDemo>
    <DocsDemo title="Progress and loaders">
      <div class="stack">
        <UiProgress :value="progress" label="Uploading assets" />
        <div class="row">
          <UiButton size="sm" @click="progress = Math.min(100, progress + 12)">Add 12%</UiButton>
          <FxPixelLoader />
          <span class="muted">Connecting…</span>
        </div>
      </div>
    </DocsDemo>
    <DocsDemo title="Tabs and accordion">
      <UiTabs :tabs="['Overview', 'Activity', 'Settings']">
        <template #Overview><p>Three projects, two of them shipping this week.</p></template>
        <template #Activity><p>James Lewis updated Crafty Theme 12 minutes ago.</p></template>
        <template #Settings><p>Notifications are on for mentions only.</p></template>
      </UiTabs>
      <div style="margin-top: var(--s-5)"><UiAccordion :items="faq" /></div>
    </DocsDemo>
  </DocsPage>
</template>
