<script setup lang="ts">
import type { PageKind, Template } from '~/types/api'

const model = defineModel<string>({ required: true })
const emit = defineEmits<{ change: [id: string] }>()
const props = defineProps<{ pageKind?: PageKind }>()

const auth = useAuthStore()
const pagesStore = usePagesStore()
const { open: openPremiumUpsell } = usePremiumUpsell()

const templates = ref<Template[]>([])
const loading = ref(true)
const error = ref<string | null>(null)

async function load(): Promise<void> {
  if (pagesStore.templatesLoaded) {
    templates.value = pagesStore.templates
    loading.value = false
    return
  }
  loading.value = true
  error.value = null
  try {
    templates.value = await pagesStore.fetchTemplates()
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    loading.value = false
  }
}
onMounted(() => {
  load()
  // Trocar de template na prévia sem esperar o download do novo.
  preloadTemplates()
})

// Em perfil gamer, os temas gamer aparecem primeiro.
const ordered = computed(() => {
  if (props.pageKind !== 'gamer') return templates.value
  return [
    ...templates.value.filter((t) => t.category === 'gamer'),
    ...templates.value.filter((t) => t.category !== 'gamer'),
  ]
})

function planLabel(t: Template): string {
  return t.plan === 'gamer' ? 'Gamer' : 'Premium'
}

function isLocked(t: Template): boolean {
  return Boolean(t.premium) && !auth.canUseTemplate(t.id)
}

function select(t: Template): void {
  if (isLocked(t)) {
    openPremiumUpsell(t.plan === 'gamer' ? 'gamer' : 'premium')
    return
  }
  if (t.id === model.value) return
  model.value = t.id
  emit('change', t.id)
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-layout-template" class="size-4 text-gray-500" />
        <h2 class="font-display font-semibold">Template</h2>
      </div>
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

    <div v-else role="radiogroup" aria-label="Template da página" class="grid grid-cols-2 gap-3 sm:grid-cols-3">
      <button
        v-for="t in ordered"
        :key="t.id"
        type="button"
        role="radio"
        :aria-checked="model === t.id"
        class="relative rounded-lg border p-3 text-left transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        :class="[
          model === t.id
            ? 'border-primary-500 ring-2 ring-primary-500/30'
            : 'border-gray-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-sm dark:border-gray-700 dark:hover:border-gray-600',
          isLocked(t) ? 'opacity-60' : '',
        ]"
        @click="select(t)"
      >
        <div
          class="mb-2.5 flex h-14 flex-col justify-end gap-1 rounded-md p-1.5"
          :style="{ background: templateSwatch(t.id).bg, boxShadow: templateSwatch(t.id).ring ? `inset 0 0 0 1px ${templateSwatch(t.id).ring}` : undefined }"
          aria-hidden="true"
        >
          <span class="block h-1.5 rounded-sm" :style="{ background: templateSwatch(t.id).bar }" />
          <span class="block h-1.5 rounded-sm" :style="{ background: templateSwatch(t.id).bar }" />
        </div>
        <div class="flex items-center justify-between gap-1">
          <span class="font-medium">{{ t.name }}</span>
          <div class="flex shrink-0 items-center gap-1">
            <UBadge v-if="isLocked(t)" color="primary" variant="subtle" size="sm">
              {{ planLabel(t) }}
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
          v-if="isLocked(t)"
          name="i-lucide-lock"
          class="absolute right-2 bottom-2 size-3.5 text-gray-400"
        />
      </button>
    </div>
  </UCard>
</template>
