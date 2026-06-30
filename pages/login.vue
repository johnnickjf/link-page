<script setup lang="ts">
import type { FormError, FormSubmitEvent } from '@nuxt/ui'

definePageMeta({ layout: false })
useHead({ title: 'Entrar · LinkLand' })

const route = useRoute()
const auth = useAuthStore()
if (auth.isAuthenticated) {
  await navigateTo(auth.isSuperadmin ? '/admin' : '/dashboard')
}

const { login } = useAuth()
const toast = useToast()
const loading = ref(false)
const notVerified = ref(false)
const state = reactive({ email: '', password: '' })

// Banners vindos de redirecionamentos (verify-email / reset-password).
const verifiedBanner = computed(() => route.query.verified === 'true')
const resetBanner = computed(() => route.query.reset === 'true')

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
  notVerified.value = false
  try {
    const me = await login(event.data.email, event.data.password)
    await navigateTo(me.is_superadmin ? '/admin' : '/dashboard')
  } catch (err) {
    const message = getApiErrorMessage(err)
    // 400 "E-mail nao verificado" → oferece reenviar a confirmação.
    if (/verific/i.test(message)) {
      notVerified.value = true
    } else {
      toast.add({
        title: 'Não foi possível entrar',
        description: message,
        color: 'error',
      })
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <AuthShell title="Entrar" subtitle="Acesse sua conta para gerenciar suas páginas.">
    <div class="space-y-4">
      <UAlert
        v-if="verifiedBanner"
        color="success"
        variant="soft"
        icon="i-lucide-circle-check"
        description="E-mail confirmado! Faça login para acessar."
      />
      <UAlert
        v-else-if="resetBanner"
        color="success"
        variant="soft"
        icon="i-lucide-circle-check"
        description="Senha redefinida! Faça login com a nova senha."
      />

      <div v-if="notVerified" class="space-y-2">
        <UAlert
          color="warning"
          variant="soft"
          icon="i-lucide-triangle-alert"
          title="Seu e-mail ainda não foi confirmado."
        />
        <UButton block variant="subtle" color="neutral" to="/resend-verification">
          Reenviar e-mail de confirmação
        </UButton>
      </div>

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
    </div>

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
