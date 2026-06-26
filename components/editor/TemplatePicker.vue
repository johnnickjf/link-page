<script setup lang="ts">
import type { Template } from '~/types/api'

// Lista os templates de GET /template e deixa escolher. v-model = id do
// template; emite `change` ao selecionar (o editor persiste via PUT).
const model = defineModel<string>({ required: true })
const emit = defineEmits<{ change: [id: string] }>()

const { request } = useApi()
const templates = ref<Template[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function load(): Promise<void> {
  loading.value = true
  error.value = null
  try {
    templates.value = await request<Template[]>('/template')
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}
onMounted(load)

function select(id: string): void {
  if (id === model.value) return
  model.value = id
  emit('change', id)
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-semibold">Template</h2>
    </template>

    <div v-if="loading" class="grid grid-cols-2 gap-3">
      <USkeleton v-for="i in 3" :key="i" class="h-20 w-full rounded-lg" />
    </div>

    <div v-else-if="error">
      <UAlert color="error" variant="soft" :description="error" />
      <UButton
        class="mt-3"
        size="sm"
        variant="subtle"
        color="neutral"
        icon="i-lucide-refresh-cw"
        @click="load"
      >
        Tentar novamente
      </UButton>
    </div>

    <div v-else class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <button
        v-for="t in templates"
        :key="t.id"
        type="button"
        class="rounded-lg border p-3 text-left transition"
        :class="
          model === t.id
            ? 'border-primary-500 ring-2 ring-primary-500/30'
            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
        "
        @click="select(t.id)"
      >
        <div class="flex items-center justify-between">
          <span class="font-medium">{{ t.name }}</span>
          <UIcon
            v-if="model === t.id"
            name="i-lucide-check-circle-2"
            class="size-4 text-primary-500"
          />
        </div>
        <p
          v-if="t.description"
          class="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ t.description }}
        </p>
      </button>
    </div>
  </UCard>
</template>
