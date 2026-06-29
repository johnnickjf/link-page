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
const { uploadImage } = useImageUpload()
const auth = useAuthStore()
const isEdit = computed(() => Boolean(props.block))
const isFree = computed(() => (auth.user?.plan ?? 'free') === 'free')

const _PREMIUM_BLOCK_TYPES = new Set<BlockType>(['text', 'image'])

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

// Ícones populares para o botão de link (Lucide + algumas marcas).
const LINK_ICONS = [
  'i-lucide-link', 'i-lucide-globe', 'i-lucide-shopping-bag', 'i-lucide-music',
  'i-lucide-play', 'i-lucide-video', 'i-lucide-mail', 'i-lucide-phone',
  'i-lucide-calendar', 'i-lucide-map-pin', 'i-lucide-star', 'i-lucide-heart',
  'i-lucide-book-open', 'i-lucide-briefcase', 'i-lucide-camera', 'i-lucide-file-text',
  'i-lucide-download', 'i-lucide-gift', 'i-lucide-newspaper', 'i-lucide-graduation-cap',
  'i-simple-icons-spotify', 'i-simple-icons-youtube', 'i-simple-icons-instagram',
  'i-simple-icons-tiktok',
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
            class="relative flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            :class="[
              form.type === t.value
                ? 'border-primary-500 ring-2 ring-primary-500/30'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700',
              isFree && _PREMIUM_BLOCK_TYPES.has(t.value)
                ? 'cursor-not-allowed opacity-50'
                : '',
            ]"
            :disabled="isFree && _PREMIUM_BLOCK_TYPES.has(t.value)"
            @click="!(isFree && _PREMIUM_BLOCK_TYPES.has(t.value)) && (form.type = t.value)"
          >
            <UIcon :name="t.icon" class="size-5" />
            {{ t.label }}
            <UBadge
              v-if="isFree && _PREMIUM_BLOCK_TYPES.has(t.value)"
              color="primary"
              variant="subtle"
              size="sm"
            >
              Premium
            </UBadge>
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
          <UFormField label="Ícone (opcional)">
            <div class="space-y-2">
              <div class="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
                <button
                  v-for="ic in LINK_ICONS"
                  :key="ic"
                  type="button"
                  :aria-label="ic"
                  class="flex aspect-square items-center justify-center rounded-md border transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                  :class="
                    form.link.icon === ic
                      ? 'border-primary-500 text-primary-600 ring-2 ring-primary-500/30'
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-700 dark:text-gray-300'
                  "
                  @click="form.link.icon = form.link.icon === ic ? '' : ic"
                >
                  <UIcon :name="ic" class="size-5" />
                </button>
              </div>
              <UInput v-model="form.link.icon" placeholder="i-lucide-globe" class="w-full" />
              <p class="text-xs text-gray-500 dark:text-gray-400">
                Escolha acima ou cole um código. Qualquer ícone do
                <a
                  href="https://lucide.dev/icons"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary-500 hover:underline"
                >Lucide</a>
                (<code>i-lucide-nome</code>) ou marca do
                <a
                  href="https://simpleicons.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary-500 hover:underline"
                >Simple Icons</a>
                (<code>i-simple-icons-nome</code>).
              </p>
            </div>
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
          <ImageUploadField
            v-model="form.image.url"
            :uploader="uploadImage"
            rounded="lg"
            label="Imagem"
          />
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
      <div class="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <UButton color="neutral" variant="ghost" class="w-full sm:w-auto" @click="open = false">
          Cancelar
        </UButton>
        <UButton :loading="saving" class="w-full sm:w-auto" @click="submit">
          {{ isEdit ? 'Salvar' : 'Adicionar' }}
        </UButton>
      </div>
    </template>
  </UModal>
</template>
