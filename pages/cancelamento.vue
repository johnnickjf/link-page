<script setup lang="ts">
definePageMeta({ middleware: 'auth' })
useHead({ title: 'Assinatura cancelada · LinkLand' })

const auth = useAuthStore()
const { fetchMe } = useAuth()
const toast = useToast()

const selected = ref<string | null>(null)
const otherFeedback = ref('')
const submitted = ref(false)
const submitting = ref(false)

const reasons = [
  { value: 'price', label: 'O preço está alto demais' },
  { value: 'features', label: 'Faltam recursos que preciso' },
  { value: 'not_using', label: 'Não estou usando tanto quanto esperava' },
  { value: 'found_alternative', label: 'Encontrei outra solução' },
  { value: 'temporary', label: 'É temporário, voltarei em breve' },
  { value: 'other', label: 'Outro motivo' },
]

const stillPremium = ref(false)

onMounted(async () => {
  // Recarrega o plano do usuário (pode ter sido downgraded pelo webhook)
  try {
    await fetchMe()
  } catch {
    // ignora
  }
  // Se o usuário voltou do portal sem cancelar, ainda é premium
  if (auth.user?.plan === 'premium') {
    stillPremium.value = true
  }
})

async function onSubmit(): Promise<void> {
  submitting.value = true
  // Aqui você pode enviar o feedback para um endpoint de analytics/CRM.
  // Por ora, simula uma chamada e exibe confirmação.
  await new Promise((r) => setTimeout(r, 600))
  submitted.value = true
  submitting.value = false
  toast.add({ title: 'Feedback enviado. Obrigado!', color: 'success' })
}
</script>

<template>
  <div class="mx-auto max-w-lg py-12">
    <div class="mb-8 text-center">
      <Logo class="mx-auto mb-6" />
    </div>

    <!-- Usuário voltou do portal sem cancelar -->
    <UAlert
      v-if="stillPremium"
      class="mb-6"
      color="success"
      variant="soft"
      icon="i-lucide-sparkles"
      title="Sua assinatura Premium continua ativa!"
      description="Suas alterações foram salvas. Aproveite todos os recursos Premium."
    >
      <template #actions>
        <UButton size="sm" variant="subtle" color="success" to="/dashboard">
          Ir ao dashboard
        </UButton>
      </template>
    </UAlert>

    <UCard>
      <template #header>
        <div class="text-center">
          <div class="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
            <UIcon name="i-lucide-heart-crack" class="size-7 text-gray-500" />
          </div>
          <h1 class="text-xl font-bold tracking-tight">Assinatura cancelada</h1>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Lamentamos que você esteja indo embora{{ auth.user?.name ? `, ${auth.user.name.split(' ')[0]}` : '' }}.
            Seu acesso Premium continua até o fim do período atual.
          </p>
        </div>
      </template>

      <div v-if="!submitted" class="space-y-5">
        <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
          Pode nos contar o motivo do cancelamento?
        </p>

        <div class="space-y-2">
          <label
            v-for="reason in reasons"
            :key="reason.value"
            class="flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors"
            :class="
              selected === reason.value
                ? 'border-primary-500 bg-primary-50 dark:border-primary-600 dark:bg-primary-950/40'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600'
            "
          >
            <input
              v-model="selected"
              type="radio"
              :value="reason.value"
              class="size-4 accent-primary-500"
            />
            <span class="text-sm">{{ reason.label }}</span>
          </label>
        </div>

        <UFormField v-if="selected === 'other'" label="Conte mais" name="other">
          <UTextarea
            v-model="otherFeedback"
            placeholder="O que podíamos ter feito diferente?"
            class="w-full"
            :rows="3"
          />
        </UFormField>

        <div class="flex flex-col gap-2 pt-1 sm:flex-row">
          <UButton
            block
            :loading="submitting"
            :disabled="!selected"
            @click="onSubmit"
          >
            Enviar feedback
          </UButton>
          <UButton
            block
            variant="ghost"
            color="neutral"
            to="/dashboard"
          >
            Pular
          </UButton>
        </div>
      </div>

      <div v-else class="space-y-4 py-4 text-center">
        <UIcon name="i-lucide-circle-check" class="mx-auto size-10 text-green-500" />
        <p class="font-medium">Obrigado pelo feedback!</p>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Isso nos ajuda a melhorar o LinkLand. Você pode continuar usando o plano Free após o encerramento do período atual.
        </p>
        <UButton to="/dashboard" icon="i-lucide-arrow-right" trailing>
          Voltar ao dashboard
        </UButton>
      </div>
    </UCard>

    <div class="mt-6 space-y-3 text-center">
      <p class="text-sm text-gray-500 dark:text-gray-400">
        Mudou de ideia?
      </p>
      <UButton to="/settings" variant="subtle" color="primary" icon="i-lucide-sparkles">
        Reativar Premium
      </UButton>
    </div>
  </div>
</template>
