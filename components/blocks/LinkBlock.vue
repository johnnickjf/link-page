<script setup lang="ts">
import type { LinkConfig } from '~/types/api'

defineProps<{ config: LinkConfig }>()
</script>

<template>
  <a
    :href="config.url"
    target="_blank"
    rel="noopener noreferrer"
    class="lp-link"
  >
    <UIcon v-if="config.icon" :name="config.icon" class="size-5 shrink-0" />
    <span>{{ config.label }}</span>
  </a>
</template>
