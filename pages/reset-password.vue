<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: false })
useHead({ title: 'Definir nova senha · LinkLand' })

const route = useRoute()
const { resetPassword } = useAuth()
const toast = useToast()
const loading = ref(false)

// Token vem da URL: /reset-password?token=...
const token = computed(() =>
  typeof route.query.token === 'string' ? route.query.token : '',
)

const state = reactive({ password: '', confirm: '' })

function validate(s: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!s.password) {
    errors.push({ name: 'password', message: 'Crie uma senha' })
  } else {
    const pwError = passwordError(s.password)
    if (pwError) errors.push({ name: 'password', message: pwError })
  }
  if (s.confirm !== s.password) {
    errors.push({ name: 'confirm', message: 'As senhas não conferem' })
  }
  return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>): Promise<void> {
  loading.value = true
  try {
    await resetPassword({ token: token.value, new_password: event.data.password })
    toast.add({ title: 'Senha redefinida!', color: 'success' })
    await navigateTo('/login')
  } catch (err) {
    toast.add({
      title: 'Não foi possível redefinir',
      description: getApiErrorMessage(err),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell title="Definir nova senha" subtitle="Escolha uma nova senha de acesso.">
    <UAlert
      v-if="!token"
      icon="i-lucide-triangle-alert"
      color="warning"
      variant="soft"
      title="Link inválido"
      description="Este link de redefinição é inválido ou expirou. Solicite um novo."
    />

    <UForm
      v-else
      :state="state"
      :validate="validate"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="Nova senha"
        name="password"
        hint="8+ caracteres, com maiúscula, minúscula e número"
      >
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="new-password"
          placeholder="••••••••"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Confirmar senha" name="confirm">
        <UInput
          v-model="state.confirm"
          type="password"
          autocomplete="new-password"
          placeholder="••••••••"
          class="w-full"
        />
      </UFormField>

      <UButton type="submit" block :loading="loading">Redefinir senha</UButton>
    </UForm>

    <template #footer>
      <p class="text-sm text-center text-gray-500 dark:text-gray-400">
        <NuxtLink to="/forgot-password" class="text-primary-500 hover:underline">
          Solicitar novo link
        </NuxtLink>
      </p>
    </template>
  </AuthShell>
</template>
