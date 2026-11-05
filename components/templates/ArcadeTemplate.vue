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
    root-class="arcade-root px-5 py-14"
    content-class="arcade-content mx-auto flex w-full max-w-[480px] flex-col"
    default-accent="#ff4fd8"
  >
    <template #header="{ initials }">
      <header class="flex flex-col items-center text-center">
        <div class="arcade-sun" aria-hidden="true" />
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="arcade-avatar object-cover"
          fetchpriority="high"
        />
        <div v-else class="arcade-avatar arcade-avatar--initials">{{ initials }}</div>

        <h1 class="arcade-title mt-8">{{ title }}</h1>
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
/* Template "arcade": fliperama dos anos 80. Sol listrado atrás do avatar, chão
   quadriculado em perspectiva e tudo em magenta e ciano sobre roxo profundo. */
.arcade-root {
  position: relative;
  overflow: hidden;
  background: linear-gradient(180deg, #12052e 0%, #2a0a4a 58%, #16042c 100%);
  --lp-text: #ffffff;
  --lp-muted: #dccdf5;
  --lp-link-bg: rgb(18 5 46 / 0.78);
  --lp-link-fg: #ffffff;
  --lp-link-border: var(--lp-accent);
  --lp-link-radius: 0.5rem;
  --lp-link-rest-shadow: 3px 3px 0 #22d3ee;
  --lp-link-shadow: 5px 5px 0 #22d3ee;
}
/* Chão: grade em perspectiva que some em direção ao horizonte. */
.arcade-root::after {
  content: '';
  position: absolute;
  left: -50%;
  right: -50%;
  bottom: 0;
  height: 340px;
  pointer-events: none;
  background-image:
    linear-gradient(rgb(255 79 216 / 0.45) 1px, transparent 1px),
    linear-gradient(90deg, rgb(255 79 216 / 0.45) 1px, transparent 1px);
  background-size: 44px 44px;
  transform: perspective(280px) rotateX(58deg);
  transform-origin: bottom;
  -webkit-mask-image: linear-gradient(to top, #000 10%, transparent 90%);
  mask-image: linear-gradient(to top, #000 10%, transparent 90%);
}
.arcade-root :deep(.arcade-content) {
  position: relative;
  z-index: 1;
}
.arcade-sun {
  position: absolute;
  top: -1.5rem;
  left: 50%;
  width: 9rem;
  height: 9rem;
  border-radius: 9999px;
  background: linear-gradient(180deg, #ffd166 0%, #ff4fd8 62%, #7c3aed 100%);
  transform: translateX(-50%);
  -webkit-mask-image: repeating-linear-gradient(180deg, #000 0 11px, transparent 11px 14px);
  mask-image: repeating-linear-gradient(180deg, #000 0 11px, transparent 11px 14px);
  opacity: 0.85;
}
.arcade-avatar {
  position: relative;
  width: 6rem;
  height: 6rem;
  border-radius: 9999px;
  box-shadow: 0 0 0 3px #12052e, 0 0 0 5px var(--lp-accent);
}
.arcade-avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #12052e;
  color: #fff;
  font-family: 'Audiowide', ui-sans-serif, sans-serif;
  font-size: 2rem;
}
.arcade-title {
  position: relative;
  color: var(--lp-text);
  font-family: 'Audiowide', ui-sans-serif, sans-serif;
  font-size: 1.6rem;
  line-height: 1.2;
  overflow-wrap: anywhere;
  text-shadow: 2px 2px 0 #7c3aed;
}
.arcade-root :deep(.lp-link) {
  border-width: 2px;
  font-weight: 600;
}
@media (hover: hover) {
  .arcade-root :deep(.lp-link:hover) {
    transform: translate(-2px, -2px);
  }
}
.arcade-root :deep(.lp-link:active) {
  transform: translate(3px, 3px);
  box-shadow: none;
}
</style>
