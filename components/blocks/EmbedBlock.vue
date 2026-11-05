<script setup lang="ts">
import type { EmbedConfig } from '~/types/api'

// Só carrega o player de terceiros quando o visitante pede: a página pública
// continua leve e nenhum cookie da Twitch/YouTube/Discord entra antes do clique.
const props = defineProps<{ config: EmbedConfig }>()

const provider = computed(() => EMBED_PROVIDERS[props.config.provider])
const src = ref<string | null>(null)

function load(): void {
  src.value = embedSrc(props.config.provider, props.config.value, window.location.hostname)
}
</script>

<template>
  <div class="lp-card lp-embed" :class="{ 'lp-embed--tall': config.provider === 'discord' && src }">
    <iframe
      v-if="src"
      :src="src"
      :title="config.label || provider.label"
      class="size-full border-0"
      allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    />
    <button v-else type="button" class="lp-embed__facade" @click="load">
      <UIcon :name="provider.icon" class="size-9" />
      <span class="font-semibold">{{ config.label || provider.cta }}</span>
      <span class="lp-embed__hint">Toque para carregar o player</span>
    </button>
  </div>
</template>
