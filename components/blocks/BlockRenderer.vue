<script setup lang="ts">
import type { PublicBlock } from '~/types/api'

// Despacha blocos "em linha" (link / texto / imagem). Social e WhatsApp são
// tratados separadamente pelo template (linha de ícones / botão flutuante).
defineProps<{ block: PublicBlock }>()
</script>

<template>
  <LinkBlock v-if="block.type === 'link'" :config="block.config" />
  <TextBlock v-else-if="block.type === 'text'" :config="block.config" />
  <ImageBlock v-else-if="block.type === 'image'" :config="block.config" />
</template>
