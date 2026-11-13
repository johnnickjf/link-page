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
    root-class="quest-root px-5 py-14"
    content-class="quest-content mx-auto flex w-full max-w-[480px] flex-col"
    default-accent="#c084fc"
  >
    <template #header="{ initials }">
      <header class="flex flex-col items-center text-center">
        <div class="quest-frame">
          <img
            v-if="avatarUrl"
            :src="avatarUrl"
            :alt="title"
            class="quest-avatar object-cover"
            fetchpriority="high"
          />
          <div v-else class="quest-avatar quest-avatar--initials">{{ initials }}</div>
        </div>

        <div class="quest-heading mt-5">
          <span aria-hidden="true">✦</span>
          <h1 class="quest-title">{{ title }}</h1>
          <span aria-hidden="true">✦</span>
        </div>
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
/* Template "quest": menu de RPG à noite. Céu estrelado, moldura dupla nos
   botões e avatar num brasão hexagonal, com a cor de destaque como magia. */
.quest-root {
  position: relative;
  overflow: hidden;
  background-color: #14101d;
  background-image:
    radial-gradient(1px 1px at 12% 18%, rgb(255 255 255 / 0.7), transparent 60%),
    radial-gradient(1px 1px at 78% 9%, rgb(255 255 255 / 0.6), transparent 60%),
    radial-gradient(1.5px 1.5px at 62% 31%, rgb(255 255 255 / 0.5), transparent 60%),
    radial-gradient(1px 1px at 30% 52%, rgb(255 255 255 / 0.45), transparent 60%),
    radial-gradient(1.5px 1.5px at 88% 64%, rgb(255 255 255 / 0.4), transparent 60%),
    radial-gradient(1px 1px at 8% 80%, rgb(255 255 255 / 0.4), transparent 60%),
    radial-gradient(60% 34% at 50% 0%, color-mix(in srgb, var(--lp-accent) 24%, transparent), transparent 75%),
    radial-gradient(70% 40% at 50% 110%, rgb(56 34 92 / 0.9), transparent 70%);
  --lp-text: #f4ecdb;
  --lp-muted: #cbc1aa;
  --lp-link-bg: linear-gradient(180deg, rgb(255 255 255 / 0.07), rgb(255 255 255 / 0.02));
  --lp-link-fg: #f4ecdb;
  --lp-link-border: color-mix(in srgb, var(--lp-accent) 70%, transparent);
  --lp-link-radius: 0.45rem;
  /* Moldura dupla: o anel interno é translúcido para funcionar também quando a
     pessoa escolhe outra cor de botão. */
  --lp-link-rest-shadow: inset 0 0 0 3px rgb(0 0 0 / 0.3), inset 0 0 0 4px color-mix(in srgb, var(--lp-accent) 30%, transparent);
  --lp-link-shadow: inset 0 0 0 3px rgb(0 0 0 / 0.3), inset 0 0 0 4px var(--lp-accent), 0 0 22px -6px var(--lp-accent);
}
.quest-root :deep(.quest-content) {
  position: relative;
}
/* Brasão hexagonal: a moldura é a cor de destaque aparecendo por trás. */
.quest-frame {
  padding: 4px;
  background: linear-gradient(160deg, var(--lp-accent), #f4ecdb 50%, var(--lp-accent));
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
  filter: drop-shadow(0 0 14px color-mix(in srgb, var(--lp-accent) 60%, transparent));
}
.quest-avatar {
  width: 6.25rem;
  height: 7rem;
  clip-path: polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%);
}
.quest-avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #221a31;
  color: #f4ecdb;
  font-family: 'Cinzel', Georgia, serif;
  font-size: 2.2rem;
  font-weight: 700;
}
.quest-heading {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--lp-accent);
}
.quest-title {
  color: var(--lp-text);
  font-family: 'Cinzel', Georgia, serif;
  font-size: 1.7rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  line-height: 1.2;
  overflow-wrap: anywhere;
  text-shadow: 0 2px 0 rgb(0 0 0 / 0.45);
}
.quest-root :deep(.lp-link) {
  font-weight: 600;
  letter-spacing: 0.02em;
}
/* No hover o item avança um pouco, como a seleção de um menu de jogo. */
@media (hover: hover) {
  .quest-root :deep(.lp-link:hover) {
    transform: translateX(3px);
  }
}
</style>
