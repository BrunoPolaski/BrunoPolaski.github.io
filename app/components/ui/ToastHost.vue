<script setup lang="ts">
const { toasts, dismiss } = useToast()
const icons = { neutral: 'lucide:info', good: 'lucide:circle-check', critical: 'lucide:circle-x' }
</script>

<template>
  <div class="toasts" role="status" aria-live="polite">
    <TransitionGroup name="toast">
      <div v-for="t in toasts" :key="t.id" :class="['toast', `toast--${t.tone}`]">
        <Icon :name="icons[t.tone ?? 'neutral']" />
        <span>{{ t.title }}</span>
        <button type="button" aria-label="Dismiss" @click="dismiss(t.id)"><Icon name="lucide:x" /></button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toasts { position: fixed; right: 16px; bottom: 16px; z-index: 50; display: flex; flex-direction: column; gap: 8px; }
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: min(320px, calc(100vw - 32px));
  padding: 12px 14px;
  border-radius: 12px;
  background: var(--ink);
  color: var(--on-ink);
  font-size: var(--fs-sm);
  box-shadow: var(--shadow-pop);
}
.toast span { flex: 1; }
.toast button { border: 0; background: none; color: inherit; cursor: pointer; opacity: 0.7; }
.toast--good .iconify:first-child { color: var(--good); }
.toast--critical .iconify:first-child { color: var(--critical); }
.toast-enter-active, .toast-leave-active { transition: all 220ms var(--ease); }
.toast-enter-from, .toast-leave-to { opacity: 0; translate: 0 12px; }
</style>
