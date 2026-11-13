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
    root-class="aurora-root px-5 py-14"
    content-class="aurora-content mx-auto flex w-full max-w-[480px] flex-col"
    default-accent="#7c3aed"
  >
    <template #header="{ initials }">
      <header class="flex flex-col items-center text-center">
        <div class="aurora-ring">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="title"
            class="aurora-avatar object-cover"
            fetchpriority="high"
          />
          <div v-else class="aurora-avatar aurora-avatar--initials">{{ initials }}</div>
        </div>

        <h1 class="aurora-title mt-5 font-display">{{ title }}</h1>
        <p
          v-if="bio"
          class="mt-2 max-w-sm leading-relaxed"
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
/* Template "aurora": claro e leve. Manchas de cor suaves no fundo e botões de
   vidro fosco, para quem quer uma página sofisticada sem ser escura. */
.aurora-root {
  position: relative;
  overflow: hidden;
  background-color: #fbf8ff;
  background-image:
    radial-gradient(48% 30% at 6% 2%, rgb(233 213 255 / 0.95), transparent 72%),
    radial-gradient(44% 28% at 96% 10%, rgb(252 207 232 / 0.85), transparent 72%),
    radial-gradient(52% 30% at 80% 96%, rgb(254 215 170 / 0.6), transparent 72%),
    radial-gradient(50% 30% at 4% 82%, rgb(199 210 254 / 0.7), transparent 72%);
  --lp-text: #1e1b2e;
  --lp-muted: #4f4a63;
  --lp-link-bg: rgb(255 255 255 / 0.66);
  --lp-link-fg: #1e1b2e;
  --lp-link-border: rgb(255 255 255 / 0.95);
  --lp-link-radius: 1.1rem;
  --lp-link-rest-shadow: 0 6px 20px -10px rgb(76 29 149 / 0.35);
  --lp-link-shadow: 0 14px 30px -12px rgb(76 29 149 / 0.45);
}
.aurora-root :deep(.aurora-content) {
  position: relative;
}
.aurora-ring {
  padding: 3px;
  border-radius: 9999px;
  background: linear-gradient(135deg, #c084fc, #f472b6 55%, #fb923c);
  box-shadow: 0 12px 30px -12px rgb(124 58 237 / 0.55);
}
.aurora-avatar {
  width: 6rem;
  height: 6rem;
  border: 3px solid #fff;
  border-radius: 9999px;
}
.aurora-avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f0ff;
  color: #5b21b6;
  font-size: 2.1rem;
  font-weight: 700;
}
.aurora-title {
  color: var(--lp-text);
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
  overflow-wrap: anywhere;
}
/* Vidro fosco: o borrão só onde o navegador aguenta; sem ele o botão continua
   legível porque o fundo branco já é quase opaco. */
@supports (backdrop-filter: blur(8px)) {
  .aurora-root :deep(.lp-link) {
    backdrop-filter: blur(10px) saturate(1.2);
  }
}
.aurora-root :deep(.lp-link) {
  font-weight: 600;
}
</style>
