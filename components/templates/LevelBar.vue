<script setup lang="ts">
import type { PageProgress } from '~/types/api'

const props = defineProps<{ progress: PageProgress }>()

const isMax = computed(() => props.progress.next_level_xp === null)
const percent = computed(() => {
  const { xp, level_xp: start, next_level_xp: end } = props.progress
  if (end === null) return 100
  return Math.min(100, Math.max(0, ((xp - start) / (end - start)) * 100))
})
const fmt = (n: number) => n.toLocaleString('pt-BR')
</script>

<template>
  <div class="lp-level" data-testid="level-bar">
    <div class="lp-level__row">
      <span class="lp-level__badge">Nv. {{ progress.level }}</span>
      <span class="lp-level__xp">
        <template v-if="isMax">{{ fmt(progress.xp) }} XP · nível máximo</template>
        <template v-else>{{ fmt(progress.xp) }} / {{ fmt(progress.next_level_xp!) }} XP</template>
      </span>
    </div>
    <div
      class="lp-level__track"
      role="progressbar"
      :aria-label="`Progresso para o nível ${progress.level + 1}`"
      :aria-valuenow="Math.round(percent)"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <div class="lp-level__fill" :style="{ width: `${percent}%` }" />
    </div>
  </div>
</template>
