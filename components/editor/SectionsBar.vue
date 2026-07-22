<script setup lang="ts">
import type { PageTab, ID } from '~/types/api'

// Barra de "Seções" (abas) no topo do card de Blocos. Premium: gerencia até 3
// seções, cada uma com seu conjunto próprio de blocos. Não-premium: aparece
// travada e abre o modal de upsell (mesmo padrão de QR/templates).
const props = defineProps<{
  pageId: ID
  tabs: PageTab[]
  activeTabId: ID | null
  canUse: boolean
}>()

const emit = defineEmits<{
  switch: [id: ID]
  changed: []
  upsell: []
}>()

const store = usePagesStore()
const toast = useToast()

const MAX_TABS = 3
const canAdd = computed(() => props.tabs.length < MAX_TABS)

// Ícones opcionais para a seção (curados; o usuário pode não escolher nenhum).
const SECTION_ICONS = [
  'i-lucide-house', 'i-lucide-shopping-bag', 'i-lucide-link', 'i-lucide-star',
  'i-lucide-heart', 'i-lucide-music', 'i-lucide-play', 'i-lucide-camera',
  'i-lucide-briefcase', 'i-lucide-book-open', 'i-lucide-gift', 'i-lucide-sparkles',
]

// ---- Modal criar/editar ----
const modalOpen = ref(false)
const editing = ref<PageTab | null>(null)
const form = reactive({ name: '', icon: '' })
const saving = ref(false)
const formError = ref<string | null>(null)

function openCreate(): void {
  if (!props.canUse) { emit('upsell'); return }
  editing.value = null
  form.name = ''
  form.icon = ''
  formError.value = null
  modalOpen.value = true
}

function openEdit(tab: PageTab): void {
  editing.value = tab
  form.name = tab.name
  form.icon = tab.icon ?? ''
  formError.value = null
  modalOpen.value = true
}

async function submit(): Promise<void> {
  if (!form.name.trim()) {
    formError.value = 'Dê um nome à seção.'
    return
  }
  saving.value = true
  formError.value = null
  try {
    if (editing.value) {
      await store.updateTab(editing.value.id, {
        name: form.name.trim(),
        icon: form.icon || null,
      })
    } else {
      await store.createTab(props.pageId, {
        name: form.name.trim(),
        icon: form.icon || null,
      })
    }
    modalOpen.value = false
    emit('changed')
  } catch (e) {
    formError.value = getApiErrorMessage(e)
  } finally {
    saving.value = false
  }
}

// ---- Excluir ----
const deleting = ref(false)
async function removeTab(): Promise<void> {
  if (!editing.value) return
  deleting.value = true
  try {
    await store.deleteTab(editing.value.id)
    modalOpen.value = false
    toast.add({ title: 'Seção excluída', color: 'success' })
    emit('changed')
  } catch (e) {
    formError.value = getApiErrorMessage(e)
  } finally {
    deleting.value = false
  }
}
</script>

