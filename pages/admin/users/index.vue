<script setup lang="ts">
import type { AdminUser, Paginated, Plan } from '~/types/api'

definePageMeta({ layout: 'admin', middleware: 'superadmin' })
useHead({
  title: 'Usuários · Admin · LinkLand',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const route = useRoute()
const { listUsers } = useAdminApi()
const PAGE_SIZE = 20

const page = ref(1)
const q = ref('')
const plan = ref<Plan | ''>((route.query.plan as Plan) || '')
const hasReferral = ref<boolean | null>(
  route.query.has_referral === 'true' ? true : null,
)
const data = ref<Paginated<AdminUser> | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const planChips: { value: Plan | ''; label: string; icon: string }[] = [
  { value: '', label: 'Todos', icon: 'i-lucide-users' },
  { value: 'free', label: 'Free', icon: 'i-lucide-user' },
  { value: 'premium', label: 'Premium', icon: 'i-lucide-sparkles' },
  { value: 'custom', label: 'Personalizado', icon: 'i-lucide-settings-2' },
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
      has_referral: hasReferral.value ?? undefined,
    })
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}

watch(plan, () => { page.value = 1; load() })
watch(hasReferral, () => { page.value = 1; load() })
watchDebounced(q, () => { page.value = 1; load() }, { debounce: 350 })
onMounted(load)

const totalPages = computed(() =>
  data.value ? Math.max(1, Math.ceil(data.value.total / PAGE_SIZE)) : 1,
)
function goTo(p: number): void {
  page.value = p
  load()
}

</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <h1 class="font-display text-2xl font-bold tracking-tight">Usuários</h1>
        <UBadge
          v-if="data"
          color="neutral"
          variant="subtle"
          class="tabular-nums"
        >
          {{ data.total }}
        </UBadge>
      </div>
    </div>

    <!-- Filtros -->
    <div class="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
      <UInput
        v-model="q"
        icon="i-lucide-search"
        placeholder="Buscar por nome ou e-mail…"
        class="w-full sm:max-w-xs"
      />
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="c in planChips"
          :key="c.value"
          size="sm"
          :icon="c.icon"
          :variant="plan === c.value ? 'solid' : 'subtle'"
          :color="plan === c.value ? 'primary' : 'neutral'"
          @click="plan = c.value"
        >
          {{ c.label }}
        </UButton>
        <UButton
          size="sm"
          icon="i-lucide-tag"
          :variant="hasReferral === true ? 'solid' : 'subtle'"
          :color="hasReferral === true ? 'warning' : 'neutral'"
          @click="hasReferral = hasReferral === true ? null : true"
        >
          Com indicação
        </UButton>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-5 space-y-2">
      <USkeleton v-for="i in 8" :key="i" class="h-16 w-full rounded-lg" />
    </div>

    <!-- Erro -->
    <UAlert
      v-else-if="error"
      class="mt-5"
      color="error"
      variant="soft"
      icon="i-lucide-triangle-alert"
      title="Erro ao carregar usuários"
      :description="error"
    >
      <template #actions>
        <UButton size="sm" @click="load">Tentar novamente</UButton>
      </template>
    </UAlert>

    <!-- Vazio -->
    <div
      v-else-if="!data || data.items.length === 0"
      class="mt-5 rounded-xl border border-dashed border-gray-300 p-10 text-center text-sm text-gray-500 dark:border-gray-700"
    >
      Nenhum usuário encontrado para os filtros selecionados.
    </div>

    <!-- Tabela / Lista -->
    <template v-else>
      <div class="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <!-- Header (só desktop) -->
        <div class="hidden grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] items-center gap-4 border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-400 lg:grid">
          <span>Usuário</span>
          <span>E-mail</span>
          <span>Plano</span>
          <span>Status</span>
          <span>Cadastro</span>
          <span />
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <NuxtLink
            v-for="u in data.items"
            :key="u.id"
            :to="`/admin/users/${u.id}`"
            class="flex flex-col gap-2 px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-gray-800/60 lg:grid lg:grid-cols-[2fr_2fr_1fr_1fr_1fr_auto] lg:items-center lg:gap-4"
          >
            <!-- Nome -->
            <div class="flex items-center gap-2 min-w-0">
              <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {{ u.name.charAt(0).toUpperCase() }}
              </div>
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold">
                  {{ u.name }}
                </p>
                <div class="flex flex-wrap items-center gap-1 mt-0.5">
                  <UBadge v-if="u.is_superadmin" color="primary" variant="subtle" size="sm">admin</UBadge>
                  <UBadge v-if="u.referral_code" color="warning" variant="subtle" size="sm" icon="i-lucide-tag">
                    {{ u.referral_code }}
                  </UBadge>
                </div>
              </div>
            </div>

            <!-- Email (desktop) -->
            <p class="hidden truncate text-sm text-gray-500 dark:text-gray-400 lg:block">
              {{ u.email }}
            </p>

            <!-- Email (mobile) -->
            <p class="truncate text-xs text-gray-500 dark:text-gray-400 lg:hidden">
              {{ u.email }}
            </p>

            <!-- Plano -->
            <div>
              <UBadge :color="planBadgeColor[u.plan]" variant="subtle" size="sm">
                {{ planLabel[u.plan] }}
              </UBadge>
            </div>

            <!-- Status -->
            <div class="flex gap-1.5">
              <UBadge :color="u.is_active ? 'success' : 'error'" variant="subtle" size="sm">
                {{ u.is_active ? 'Ativo' : 'Inativo' }}
              </UBadge>
              <UBadge
                :color="u.email_verified ? 'success' : 'warning'"
                variant="subtle"
                size="sm"
                class="hidden xl:inline-flex"
              >
                {{ u.email_verified ? 'Verificado' : 'Pendente' }}
              </UBadge>
            </div>

            <!-- Data -->
            <p class="hidden text-xs text-gray-400 dark:text-gray-500 lg:block">
              {{ formatDate(u.created_at) }}
            </p>

            <!-- Ação -->
            <div class="flex items-center justify-end">
              <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Paginação -->
      <div
        v-if="totalPages > 1"
        class="mt-5 flex items-center justify-center gap-4"
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
