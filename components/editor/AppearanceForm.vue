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

// Pré-carrega todas as fontes para o preview dos botões
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@400;500;600&family=Playfair+Display:wght@400;500;600&family=Raleway:wght@400;500;600&family=Oswald:wght@400;500;600&family=Lora:wght@400;500;600&family=Space+Grotesk:wght@400;500;600&family=Josefin+Sans:wght@400;500;600&family=Caveat:wght@400;500;600;700&family=Pacifico&display=swap',
    },
  ],
})

const FONTS = [
  { value: 'Inter', label: 'Inter', hint: 'moderno' },
  { value: 'Poppins', label: 'Poppins', hint: 'arredondada' },
  { value: 'Playfair Display', label: 'Playfair', hint: 'editorial' },
  { value: 'Raleway', label: 'Raleway', hint: 'elegante' },
  { value: 'Oswald', label: 'Oswald', hint: 'compacta' },
  { value: 'Lora', label: 'Lora', hint: 'literária' },
  { value: 'Space Grotesk', label: 'Space Grotesk', hint: 'técnica' },
  { value: 'Josefin Sans', label: 'Josefin', hint: 'geométrica' },
  { value: 'Caveat', label: 'Caveat', hint: 'manuscrita' },
  { value: 'Pacifico', label: 'Pacifico', hint: 'casual' },
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
          <div class="grid grid-cols-2 gap-2">
            <button
              v-for="f in FONTS"
              :key="f.value"
              type="button"
              class="flex flex-col rounded-lg border px-3 py-2.5 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              :class="
                theme.font === f.value
                  ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-500/30 dark:bg-primary-950/30'
                  : 'border-gray-200 hover:border-gray-300 dark:border-gray-700'
              "
              :style="{ fontFamily: `'${f.value}', sans-serif` }"
              @click="theme.font = theme.font === f.value ? undefined : f.value"
            >
              <span class="text-sm font-medium leading-tight">{{ f.label }}</span>
              <span class="mt-0.5 text-xs text-gray-400 dark:text-gray-500">{{ f.hint }}</span>
            </button>
          </div>
          <p v-if="theme.font" class="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Ativa: <strong>{{ theme.font }}</strong>. Clique novamente para remover.
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
