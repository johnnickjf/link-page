<script setup lang="ts">
import type { BadgesConfig } from '~/types/api'

defineProps<{ config: BadgesConfig }>()
</script>

<template>
  <section class="lp-card">
    <h2 v-if="config.title" class="lp-card__title">{{ config.title }}</h2>
    <ul class="lp-badges">
      <li v-for="(badge, i) in config.items" :key="i" class="lp-badge">
        <span class="lp-badge__icon" aria-hidden="true">
          <UIcon :name="BADGE_ICONS[badge.icon ?? 'trophy'] ?? BADGE_ICONS.trophy!" class="size-5" />
        </span>
        <span class="min-w-0">
          <span class="lp-badge__title">{{ badge.title }}</span>
          <span v-if="badge.description" class="lp-badge__desc">{{ badge.description }}</span>
        </span>
      </li>
    </ul>
  </section>
</template>
