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
  useTemplateLayout(props, '#22d3ee')
</script>

<template>
  <div
    class="neon-root px-5 py-14"
    :class="preview ? 'relative min-h-full' : 'min-h-screen'"
    :style="rootStyle"
  >
    <div class="lp-animate relative mx-auto flex w-full max-w-[480px] flex-col">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="size-24 rounded-full object-cover"
          :style="{ boxShadow: `0 0 0 2px ${accent}, 0 0 25px ${accent}80` }"
          fetchpriority="high"
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

      <BrandingBadge v-if="showBranding" />
    </div>

    <WhatsappButton v-if="whatsapp" :config="whatsapp.config" :fixed="!preview" />
  </div>
</template>

<style scoped>
/* Template "neon": fundo escuro com brilho de neon visível — os glows dao a
   personalidade; a base continua quase preta para máximo contraste. */
.neon-root {
  background:
    radial-gradient(55% 40% at 12% 0%, rgb(34 211 238 / 0.32), transparent 72%),
    radial-gradient(50% 38% at 88% 12%, rgb(217 70 239 / 0.28), transparent 72%),
    radial-gradient(70% 45% at 50% 108%, rgb(34 211 238 / 0.14), transparent 70%),
    #050507;
  --lp-text: #fafafa;
  --lp-muted: #a1a1aa;
  --lp-link-bg: rgb(255 255 255 / 0.03);
  --lp-link-fg: #fafafa;
  --lp-link-border: var(--lp-accent);
  --lp-link-radius: 0.75rem;
}
/* Onde houver suporte, o glow inferior acompanha a cor de accent do usuário. */
@supports (color: color-mix(in srgb, red 50%, blue)) {
  .neon-root {
    background:
      radial-gradient(55% 40% at 12% 0%, rgb(34 211 238 / 0.32), transparent 72%),
      radial-gradient(50% 38% at 88% 12%, rgb(217 70 239 / 0.28), transparent 72%),
      radial-gradient(70% 45% at 50% 108%, color-mix(in srgb, var(--lp-accent) 18%, transparent), transparent 70%),
      #050507;
  }
}

.neon-title {
  color: var(--lp-text);
  /* "Ignição" de letreiro neon: pisca 2x ao acender, uma única vez. */
  animation: neon-ignite 1.3s linear 1;
}
@keyframes neon-ignite {
  0% { opacity: 0; }
  6% { opacity: 1; }
  10% { opacity: 0.35; }
  16% { opacity: 1; }
  22% { opacity: 0.55; }
  28%, 100% { opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .neon-title { animation: none; }
}
.neon-root :deep(.lp-link) {
  box-shadow: 0 0 14px -2px var(--lp-accent);
}
@media (hover: hover) {
  .neon-root :deep(.lp-link:hover) {
    box-shadow: 0 0 22px 0 var(--lp-accent);
    border-color: var(--lp-accent);
  }
  /* Ícones sociais ganham brilho neon no hover (só quando hover existe;
     custo zero em repouso). */
  .neon-root :deep(.lp-social:hover) {
    filter: drop-shadow(0 0 6px var(--lp-accent));
  }
}
</style>
