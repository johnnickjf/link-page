<script setup lang="ts">
const { isOpen, plan, close } = usePremiumUpsell()

function goToPlans(): void {
  close()
  navigateTo('/settings')
}
</script>

<template>
  <UModal v-model:open="isOpen" :title="plan === 'gamer' ? 'Esse recurso é do plano Gamer' : 'Esse recurso é Premium'">
    <template #body>
      <div class="flex flex-col items-center gap-4 py-2 text-center">
        <div class="flex size-14 items-center justify-center rounded-2xl bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
          <UIcon name="i-lucide-crown" class="size-7" />
        </div>
        <p v-if="plan === 'gamer'" class="text-sm text-gray-600 dark:text-gray-300">
          O plano Gamer tem tudo do Premium e libera temas gamer, conquistas,
          player da Twitch e do YouTube, cabeçalho com gamertag e mais jogos.
        </p>
        <p v-else class="text-sm text-gray-600 dark:text-gray-300">
          Assine o LinkLand Premium agora com desconto e libere templates
          exclusivos, fontes e fundo personalizados, QR Code e muito mais.
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <UButton variant="ghost" color="neutral" class="w-full sm:w-auto" @click="close">
          Agora não
        </UButton>
        <UButton
          icon="i-lucide-crown"
          class="w-full sm:w-auto"
          @click="goToPlans"
        >
          Assinar agora
        </UButton>
      </div>
    </template>
  </UModal>
</template>
