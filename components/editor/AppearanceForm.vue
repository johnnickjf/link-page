<script setup lang="ts">
import type { Theme } from '~/types/api'

// v-model = objeto theme (alimenta o preview ao vivo); "Salvar" persiste via PUT.
const theme = defineModel<Theme>({ required: true })
defineProps<{ saving?: boolean }>()
const emit = defineEmits<{ save: [] }>()

const { uploadImage } = useImageUpload()
const auth = useAuthStore()
const isFree = computed(() => (auth.user?.plan ?? 'free') === 'free')

const buttonStyles = [
  { value: 'rounded', label: 'Arredondado' },
  { value: 'square', label: 'Reto' },
  { value: 'pill', label: 'Pílula' },
] as const

const backgroundTypes = [
  { value: 'color', label: 'Cor' },
  { value: 'gradient', label: 'Gradiente' },
  { value: 'image', label: 'Imagem' },
] as const

const directions = [
  { value: '135deg', label: '↘' },
  { value: '90deg', label: '→' },
  { value: '180deg', label: '↓' },
  { value: '45deg', label: '↗' },
]

const FONTS = [
  'Inter', 'Poppins', 'Montserrat', 'Roboto', 'Nunito',
  'Outfit', 'DM Sans', 'Manrope', 'Raleway', 'Open Sans',
]
</script>

<template>
  <UCard>
    <template #header>
      <h2 class="font-display font-semibold">Aparência</h2>
    </template>

    <div class="space-y-5">
      <!-- Botões -->
      <div>
        <p class="mb-2 text-sm font-medium">Estilo do botão</p>
        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="s in buttonStyles"
            :key="s.value"
            size="sm"
            :variant="theme.button_style === s.value ? 'solid' : 'subtle'"
            :color="theme.button_style === s.value ? 'primary' : 'neutral'"
            @click="theme.button_style = s.value"
          >
            {{ s.label }}
          </UButton>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ColorField v-model="theme.button_color" label="Cor do botão" />
        <ColorField v-model="theme.button_text_color" label="Texto do botão" />
        <ColorField v-model="theme.text_color" label="Cor do texto" />
      </div>

      <!-- Fundo (premium) -->
      <div>
        <div class="mb-2 flex items-center gap-2">
          <p class="text-sm font-medium">Fundo</p>
          <UBadge v-if="isFree" color="primary" variant="subtle" size="sm">Premium</UBadge>
        </div>
        <div :class="isFree ? 'pointer-events-none opacity-40' : ''">
          <div class="flex flex-wrap gap-2">
            <UButton
              v-for="b in backgroundTypes"
              :key="b.value"
              size="sm"
              :variant="theme.background_type === b.value ? 'solid' : 'subtle'"
              :color="theme.background_type === b.value ? 'primary' : 'neutral'"
              @click="theme.background_type = b.value"
            >
              {{ b.label }}
            </UButton>
          </div>

          <div class="mt-3">
            <ColorField
              v-if="theme.background_type === 'color'"
              v-model="theme.background_value"
              label="Cor de fundo"
            />

            <div v-else-if="theme.background_type === 'gradient'" class="space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <ColorField v-model="theme.background_from" label="De" />
                <ColorField v-model="theme.background_to" label="Para" />
              </div>
              <div class="flex flex-wrap gap-2">
                <UButton
                  v-for="d in directions"
                  :key="d.value"
                  size="sm"
                  :variant="theme.background_direction === d.value ? 'solid' : 'subtle'"
                  :color="theme.background_direction === d.value ? 'primary' : 'neutral'"
                  @click="theme.background_direction = d.value"
                >
                  {{ d.label }}
                </UButton>
              </div>
            </div>

            <ImageUploadField
              v-else-if="theme.background_type === 'image'"
              v-model="theme.background_value"
              :uploader="uploadImage"
              rounded="lg"
              label="Imagem de fundo"
            />
          </div>
        </div>
        <p v-if="isFree" class="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
          Personalize o fundo no plano Premium.
        </p>
      </div>

      <!-- Fonte (premium) -->
      <div class="border-t border-gray-100 pt-4 dark:border-gray-800">
        <div class="mb-2 flex items-center gap-2">
          <p class="text-sm font-medium">Fonte</p>
          <UBadge v-if="isFree" color="primary" variant="subtle" size="sm">Premium</UBadge>
        </div>
        <template v-if="!isFree">
          <div class="grid grid-cols-2 gap-2 sm:grid-cols-3">
            <button
              v-for="f in FONTS"
              :key="f"
              type="button"
              class="rounded-lg border px-3 py-2 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              :class="
                theme.font === f
                  ? 'border-primary-500 ring-2 ring-primary-500/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
              "
              :style="{ fontFamily: `'${f}', sans-serif` }"
              @click="theme.font = theme.font === f ? undefined : f"
            >
              {{ f }}
            </button>
          </div>
          <p v-if="theme.font" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Fonte ativa: <strong>{{ theme.font }}</strong>. Clique novamente para remover.
          </p>
        </template>
        <p v-else class="text-xs text-gray-400 dark:text-gray-500">
          Escolha entre 10 fontes do Google Fonts no plano Premium.
        </p>
      </div>

      <!-- Branding (premium) -->
      <div
        class="flex items-center justify-between gap-3 border-t border-gray-100 pt-4 dark:border-gray-800"
      >
        <div>
          <p class="flex items-center gap-2 font-medium">
            Ocultar "feito com LinkLand"
            <UBadge v-if="isFree" color="primary" variant="subtle" size="sm">
              Premium
            </UBadge>
          </p>
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Remove a assinatura no rodapé da página.
          </p>
        </div>
        <USwitch v-model="theme.hide_branding" :disabled="isFree" />
      </div>

      <div class="flex justify-end">
        <UButton :loading="saving" icon="i-lucide-save" @click="emit('save')">
          Salvar aparência
        </UButton>
      </div>
    </div>
  </UCard>
</template>