<template>
  <div class="mb-4">
    <!-- Travado (não-premium): teaser que abre o upsell -->
    <button
      v-if="!canUse"
      type="button"
      class="flex w-full items-center justify-between gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-left text-sm transition hover:border-primary-300 dark:border-gray-700 dark:hover:border-primary-700"
      @click="emit('upsell')"
    >
      <span class="flex items-center gap-2 text-gray-600 dark:text-gray-300">
        <UIcon name="i-lucide-layers" class="size-4 text-gray-400" />
        Divida sua página em <strong>Seções</strong>
      </span>
      <span class="flex items-center gap-1.5">
        <UBadge color="primary" variant="subtle" size="sm">Premium</UBadge>
        <UIcon name="i-lucide-lock" class="size-3.5 text-gray-400" />
      </span>
    </button>

    <!-- Premium sem seções ainda: criar a primeira -->
    <button
      v-else-if="tabs.length === 0"
      type="button"
      class="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-gray-300 px-3 py-2 text-sm font-medium text-primary-600 transition hover:border-primary-400 hover:bg-primary-50/50 dark:border-gray-700 dark:text-primary-400 dark:hover:bg-primary-950/30"
      @click="openCreate"
    >
      <UIcon name="i-lucide-layers" class="size-4" />
      Criar seções
    </button>

    <!-- Premium com seções: pílulas de troca + gerenciar -->
    <div v-else class="flex flex-wrap items-center gap-2">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        class="group flex items-center overflow-hidden rounded-lg border transition"
        :class="
          tab.id === activeTabId
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/40'
            : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
        "
      >
        <button
          type="button"
          class="flex items-center gap-1.5 py-1.5 pl-3 pr-2 text-sm font-medium"
          :class="
            tab.id === activeTabId
              ? 'text-primary-700 dark:text-primary-300'
              : 'text-gray-600 dark:text-gray-300'
          "
          @click="emit('switch', tab.id)"
        >
          <UIcon v-if="tab.icon" :name="tab.icon" class="size-4 shrink-0" />
          <span class="max-w-[10rem] truncate">{{ tab.name }}</span>
        </button>
        <button
          type="button"
          class="px-1.5 py-1.5 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
          :aria-label="`Editar seção ${tab.name}`"
          @click="openEdit(tab)"
        >
          <UIcon name="i-lucide-pencil" class="size-3.5" />
        </button>
      </div>

      <UButton
        v-if="canAdd"
        icon="i-lucide-plus"
        size="sm"
        variant="ghost"
        color="neutral"
        aria-label="Nova seção"
        @click="openCreate"
      />
    </div>

    <!-- Modal criar / editar seção -->
    <UModal
      v-model:open="modalOpen"
      :title="editing ? 'Editar seção' : 'Nova seção'"
    >
      <template #body>
        <div class="space-y-4">
          <UAlert
            v-if="formError"
            color="error"
            variant="soft"
            icon="i-lucide-triangle-alert"
            :description="formError"
          />
          <p
            v-if="!editing && tabs.length === 0"
            class="rounded-lg bg-gray-50 p-3 text-xs text-gray-500 dark:bg-gray-800/60 dark:text-gray-400"
          >
            Suas caixas atuais viram a seção <strong>Início</strong> e criamos esta
            nova ao lado. No visitante, um toggle troca entre elas.
          </p>

          <UFormField label="Nome da seção">
            <UInput
              v-model="form.name"
              placeholder="Ex.: Loja, Vídeos, Contato"
              maxlength="60"
              class="w-full"
              autofocus
            />
          </UFormField>

          <UFormField label="Ícone (opcional)">
            <div class="flex flex-wrap gap-1.5">
              <button
                type="button"
                class="flex size-9 items-center justify-center rounded-md border text-gray-500 transition"
                :class="
                  !form.icon
                    ? 'border-primary-500 ring-2 ring-primary-500/30'
                    : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
                "
                aria-label="Sem ícone"
                @click="form.icon = ''"
              >
                <UIcon name="i-lucide-ban" class="size-4" />
              </button>
              <button
                v-for="ic in SECTION_ICONS"
                :key="ic"
                type="button"
                class="flex size-9 items-center justify-center rounded-md border transition"
                :class="
                  form.icon === ic
                    ? 'border-primary-500 text-primary-600 ring-2 ring-primary-500/30'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                "
                @click="form.icon = ic"
              >
                <UIcon :name="ic" class="size-4" />
              </button>
            </div>
          </UFormField>
        </div>
      </template>

      <template #footer>
        <div class="flex w-full items-center gap-2">
          <UButton
            v-if="editing"
            color="error"
            variant="ghost"
            icon="i-lucide-trash-2"
            :loading="deleting"
            @click="removeTab"
          >
            Excluir
          </UButton>
          <div class="flex-1" />
          <UButton color="neutral" variant="ghost" @click="modalOpen = false">
            Cancelar
          </UButton>
          <UButton :loading="saving" icon="i-lucide-check" @click="submit">
            {{ editing ? 'Salvar' : 'Criar' }}
          </UButton>
        </div>
      </template>
    </UModal>
  </div>
</template>
