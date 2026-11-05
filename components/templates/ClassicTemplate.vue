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
    root-class="classic-root px-5 py-16"
    content-class="mx-auto flex w-full max-w-[460px] flex-col"
    default-accent="#292524"
  >
    <template #header="{ accent, initials }">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="size-24 rounded-full object-cover shadow-sm ring-1 ring-stone-300"
          fetchpriority="high"
        />
        <div
          v-else
          class="flex size-24 items-center justify-center rounded-full text-3xl text-white shadow-sm"
          :style="{ background: accent, fontFamily: 'Playfair Display, serif' }"
        >
          {{ initials }}
        </div>

        <h1 class="classic-title mt-6 text-[2rem] font-semibold leading-tight tracking-tight">
          {{ title }}
        </h1>
        <div class="classic-ornament mt-4" aria-hidden="true" />
        <p
          v-if="bio"
          class="classic-bio mt-4 max-w-sm leading-relaxed"
          :style="{ color: 'var(--lp-muted)' }"
        >
          {{ bio }}
        </p>
      </header>
    </template>

    <template #tabs><slot name="tabs" /></template>
  </TemplateShell>
</template>

<style scoped>
/* Template "classic": impresso de tipografia. Papel com textura, serifa e botões
   com filete interno, como um convite. */
.classic-root {
  background-color: #f8f5ee;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 .35 0 0 0 0 .3 0 0 0 0 .22 0 0 0 .07 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
  --lp-text: #1c1917;
  --lp-muted: #635b54;
  --lp-link-bg: #ffffff;
  --lp-link-fg: #1c1917;
  --lp-link-border: #d6d3d1;
  --lp-link-radius: 0.5rem;
  --lp-link-shadow: 0 8px 22px -6px rgb(28 25 23 / 0.2);
}
.classic-title {
  font-family: 'Playfair Display', Georgia, serif;
  color: var(--lp-text);
}
.classic-bio {
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 0.95rem;
  font-style: italic;
}
/* Fio com losango central. */
.classic-ornament {
  position: relative;
  width: 4.5rem;
  height: 1px;
  background: currentColor;
  color: var(--lp-link-border);
}
.classic-ornament::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 7px;
  height: 7px;
  background: var(--lp-muted);
  transform: translate(-50%, -50%) rotate(45deg);
}
/* Filete interno: acompanha as cores escolhidas pelo usuário. */
.classic-root :deep(.lp-link) {
  font-weight: 500;
  letter-spacing: 0.01em;
  box-shadow:
    inset 0 0 0 3px var(--lp-link-bg),
    inset 0 0 0 4px var(--lp-link-border);
}
@media (hover: hover) {
  .classic-root :deep(.lp-link:hover) {
    box-shadow:
      inset 0 0 0 3px var(--lp-link-bg),
      inset 0 0 0 4px var(--lp-accent),
      var(--lp-link-shadow);
  }
}
</style>
