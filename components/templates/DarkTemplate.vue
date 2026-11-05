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
    root-class="dark-root px-5 py-14"
    content-class="relative mx-auto flex w-full max-w-[480px] flex-col"
    default-accent="#a78bfa"
  >
    <template #header="{ accent, initials }">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="size-24 rounded-full object-cover"
          :style="{ boxShadow: `0 0 0 2px ${accent}55, 0 8px 30px ${accent}40` }"
          fetchpriority="high"
        />
        <div
          v-else
          class="flex size-24 items-center justify-center rounded-full text-3xl font-bold text-white"
          :style="{ background: accent, boxShadow: `0 8px 30px ${accent}50` }"
        >
          {{ initials }}
        </div>

        <h1
          class="mt-4 font-display text-2xl font-bold tracking-tight"
          :style="{ color: 'var(--lp-text)' }"
        >
          {{ title }}
        </h1>
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
/* Template "dark": grafite com a luz vindo de cima, na cor do usuário. */
.dark-root {
  background: #09090b;
  background:
    radial-gradient(70% 38% at 50% -6%, color-mix(in srgb, var(--lp-accent) 26%, transparent), transparent 72%),
    #09090b;
  --lp-text: #fafafa;
  --lp-muted: #b1b1b9;
  --lp-link-bg: #18181b;
  --lp-link-fg: #fafafa;
  --lp-link-border: #27272a;
  --lp-link-radius: 0.9rem;
  --lp-link-rest-shadow: inset 0 1px 0 rgb(255 255 255 / 0.06);
  --lp-link-shadow: inset 0 1px 0 rgb(255 255 255 / 0.08), 0 14px 34px -10px color-mix(in srgb, var(--lp-accent) 45%, transparent);
}
.dark-root :deep(.lp-link) {
  background-image: linear-gradient(180deg, rgb(255 255 255 / 0.05), transparent);
}
</style>
