<script setup lang="ts">
import type { AdminDashboard, Plan } from '~/types/api'

definePageMeta({ middleware: 'superadmin' })
useHead({ title: 'Admin · LinkLand' })

const { getDashboard } = useAdminApi()
const data = ref<AdminDashboard | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    data.value = await getDashboard()
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}
onMounted(load)

const stats = computed(() => {
  const d = data.value
  if (!d) return []
  return [
    { label: 'Usuários', value: d.total_users, icon: 'i-lucide-users' },
    { label: 'Ativos', value: d.active_users, icon: 'i-lucide-user-check' },
    { label: 'Páginas', value: d.total_pages, icon: 'i-lucide-file' },
    { label: 'Blocos', value: d.total_blocks, icon: 'i-lucide-blocks' },
  ]
})

const planLabels: Record<Plan, string> = {
  free: 'Free',
  premium: 'Premium',
  custom: 'Personalizado',
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-4">
      <h1 class="font-display text-2xl font-bold tracking-tight">Painel</h1>
      <UButton to="/admin/users" icon="i-lucide-users" variant="subtle" color="neutral">
        Usuários
      </UButton>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <USkeleton v-for="i in 4" :key="i" class="h-24 w-full rounded-xl" />
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="mt-6">
      <UAlert
        color="error"
        variant="soft"
        icon="i-lucide-triangle-alert"
        title="Erro ao carregar o painel"
        :description="error"
      />
      <UButton
        class="mt-3"
        variant="subtle"
        color="neutral"
        icon="i-lucide-refresh-cw"
        @click="load"
      >
        Tentar novamente
      </UButton>
    </div>

    <template v-else-if="data">
      <!-- Totais -->
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UCard v-for="s in stats" :key="s.label">
          <div class="flex items-center gap-3">
            <div
              class="flex size-10 items-center justify-center rounded-lg bg-primary-50 text-primary-600 dark:bg-primary-950/60 dark:text-primary-300"
            >
              <UIcon :name="s.icon" class="size-5" />
            </div>
            <div>
              <p class="text-2xl font-bold leading-none">{{ s.value }}</p>
              <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ s.label }}</p>
            </div>
          </div>
        </UCard>
      </div>

      <!-- Usuários por plano -->
      <UCard class="mt-4">
        <template #header>
          <h2 class="font-display font-semibold">Usuários por plano</h2>
        </template>
        <div class="grid grid-cols-3 gap-4 text-center">
          <div v-for="(label, key) in planLabels" :key="key">
            <p class="text-xl font-bold">{{ data.users_by_plan[key] ?? 0 }}</p>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">{{ label }}</p>
          </div>
        </div>
      </UCard>
    </template>
  </div>
</template>
