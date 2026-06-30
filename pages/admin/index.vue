<script setup lang="ts">
import type { AdminDashboard, AdminUser, Paginated, Plan } from '~/types/api'

definePageMeta({ layout: 'admin', middleware: 'superadmin' })
useHead({ title: 'Dashboard · Admin · LinkLand' })

const { getDashboard, listUsers } = useAdminApi()
const dashboard = ref<AdminDashboard | null>(null)
const recentUsers = ref<AdminUser[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    const [dash, users] = await Promise.all([
      getDashboard(),
      listUsers({ page: 1, page_size: 8 }) as Promise<Paginated<AdminUser>>,
    ])
    dashboard.value = dash
    recentUsers.value = users.items
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}
onMounted(load)

const stats = computed(() => {
  const d = dashboard.value
  if (!d) return []
  const freeCount = d.users_by_plan['free'] ?? 0
  const premiumCount = d.users_by_plan['premium'] ?? 0
  const conversionRate = d.total_users
    ? Math.round((premiumCount / d.total_users) * 100)
    : 0
  return [
    {
      label: 'Usuários',
      value: d.total_users,
      sub: `${d.active_users} ativos`,
      icon: 'i-lucide-users',
      color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60 dark:text-blue-300',
      to: '/admin/users',
    },
    {
      label: 'Premium',
      value: premiumCount,
      sub: `${conversionRate}% de conversão`,
      icon: 'i-lucide-sparkles',
      color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60 dark:text-amber-300',
      to: '/admin/users?plan=premium',
    },
    {
      label: 'Free',
      value: freeCount,
      sub: `${d.total_users - premiumCount - (d.users_by_plan['custom'] ?? 0)} sem upgrade`,
      icon: 'i-lucide-user',
      color: 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-300',
      to: '/admin/users?plan=free',
    },
    {
      label: 'Páginas',
      value: d.total_pages,
      sub: `${d.total_blocks} blocos no total`,
      icon: 'i-lucide-file-text',
      color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/60 dark:text-violet-300',
      to: null,
    },
  ]
})

const planOrder: Plan[] = ['free', 'premium', 'custom']
const planColor: Record<Plan, string> = {
  free: 'bg-gray-400 dark:bg-gray-500',
  premium: 'bg-amber-400 dark:bg-amber-500',
  custom: 'bg-violet-400 dark:bg-violet-500',
}

const planDistribution = computed(() => {
  const d = dashboard.value
  if (!d) return []
  const total = d.total_users || 1
  return planOrder.map((p) => ({
    plan: p,
    label: planLabel[p],
    count: d.users_by_plan[p] ?? 0,
    pct: Math.round(((d.users_by_plan[p] ?? 0) / total) * 100),
    color: planColor[p],
  }))
})

