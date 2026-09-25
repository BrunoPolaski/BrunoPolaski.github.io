<script setup lang="ts">
/**
 * "How I work" as an event-driven saga: each step is a handler subscribed to the work log.
 * A frame publishes one event: a pulse rises from the emitting handler into the log,
 * then drops into the handler subscribed to it. -1 is outside the saga (backlog / done).
 */
const { t } = useLocale()

// Event names are code, so they stay as-is in every language; the names, texts and notes
// come from the locale files (process.handlers / process.notes), matched by index.
const handlers = [
  { on: 'task.created', emits: 'scope.defined' },
  { on: 'scope.defined · changes.requested', emits: 'feature.built' },
  { on: 'feature.built', emits: 'review.passed · changes.requested' },
  { on: 'review.passed', emits: 'deployed' },
]
const flow: { event: string, from: number, to: number, comp?: boolean }[] = [
  { event: 'task.created', from: -1, to: 0 },
  { event: 'scope.defined', from: 0, to: 1 },
  { event: 'feature.built', from: 1, to: 2 },
  { event: 'changes.requested', from: 2, to: 1, comp: true },
  { event: 'feature.built', from: 1, to: 2 },
  { event: 'review.passed', from: 2, to: 3 },
  { event: 'deployed', from: 3, to: -1 },
]

const step = ref(0)
const playing = ref(true)
const f = computed(() => flow[step.value]!)
const log = computed(() => flow.slice(0, step.value + 1))
const status = computed(() => f.value.to === -1 ? 'completed' : f.value.comp ? 'compensating' : 'running' as const)
const done = (i: number) => f.value.to !== i && flow.slice(0, step.value + 1).some(e => e.from === i && !e.comp)
const next = () => { step.value = (step.value + 1) % flow.length }

let timer: ReturnType<typeof setInterval> | undefined
onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) playing.value = false
  timer = setInterval(() => { if (playing.value) next() }, 2000)
})
onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="saga">
    <div class="log">
      <span class="log__topic">work.events</span>
      <TransitionGroup tag="ol" name="chip" class="log__chips">
        <li v-for="(e, i) in log" :key="i" class="chip" :class="{ 'is-comp': e.comp }"><span class="muted">#{{ i }}</span> {{ e.event }}</li>
      </TransitionGroup>
    </div>

    <ol class="handlers">
      <li
        v-for="(h, i) in handlers"
        :key="h.emits"
        class="handler"
        :class="{ 'is-active': f.to === i, 'is-done': done(i), 'is-comp': f.comp }"
      >
        <span v-if="f.from === i" :key="`up-${step}`" class="dot dot--up" aria-hidden="true" />
        <span v-if="f.to === i" :key="`down-${step}`" class="dot dot--down" aria-hidden="true" />
        <div class="handler__top">
          <small>{{ t.process.step }} #{{ i + 1 }}</small>
          <Transition name="pop" mode="out-in">
            <span v-if="f.to === i" key="active" class="handler__state">{{ f.comp ? t.process.state.reworking : t.process.state.handling }}</span>
            <span v-else-if="done(i)" key="done" class="handler__state handler__state--done">{{ t.process.state.done }}</span>
          </Transition>
        </div>
        <b>{{ t.process.handlers[i]!.name }}</b>
        <p>{{ t.process.handlers[i]!.text }}</p>
        <dl>
          <dt>on</dt><dd>{{ h.on }}</dd>
          <dt>emits</dt><dd>{{ h.emits }}</dd>
        </dl>
      </li>
    </ol>

    <div class="saga__foot">
      <span class="saga__status" :data-s="status">Saga #42 · {{ t.process.status[status] }}</span>
      <p :key="step" class="saga__note">{{ t.process.notes[step] }}</p>
      <UiButton variant="ghost" size="sm" :icon="playing ? 'lucide:pause' : 'lucide:play'" :label="playing ? t.projects.pause : t.projects.play" @click="playing = !playing" />
      <UiButton variant="ghost" size="sm" icon="lucide:step-forward" :label="t.projects.next" @click="next" />
    </div>
  </div>
</template>

<style scoped>
.saga {
  --wire: 56px;
  display: flex;
  flex-direction: column;
  /* wider than the text column for roomier cards, but clear of the progress rail (72px each side), never narrower */
  width: max(100%, min(1360px, 100vw - 2 * 72px));
  align-self: center;
}

