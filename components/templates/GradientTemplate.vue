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

const { inlineBlocks, socialBlocks, whatsapp, initials, showBranding, rootStyle } =
  useTemplateLayout(props, '#ffffff')
</script>

<template>
  <div
    class="gradient-root px-5 py-14"
    :class="preview ? 'relative min-h-full' : 'min-h-screen'"
    :style="rootStyle"
  >
    <div class="mx-auto flex w-full max-w-[480px] flex-col">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="size-24 rounded-full object-cover ring-4 ring-white/40"
        />
        <div
          v-else
          class="flex size-24 items-center justify-center rounded-full bg-white/90 text-3xl font-bold text-purple-600 ring-4 ring-white/40"
        >
          {{ initials }}
        </div>

        <h1 class="mt-4 font-display text-2xl font-bold tracking-tight text-white">
          {{ title }}
        </h1>
        <p v-if="bio" class="mt-2 max-w-sm text-sm leading-relaxed text-white/80">
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
        class="mt-12 flex items-center justify-center gap-1.5 text-xs opacity-70 transition hover:opacity-100"
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
/* Template "gradient": fundo vibrante + cards translúcidos (glass). */
.gradient-root {
  background: linear-gradient(160deg, #6366f1 0%, #a855f7 45%, #ec4899 100%);
  --lp-accent: #ffffff;
  --lp-text: #ffffff;
  --lp-muted: rgb(255 255 255 / 0.8);
  --lp-link-bg: rgb(255 255 255 / 0.15);
  --lp-link-fg: #ffffff;
  --lp-link-border: rgb(255 255 255 / 0.3);
  --lp-link-radius: 1rem;
  --lp-link-shadow: 0 10px 30px rgb(0 0 0 / 0.18);
}
.gradient-root :deep(.lp-link) {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-weight: 600;
}
.gradient-root :deep(.lp-link:hover) {
  background: rgb(255 255 255 / 0.25);
  border-color: rgb(255 255 255 / 0.5);
}
</style>
