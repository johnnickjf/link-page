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
    root-class="cozy-root px-5 py-14"
    content-class="cozy-content mx-auto flex w-full max-w-[480px] flex-col"
    default-accent="#4f7f4b"
  >
    <template #header="{ initials }">
      <header class="flex flex-col items-center text-center">
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="title"
          class="cozy-avatar object-cover"
          fetchpriority="high"
        />
        <div v-else class="cozy-avatar cozy-avatar--initials">{{ initials }}</div>

        <h1 class="cozy-title mt-5">{{ title }}</h1>
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
/* Template "cozy": fim de tarde na fazendinha. Creme, sálvia e pêssego, cantos
   bem redondos e botões fofos que afundam ao toque. */
.cozy-root {
  position: relative;
  overflow: hidden;
  background-color: #f7f0e1;
  background-image:
    radial-gradient(38% 24% at 12% 4%, rgb(246 196 160 / 0.55), transparent 72%),
    radial-gradient(40% 26% at 92% 16%, rgb(168 205 160 / 0.5), transparent 72%),
    radial-gradient(50% 24% at 40% 104%, rgb(246 196 160 / 0.4), transparent 72%);
  font-family: 'Fredoka', ui-rounded, ui-sans-serif, system-ui, sans-serif;
  --lp-text: #3d382c;
  --lp-muted: #635c4c;
  --lp-link-bg: #fffdf6;
  --lp-link-fg: #3d382c;
  --lp-link-border: #e3d9bf;
  --lp-link-radius: 1.4rem;
  --lp-link-rest-shadow: 0 4px 0 #e3d9bf;
  --lp-link-shadow: 0 6px 0 #d8ccad;
}
.cozy-root :deep(.cozy-content) {
  position: relative;
}
.cozy-avatar {
  width: 6.25rem;
  height: 6.25rem;
  border: 4px solid #fffdf6;
  border-radius: 40% 60% 55% 45% / 50% 45% 55% 50%;
  box-shadow: 0 4px 0 #e3d9bf;
}
.cozy-avatar--initials {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #cfe3c8;
  color: #2f4f2c;
  font-size: 2.5rem;
  font-weight: 600;
}
.cozy-title {
  color: var(--lp-text);
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1.15;
  overflow-wrap: anywhere;
}
.cozy-root :deep(.lp-link) {
  font-size: 1.05rem;
}
.cozy-root :deep(.lp-link:active) {
  transform: translateY(4px);
  box-shadow: none;
}
</style>
