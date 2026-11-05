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
    root-class="esports-root px-5 py-14"
    content-class="esports-content mx-auto flex w-full max-w-[480px] flex-col"
    default-accent="#ef4444"
  >
    <template #header="{ initials }">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="esports-avatar object-cover"
          fetchpriority="high"
        />
        <div v-else class="esports-avatar esports-avatar--initials">{{ initials }}</div>

        <h1 class="esports-title mt-5">{{ title }}</h1>
        <p
          v-if="bio"
          class="mt-2 max-w-sm text-sm leading-relaxed"
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
/* Template "esports": camisa de time. Faixas diagonais na cor do usuário, tudo
   inclinado e condensado, como numeração de uniforme. */
.esports-root {
  position: relative;
  overflow: hidden;
  background-color: #0a0a0c;
  font-family: 'Saira Condensed', ui-sans-serif, system-ui, sans-serif;
  --lp-text: #ffffff;
  --lp-muted: #c4c4cc;
  --lp-link-bg: #17171b;
  --lp-link-fg: #ffffff;
  --lp-link-border: #2d2d33;
  --lp-link-radius: 0.2rem;
  --lp-link-shadow: 6px 6px 0 color-mix(in srgb, var(--lp-accent) 75%, #000);
}
.esports-root::before {
  content: '';
  position: absolute;
  /* Só no canto: nunca atrás do cabeçalho, para o texto manter o contraste. */
  top: -12rem;
  right: -8.5rem;
  width: 14rem;
  height: 26rem;
  pointer-events: none;
  background:
    linear-gradient(90deg,
      var(--lp-accent) 0 44%,
      transparent 44% 52%,
      color-mix(in srgb, var(--lp-accent) 55%, transparent) 52% 66%,
      transparent 66% 74%,
      color-mix(in srgb, var(--lp-accent) 28%, transparent) 74% 84%,
      transparent 84%);
  transform: rotate(24deg);
  opacity: 0.9;
}
.esports-root :deep(.esports-content) {
  position: relative;
  z-index: 1;
}
.esports-avatar {
  width: 6.5rem;
  height: 6.5rem;
  clip-path: polygon(14% 0, 100% 0, 86% 100%, 0 100%);
}
.esports-avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--lp-accent);
  color: #0a0a0c;
  font-size: 3rem;
  font-style: italic;
  font-weight: 800;
}
.esports-title {
  color: var(--lp-text);
  font-size: 2.5rem;
  font-style: italic;
  font-weight: 800;
  letter-spacing: 0.01em;
  line-height: 1;
  overflow-wrap: anywhere;
  text-transform: uppercase;
}
/* Botões inclinados; o conteúdo volta ao prumo para ler bem. */
.esports-root :deep(.lp-link) {
  font-size: 1.15rem;
  font-weight: 700;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  transform: skewX(-6deg);
}
.esports-root :deep(.lp-link > *) {
  transform: skewX(6deg);
}
@media (hover: hover) {
  .esports-root :deep(.lp-link:hover) {
    transform: skewX(-6deg) translate(-3px, -3px);
    border-color: var(--lp-accent);
  }
}
.esports-root :deep(.lp-link:active) {
  transform: skewX(-6deg) translate(2px, 2px);
  box-shadow: none;
}
</style>
