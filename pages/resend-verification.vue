<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: false })
useHead({
  title: 'Reenviar confirmação · LinkLand',
  meta: [{ name: 'robots', content: 'noindex, follow' }],
})

const { resendVerification } = useAuth()
const loading = ref(false)
const sent = ref(false)
const state = reactive({ email: '' })

function validate(s: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!s.email) {
    errors.push({ name: 'email', message: 'Informe seu e-mail' })
  } else if (!isValidEmail(s.email)) {
    errors.push({ name: 'email', message: 'E-mail inválido' })
  }
  return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>): Promise<void> {
  loading.value = true
  try {
    await resendVerification({ email: event.data.email })
  } catch {
    // Resposta neutra independente do resultado (não revela se a conta existe).
  } finally {
    loading.value = false
    sent.value = true
  }
}
</script>

<template>
  <AuthShell
    title="Reenviar confirmação"
    subtitle="Enviaremos um novo link para confirmar seu e-mail."
  >
    <UAlert
      v-if="sent"
      icon="i-lucide-mail-check"
      color="success"
      variant="soft"
      title="Pronto"
      description="Se houver uma conta pendente, reenviaremos o link."
    />

    <UForm
      v-else
      :state="state"
      :validate="validate"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField label="E-mail" name="email">
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="voce@email.com"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" block :loading="loading">Reenviar link</UButton>
    </UForm>

    <template #footer>
      <p class="text-sm text-center text-gray-500 dark:text-gray-400">
        <NuxtLink to="/login" class="text-primary-500 hover:underline">
          Voltar para o login
        </NuxtLink>
      </p>
    </template>
  </AuthShell>
</template>
