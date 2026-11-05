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
    root-class="gradient-root px-5 py-14"
    content-class="relative mx-auto flex w-full max-w-[480px] flex-col"
    default-accent="#ffffff"
  >
    <template #header="{ initials }">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="size-24 rounded-full object-cover shadow-lg shadow-black/10 ring-4 ring-white/40"
          fetchpriority="high"
        />
        <div
          v-else
          class="flex size-24 items-center justify-center rounded-full bg-white/90 text-3xl font-bold text-purple-600 shadow-lg shadow-black/10 ring-4 ring-white/40"
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
/* Template "gradient": gradiente profundo + vidro. Os tons foram escurecidos
   para o texto branco ficar legível em toda a página, não só no topo. */
.gradient-root {
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, #4338ca 0%, #7e22ce 48%, #be185d 100%);
  --lp-accent: #ffffff;
  --lp-text: #ffffff;
  --lp-muted: rgb(255 255 255 / 0.86);
  --lp-link-bg: rgb(255 255 255 / 0.14);
  --lp-link-fg: #ffffff;
  --lp-link-border: rgb(255 255 255 / 0.3);
  --lp-link-radius: 1rem;
  --lp-link-rest-shadow: inset 0 1px 0 rgb(255 255 255 / 0.22);
  --lp-link-shadow: inset 0 1px 0 rgb(255 255 255 / 0.3), 0 14px 32px -8px rgb(0 0 0 / 0.35);
}

/* Brilho suave em movimento lento (premium). Anima só `transform`, que roda
   no compositor — sem repaint do gradiente inteiro a cada frame. */
.gradient-root::before {
  content: '';
  position: absolute;
  inset: -30%;
  pointer-events: none;
  background: radial-gradient(
    35% 35% at 30% 30%,
    rgb(255 255 255 / 0.14),
    transparent 70%
  );
  animation: gradient-sheen 22s ease-in-out infinite;
}
@keyframes gradient-sheen {
  0%, 100% { transform: translate(0%, 0%); }
  50% { transform: translate(28%, 22%); }
}

.gradient-root :deep(.lp-link) {
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  font-weight: 600;
}
@media (hover: hover) {
  .gradient-root :deep(.lp-link:hover) {
    background: rgb(255 255 255 / 0.25);
    border-color: rgb(255 255 255 / 0.5);
  }
}

@media (prefers-reduced-motion: reduce) {
  .gradient-root::before { animation: none; }
}
</style>
