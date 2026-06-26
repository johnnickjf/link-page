<script setup lang="ts">
import type { ImageConfig } from '~/types/api'

defineProps<{ config: ImageConfig }>()
</script>

<template>
  <component
    :is="config.link ? 'a' : 'div'"
    :href="config.link || undefined"
    :target="config.link ? '_blank' : undefined"
    :rel="config.link ? 'noopener noreferrer' : undefined"
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
