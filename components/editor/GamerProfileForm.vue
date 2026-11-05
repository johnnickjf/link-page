<script setup lang="ts">
import type { GamerProfile, PageKind } from '~/types/api'

// "Perfil gamer" de uma página: liga o modo (qualquer plano) e edita o cabeçalho
// (gamertag etc., exclusivo do plano Gamer).
const kind = defineModel<PageKind>('kind', { required: true })
const meta = defineModel<GamerProfile>('meta', { required: true })
const emit = defineEmits<{ saveKind: [], saveMeta: [] }>()
defineProps<{ saving?: boolean }>()

const auth = useAuthStore()
const { open: openUpsell } = usePremiumUpsell()
const canEdit = computed(() => auth.hasFeature('gamer_header'))

const isGamer = computed({
  get: () => kind.value === 'gamer',
  set: (value) => {
    kind.value = value ? 'gamer' : 'standard'
    emit('saveKind')
  },
})
</script>

<template>
  <UCard data-testid="gamer-profile-form">
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-gamepad-2" class="size-4 text-gray-500" />
          <h2 class="font-display font-semibold">Perfil gamer</h2>
        </div>
        <USwitch v-model="isGamer" aria-label="Usar esta página como perfil gamer" />
      </div>
    </template>

    <p v-if="!isGamer" class="text-sm text-gray-600 dark:text-gray-400">
      Mostre seus IDs de jogo, jogos favoritos e canais de stream. Tudo o que já
      está na página continua igual.
    </p>

    <div
      v-else-if="!canEdit"
      class="flex cursor-pointer items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400"
      data-testid="gamer-header-locked"
      @click="openUpsell('gamer')"
    >
      <span>Gamertag, jogo principal, região e status de "procurando squad" no topo da página.</span>
      <UBadge color="primary" variant="subtle" size="sm" class="shrink-0">Gamer</UBadge>
    </div>

    <div v-else class="space-y-3">
      <div class="grid gap-3 sm:grid-cols-2">
        <UFormField label="Gamertag">
          <UInput v-model="meta.gamertag" maxlength="32" placeholder="seu_nick" class="w-full" />
        </UFormField>
        <UFormField label="Jogo principal">
          <UInput v-model="meta.main_game" maxlength="60" placeholder="Valorant" class="w-full" />
        </UFormField>
        <UFormField label="Região">
          <UInput v-model="meta.region" maxlength="40" placeholder="São Paulo, BR" class="w-full" />
        </UFormField>
      </div>
      <USwitch v-model="meta.looking_for_group" label="Procurando squad" />
      <div class="flex justify-end">
        <UButton :loading="saving" icon="i-lucide-save" @click="emit('saveMeta')">Salvar perfil</UButton>
      </div>
    </div>
  </UCard>
</template>
