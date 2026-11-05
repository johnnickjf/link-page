<script setup lang="ts">
import type { GameItem, GamesConfig } from '~/types/api'

const props = defineProps<{ config: GamesConfig }>()

// Até 2 jogos, em lista (capas pequenas ficariam perdidas); a partir de 3, grade.
const asGrid = computed(() => props.config.items.length >= 3)

function initial(name: string): string {
  return name.trim().charAt(0).toUpperCase() || '?'
}

function meta(game: GameItem): string {
  const parts: string[] = []
  if (game.rank) parts.push(game.rank)
  if (game.hours != null) parts.push(`${game.hours.toLocaleString('pt-BR')} h`)
  return parts.join(' · ')
}

function safeCover(game: GameItem): string | undefined {
  return game.cover_url && /^https?:/i.test(game.cover_url) ? game.cover_url : undefined
}
</script>

<template>
  <section class="lp-card">
    <h2 v-if="config.title" class="lp-card__title">{{ config.title }}</h2>
    <ul :class="asGrid ? 'lp-games--grid' : 'lp-games--list'">
      <li v-for="(game, i) in config.items" :key="i" class="lp-game">
        <img
          v-if="safeCover(game)"
          :src="safeCover(game)"
          :alt="`Capa de ${game.name}`"
          loading="lazy"
          class="lp-game__cover"
        />
        <span v-else class="lp-game__cover lp-game__cover--empty" aria-hidden="true">
          {{ initial(game.name) }}
        </span>
        <span class="lp-game__text">
          <span class="lp-game__name">{{ game.name }}</span>
          <span v-if="meta(game)" class="lp-game__meta">{{ meta(game) }}</span>
        </span>
      </li>
    </ul>
  </section>
</template>
