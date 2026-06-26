<script setup lang="ts">
import type {
  Block,
  BlockType,
  CreateBlockPayload,
  ID,
  ImageConfig,
  LinkConfig,
  SocialConfig,
  TextConfig,
  WhatsappConfig,
} from '~/types/api'

const props = defineProps<{
  pageId: ID
  block?: Block | null
  nextPosition?: number
}>()
const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ saved: [block: Block] }>()

const store = usePagesStore()
const toast = useToast()
const isEdit = computed(() => Boolean(props.block))

const TYPES: { value: BlockType; label: string; icon: string }[] = [
  { value: 'link', label: 'Link', icon: 'i-lucide-link' },
  { value: 'social', label: 'Rede social', icon: 'i-lucide-at-sign' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'i-simple-icons-whatsapp' },
  { value: 'text', label: 'Texto', icon: 'i-lucide-type' },
  { value: 'image', label: 'Imagem', icon: 'i-lucide-image' },
]
const NETWORKS = [
  'instagram', 'tiktok', 'youtube', 'x', 'facebook', 'linkedin',
  'github', 'twitch', 'telegram', 'spotify', 'threads', 'pinterest',
]

function blankForm() {
  return {
    type: 'link' as BlockType,
    is_active: true,
    link: { label: '', url: '', icon: '' } as LinkConfig,
    social: { network: 'instagram', url: '' } as SocialConfig,
    whatsapp: { phone: '', message: '', label: '' } as WhatsappConfig,
    text: { content: '' } as TextConfig,
    image: { url: '', alt: '', link: '' } as ImageConfig,
  }
}
const form = reactive(blankForm())
const saving = ref(false)
const error = ref<string | null>(null)

watch(open, (isOpen) => {
  if (!isOpen) return
  error.value = null
  Object.assign(form, blankForm())
  const b = props.block
  if (!b) return
  form.type = b.type
  form.is_active = b.is_active
  if (b.type === 'link') Object.assign(form.link, b.config)
  else if (b.type === 'social') Object.assign(form.social, b.config)
  else if (b.type === 'whatsapp') Object.assign(form.whatsapp, b.config)
  else if (b.type === 'text') Object.assign(form.text, b.config)
  else if (b.type === 'image') Object.assign(form.image, b.config)
})

function buildConfig() {
  switch (form.type) {
    case 'link': {
      const c: LinkConfig = {
        label: form.link.label.trim(),
        url: form.link.url.trim(),
      }
      if (form.link.icon?.trim()) c.icon = form.link.icon.trim()
      return c
    }
    case 'social':
      return { network: form.social.network, url: form.social.url.trim() }
    case 'whatsapp': {
      const c: WhatsappConfig = { phone: form.whatsapp.phone.trim() }
      if (form.whatsapp.message?.trim()) c.message = form.whatsapp.message.trim()
      if (form.whatsapp.label?.trim()) c.label = form.whatsapp.label.trim()
      return c
    }
    case 'text':
      return { content: form.text.content.trim() }
    case 'image': {
      const c: ImageConfig = { url: form.image.url.trim() }
      if (form.image.alt?.trim()) c.alt = form.image.alt.trim()
      if (form.image.link?.trim()) c.link = form.image.link.trim()
      return c
    }
  }
}

function validate(): string | null {
  switch (form.type) {
    case 'link':
      if (!form.link.label.trim()) return 'Informe o texto do botão'
      if (!form.link.url.trim()) return 'Informe a URL'
      break
    case 'social':
      if (!form.social.url.trim()) return 'Informe a URL'
      break
    case 'whatsapp':
      if (!form.whatsapp.phone.trim()) return 'Informe o telefone'
      break
    case 'text':
      if (!form.text.content.trim()) return 'Escreva o texto'
      break
    case 'image':
      if (!form.image.url.trim()) return 'Informe a URL da imagem'
      break
  }
  return null
}

