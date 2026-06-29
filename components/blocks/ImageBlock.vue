<script setup lang="ts">
import type { ImageConfig } from '~/types/api'

const props = defineProps<{ config: ImageConfig }>()

// Só vira link se a URL for segura (http/https/...); senão, fica só imagem.
const href = computed(() => safeUrl(props.config.link))
</script>

<template>
  <component
    :is="href ? 'a' : 'div'"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    class="block overflow-hidden"
    :style="{ borderRadius: 'var(--lp-link-radius, 0.9rem)' }"
  >
    <img
      :src="config.url"
      :alt="config.alt || ''"
      loading="lazy"
      class="w-full object-cover"
    />
  </component>
</template>
