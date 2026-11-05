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
    root-class="minimal-root px-5 py-14"
    content-class="mx-auto flex w-full max-w-[480px] flex-col"
    default-accent="#4f46e5"
  >
    <template #header="{ accent, initials }">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="size-24 rounded-full object-cover ring-1 ring-black/5 ring-offset-4 ring-offset-white"
          fetchpriority="high"
        />
        <div
          v-else
          class="flex size-24 items-center justify-center rounded-full text-3xl font-bold text-white"
          :style="{ background: accent }"
        >
          {{ initials }}
        </div>

        <h1
          class="mt-5 font-display text-[1.65rem] font-bold leading-tight tracking-tight"
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
/* Template "minimal": papel branco e tinta preta. A única cor é a do usuário. */
.minimal-root {
  background: #ffffff;
  --lp-text: #0f172a;
  --lp-muted: #526071;
  --lp-link-bg: #ffffff;
  --lp-link-fg: #0f172a;
  --lp-link-border: #e2e8f0;
  --lp-link-radius: 0.9rem;
  --lp-link-rest-shadow: 0 1px 2px rgb(15 23 42 / 0.05);
  --lp-link-shadow: 0 12px 28px -8px rgb(15 23 42 / 0.16);
}
</style>
