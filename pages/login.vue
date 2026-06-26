<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: false })
useHead({ title: 'Entrar · LinkLand' })

// Guarda de convidado: já logado vai pro dashboard.
const auth = useAuthStore()
if (auth.isAuthenticated) {
  await navigateTo('/dashboard')
}

const { login } = useAuth()
const toast = useToast()
const loading = ref(false)
const state = reactive({ email: '', password: '' })

function validate(s: typeof state): FormError[] {
  const errors: FormError[] = []
  if (!s.email) {
    errors.push({ name: 'email', message: 'Informe seu e-mail' })
  } else if (!isValidEmail(s.email)) {
    errors.push({ name: 'email', message: 'E-mail inválido' })
  }
  if (!s.password) errors.push({ name: 'password', message: 'Informe sua senha' })
  return errors
}

async function onSubmit(event: FormSubmitEvent<typeof state>): Promise<void> {
  loading.value = true
  try {
    await login(event.data.email, event.data.password)
    await navigateTo('/dashboard')
  } catch (err) {
    toast.add({
      title: 'Não foi possível entrar',
      description: getApiErrorMessage(err),
      color: 'error',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell title="Entrar" subtitle="Acesse para gerenciar suas páginas.">
    <UForm :state="state" :validate="validate" class="space-y-4" @submit="onSubmit">
      <UFormField label="E-mail" name="email">
        <UInput
          v-model="state.email"
          type="email"
          autocomplete="email"
          placeholder="voce@email.com"
          class="w-full"
        />
      </UFormField>

      <UFormField label="Senha" name="password">
        <UInput
          v-model="state.password"
          type="password"
          autocomplete="current-password"
          placeholder="••••••••"
          class="w-full"
        />
      </UFormField>

      <div class="flex justify-end">
        <NuxtLink
          to="/forgot-password"
          class="text-sm text-primary-500 hover:underline"
        >
          Esqueci minha senha
        </NuxtLink>
      </div>

      <UButton type="submit" block :loading="loading">Entrar</UButton>
    </UForm>

    <template #footer>
      <p class="text-sm text-center text-gray-500 dark:text-gray-400">
        Não tem conta?
        <NuxtLink to="/register" class="text-primary-500 hover:underline">
          Criar conta
        </NuxtLink>
      </p>
    </template>
  </AuthShell>
</template>
