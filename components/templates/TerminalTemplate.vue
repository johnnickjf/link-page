<script setup lang="ts">
import type { PublicBlock, Theme } from '~/types/api'

const props = defineProps<{
  title: string
  bio?: string | null
  avatarUrl?: string | null
  theme?: Theme | null
  blocks: PublicBlock[]
  preview?: boolean
}>()
</script>

<template>
  <TemplateShell
    v-bind="props"
    root-class="term-root px-5 py-14"
    content-class="term-content mx-auto flex w-full max-w-[480px] flex-col"
    blocks-class="mt-8 space-y-2.5"
    default-accent="#39ff88"
  >
    <template #header="{ initials }">
      <header class="flex flex-col items-start text-left">
        <p class="term-bar" aria-hidden="true">
          <span /><span /><span />
          <em>~/links</em>
        </p>
        <div class="mt-5 flex items-center gap-4">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="title"
            class="term-avatar object-cover"
            fetchpriority="high"
          />
          <div v-else class="term-avatar term-avatar--initials">{{ initials }}</div>
          <div class="min-w-0">
            <div class="flex items-baseline gap-2">
              <span class="term-prompt" aria-hidden="true">&gt;</span>
              <h1 class="term-title">{{ title }}</h1>
              <span class="term-cursor" aria-hidden="true" />
            </div>
            <p v-if="bio" class="term-bio mt-1.5">
              <span aria-hidden="true">// </span>{{ bio }}
            </p>
          </div>
        </div>
      </header>
    </template>

    <template #tabs><slot name="tabs" /></template>
  </TemplateShell>
</template>

<style scoped>
/* Template "terminal": monitor de fósforo verde. Linhas de varredura, fonte mono,
   prompt e cursor piscando. Os botões invertem as cores no hover, como uma
   seleção de menu em modo texto. */
.term-root {
  position: relative;
  overflow: hidden;
  background-color: #050806;
  background-image:
    repeating-linear-gradient(180deg, rgb(255 255 255 / 0.025) 0 1px, transparent 1px 3px),
    radial-gradient(80% 60% at 50% 30%, color-mix(in srgb, var(--lp-accent) 9%, transparent), transparent 75%);
  font-family: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace;
  --lp-text: #d9ffe6;
  --lp-muted: #92d4a9;
  --lp-link-bg: rgb(0 0 0 / 0.35);
  --lp-link-fg: #d9ffe6;
  --lp-link-border: color-mix(in srgb, var(--lp-accent) 60%, transparent);
  --lp-link-radius: 0;
  --lp-link-shadow: 0 0 18px -4px var(--lp-accent);
}
.term-root :deep(.term-content) {
  position: relative;
}
/* Barra de janela: três pontos e o caminho, só decoração. */
.term-bar {
  display: flex;
  width: 100%;
  align-items: center;
  gap: 0.4rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px dashed color-mix(in srgb, var(--lp-accent) 35%, transparent);
  color: var(--lp-muted);
  font-size: 0.75rem;
}
.term-bar span {
  width: 0.6rem;
  height: 0.6rem;
  border-radius: 9999px;
  background: color-mix(in srgb, var(--lp-accent) 55%, transparent);
}
.term-bar em {
  margin-left: auto;
  font-style: normal;
}
.term-avatar {
  width: 4.5rem;
  height: 4.5rem;
  flex-shrink: 0;
  border: 1px solid var(--lp-accent);
  box-shadow: 0 0 16px -4px var(--lp-accent);
}
.term-avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 0.4);
  color: var(--lp-accent);
  font-size: 1.6rem;
  font-weight: 700;
}
.term-prompt {
  color: var(--lp-accent);
  font-size: 1.4rem;
  font-weight: 700;
}
.term-title {
  min-width: 0;
  color: var(--lp-text);
  font-size: 1.4rem;
  font-weight: 700;
  line-height: 1.2;
  overflow-wrap: anywhere;
}
.term-cursor {
  display: inline-block;
  width: 0.6rem;
  height: 1.15rem;
  flex-shrink: 0;
  background: var(--lp-accent);
  animation: term-blink 1.1s steps(1) infinite;
}
@keyframes term-blink {
  50% { opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .term-cursor { animation: none; }
}
.term-bio {
  color: var(--lp-muted);
  font-size: 0.85rem;
  line-height: 1.55;
}
.term-root :deep(.lp-link) {
  font-size: 0.92rem;
  font-weight: 600;
}
@media (hover: hover) {
  .term-root :deep(.lp-link:hover) {
    transform: none;
    background: var(--lp-accent);
    color: #04130a;
  }
}
</style>
