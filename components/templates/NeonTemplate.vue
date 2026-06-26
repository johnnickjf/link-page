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

const { inlineBlocks, socialBlocks, whatsapp, accent, initials } =
  useTemplateLayout(props, '#22d3ee')
</script>

<template>
  <div
    class="neon-root px-5 py-14"
    :class="preview ? 'relative min-h-full' : 'min-h-screen'"
    :style="{ '--lp-accent': accent }"
  >
    <div class="relative mx-auto flex w-full max-w-[480px] flex-col">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="size-24 rounded-full object-cover"
          :style="{ boxShadow: `0 0 0 2px ${accent}, 0 0 25px ${accent}80` }"
        />
        <div
          v-else
          class="flex size-24 items-center justify-center rounded-full text-3xl font-bold"
          :style="{
            color: accent,
            border: `2px solid ${accent}`,
            boxShadow: `0 0 25px ${accent}80, inset 0 0 18px ${accent}30`,
          }"
        >
          {{ initials }}
        </div>

        <h1
          class="neon-title mt-5 font-display text-2xl font-bold tracking-tight"
          :style="{ textShadow: `0 0 18px ${accent}99` }"
        >
          {{ title }}
        </h1>
        <p v-if="bio" class="mt-2 max-w-sm text-sm leading-relaxed text-zinc-400">
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

      <p class="mt-12 text-center text-xs text-zinc-500">
        feito com <a href="/" class="font-semibold hover:underline">LinkLand</a>
      </p>
    </div>

    <WhatsappButton v-if="whatsapp" :config="whatsapp.config" :fixed="!preview" />
  </div>
</template>

<style scoped>
/* Template "neon": fundo escuro com brilho de neon contido. */
.neon-root {
  background:
    radial-gradient(40% 30% at 15% 0%, rgb(34 211 238 / 0.18), transparent 70%),
    radial-gradient(40% 30% at 85% 20%, rgb(217 70 239 / 0.16), transparent 70%),
    #050507;
  --lp-text: #fafafa;
  --lp-muted: #a1a1aa;
  --lp-link-bg: rgb(255 255 255 / 0.03);
  --lp-link-fg: #fafafa;
  --lp-link-border: var(--lp-accent);
  --lp-link-radius: 0.75rem;
}
.neon-title {
  color: var(--lp-text);
}
.neon-root :deep(.lp-link) {
  box-shadow: 0 0 14px -2px var(--lp-accent);
}
.neon-root :deep(.lp-link:hover) {
  box-shadow: 0 0 22px 0 var(--lp-accent);
  border-color: var(--lp-accent);
}
</style>
