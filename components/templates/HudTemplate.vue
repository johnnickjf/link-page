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
    root-class="hud-root px-5 py-14"
    content-class="hud-content mx-auto flex w-full max-w-[480px] flex-col"
    default-accent="#facc15"
  >
    <template #header="{ initials }">
      <header class="flex flex-col items-center text-center">
        <div class="hud-frame">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="title"
            class="size-24 object-cover"
            fetchpriority="high"
          />
          <div v-else class="hud-frame__initials">{{ initials }}</div>
        </div>

        <h1 class="hud-title mt-5">{{ title }}</h1>
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
/* Template "hud": interface tática. Linhas de varredura, cantos chanfrados, mira
   em volta do avatar e tipografia técnica. */
.hud-root {
  position: relative;
  overflow: hidden;
  background-color: #0b0e0a;
  background-image:
    repeating-linear-gradient(180deg, rgb(255 255 255 / 0.018) 0 1px, transparent 1px 4px),
    radial-gradient(70% 40% at 50% 0%, color-mix(in srgb, var(--lp-accent) 14%, transparent), transparent 75%);
  font-family: 'Chakra Petch', ui-sans-serif, system-ui, sans-serif;
  --lp-text: #eef2df;
  --lp-muted: #b4bca5;
  --lp-link-bg: rgb(255 255 255 / 0.035);
  --lp-link-fg: #eef2df;
  --lp-link-border: color-mix(in srgb, var(--lp-accent) 45%, transparent);
  --lp-link-radius: 0.25rem;
  --lp-link-shadow: 0 0 0 1px var(--lp-accent);
}
.hud-root :deep(.hud-content) {
  position: relative;
}
/* Mira: quatro cantos desenhados com gradientes, sem imagem. */
.hud-frame {
  position: relative;
  padding: 0.5rem;
  background:
    linear-gradient(var(--lp-accent), var(--lp-accent)) top left / 18px 2px no-repeat,
    linear-gradient(var(--lp-accent), var(--lp-accent)) top left / 2px 18px no-repeat,
    linear-gradient(var(--lp-accent), var(--lp-accent)) top right / 18px 2px no-repeat,
    linear-gradient(var(--lp-accent), var(--lp-accent)) top right / 2px 18px no-repeat,
    linear-gradient(var(--lp-accent), var(--lp-accent)) bottom left / 18px 2px no-repeat,
    linear-gradient(var(--lp-accent), var(--lp-accent)) bottom left / 2px 18px no-repeat,
    linear-gradient(var(--lp-accent), var(--lp-accent)) bottom right / 18px 2px no-repeat,
    linear-gradient(var(--lp-accent), var(--lp-accent)) bottom right / 2px 18px no-repeat;
}
.hud-frame__initials {
  display: flex;
  width: 6rem;
  height: 6rem;
  align-items: center;
  justify-content: center;
  background: rgb(255 255 255 / 0.05);
  color: var(--lp-accent);
  font-size: 2.25rem;
  font-weight: 700;
}
.hud-title {
  color: var(--lp-text);
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.2;
  overflow-wrap: anywhere;
  text-transform: uppercase;
}
/* Chanfro nos botões; o filete à esquerda marca o item como um menu de jogo. */
.hud-root :deep(.lp-link) {
  border-left: 3px solid var(--lp-accent);
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
  font-weight: 600;
  letter-spacing: 0.02em;
}
@media (hover: hover) {
  .hud-root :deep(.lp-link:hover) {
    transform: translateX(3px);
    background: color-mix(in srgb, var(--lp-accent) 12%, transparent);
  }
}
.hud-root :deep(.lp-card) {
  clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
}
</style>
