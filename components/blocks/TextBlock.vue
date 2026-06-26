<script setup lang="ts">
import type { TextConfig } from '~/types/api'

defineProps<{ config: TextConfig }>()
</script>

<template>
  <p
    class="whitespace-pre-line text-center leading-relaxed"
    :style="{ color: 'var(--lp-text, #111827)' }"
  >
    {{ config.content }}
  </p>
</template>
