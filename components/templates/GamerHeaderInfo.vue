<script setup lang="ts">
import type { GamerProfile } from '~/types/api'

defineProps<{ meta: GamerProfile }>()
</script>

<template>
  <div class="lp-gamer-info" data-testid="gamer-header">
    <span v-if="meta.gamertag" class="lp-gamer-info__tag">@{{ meta.gamertag }}</span>
    <span v-if="meta.main_game">
      <UIcon name="i-lucide-gamepad-2" class="size-3.5 align-[-2px]" aria-hidden="true" />
      {{ meta.main_game }}
    </span>
    <span v-if="meta.region">
      <UIcon name="i-lucide-map-pin" class="size-3.5 align-[-2px]" aria-hidden="true" />
      {{ meta.region }}
    </span>
    <span v-if="meta.looking_for_group" class="lp-gamer-info__lfg">
      <span class="lp-gamer-info__dot" aria-hidden="true" />
      Procurando squad
    </span>
  </div>
</template>
