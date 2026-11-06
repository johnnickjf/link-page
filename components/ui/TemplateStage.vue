<script setup lang="ts">
// Vitrine viva: renderiza os templates de verdade (o mesmo TemplateRenderer das
// páginas publicadas) em celulares. Só no cliente: as páginas de demonstração
// não entram no HTML indexado, e os templates ficam fora do JS inicial.
const props = withDefaults(
  defineProps<{ compact?: boolean, start?: number, gamer?: boolean }>(),
  { compact: false, start: 0, gamer: false },
)

const pages = props.gamer ? GAMER_DEMO_PAGES : DEMO_PAGES
const active = ref(props.start % pages.length)

function wrap(i: number): number {
  return (i + pages.length) % pages.length
}

// `compact` = um celular só; senão, o ativo e os vizinhos em leque. No celular não
// há largura para o leque: os vizinhos nem são renderizados.
const isNarrow = useMediaQuery('(max-width: 639px)')
const visible = computed(() =>
  (props.compact || isNarrow.value ? [0] : [-1, 0, 1]).map((offset) => ({
    offset,
    page: pages[wrap(active.value + offset)]!,
  })),
)

let timer: ReturnType<typeof setInterval> | null = null
function stopAutoplay(): void {
  if (timer) clearInterval(timer)
  timer = null
}
onMounted(() => {
  // Só a vitrine gamer gira sozinha: na home normal, a página fica parada.
  if (!props.gamer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(() => {
    active.value = wrap(active.value + 1)
  }, 4200)
})
onBeforeUnmount(stopAutoplay)

function select(i: number): void {
  stopAutoplay() // quem escolheu um template quer olhar para ele
  active.value = i
}
</script>

<template>
  <div class="flex flex-col items-center" data-testid="template-stage">
    <div class="stage-phones" :class="{ 'stage-phones--compact': compact }">
      <ClientOnly>
        <div
          v-for="{ offset, page } in visible"
          :key="page.template"
          class="stage-phone"
          :data-offset="offset"
          aria-hidden="true"
          inert
        >
          <div class="stage-phone__screen">
            <LazyTemplateRenderer
              :template="page.template"
              :title="page.title"
              :bio="page.bio"
              :blocks="page.blocks"
              :theme="page.theme"
              :profile-meta="page.profileMeta"
              :progress="page.progress"
              preview
            />
          </div>
        </div>
        <template #fallback>
          <div class="stage-phone" data-offset="0" aria-hidden="true">
            <div class="stage-phone__screen stage-phone__screen--empty" />
          </div>
        </template>
      </ClientOnly>
    </div>

    <div
      v-if="!compact"
      class="relative z-3 mt-6 flex max-w-lg flex-wrap justify-center gap-1.5"
      role="group"
      aria-label="Ver o template"
    >
      <button
        v-for="(page, i) in pages"
        :key="page.template"
        type="button"
        class="stage-chip"
        :aria-pressed="i === active"
        @click="select(i)"
      >
        {{ page.name }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.stage-phones {
  --phone-w: 248px;
  position: relative;
  width: 100%;
  max-width: 34rem;
  height: 508px;
}
.stage-phones--compact {
  max-width: var(--phone-w);
}
.stage-phone {
  position: absolute;
  top: 0;
  left: 50%;
  width: var(--phone-w);
  height: 508px;
  margin-left: calc(var(--phone-w) / -2);
  padding: 7px;
  border-radius: 2.4rem;
  background: #0f172a;
  box-shadow:
    0 0 0 1px rgb(15 23 42 / 0.08),
    0 28px 56px -24px rgb(15 23 42 / 0.45);
  transition: transform 0.6s cubic-bezier(0.22, 0.8, 0.35, 1), opacity 0.4s ease;
}
.stage-phone[data-offset='0'] {
  z-index: 2;
}
.stage-phone[data-offset='-1'],
.stage-phone[data-offset='1'] {
  z-index: 1;
  opacity: 0.75;
}
.stage-phone[data-offset='-1'] {
  transform: translateX(-46%) translateY(26px) rotate(-7deg) scale(0.86);
}
.stage-phone[data-offset='1'] {
  transform: translateX(46%) translateY(26px) rotate(7deg) scale(0.86);
}
/* A tela é desenhada em largura de celular real e reduzida: o template renderiza
   exatamente como na página publicada. 234 = 248 da moldura - 2x7 de borda. */
.stage-phone__screen {
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 1.95rem;
  background: #fff;
}
.stage-phone__screen > :deep(*) {
  width: 375px;
  height: 790px;
  transform: scale(0.624);
  transform-origin: top left;
}
.stage-chip {
  padding: 0.45rem 0.85rem;
  border-radius: 9999px;
  border: 1px solid var(--ui-color-neutral-300);
  background: #fff;
  color: var(--ui-color-neutral-700);
  font-size: 0.8125rem;
  font-weight: 500;
  transition: background 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
.stage-chip:hover {
  border-color: var(--ui-color-primary-600);
}
.stage-chip[aria-pressed='true'] {
  border-color: var(--ui-color-primary-600);
  background: var(--ui-color-primary-600);
  color: #fff;
}
.stage-chip:focus-visible {
  outline: 2px solid var(--ui-color-primary-600);
  outline-offset: 2px;
}

/* Sobre o painel roxo das telas de login e cadastro. */
.stage-panel .stage-phone {
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.2),
    0 28px 56px -20px rgb(38 18 84 / 0.7);
}

/* Sobre o palco escuro da superfície gamer. */
.stage-bg .stage-phone {
  background: #05040a;
  box-shadow:
    0 0 0 1px rgb(255 255 255 / 0.14),
    0 40px 80px -24px rgb(0 0 0 / 0.8);
}
.stage-bg .stage-phone__screen--empty {
  background: #16141f;
}
.stage-bg .stage-chip {
  padding: 0.3rem 0.75rem;
  background: transparent;
  border-color: rgb(255 255 255 / 0.4);
  color: #fff;
}
.stage-bg .stage-chip:hover {
  border-color: #fff;
  background: rgb(255 255 255 / 0.12);
}
.stage-bg .stage-chip[aria-pressed='true'] {
  border-color: var(--stage-accent);
  background: var(--stage-accent);
  color: var(--stage-accent-ink);
}
.stage-bg .stage-chip:focus-visible {
  outline-color: #fff;
}
@media (prefers-reduced-motion: reduce) {
  .stage-phone { transition: none; }
}
</style>
