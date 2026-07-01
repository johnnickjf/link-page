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
const showPassword = ref(false)
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
      >
        <UInput
          v-model="state.password"
          :type="showPassword ? 'text' : 'password'"
          autocomplete="new-password"
          placeholder="••••••••"
          class="w-full"
        >
          <template #trailing>
            <button
              type="button"
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              :aria-label="showPassword ? 'Ocultar senha' : 'Mostrar senha'"
              @click="showPassword = !showPassword"
            >
              <UIcon :name="showPassword ? 'i-lucide-eye-off' : 'i-lucide-eye'" class="size-4" />
            </button>
          </template>
        </UInput>
        <PasswordStrengthBar :password="state.password" class="mt-2" />
      </UFormField>

      <!-- Código de indicação / cupom (opcional, colapsável) -->
      <div>
        <button
          type="button"
          class="flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
          @click="showReferral = !showReferral"
        >
          <UIcon
            :name="showReferral ? 'i-lucide-chevron-up' : 'i-lucide-tag'"
            class="size-4"
          />
          {{ showReferral ? 'Remover código' : 'Tenho um cupom ou código de indicação' }}
        </button>
        <Transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-150 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-1"
        >
          <UFormField v-if="showReferral" name="referral_code" class="mt-2">
            <UInput
              v-model="state.referral_code"
              placeholder="Ex.: AMIGO2024"
              class="w-full"
              autofocus
            >
              <template #leading>
                <UIcon name="i-lucide-ticket" class="size-4 text-gray-400" />
              </template>
            </UInput>
          </UFormField>
        </Transition>
      </div>

      <UButton type="submit" block :loading="loading">Criar conta</UButton>

      <p class="text-center text-xs text-gray-400 dark:text-gray-500">
        Ao criar sua conta, você concorda com os
        <NuxtLink to="/termos" target="_blank" class="underline hover:text-gray-600 dark:hover:text-gray-300">Termos de Uso</NuxtLink>
        e a
        <NuxtLink to="/privacidade" target="_blank" class="underline hover:text-gray-600 dark:hover:text-gray-300">Política de Privacidade</NuxtLink>.
      </p>
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
