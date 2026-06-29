<script setup lang="ts">
import type { Template } from '~/types/api'

const model = defineModel<string>({ required: true })
const emit = defineEmits<{ change: [id: string] }>()

const { request } = useApi()
const auth = useAuthStore()
const isFree = computed(() => (auth.user?.plan ?? 'free') === 'free')

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

function select(t: Template): void {
  if (t.premium && isFree.value) return
  if (t.id === model.value) return
  model.value = t.id
  emit('change', t.id)
}
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-display font-semibold">Template</h2>
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
        class="relative rounded-lg border p-3 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        :class="[
          model === t.id
            ? 'border-primary-500 ring-2 ring-primary-500/30'
            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700',
          t.premium && isFree ? 'cursor-not-allowed opacity-60' : '',
        ]"
        @click="select(t)"
      >
        <div class="flex items-center justify-between gap-1">
          <span class="font-medium">{{ t.name }}</span>
          <div class="flex shrink-0 items-center gap-1">
            <UBadge v-if="t.premium" color="primary" variant="subtle" size="sm">
              Premium
            </UBadge>
            <UIcon
              v-else-if="model === t.id"
              name="i-lucide-check-circle-2"
              class="size-4 text-primary-500"
            />
          </div>
        </div>
        <p
          v-if="t.description"
          class="mt-1 line-clamp-2 text-xs text-gray-500 dark:text-gray-400"
        >
          {{ t.description }}
        </p>
        <UIcon
          v-if="t.premium && isFree"
          name="i-lucide-lock"
          class="absolute right-2 bottom-2 size-3.5 text-gray-400"
        />
      </button>
    </div>
  </UCard>
</template>