</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl font-bold tracking-tight">Dashboard</h1>
        <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Visão geral da plataforma</p>
      </div>
      <UButton icon="i-lucide-refresh-cw" variant="ghost" color="neutral" size="sm" :disabled="loading" @click="load">
        Atualizar
      </UButton>
    </div>

    <!-- Erro -->
    <div v-if="error" class="mt-6">
      <UAlert color="error" variant="soft" icon="i-lucide-triangle-alert" title="Erro ao carregar" :description="error">
        <template #actions>
          <UButton size="sm" @click="load">Tentar novamente</UButton>
        </template>
      </UAlert>
    </div>

    <template v-else>
      <!-- Stats cards -->
      <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <template v-if="loading">
          <USkeleton v-for="i in 4" :key="i" class="h-24 w-full rounded-xl" />
        </template>
        <component
          :is="s.to ? 'NuxtLink' : 'div'"
          v-for="s in stats"
          v-else
          :key="s.label"
          :to="s.to ?? undefined"
          class="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900"
          :class="s.to ? 'transition hover:border-primary-300 hover:shadow-sm dark:hover:border-primary-700' : ''"
        >
          <div :class="`flex size-11 shrink-0 items-center justify-center rounded-lg ${s.color}`">
            <UIcon :name="s.icon" class="size-5" />
          </div>
          <div class="min-w-0">
            <p class="text-2xl font-bold leading-none">{{ s.value }}</p>
            <p class="mt-0.5 truncate text-sm font-medium text-gray-700 dark:text-gray-300">{{ s.label }}</p>
            <p class="truncate text-xs text-gray-500 dark:text-gray-500">{{ s.sub }}</p>
          </div>
        </component>
      </div>

      <!-- Plan distribution + quick links -->
      <div class="mt-4 grid gap-4 lg:grid-cols-3">
        <!-- Distribuição por plano -->
        <UCard class="lg:col-span-1">
          <template #header>
            <h2 class="font-display font-semibold">Distribuição por plano</h2>
          </template>
          <div v-if="loading" class="space-y-3">
            <USkeleton v-for="i in 3" :key="i" class="h-8 w-full rounded" />
          </div>
          <div v-else class="space-y-3">
            <div v-for="item in planDistribution" :key="item.plan">
              <div class="mb-1 flex items-center justify-between text-sm">
                <span class="font-medium">{{ item.label }}</span>
                <span class="text-gray-500 dark:text-gray-400">{{ item.count }} ({{ item.pct }}%)</span>
              </div>
              <div class="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                <div
                  :class="`h-full rounded-full transition-all ${item.color}`"
                  :style="{ width: `${item.pct}%` }"
                />
              </div>
            </div>
          </div>
        </UCard>

        <!-- Ações rápidas -->
        <UCard class="lg:col-span-2">
          <template #header>
            <h2 class="font-display font-semibold">Ações rápidas</h2>
          </template>
          <div class="grid gap-3 sm:grid-cols-2">
            <NuxtLink
              to="/admin/users"
              class="flex items-center gap-3 rounded-lg border border-gray-200 p-3.5 transition hover:border-primary-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-primary-700"
            >
              <UIcon name="i-lucide-users" class="size-5 text-blue-500" />
              <div>
                <p class="text-sm font-medium">Todos os usuários</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Ver e gerenciar todos</p>
              </div>
              <UIcon name="i-lucide-chevron-right" class="ml-auto size-4 text-gray-400" />
            </NuxtLink>
            <NuxtLink
              to="/admin/users?plan=free"
              class="flex items-center gap-3 rounded-lg border border-gray-200 p-3.5 transition hover:border-primary-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-primary-700"
            >
              <UIcon name="i-lucide-user" class="size-5 text-gray-500" />
              <div>
                <p class="text-sm font-medium">Usuários Free</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Candidatos a upgrade</p>
              </div>
              <UIcon name="i-lucide-chevron-right" class="ml-auto size-4 text-gray-400" />
            </NuxtLink>
            <NuxtLink
              to="/admin/users?plan=premium"
              class="flex items-center gap-3 rounded-lg border border-gray-200 p-3.5 transition hover:border-primary-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-primary-700"
            >
              <UIcon name="i-lucide-sparkles" class="size-5 text-amber-500" />
              <div>
                <p class="text-sm font-medium">Usuários Premium</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Assinantes ativos</p>
              </div>
              <UIcon name="i-lucide-chevron-right" class="ml-auto size-4 text-gray-400" />
            </NuxtLink>
            <NuxtLink
              to="/admin/users?has_referral=true"
              class="flex items-center gap-3 rounded-lg border border-gray-200 p-3.5 transition hover:border-primary-300 hover:shadow-sm dark:border-gray-800 dark:hover:border-primary-700"
            >
              <UIcon name="i-lucide-tag" class="size-5 text-orange-500" />
              <div>
                <p class="text-sm font-medium">Com indicação</p>
                <p class="text-xs text-gray-500 dark:text-gray-400">Usuários com código</p>
              </div>
              <UIcon name="i-lucide-chevron-right" class="ml-auto size-4 text-gray-400" />
            </NuxtLink>
          </div>
        </UCard>
      </div>

      <!-- Usuários recentes -->
      <UCard class="mt-4">
        <template #header>
          <div class="flex items-center justify-between gap-3">
            <h2 class="font-display font-semibold">Cadastros recentes</h2>
            <UButton to="/admin/users" size="xs" variant="ghost" color="neutral" trailing-icon="i-lucide-arrow-right">
              Ver todos
            </UButton>
          </div>
        </template>

        <div v-if="loading" class="space-y-2">
          <USkeleton v-for="i in 5" :key="i" class="h-12 w-full rounded-lg" />
        </div>
        <div v-else-if="recentUsers.length === 0" class="py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          Nenhum usuário encontrado.
        </div>
        <div v-else class="divide-y divide-gray-100 dark:divide-gray-800">
          <NuxtLink
            v-for="u in recentUsers"
            :key="u.id"
            :to="`/admin/users/${u.id}`"
            class="flex items-center gap-3 py-3 transition first:pt-0 last:pb-0 hover:opacity-80"
          >
            <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
              {{ u.name.charAt(0).toUpperCase() }}
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate text-sm font-medium">{{ u.name }}</p>
              <p class="truncate text-xs text-gray-500 dark:text-gray-400">{{ u.email }}</p>
            </div>
            <div class="flex shrink-0 items-center gap-2">
              <UBadge
                v-if="u.referral_code"
                color="warning"
                variant="subtle"
                size="sm"
                icon="i-lucide-tag"
              >
                indicado
              </UBadge>
              <UBadge
                :color="planBadgeColor[u.plan]"
                variant="subtle"
                size="sm"
              >
                {{ planLabel[u.plan] }}
              </UBadge>
              <UBadge
                :color="u.is_active ? 'success' : 'error'"
                variant="subtle"
                size="sm"
                class="hidden sm:inline-flex"
              >
                {{ u.is_active ? 'Ativo' : 'Inativo' }}
              </UBadge>
              <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            </div>
          </NuxtLink>
        </div>
      </UCard>
    </template>
  </div>
</template>
