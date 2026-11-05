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
    root-class="minimal-root bg-white px-5 py-14"
    content-class="mx-auto flex w-full max-w-[480px] flex-col"
    default-accent="#4f46e5"
  >
    <template #header="{ accent, initials }">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="size-24 rounded-full object-cover shadow-md"
          fetchpriority="high"
        />
        <div
          v-else
          class="flex size-24 items-center justify-center rounded-full text-3xl font-bold text-white shadow-md"
          :style="{ background: accent }"
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
/* Template "minimal": limpo, claro, uma cor de destaque. */
.minimal-root {
  --lp-text: #111827;
  --lp-muted: #6b7280;
  --lp-link-bg: #ffffff;
  --lp-link-fg: #111827;
  --lp-link-border: #e5e7eb;
  --lp-link-radius: 0.9rem;
  --lp-link-shadow: 0 10px 25px rgb(0 0 0 / 0.08);
}
</style>
