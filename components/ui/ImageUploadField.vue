<script setup lang="ts">
// Campo de upload de imagem reutilizável (avatar, fundo, bloco de imagem).
// v-model = URL final (absoluta). O `uploader` faz o POST e devolve a URL.
const model = defineModel<string>({ default: '' })
const props = defineProps<{
  uploader: (file: File) => Promise<string>
  label?: string
  buttonLabel?: string
  rounded?: 'full' | 'lg'
}>()

const toast = useToast()
const uploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const localPreview = ref('')

const previewSrc = computed(() => localPreview.value || model.value)
const roundedClass = computed(() =>
  props.rounded === 'full' ? 'rounded-full' : 'rounded-lg',
)

function pick(): void {
  fileInput.value?.click()
}

async function onChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = '' // permite reenviar o mesmo arquivo
  if (!file) return
  if (!file.type.startsWith('image/')) {
    toast.add({ title: 'Selecione um arquivo de imagem', color: 'error' })
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.add({ title: 'Imagem muito grande (máx. 5 MB)', color: 'error' })
    return
  }

  localPreview.value = URL.createObjectURL(file)
  uploading.value = true
  try {
    model.value = await props.uploader(file)
    toast.add({ title: 'Imagem enviada', color: 'success' })
  } catch (err) {
    toast.add({
      title: 'Não foi possível enviar a imagem',
      description: getApiErrorMessage(err),
      color: 'error',
    })
  } finally {
    uploading.value = false
    if (localPreview.value) {
      URL.revokeObjectURL(localPreview.value)
      localPreview.value = ''
    }
  }
}
</script>

<template>
  <div>
    <p
      v-if="label"
      class="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
    >
      {{ label }}
    </p>
    <div class="flex items-center gap-4">
      <img
        v-if="previewSrc"
        :src="previewSrc"
        alt="Pré-visualização"
        class="size-16 shrink-0 object-cover ring-1 ring-gray-200 dark:ring-gray-700"
        :class="roundedClass"
      />
      <div
        v-else
        class="flex size-16 shrink-0 items-center justify-center bg-gray-100 text-gray-400 dark:bg-gray-800"
        :class="roundedClass"
      >
        <UIcon name="i-lucide-image" class="size-7" />
      </div>

      <div class="flex-1">
        <input
          ref="fileInput"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          class="hidden"
          @change="onChange"
        />
        <UButton
          :loading="uploading"
          icon="i-lucide-upload"
          variant="subtle"
          color="neutral"
          @click="pick"
        >
          {{ buttonLabel || (model ? 'Trocar imagem' : 'Enviar imagem') }}
        </UButton>
        <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">
          PNG, JPG ou WebP. Otimização automática.
        </p>
      </div>
    </div>
  </div>
</template>
