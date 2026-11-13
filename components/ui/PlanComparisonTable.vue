<script setup lang="ts">
// Tabela "Compare todos os recursos", com uma coluna em destaque. Os dados vêm de PLAN_COMPARISON (utils/plans.ts).
withDefaults(defineProps<{
  /** Coluna em destaque: o Premium (plano completo), ou o Gamer na home gamer. */
  highlight?: 'premium' | 'gamer'
  /** Distância do topo do cabeçalho fixo da tabela (altura do menu da página). */
  stickyClass?: string
  /** Fundo do cabeçalho: igual ao da seção, para cobrir as linhas ao rolar. */
  headBgClass?: string
}>(), {
  highlight: 'premium',
  stickyClass: 'top-0',
  headBgClass: 'bg-gray-50 dark:bg-gray-950',
})

const COMPARISON_COLUMNS = [
  { id: 'free', name: 'Free' },
  { id: 'gamer', name: 'Gamer' },
  { id: 'premium', name: 'Premium' },
] as const
</script>

<template>
  <table class="w-full table-fixed border-separate border-spacing-0 text-sm" data-testid="plan-comparison">
    <thead class="sticky z-10" :class="stickyClass">
      <tr>
        <th scope="col" class="w-[40%] border-b border-gray-200 sm:w-1/2 dark:border-gray-800" :class="headBgClass">
          <span class="sr-only">Recurso</span>
        </th>
        <th
          v-for="column in COMPARISON_COLUMNS"
          :key="column.id"
          scope="col"
          class="border-b border-gray-200 px-0.5 py-3 text-center text-xs font-semibold sm:text-sm dark:border-gray-800"
          :class="column.id === highlight
            ? 'rounded-t-lg bg-primary-100 text-primary-900 dark:bg-primary-950 dark:text-primary-100'
            : headBgClass"
        >
          {{ column.name }}
        </th>
      </tr>
    </thead>
    <tbody v-for="group in PLAN_COMPARISON" :key="group.title">
      <tr>
        <th
          colspan="4"
          scope="rowgroup"
          class="pb-2 pt-6 text-left font-display text-sm font-semibold"
        >
          {{ group.title }}
        </th>
      </tr>
      <tr v-for="row in group.rows" :key="row.label" data-testid="comparison-row">
        <th
          scope="row"
          class="border-t border-gray-200 py-3 pr-2 text-left font-normal text-gray-700 dark:border-gray-800 dark:text-gray-200"
        >
          {{ row.label }}
        </th>
        <td
          v-for="column in COMPARISON_COLUMNS"
          :key="column.id"
          class="border-t border-gray-200 px-0.5 py-3 text-center align-middle dark:border-gray-800"
          :class="column.id === highlight ? 'bg-primary-50 dark:bg-primary-950/40' : ''"
          :data-plan="column.id"
        >
          <span v-if="typeof row[column.id] === 'string'" class="text-xs font-semibold sm:text-sm">
            {{ row[column.id] }}
          </span>
          <template v-else-if="row[column.id]">
            <UIcon name="i-lucide-check" class="mx-auto block size-5 text-primary-600 dark:text-primary-400" />
            <span class="sr-only">Incluso</span>
          </template>
          <template v-else>
            <UIcon name="i-lucide-minus" class="mx-auto block size-4 text-gray-300 dark:text-gray-600" />
            <span class="sr-only">Não incluso</span>
          </template>
        </td>
      </tr>
    </tbody>
  </table>
</template>
