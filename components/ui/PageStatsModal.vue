<script setup lang="ts">
import type { Page, PageStats } from '~/types/api'

// Estatísticas de uma página: só contagens agregadas por dia. Uma série por vez
// (visitas OU cliques) porque as escalas são diferentes e dividir um eixo
// entre elas esconderia a menor.
const props = defineProps<{ page: Page | null }>()
const emit = defineEmits<{ close: [] }>()

const { pageStats } = useStats()

const RANGES = [
  { value: 7, label: '7 dias' },
  { value: 30, label: '30 dias' },
  { value: 90, label: '90 dias' },
] as const
const METRICS = [
  { value: 'views', label: 'Visitas' },
  { value: 'clicks', label: 'Cliques' },
] as const

const days = ref<7 | 30 | 90>(30)
const metric = ref<'views' | 'clicks'>('views')
const stats = ref<PageStats | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const hovered = ref<number | null>(null)

const open = computed({
  get: () => props.page !== null,
  set: (value) => {
    if (!value) emit('close')
  },
})

async function load(): Promise<void> {
  if (!props.page) return
  loading.value = true
  error.value = null
  try {
    stats.value = await pageStats(props.page.id, days.value)
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}
watch(
  () => props.page?.id,
  () => {
    stats.value = null
    load()
  },
  { immediate: true },
)
watch(days, load)

function shortDay(iso: string): string {
  // Sem `new Date(iso)`: uma data pura seria lida como UTC e voltaria um dia.
  const [, month, day] = iso.split('-')
  return `${day}/${month}`
}

const series = computed(() => stats.value?.daily ?? [])
const maxValue = computed(() =>
  Math.max(1, ...series.value.map((d) => d[metric.value])),
)
const metricLabel = computed(
  () => METRICS.find((m) => m.value === metric.value)?.label ?? '',
)
const isEmpty = computed(
  () => !!stats.value && stats.value.views === 0 && stats.value.clicks === 0,
)
const hoveredDay = computed(() =>
  hovered.value === null ? null : series.value[hovered.value] ?? null,
)
const maxBlockClicks = computed(() =>
  Math.max(1, ...(stats.value?.blocks ?? []).map((b) => b.clicks)),
)
</script>

<template>
  <UModal v-model:open="open" :title="page ? `Estatísticas · ${page.title}` : 'Estatísticas'">
    <template #body>
      <div class="space-y-5" data-testid="stats-modal">
        <div class="flex flex-wrap gap-1" role="group" aria-label="Período">
          <UButton
            v-for="r in RANGES"
            :key="r.value"
            size="xs"
            :variant="days === r.value ? 'solid' : 'subtle'"
            :color="days === r.value ? 'primary' : 'neutral'"
            :aria-pressed="days === r.value"
            @click="days = r.value"
          >
            {{ r.label }}
          </UButton>
        </div>

        <UAlert v-if="error" color="error" variant="soft" :description="error" />

        <div v-else-if="loading && !stats" class="space-y-3">
          <USkeleton class="h-16 w-full rounded-lg" />
          <USkeleton class="h-40 w-full rounded-lg" />
        </div>

        <template v-else-if="stats">
          <div class="flex items-center justify-between gap-4 rounded-lg bg-gray-50 p-3 dark:bg-white/5" data-testid="stats-level">
            <div>
              <p class="text-xs text-gray-600 dark:text-gray-400">Nível da página</p>
              <p class="font-display text-2xl font-bold">Nv. {{ stats.progress.level }}</p>
            </div>
            <p class="text-right text-xs tabular-nums text-gray-600 dark:text-gray-400">
              {{ stats.progress.xp.toLocaleString('pt-BR') }} XP
              <template v-if="stats.progress.next_level_xp !== null">
                <br>faltam {{ (stats.progress.next_level_xp - stats.progress.xp).toLocaleString('pt-BR') }} para o próximo
              </template>
            </p>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
              <p class="text-2xl font-bold tabular-nums" data-testid="stats-views">{{ stats.views.toLocaleString('pt-BR') }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Visitas</p>
            </div>
            <div class="rounded-lg border border-gray-200 p-3 dark:border-gray-800">
              <p class="text-2xl font-bold tabular-nums" data-testid="stats-clicks">{{ stats.clicks.toLocaleString('pt-BR') }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Cliques nos seus links</p>
            </div>
          </div>

          <div v-if="isEmpty" class="rounded-lg border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400">
            Ainda não há visitas neste período. Compartilhe o link da sua página para começar a contar.
          </div>

          <template v-else>
            <div>
              <div class="mb-2 flex items-center justify-between gap-2">
                <h3 class="text-sm font-semibold">{{ metricLabel }} por dia</h3>
                <div class="flex gap-1" role="group" aria-label="Métrica do gráfico">
                  <UButton
                    v-for="m in METRICS"
                    :key="m.value"
                    size="xs"
                    variant="ghost"
                    :color="metric === m.value ? 'primary' : 'neutral'"
                    :aria-pressed="metric === m.value"
                    @click="metric = m.value"
                  >
                    {{ m.label }}
                  </UButton>
                </div>
              </div>

              <div>
                <!-- Tooltip único, em linha própria para não cobrir as colunas:
                     valor primeiro, dia depois. -->
                <div class="mb-1 flex h-6 justify-end">
                  <div
                    v-if="hoveredDay"
                    class="rounded-md border border-gray-200 bg-white px-2 py-0.5 text-xs dark:border-gray-700 dark:bg-gray-900"
                    role="status"
                  >
                    <strong class="tabular-nums">{{ hoveredDay[metric].toLocaleString('pt-BR') }}</strong>
                    <span class="text-gray-500 dark:text-gray-400"> · {{ shortDay(hoveredDay.day) }}</span>
                  </div>
                </div>

                <div class="flex items-stretch gap-2">
                  <div class="flex w-7 shrink-0 flex-col justify-between text-right text-[10px] tabular-nums text-gray-500 dark:text-gray-400" aria-hidden="true">
                    <span>{{ maxValue.toLocaleString('pt-BR') }}</span>
                    <span>0</span>
                  </div>
                  <div
                    class="flex h-32 min-w-0 flex-1 items-end border-b border-gray-200 dark:border-gray-800"
                    :class="series.length > 30 ? 'gap-px' : 'gap-0.5'"
                    data-testid="stats-chart"
                    @pointerleave="hovered = null"
                  >
                    <!-- Área de toque = coluna inteira, maior que a barra. -->
                    <div
                      v-for="(d, i) in series"
                      :key="d.day"
                      class="flex h-full min-w-0 flex-1 cursor-default items-end justify-center"
                      data-testid="stats-bar"
                      @pointerenter="hovered = i"
                      @pointerdown="hovered = i"
                    >
                      <div
                        class="w-full max-w-6 rounded-t bg-primary-500 transition-opacity"
                        :class="hovered !== null && hovered !== i ? 'opacity-40' : ''"
                        :style="{
                          height: d[metric] > 0 ? `${Math.max(3, (d[metric] / maxValue) * 100)}%` : '0',
                        }"
                      />
                    </div>
                  </div>
                </div>
                <div class="ml-9 mt-1 flex justify-between text-[10px] tabular-nums text-gray-500 dark:text-gray-400" aria-hidden="true">
                  <span>{{ series[0] ? shortDay(series[0].day) : '' }}</span>
                  <span>{{ series.length ? shortDay(series[series.length - 1]!.day) : '' }}</span>
                </div>
              </div>

              <details class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                <summary class="cursor-pointer hover:text-gray-700 dark:hover:text-gray-200">Ver dados em tabela</summary>
                <div class="mt-2 max-h-48 overflow-auto">
                  <table class="w-full text-left tabular-nums">
                    <thead>
                      <tr>
                        <th class="py-1 font-medium">Dia</th>
                        <th class="py-1 text-right font-medium">Visitas</th>
                        <th class="py-1 text-right font-medium">Cliques</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="d in series" :key="d.day" class="border-t border-gray-100 dark:border-gray-800">
                        <td class="py-1">{{ shortDay(d.day) }}</td>
                        <td class="py-1 text-right">{{ d.views }}</td>
                        <td class="py-1 text-right">{{ d.clicks }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </details>
            </div>

            <div v-if="stats.blocks.length">
              <h3 class="mb-2 text-sm font-semibold">Cliques por link</h3>
              <ul class="space-y-2.5" data-testid="stats-blocks">
                <li v-for="b in stats.blocks" :key="b.block_id" class="text-sm">
                  <div class="flex items-baseline justify-between gap-3">
                    <span class="min-w-0 truncate">{{ b.label }}</span>
                    <span class="shrink-0 font-medium tabular-nums">{{ b.clicks.toLocaleString('pt-BR') }}</span>
                  </div>
                  <div class="mt-1 h-1.5 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <div
                      class="h-full rounded-full bg-primary-500"
                      :style="{ width: `${Math.max(2, (b.clicks / maxBlockClicks) * 100)}%` }"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </template>

          <p class="text-xs text-gray-500 dark:text-gray-400">
            Contagem anônima: cada pessoa conta uma vez por dia, e suas próprias visitas não entram.
          </p>
        </template>
      </div>
    </template>
  </UModal>
</template>
