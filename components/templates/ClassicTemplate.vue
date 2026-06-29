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

const { inlineBlocks, socialBlocks, whatsapp, accent, initials, showBranding, rootStyle } =
  useTemplateLayout(props, '#292524')
</script>

<template>
  <div
    class="classic-root px-5 py-16"
    :class="preview ? 'relative min-h-full' : 'min-h-screen'"
    :style="rootStyle"
  >
    <div class="mx-auto flex w-full max-w-[460px] flex-col">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="size-24 rounded-full object-cover ring-1 ring-stone-300"
        />
        <div
          v-else
          class="flex size-24 items-center justify-center rounded-full text-3xl text-white"
          :style="{ background: accent, fontFamily: 'Playfair Display, serif' }"
        >
          {{ initials }}
        </div>

        <h1 class="classic-title mt-5 text-3xl font-semibold tracking-tight">
          {{ title }}
        </h1>
        <div class="mt-3 h-px w-10 bg-stone-300" />
        <p
          v-if="bio"
          class="mt-3 max-w-sm text-sm italic leading-relaxed text-stone-500"
        >
          {{ bio }}
        </p>
      </header>

      <div
        v-if="socialBlocks.length"
        class="mt-6 flex flex-wrap justify-center gap-5"
      >
        <SocialBlock
          v-for="(b, i) in socialBlocks"
          :key="`s-${i}`"
          :config="b.config"
        />
      </div>

      <div class="mt-8 space-y-3">
        <BlockRenderer v-for="(b, i) in inlineBlocks" :key="`b-${i}`" :block="b" />
      </div>

      <a
        v-if="showBranding"
        href="/"
        class="mt-12 flex items-center justify-center gap-1.5 text-xs opacity-60 transition hover:opacity-100"
        :style="{ color: 'var(--lp-muted)' }"
      >
        <span>Criado por</span>
        <svg class="size-3.5 shrink-0" viewBox="0 0 32 32" aria-hidden="true">
          <rect width="32" height="32" rx="8" fill="currentColor" opacity="0.25" />
          <g transform="translate(6 6) scale(0.835)" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </g>
        </svg>
        <span class="font-semibold">LinkLand</span>
      </a>
    </div>

    <WhatsappButton v-if="whatsapp" :config="whatsapp.config" :fixed="!preview" />
  </div>
</template>

<style scoped>
/* Template "classic": papel quente, tipografia serifada, sóbrio. */
.classic-root {
  background: #faf8f4;
  --lp-text: #1c1917;
  --lp-muted: #78716c;
  --lp-link-bg: #ffffff;
  --lp-link-fg: #1c1917;
  --lp-link-border: #d6d3d1;
  --lp-link-radius: 0.5rem;
  --lp-link-shadow: 0 6px 18px rgb(28 25 23 / 0.08);
}
.classic-title {
  font-family: 'Playfair Display', Georgia, serif;
  color: var(--lp-text);
}
.classic-root :deep(.lp-link) {
  font-weight: 500;
  letter-spacing: 0.01em;
}
</style>
