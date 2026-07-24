<script setup lang="ts">
import type { PublicTab } from '~/types/api'

// Toggle de seções na página pública. Fica logo abaixo do cabeçalho (via slot
// do template) e herda o tema pelas variáveis --lp-* já definidas no root de
// cada template. O segmento ativo usa o par de cores dos botões (--lp-link-*),
// que o template garante ser legível — então funciona em qualquer tema.
defineProps<{ tabs: PublicTab[] }>()
const model = defineModel<string>({ required: true })
</script>

<template>
  <div class="mt-6 flex justify-center">
    <div class="lp-tabs" role="tablist">
      <button
        v-for="t in tabs"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="t.id === model"
        class="lp-tab"
        :class="{ 'lp-tab--active': t.id === model }"
        @click="model = t.id"
      >
        <UIcon v-if="t.icon" :name="t.icon" class="size-4 shrink-0" />
        <span class="truncate">{{ t.name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.lp-tabs {
  display: inline-flex;
  max-width: 100%;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.25rem;
  padding: 0.25rem;
  border-radius: 9999px;
  border: 1px solid var(--lp-link-border, rgb(0 0 0 / 0.1));
  background: var(--lp-link-bg, rgb(255 255 255 / 0.5));
}
.lp-tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 36px;
  max-width: 11rem;
  padding: 0.35rem 0.95rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  /* Ambas as pílulas sentam sobre --lp-link-bg (container), então precisam
     da mesma variável de contraste que a ativa usa — --lp-text é a cor do
     título/bio, sem relação com esse fundo. */
  color: var(--lp-link-fg, #111827);
  opacity: 0.6;
  transition: opacity 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
  -webkit-tap-highlight-color: transparent;
}
.lp-tab--active {
  opacity: 1;
  background: var(--lp-link-bg, #fff);
  color: var(--lp-link-fg, #111827);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.12), 0 0 0 1px var(--lp-accent, transparent);
}
@media (hover: hover) {
  .lp-tab:hover {
    opacity: 1;
  }
}
</style>