async function submit(): Promise<void> {
  const invalid = validate()
  if (invalid) {
    error.value = invalid
    return
  }
  saving.value = true
  error.value = null
  try {
    const result = props.block
      ? await store.updateBlock(props.block.id, {
          config: buildConfig(),
          is_active: form.is_active,
        })
      : await store.createBlock(props.pageId, {
          type: form.type,
          config: buildConfig(),
          position: props.nextPosition,
        } as CreateBlockPayload)
    emit('saved', result)
    toast.add({
      title: isEdit.value ? 'Bloco atualizado' : 'Bloco adicionado',
      color: 'success',
    })
    open.value = false
  } catch (e) {
    error.value = getApiErrorMessage(e)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <UModal v-model:open="open" :title="isEdit ? 'Editar bloco' : 'Novo bloco'">
    <template #body>
      <div class="space-y-4">
        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          icon="i-lucide-triangle-alert"
          :description="error"
        />

        <!-- Tipo (só na criação) -->
        <div v-if="!isEdit" class="grid grid-cols-3 gap-2 sm:grid-cols-5">
          <button
            v-for="t in TYPES"
            :key="t.value"
            type="button"
            class="flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition"
            :class="
              form.type === t.value
                ? 'border-primary-500 ring-2 ring-primary-500/30'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
            "
            @click="form.type = t.value"
          >
            <UIcon :name="t.icon" class="size-5" />
            {{ t.label }}
          </button>
        </div>

        <!-- Campos por tipo -->
        <template v-if="form.type === 'link'">
          <UFormField label="Texto do botão">
            <UInput v-model="form.link.label" placeholder="Meu site" class="w-full" />
          </UFormField>
          <UFormField label="URL">
            <UInput v-model="form.link.url" placeholder="https://…" class="w-full" />
          </UFormField>
          <UFormField label="Ícone (opcional)" hint="ex.: i-lucide-globe">
            <UInput v-model="form.link.icon" placeholder="i-lucide-globe" class="w-full" />
          </UFormField>
        </template>

        <template v-else-if="form.type === 'social'">
          <UFormField label="Rede">
            <USelect v-model="form.social.network" :items="NETWORKS" class="w-full" />
          </UFormField>
          <UFormField label="URL">
            <UInput
              v-model="form.social.url"
              placeholder="https://instagram.com/voce"
              class="w-full"
            />
          </UFormField>
        </template>

        <template v-else-if="form.type === 'whatsapp'">
          <UFormField label="Telefone" hint="só números, com DDI/DDD">
            <UInput
              v-model="form.whatsapp.phone"
              placeholder="5511999998888"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Mensagem (opcional)">
            <UTextarea
              v-model="form.whatsapp.message"
              :rows="2"
              placeholder="Olá! Vim pela sua página…"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Texto do botão (opcional)">
            <UInput v-model="form.whatsapp.label" placeholder="Fale comigo" class="w-full" />
          </UFormField>
        </template>

        <template v-else-if="form.type === 'text'">
          <UFormField label="Conteúdo">
            <UTextarea
              v-model="form.text.content"
              :rows="3"
              placeholder="Seu texto…"
              class="w-full"
            />
          </UFormField>
        </template>

        <template v-else-if="form.type === 'image'">
          <UFormField label="URL da imagem">
            <UInput v-model="form.image.url" placeholder="https://…/img.jpg" class="w-full" />
          </UFormField>
          <UFormField label="Texto alternativo (opcional)">
            <UInput v-model="form.image.alt" placeholder="Descrição da imagem" class="w-full" />
          </UFormField>
          <UFormField label="Link ao clicar (opcional)">
            <UInput v-model="form.image.link" placeholder="https://…" class="w-full" />
          </UFormField>
        </template>

        <USwitch v-model="form.is_active" label="Ativo" />
      </div>
    </template>

    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton color="neutral" variant="ghost" @click="open = false">
          Cancelar
        </UButton>
        <UButton :loading="saving" @click="submit">
          {{ isEdit ? 'Salvar' : 'Adicionar' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
