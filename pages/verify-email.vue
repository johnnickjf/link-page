<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Verificando e-mail · LinkLand' })

const route = useRoute()
const { verifyEmail } = useAuth()

// Token vem da URL: /verify-email?token=...
const token = computed(() =>
  typeof route.query.token === 'string' ? route.query.token : '',
)

// Sem token → vai pro login.
if (!token.value) {
  await navigateTo('/login')
}

const status = ref<'loading' | 'error'>('loading')

// Verifica automaticamente ao montar (client-side, uma vez).
onMounted(async () => {
  try {
    await verifyEmail({ token: token.value })
    await navigateTo('/login?verified=true')
  } catch {
    status.value = 'error'
  }
})
</script>

<template>
  <AuthShell
    :title="status === 'loading' ? 'Verificando seu e-mail…' : 'Link inválido'"
  >
    <div
      v-if="status === 'loading'"
      class="flex flex-col items-center gap-3 py-6 text-center"
    >
      <UIcon
        name="i-lucide-loader-circle"
        class="size-8 animate-spin text-primary-500"
      />
      <p class="text-sm text-gray-500 dark:text-gray-400">Só um instante…</p>
    </div>

    <div v-else class="space-y-4">
      <UAlert
        color="error"
        variant="soft"
        icon="i-lucide-triangle-alert"
        description="Este link é inválido ou já expirou."
      />
      <UButton block to="/resend-verification">Reenviar link</UButton>
    </div>

    <template #footer>
      <p class="text-sm text-center text-gray-500 dark:text-gray-400">
        <NuxtLink to="/login" class="text-primary-500 hover:underline">
          Voltar para o login
        </NuxtLink>
      </p>
    </template>
  </AuthShell>
</template>
