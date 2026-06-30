<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: false })
useHead({ title: 'Criar conta · LinkLand' })

const auth = useAuthStore()
if (auth.isAuthenticated) {
  await navigateTo('/dashboard')
}

const { register } = useAuth()
const toast = useToast()
const loading = ref(false)
const registered = ref(false)
const registeredEmail = ref('')
const showReferral = ref(false)
const state = reactive({ name: '', email: '', password: '', referral_code: '' })

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
    const payload = { ...event.data }
    if (!payload.referral_code?.trim()) delete (payload as Record<string, unknown>).referral_code
    await register(payload)
    // Não loga direto: o usuário precisa confirmar o e-mail antes.
    registeredEmail.value = event.data.email
    registered.value = true
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
  <AuthShell
    :title="registered ? 'Quase lá!' : 'Criar conta'"
    :subtitle="registered ? undefined : 'Comece a montar sua página de links.'"
  >
    <UAlert
      v-if="registered"
      icon="i-lucide-mail-check"
      color="success"
      variant="soft"
      title="Confirme seu e-mail"
      :description="`Enviamos um link de confirmação para ${registeredEmail}. Acesse seu e-mail e clique no link para ativar sua conta.`"
    />

    <UForm
      v-else
      :state="state"
      :validate="validate"
      class="space-y-4"
      @submit="onSubmit"
    >
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

      <!-- Código de indicação (opcional, colapsável) -->
      <div>
        <button
          type="button"
          class="text-xs text-gray-500 hover:text-primary-500 dark:text-gray-400 dark:hover:text-primary-400"
          @click="showReferral = !showReferral"
        >
          {{ showReferral ? '− Remover código de indicação' : '+ Tenho um código de indicação' }}
        </button>
        <UFormField v-if="showReferral" name="referral_code" class="mt-2">
          <UInput
            v-model="state.referral_code"
            placeholder="CODIGO123"
            class="w-full"
          />
        </UFormField>
      </div>

      <UButton type="submit" block :loading="loading">Criar conta</UButton>
    </UForm>

    <template #footer>
      <p
        v-if="registered"
        class="text-sm text-center text-gray-500 dark:text-gray-400"
      >
        <NuxtLink
          to="/resend-verification"
          class="text-primary-500 hover:underline"
        >
          Não recebi o e-mail
        </NuxtLink>
      </p>
      <p v-else class="text-sm text-center text-gray-500 dark:text-gray-400">
        Já tem conta?
        <NuxtLink to="/login" class="text-primary-500 hover:underline">Entrar</NuxtLink>
      </p>
    </template>
  </AuthShell>
</template>
