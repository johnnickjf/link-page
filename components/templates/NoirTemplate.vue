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
    root-class="noir-root px-5 py-16"
    content-class="noir-content mx-auto flex w-full max-w-[460px] flex-col"
    blocks-class="mt-9 space-y-3.5"
    default-accent="#d4af37"
  >
    <template #header="{ initials }">
      <header class="flex flex-col items-center text-center">
        <div class="noir-ring">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="title"
            class="noir-avatar object-cover"
            fetchpriority="high"
          />
          <div v-else class="noir-avatar noir-avatar--initials">{{ initials }}</div>
        </div>

        <h1 class="noir-title mt-6">{{ title }}</h1>
        <div class="noir-divider mt-4" aria-hidden="true">
          <span /><i /><span />
        </div>
        <p
          v-if="bio"
          class="mt-4 max-w-sm leading-relaxed"
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
/* Template "noir": preto quente com dourado e serifa clássica. Pensado para
   marcas, consultórios, ateliês e quem quer passar sofisticação. */
.noir-root {
  position: relative;
  overflow: hidden;
  background-color: #0d0c0b;
  background-image:
    radial-gradient(60% 34% at 50% 0%, color-mix(in srgb, var(--lp-accent) 16%, transparent), transparent 75%),
    radial-gradient(80% 50% at 50% 110%, rgb(255 255 255 / 0.04), transparent 70%);
  --lp-text: #f5efe3;
  --lp-muted: #bdb3a2;
  --lp-link-bg: rgb(255 255 255 / 0.02);
  --lp-link-fg: #f5efe3;
  --lp-link-border: color-mix(in srgb, var(--lp-accent) 55%, transparent);
  --lp-link-radius: 0.2rem;
  --lp-link-shadow: 0 0 0 1px var(--lp-accent);
}
.noir-root :deep(.noir-content) {
  position: relative;
}
.noir-ring {
  padding: 5px;
  border: 1px solid color-mix(in srgb, var(--lp-accent) 70%, transparent);
  border-radius: 9999px;
}
.noir-avatar {
  width: 6.25rem;
  height: 6.25rem;
  border-radius: 9999px;
}
.noir-avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1a1815;
  color: var(--lp-accent);
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.4rem;
}
.noir-title {
  color: var(--lp-text);
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 2.1rem;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.15;
  overflow-wrap: anywhere;
}
/* Fio dourado com losango ao centro, separando nome e bio. */
.noir-divider {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
.noir-divider span {
  display: block;
  width: 2.5rem;
  height: 1px;
  background: var(--lp-accent);
  opacity: 0.7;
}
.noir-divider i {
  display: block;
  width: 6px;
  height: 6px;
  background: var(--lp-accent);
  transform: rotate(45deg);
}
/* Botões em caixa alta com espaçamento largo, como uma vitrine de grife. */
.noir-root :deep(.lp-link) {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}
@media (hover: hover) {
  .noir-root :deep(.lp-link:hover) {
    transform: none;
    background: color-mix(in srgb, var(--lp-accent) 12%, transparent);
  }
}
</style>
