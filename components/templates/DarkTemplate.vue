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
  useTemplateLayout(props, '#a78bfa')
</script>

<template>
  <div
    class="dark-root px-5 py-14"
    :class="preview ? 'relative min-h-full' : 'min-h-screen'"
    :style="rootStyle"
  >
    <div class="relative mx-auto flex w-full max-w-[480px] flex-col">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="size-24 rounded-full object-cover"
          :style="{ boxShadow: `0 0 0 2px ${accent}55, 0 8px 30px ${accent}40` }"
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

      <div v-if="showBranding" class="mt-12 flex justify-center opacity-60 transition hover:opacity-100">
        <Logo sm to="/" />
      </div>
    </div>

    <WhatsappButton v-if="whatsapp" :config="whatsapp.config" :fixed="!preview" />
  </div>
</template>

<style scoped>
/* Template "dark": fundo escuro elegante, acento suave. */
.dark-root {
  background:
    radial-gradient(60% 40% at 50% 0%, rgb(255 255 255 / 0.06), transparent 70%),
    #09090b;
  --lp-text: #fafafa;
  --lp-muted: #a1a1aa;
  --lp-link-bg: #18181b;
  --lp-link-fg: #fafafa;
  --lp-link-border: #27272a;
  --lp-link-radius: 0.9rem;
  --lp-link-shadow: 0 12px 30px rgb(0 0 0 / 0.5);
}
</style>
