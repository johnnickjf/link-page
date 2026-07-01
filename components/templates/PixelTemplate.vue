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
  useTemplateLayout(props, '#22c55e')

useHead({
  link: [{ rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap' }],
})
</script>

<template>
  <div
    class="pixel-root px-5 py-14"
    :class="preview ? 'relative min-h-full' : 'min-h-screen'"
    :style="rootStyle"
  >
    <div class="mx-auto flex w-full max-w-[480px] flex-col items-center pixel-content">

      <!-- Avatar quadrado -->
      <div class="pixel-avatar">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="pixel-avatar__img"
          fetchpriority="high"
        />
        <div v-else class="pixel-avatar__initials">{{ initials }}</div>
      </div>

      <!-- Título em fonte pixel -->
      <h1
        class="pixel-title mt-6 text-center"
        :style="{ color: 'var(--lp-text)' }"
      >
        {{ title }}
      </h1>

      <!-- Bio -->
      <p
        v-if="bio"
        class="pixel-bio mt-3 max-w-xs text-center"
        :style="{ color: 'var(--lp-muted)' }"
      >
        {{ bio }}
      </p>

      <!-- Redes sociais -->
      <div v-if="socialBlocks.length" class="mt-6 flex flex-wrap justify-center gap-5">
        <SocialBlock
          v-for="(b, i) in socialBlocks"
          :key="`s-${i}`"
          :config="b.config"
        />
      </div>

      <!-- Blocos de link -->
      <div class="mt-7 w-full space-y-3">
        <BlockRenderer v-for="(b, i) in inlineBlocks" :key="`b-${i}`" :block="b" />
      </div>

      <BrandingBadge v-if="showBranding" />
    </div>

    <WhatsappButton v-if="whatsapp" :config="whatsapp.config" :fixed="!preview" />
  </div>
</template>

<style scoped>
/* ── Base ── */
.pixel-root {
  position: relative;
  overflow: hidden;
  background-color: #0a0a16;

  --lp-text:        #f0f0f0;
  --lp-muted:       #7070a0;
  --lp-link-bg:     #0f0f28;
  --lp-link-fg:     var(--lp-accent);
  --lp-link-border: var(--lp-accent);
  --lp-link-radius: 0;
  --lp-link-shadow: 4px 4px 0 #000;
}

/* Grade sempre visível, independente da cor/fundo personalizado. */
.pixel-root::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.045) 1px, transparent 1px);
  background-size: 16px 16px;
}

/* Conteúdo acima da grade. */
.pixel-content {
  position: relative;
  z-index: 1;
}

/* ── Título ── */
.pixel-title {
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(0.6rem, 3.5vw, 0.875rem);
  line-height: 1.9;
  letter-spacing: 0.04em;
  text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.7);
}

/* ── Bio ── */
.pixel-bio {
  font-size: 0.75rem;
  line-height: 1.65;
}

/* ── Avatar quadrado ── */
.pixel-avatar {
  width: 88px;
  height: 88px;
  border: 3px solid var(--lp-accent);
  box-shadow: 4px 4px 0 #000;
  flex-shrink: 0;
}
.pixel-avatar__img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  image-rendering: pixelated;
}
.pixel-avatar__initials {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Press Start 2P', monospace;
  font-size: 1.5rem;
  color: var(--lp-accent);
  background: #0f0f28;
}

/* ── Botões: pixel shadow + sem translateY ── */
.pixel-root :deep(.lp-link) {
  border-width: 2px;
  font-size: 0.65rem;
  font-family: 'Press Start 2P', monospace;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  min-height: 44px; /* área de toque mínima recomendada (iOS HIG) */
  white-space: normal;
  word-break: break-word;
  box-shadow: 4px 4px 0 #000;
  transition: box-shadow 0.06s steps(1), transform 0.06s steps(1);
}
.pixel-root :deep(.lp-link:hover) {
  transform: none;
  box-shadow: 6px 6px 0 #000;
}
.pixel-root :deep(.lp-link:active) {
  transform: translate(4px, 4px);
  box-shadow: none;
}

/* ── Social: sem scale, apenas cor ── */
.pixel-root :deep(.lp-social:hover) {
  transform: none;
  color: var(--lp-text);
}
</style>
