<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: false })
useHead({
  title: 'Recuperar senha · LinkLand',
  meta: [{ name: 'robots', content: 'noindex, follow' }],
})

const { forgotPassword } = useAuth()
const toast = useToast()
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
    await forgotPassword({ email: event.data.email })
    sent.value = true
  } catch (err) {
    toast.add({
      title: 'Não foi possível enviar',
      description: getApiErrorMessage(err),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell
    title="Recuperar senha"
    subtitle="Enviaremos um link para redefinir sua senha."
  >
    <div v-if="sent" class="space-y-4">
      <UAlert
        icon="i-lucide-mail-check"
        color="success"
        variant="soft"
        title="Verifique seu e-mail"
        description="Se o e-mail existir, enviaremos as instruções de redefinição."
      />
    </div>

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

      <UButton type="submit" block :loading="loading">Enviar instruções</UButton>
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