.log { display: flex; align-items: center; gap: var(--s-3); padding: 8px 8px 8px 16px; border: 1px solid var(--line); border-radius: var(--r-pill); background: var(--panel); }
.log__topic { flex: none; font-family: ui-monospace, monospace; font-size: var(--fs-xs); color: var(--ink-3); }
.log__chips {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  min-width: 0;
  margin: 0;
  padding: 0;
  list-style: none;
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 18%);
}
.chip {
  flex: none;
  padding: 4px 12px;
  border: 1px solid var(--line-strong);
  border-radius: var(--r-pill);
  font-family: ui-monospace, monospace;
  font-size: var(--fs-xs);
  color: var(--ink-2);
}
/* new events slide in; older ones glide left to make room instead of jumping */
.chip-enter-active, .chip-move { transition: opacity 0.45s var(--ease), translate 0.45s var(--ease), filter 0.45s var(--ease), transform 0.45s var(--ease); }
.chip-enter-from { opacity: 0; translate: 24px 0; filter: blur(6px); }
.chip-leave-active { transition: opacity 0.3s var(--ease); }
.chip-leave-to { opacity: 0; }
.chip:last-child { background: var(--signal); border-color: var(--signal); color: #fff; }
.chip:last-child .muted { color: rgb(255 255 255 / 0.7); }
.chip.is-comp { border-color: var(--warning); color: var(--warning); }
.chip.is-comp:last-child { background: var(--warning); color: #000; }
.chip.is-comp:last-child .muted { color: rgb(0 0 0 / 0.55); }
@keyframes chip-in { from { opacity: 0; translate: 24px 0; filter: blur(6px); } }

.handlers { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: var(--s-5); margin: 0; padding: 0; list-style: none; }
.handler {
  container-type: inline-size;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: var(--wire);
  padding: var(--s-4) var(--s-5) var(--s-5);
  border: 1px solid var(--line);
  border-radius: var(--r-card);
  background: var(--card);
  transition: border-color 0.4s var(--ease), box-shadow 0.4s var(--ease), background-color 0.4s var(--ease);
}
/* the subscription: a wire from the log down to each handler */
.handler::before { content: ''; position: absolute; left: 50%; bottom: 100%; height: var(--wire); border-left: 1px dashed var(--line-strong); transition: border-color 0.4s; }
.handler.is-active { border-color: var(--signal); box-shadow: 0 0 0 1px var(--signal), 0 0 48px -10px var(--signal); }
.handler.is-active::before { border-left-style: solid; border-color: var(--signal); }
.handler.is-active.is-comp { border-color: var(--warning); box-shadow: 0 0 0 1px var(--warning), 0 0 48px -10px var(--warning); }
.handler.is-active.is-comp::before { border-color: var(--warning); }
.handler.is-done { background: color-mix(in srgb, var(--signal) 12%, var(--card)); }

.handler__top { display: flex; align-items: center; justify-content: space-between; gap: var(--s-2); min-height: 22px; }
.handler__top small { color: var(--ink-3); }
.handler__state { padding: 2px 10px; border-radius: var(--r-pill); background: var(--signal); color: #fff; font-size: var(--fs-xs); font-weight: 700; transition: background-color 0.3s var(--ease), color 0.3s var(--ease); }
.pop-enter-active { transition: opacity 0.3s var(--ease), translate 0.3s var(--ease), scale 0.3s var(--ease); }
.pop-leave-active { transition: opacity 0.2s var(--ease), scale 0.2s var(--ease); }
.pop-enter-from { opacity: 0; translate: 0 6px; scale: 0.85; }
.pop-leave-to { opacity: 0; scale: 0.9; }
.is-active.is-comp .handler__state { background: var(--warning); color: #000; }
.handler__state--done { background: var(--wash); color: var(--ink-2); }
.handler b { font-size: clamp(1rem, 7cqi, var(--fs-xl)); font-stretch: 125%; } /* scales with the card: "Desenvolvimento" always fits */
.handler p { color: var(--ink-2); font-size: var(--fs-sm); }
.handler dl { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin: auto 0 0; padding-top: var(--s-3); border-top: 1px solid var(--line); font-size: var(--fs-xs); }
.handler dt { color: var(--ink-3); }
.handler dd { margin: 0; font-family: ui-monospace, monospace; color: var(--ink-2); }

.dot {
  position: absolute;
  left: 50%;
  top: calc(-1 * var(--wire));
  width: 10px;
  height: 10px;
  margin-left: -5px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 10px 3px var(--signal);
  pointer-events: none;
}
.is-comp .dot { box-shadow: 0 0 10px 3px var(--warning); }
.dot--up { animation: rise 0.6s var(--ease) both; } /* the emitter publishes first… */
.dot--down { animation: drop 0.6s var(--ease) 0.6s both; } /* …then the subscriber receives */
@keyframes rise {
  from { translate: 0 var(--wire); opacity: 0; }
  30% { opacity: 1; }
  to { translate: 0 -5px; opacity: 0; }
}
@keyframes drop {
  from { translate: 0 -5px; opacity: 0; }
  30% { opacity: 1; }
  to { translate: 0 var(--wire); opacity: 0; }
}

.saga__foot { display: flex; align-items: center; gap: var(--s-3); margin-top: var(--s-5); }
.saga__status { flex: none; padding: 4px 12px; border-radius: var(--r-pill); border: 1px solid var(--line-strong); font-family: ui-monospace, monospace; font-size: var(--fs-xs); }
.saga__status[data-s='compensating'] { border-color: var(--warning); color: var(--warning); }
.saga__status[data-s='completed'] { border-color: var(--signal); color: var(--signal); }
.saga__note { flex: 1; max-width: none; animation: chip-in 0.4s var(--ease); }

@media (max-width: 1024px) { /* four handlers get too narrow for "Desenvolvimento" below this */
  .saga { --wire: 0px; }
  .handlers { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--s-3); margin-top: var(--s-4); }
  .handler::before, .dot { display: none; }
  .saga__foot { flex-wrap: wrap; }
  .saga__note { flex-basis: 100%; order: -1; }
}
@media (max-width: 520px) {
  .handlers { grid-template-columns: minmax(0, 1fr); }
}
@media (prefers-reduced-motion: reduce) {
  .dot { display: none; }
}
</style>
