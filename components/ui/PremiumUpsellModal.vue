<script setup lang="ts">
// Aparece quando a pessoa toca num recurso bloqueado. É o melhor momento para
// comparar: mostra o que aquele plano soma, quanto custa, e leva à tabela completa.
const { isOpen, plan, close } = usePremiumUpsell()

const features = computed(() => (plan.value === 'gamer' ? GAMER_EXCLUSIVE_FEATURES : PREMIUM_HIGHLIGHTS))
const price = computed(() => brl(plan.value === 'gamer' ? GAMER_PRICE_MONTHLY : PREMIUM_PRICE_MONTHLY))

function goToPlans(): void {
  close()
  navigateTo('/settings')
}
</script>

<template>
  <!-- Camada acima dos outros modais: ele também abre de dentro do modal de bloco,
       e sem isso o fundo daquele modal ficava na frente e bloqueava os botões. -->
  <UModal
    v-model:open="isOpen"
    :title="plan === 'gamer' ? 'Esse recurso é do plano Gamer' : 'Esse recurso é Premium'"
    :ui="{ overlay: 'z-[60]', content: 'z-[60]' }"
  >
    <template #body>
      <div class="space-y-4" data-testid="upsell-body">
        <div class="flex items-start gap-3">
          <div class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-700 dark:bg-primary-950 dark:text-primary-300">
            <UIcon name="i-lucide-crown" class="size-6" />
          </div>
          <p v-if="plan === 'gamer'" class="text-sm text-gray-700 dark:text-gray-200">
            O plano Gamer tem tudo do Premium e soma o que um perfil de jogador precisa:
          </p>
          <p v-else class="text-sm text-gray-700 dark:text-gray-200">
            O Premium tem tudo do plano Free e soma:
          </p>
        </div>

        <ul class="space-y-2 rounded-xl bg-gray-50 p-4 text-sm dark:bg-gray-800/60">
          <li v-for="f in features" :key="f" class="flex items-start gap-2.5">
            <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-primary-600 dark:text-primary-400" />
            <span>{{ f }}</span>
          </li>
        </ul>

        <p class="text-center text-sm text-gray-700 dark:text-gray-200">
          <strong class="text-gray-950 dark:text-white">R${{ price }}/mês</strong>
          · cancele quando quiser
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
          Comparar planos e assinar
        </UButton>
      </div>
    </template>
  </UModal>
</template>
