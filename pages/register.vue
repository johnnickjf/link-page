<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: false })
useHead({ title: 'Criar conta · LinkLand' })

const auth = useAuthStore()
if (auth.isAuthenticated) {
  await navigateTo('/dashboard')
}

const { register, login } = useAuth()
const toast = useToast()
const loading = ref(false)
const state = reactive({ name: '', email: '', password: '' })

// Validação client-side básica; a regra final de senha é do backend.
function validate(s: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!s.name) errors.push({ name: 'name', message: 'Informe seu nome' })
  if (!s.email) {
    errors.push({ name: 'email', message: 'Informe seu e-mail' })
  } else if (!isValidEmail(s.email)) {
    errors.push({ name: 'email', message: 'E-mail inválido' })
  }
  if (!s.password) {
    errors.push({ name: 'password', message: 'Crie uma senha' })
  } else {
    const pwError = passwordError(s.password)
    if (pwError) errors.push({ name: 'password', message: pwError })
  }
  return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>): Promise<void> {
  loading.value = true
  try {
    await register(event.data)
    await login(event.data.email, event.data.password)
    toast.add({ title: 'Conta criada!', color: 'success' })
    await navigateTo('/dashboard')
  } catch (err) {
    toast.add({
      title: 'Não foi possível criar a conta',
      description: getApiErrorMessage(err),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell title="Criar conta" subtitle="Comece a montar sua página de links.">
    <UForm :state="state" :validate="validate" class="space-y-4" @submit="onSubmit">
      <UFormField label="Nome" name="name">
        <UInput
          v-model="state.name"
          autocomplete="name"
          placeholder="Seu nome"
          class="w-full"
        />
      </UFormField>

      <UFormField label="E-mail" name="email">
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="voce@email.com"
          class="w-full"
        />
      </UFormField>

      <UFormField
        label="Senha"
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

      <UButton type="submit" block :loading="loading">Criar conta</UButton>
    </UForm>

    <template #footer>
      <p class="text-sm text-center text-gray-500 dark:text-gray-400">
        Já tem conta?
        <NuxtLink to="/login" class="text-primary-500 hover:underline">Entrar</NuxtLink>
      </p>
    </template>
  </AuthShell>
</template>
