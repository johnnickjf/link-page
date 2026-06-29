<script setup lang="ts">
import type { AdminUser, Paginated, Plan } from '~/types/api'

definePageMeta({ middleware: 'superadmin' })
useHead({ title: 'Usuários · Admin · LinkLand' })

const { listUsers } = useAdminApi()
const PAGE_SIZE = 20

const page = ref(1)
const q = ref('')
const plan = ref<Plan | ''>('')
const data = ref<Paginated<AdminUser> | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const planChips: { value: Plan | ''; label: string }[] = [
  { value: '', label: 'Todos' },
  { value: 'free', label: 'Free' },
  { value: 'premium', label: 'Premium' },
  { value: 'custom', label: 'Personalizado' },
]

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    data.value = await listUsers({
      page: page.value,
      page_size: PAGE_SIZE,
      q: q.value || undefined,
      plan: plan.value || undefined,
    })
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}

watch(plan, () => {
  page.value = 1
  load()
})
watchDebounced(
  q,
  () => {
    page.value = 1
    load()
  },
  { debounce: 350 },
)
onMounted(load)

const totalPages = computed(() =>
  data.value ? Math.max(1, Math.ceil(data.value.total / PAGE_SIZE)) : 1,
)
function goTo(p: number): void {
  page.value = p
  load()
}

const planLabel: Record<Plan, string> = {
  free: 'Free',
  premium: 'Premium',
  custom: 'Personalizado',
}
</script>

<template>
  <div>
    <div class="flex items-center gap-3">
      <UButton
        to="/admin"
        icon="i-lucide-arrow-left"
        variant="ghost"
        color="neutral"
        size="sm"
      />
      <h1 class="font-display text-2xl font-bold tracking-tight">Usuários</h1>
    </div>

    <!-- Filtros -->
    <div class="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
      <UInput
        v-model="q"
        icon="i-lucide-search"
        placeholder="Buscar por nome ou e-mail…"
        class="sm:max-w-xs"
      />
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="c in planChips"
          :key="c.label"
          size="sm"
          :variant="plan === c.value ? 'solid' : 'subtle'"
          :color="plan === c.value ? 'primary' : 'neutral'"
          @click="plan = c.value"
        >
          {{ c.label }}
        </UButton>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-6 space-y-2">
      <USkeleton v-for="i in 6" :key="i" class="h-16 w-full rounded-lg" />
    </div>

    <!-- Erro -->
    <div v-else-if="error" class="mt-6">
      <UAlert
        color="error"
        variant="soft"
        icon="i-lucide-triangle-alert"
        title="Erro ao carregar usuários"
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

    <!-- Vazio -->
    <div
      v-else-if="!data || data.items.length === 0"
      class="mt-6 rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700"
    >
      Nenhum usuário encontrado.
    </div>

    <!-- Lista -->
    <template v-else>
      <p class="mt-6 text-sm text-gray-500 dark:text-gray-400">
        {{ data.total }} usuário(s)
      </p>
      <div class="mt-2 space-y-2">
        <NuxtLink
          v-for="u in data.items"
          :key="u.id"
          :to="`/admin/users/${u.id}`"
          class="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white p-4 transition hover:border-primary-300 dark:border-gray-800 dark:bg-gray-900"
        >
          <div class="min-w-0">
            <p class="truncate font-medium">
              {{ u.name }}
              <UBadge
                v-if="u.is_superadmin"
                color="primary"
                variant="subtle"
                size="sm"
                class="ml-1"
              >
                admin
              </UBadge>
            </p>
            <p class="truncate text-sm text-gray-500 dark:text-gray-400">
              {{ u.email }}
            </p>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <UBadge color="neutral" variant="subtle" class="hidden sm:inline-flex">{{ planLabel[u.plan] }}</UBadge>
            <UBadge :color="u.is_active ? 'success' : 'error'" variant="subtle">
              {{ u.is_active ? 'Ativo' : 'Inativo' }}
            </UBadge>
            <UBadge
              :color="u.email_verified ? 'success' : 'warning'"
              variant="subtle"
              class="hidden sm:inline-flex"
            >
              {{ u.email_verified ? 'Verificado' : 'Pendente' }}
            </UBadge>
            <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
          </div>
        </NuxtLink>
      </div>

      <!-- Paginação -->
      <div
        v-if="totalPages > 1"
        class="mt-6 flex items-center justify-center gap-4"
      >
        <UButton
          icon="i-lucide-chevron-left"
          variant="subtle"
          color="neutral"
          :disabled="page <= 1"
          @click="goTo(page - 1)"
        >
          Anterior
        </UButton>
        <span class="text-sm text-gray-500 dark:text-gray-400">
          Página {{ page }} de {{ totalPages }}
        </span>
        <UButton
          trailing-icon="i-lucide-chevron-right"
          variant="subtle"
          color="neutral"
          :disabled="page >= totalPages"
          @click="goTo(page + 1)"
        >
          Próxima
        </UButton>
      </div>
    </template>
  </div>
</template>
