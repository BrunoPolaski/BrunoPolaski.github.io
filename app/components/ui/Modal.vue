<script setup lang="ts">
defineProps<{ title: string }>()
const open = defineModel<boolean>({ default: false })
const dialog = ref<HTMLDialogElement>()

watch(open, (v) => {
  if (v) dialog.value?.showModal()
  else dialog.value?.close()
})
</script>

<template>
  <dialog ref="dialog" class="modal acrylic" :aria-label="title" @close="open = false" @click.self="open = false">
    <div class="modal__body">
      <header class="modal__head">
        <h3>{{ title }}</h3>
        <UiButton variant="ghost" size="sm" icon="lucide:x" label="Close" @click="open = false" />
      </header>
      <slot />
      <footer v-if="$slots.footer" class="row modal__foot"><slot name="footer" /></footer>
    </div>
  </dialog>
</template>

<style scoped>
.modal {
  width: min(460px, calc(100vw - 32px));
  padding: 0;
  border-radius: var(--r-card);
  color: var(--ink);
}
.modal[open] { animation: pop 180ms var(--ease); }
.modal::backdrop { background: rgb(0 0 0 / 0.25); }
.modal__body { display: flex; flex-direction: column; gap: var(--s-4); padding: var(--s-5); }
.modal__head { display: flex; justify-content: space-between; align-items: center; }
.modal__foot { justify-content: flex-end; }
@keyframes pop { from { opacity: 0; scale: 0.96; } }
</style>
