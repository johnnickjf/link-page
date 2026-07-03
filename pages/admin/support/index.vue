<script setup lang="ts">
import type { AdminSupportListItem, Paginated, SupportStatus, SupportType } from '~/types/api'

definePageMeta({ layout: 'admin', middleware: 'superadmin' })
useHead({
  title: 'Suporte · Admin · LinkLand',
  meta: [{ name: 'robots', content: 'noindex, nofollow' }],
})

const { listSupportRequests } = useAdminApi()
const PAGE_SIZE = 20

const page = ref(1)
const q = ref('')
const status = ref<SupportStatus | ''>('')
const type = ref<SupportType | ''>('')
const data = ref<Paginated<AdminSupportListItem> | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

const statusChips: { value: SupportStatus | ''; label: string; icon: string }[] = [
  { value: '', label: 'Todas', icon: 'i-lucide-list' },
  { value: 'open', label: 'Aberta', icon: 'i-lucide-circle-dot' },
  { value: 'answered', label: 'Respondida', icon: 'i-lucide-circle-check' },
  { value: 'closed', label: 'Fechada', icon: 'i-lucide-circle-x' },
]

const typeChips: { value: SupportType | ''; label: string }[] = [
  { value: '', label: 'Todos os tipos' },
  { value: 'support', label: 'Suporte' },
  { value: 'question', label: 'Dúvida' },
  { value: 'suggestion', label: 'Sugestão' },
  { value: 'bug_report', label: 'Relatar problema' },
  { value: 'billing', label: 'Financeiro' },
  { value: 'other', label: 'Outro' },
]

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    data.value = await listSupportRequests({
      page: page.value,
      page_size: PAGE_SIZE,
      q: q.value || undefined,
      status: status.value || undefined,
      type: type.value || undefined,
    })
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}

watch(status, () => { page.value = 1; load() })
watch(type, () => { page.value = 1; load() })
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
        <h1 class="font-display text-2xl font-bold tracking-tight">Suporte</h1>
        <UBadge v-if="data" color="neutral" variant="subtle" class="tabular-nums">
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
      <USelect v-model="type" :items="typeChips" class="w-full sm:max-w-[200px]" />
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="c in statusChips"
          :key="c.value"
          size="sm"
          :icon="c.icon"
          :variant="status === c.value ? 'solid' : 'subtle'"
          :color="status === c.value ? 'primary' : 'neutral'"
          @click="status = c.value"
        >
          {{ c.label }}
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
      title="Erro ao carregar solicitações"
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
      Nenhuma solicitação encontrada para os filtros selecionados.
    </div>

    <!-- Lista -->
    <template v-else>
      <div class="mt-5 overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div class="hidden grid-cols-[2fr_2fr_1fr_1fr_auto] items-center gap-4 border-b border-gray-100 bg-gray-50 px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900/80 dark:text-gray-400 lg:grid">
          <span>Usuário</span>
          <span>E-mail</span>
          <span>Tipo</span>
          <span>Status</span>
          <span />
        </div>

        <div class="divide-y divide-gray-100 dark:divide-gray-800">
          <NuxtLink
            v-for="item in data.items"
            :key="item.id"
            :to="`/admin/support/${item.id}`"
            class="flex flex-col gap-2 px-4 py-3 transition hover:bg-gray-50 dark:hover:bg-gray-800/60 lg:grid lg:grid-cols-[2fr_2fr_1fr_1fr_auto] lg:items-center lg:gap-4"
          >
            <div class="flex items-center gap-2 min-w-0">
              <div class="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                {{ item.user.name.charAt(0).toUpperCase() }}
              </div>
              <p class="truncate text-sm font-semibold">{{ item.user.name }}</p>
            </div>

            <p class="truncate text-sm text-gray-500 dark:text-gray-400">
              {{ item.email }}
            </p>

            <div>
              <UBadge color="neutral" variant="subtle" size="sm">
                {{ supportTypeLabel[item.type] }}
              </UBadge>
            </div>

            <div>
              <UBadge :color="supportStatusBadgeColor[item.status]" variant="subtle" size="sm">
                {{ supportStatusLabel[item.status] }}
              </UBadge>
            </div>

            <div class="flex items-center justify-between lg:justify-end lg:gap-3">
              <p class="text-xs text-gray-400 dark:text-gray-500">
                {{ formatDate(item.created_at) }}
              </p>
              <UIcon name="i-lucide-chevron-right" class="size-4 text-gray-400" />
            </div>
          </NuxtLink>
        </div>
      </div>

      <!-- Paginação -->
      <div v-if="totalPages > 1" class="mt-5 flex items-center justify-center gap-4">
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
