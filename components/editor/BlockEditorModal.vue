<script setup lang="ts">
import type {
  BadgeItem,
  BadgesConfig,
  Block,
  BlockType,
  CreateBlockPayload,
  EmailConfig,
  EmbedConfig,
  GameIdConfig,
  GameItem,
  GamesConfig,
  ID,
  ImageConfig,
  LinkConfig,
  MapConfig,
  PageKind,
  SocialConfig,
  TextConfig,
  WhatsappConfig,
} from '~/types/api'

const props = defineProps<{
  pageId: ID
  block?: Block | null
  nextPosition?: number
  /** Seção destino ao criar (null = página sem seções). */
  tabId?: ID | null
  /** Em perfil gamer, os tipos gamer aparecem primeiro. */
  pageKind?: PageKind
}>()
const open = defineModel<boolean>('open', { required: true })
const emit = defineEmits<{ saved: [block: Block] }>()

const store = usePagesStore()
const toast = useToast()
const { uploadImage } = useImageUpload()
const auth = useAuthStore()
const { open: openPremiumUpsell } = usePremiumUpsell()
const isEdit = computed(() => Boolean(props.block))

// Plano mostrado no selo dos tipos que o usuário ainda não tem.
const LOCKED_LABEL: Partial<Record<BlockType, 'Premium' | 'Gamer'>> = {
  text: 'Premium',
  image: 'Premium',
  map: 'Premium',
  badges: 'Gamer',
  embed: 'Gamer',
}
function lockLabel(type: BlockType): string | null {
  const label = LOCKED_LABEL[type]
  return label && !auth.canUseBlockType(type) ? label : null
}

const TYPES: { value: BlockType; label: string; icon: string }[] = [
  { value: 'link', label: 'Link', icon: 'i-lucide-link' },
  { value: 'social', label: 'Rede social', icon: 'i-lucide-at-sign' },
  { value: 'whatsapp', label: 'WhatsApp', icon: 'i-simple-icons-whatsapp' },
  { value: 'email', label: 'E-mail', icon: 'i-lucide-mail' },
  { value: 'text', label: 'Texto', icon: 'i-lucide-type' },
  { value: 'image', label: 'Imagem', icon: 'i-lucide-image' },
  { value: 'map', label: 'Mapa', icon: 'i-lucide-map-pin' },
  { value: 'gameid', label: 'ID de jogo', icon: 'i-lucide-gamepad-2' },
  { value: 'games', label: 'Jogos', icon: 'i-lucide-joystick' },
  { value: 'badges', label: 'Conquistas', icon: 'i-lucide-trophy' },
  { value: 'embed', label: 'Stream', icon: 'i-lucide-tv' },
]
const NETWORKS = Object.entries(NETWORK_LABELS).map(([value, label]) => ({ value, label }))

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

function iconAriaLabel(ic: string): string {
  const name = ic.replace(/^i-(?:lucide|simple-icons)-/, '').replace(/-/g, ' ')
  return `Ícone ${name}`
}

function selectType(type: BlockType): void {
  const locked = lockLabel(type)
  if (locked) {
    openPremiumUpsell(locked === 'Gamer' ? 'gamer' : 'premium')
    return
  }
  form.type = type
  error.value = null
}

interface GameRow {
  name: string
  rank: string
  hours: number | null
  cover_url: string
}
function blankGame(): GameRow {
  return { name: '', rank: '', hours: null, cover_url: '' }
}
function blankBadge(): { title: string, icon: string, description: string } {
  return { title: '', icon: 'trophy', description: '' }
}

function blankForm() {
  return {
    type: 'link' as BlockType,
    is_active: true,
    link: { label: '', url: '', icon: '' } as LinkConfig,
    social: { network: 'instagram', url: '' } as SocialConfig,
    whatsapp: { phone: '', message: '', label: '' } as WhatsappConfig,
    email: { email: '', label: '', subject: '' } as EmailConfig,
    text: { content: '' } as TextConfig,
    image: { url: '', alt: '', link: '' } as ImageConfig,
    map: { address: '', label: '' } as MapConfig,
    gameid: { platform: 'steam', handle: '', url: '' } as GameIdConfig,
    games: { title: '', items: [blankGame()] } as { title: string, items: GameRow[] },
    badges: { title: '', items: [blankBadge()] },
    embed: { provider: 'twitch', value: '', label: '' } as EmbedConfig,
  }
}
const orderedTypes = computed(() => {
  if (props.pageKind !== 'gamer') return TYPES
  const isGamerType = (t: BlockType) => ['gameid', 'games', 'badges', 'embed'].includes(t)
  return [...TYPES.filter((t) => isGamerType(t.value)), ...TYPES.filter((t) => !isGamerType(t.value))]
})

const form = reactive(blankForm())

const BADGE_ICON_OPTIONS = Object.keys(BADGE_ICONS).map((value) => ({
  value,
  label: { trophy: 'Troféu', medal: 'Medalha', crown: 'Coroa', flame: 'Chama', swords: 'Espadas', target: 'Alvo', star: 'Estrela', zap: 'Raio', shield: 'Escudo', gem: 'Gema', rocket: 'Foguete', gamepad: 'Controle' }[value] ?? value,
}))
const EMBED_OPTIONS = (Object.keys(EMBED_PROVIDERS) as EmbedProvider[]).map((value) => ({
  value,
  label: EMBED_PROVIDERS[value].label,
}))

// Limite de jogos do plano. O backend confere o total da página.
const maxGames = computed(() => (auth.hasFeature('games_unlimited') ? 24 : 3))
function addGame(): void {
  if (form.games.items.length >= maxGames.value) {
    // Com 24 já é o máximo de qualquer plano: não há o que oferecer.
    if (maxGames.value === 3) openPremiumUpsell('gamer')
    return
  }
  form.games.items.push(blankGame())
}
const saving = ref(false)
const error = ref<string | null>(null)

// Link colado no bloco errado: quem cola o endereço do Instagram num "Link" quase
// sempre queria o ícone da rede, e um wa.me queria o botão de WhatsApp. O editor
// oferece a troca com um clique, levando o que já foi digitado.
const linkSuggestion = computed(() => {
  if (isEdit.value || form.type !== 'link') return null
  const phone = whatsappPhoneFromUrl(form.link.url)
  if (phone) return { kind: 'whatsapp' as const, phone }
  const network = detectNetwork(form.link.url)
  if (network && !lockLabel('social')) return { kind: 'social' as const, network }
  return null
})

function applyLinkSuggestion(): void {
  const s = linkSuggestion.value
  if (!s) return
  if (s.kind === 'social') {
    form.social.network = s.network
    form.social.url = form.link.url.trim()
    form.type = 'social'
  } else {
    form.whatsapp.phone = s.phone
    if (form.link.label.trim()) form.whatsapp.label = form.link.label.trim()
    form.type = 'whatsapp'
  }
  error.value = null
}

// No bloco de rede, a rede acompanha o endereço colado.
watch(() => form.social.url, (url) => {
  const network = detectNetwork(url)
  if (network) form.social.network = network
})

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
  else if (b.type === 'email') Object.assign(form.email, b.config)
  else if (b.type === 'text') Object.assign(form.text, b.config)
  else if (b.type === 'image') Object.assign(form.image, b.config)
  else if (b.type === 'map') Object.assign(form.map, b.config)
  else if (b.type === 'gameid') Object.assign(form.gameid, b.config)
  else if (b.type === 'embed') Object.assign(form.embed, b.config)
  else if (b.type === 'games') {
    form.games.title = b.config.title ?? ''
    form.games.items = b.config.items.map((g) => ({ ...blankGame(), ...g }))
  } else if (b.type === 'badges') {
    form.badges.title = b.config.title ?? ''
    form.badges.items = b.config.items.map((x) => ({ ...blankBadge(), ...x }))
  }
})

function buildConfig() {
  switch (form.type) {
    case 'link': {
      const c: LinkConfig = {
        label: form.link.label.trim(),
        url: withScheme(form.link.url),
      }
      if (form.link.icon?.trim()) c.icon = form.link.icon.trim()
      return c
    }
    case 'social':
      return { network: form.social.network, url: withScheme(form.social.url) }
    case 'whatsapp': {
      const c: WhatsappConfig = { phone: form.whatsapp.phone.trim() }
      if (form.whatsapp.message?.trim()) c.message = form.whatsapp.message.trim()
      if (form.whatsapp.label?.trim()) c.label = form.whatsapp.label.trim()
      return c
    }
    case 'email': {
      const c: EmailConfig = { email: form.email.email.trim() }
      if (form.email.label?.trim()) c.label = form.email.label.trim()
      if (form.email.subject?.trim()) c.subject = form.email.subject.trim()
      return c
    }
    case 'text':
      return { content: form.text.content.trim() }
    case 'image': {
      const c: ImageConfig = { url: withScheme(form.image.url) }
      if (form.image.alt?.trim()) c.alt = form.image.alt.trim()
      if (form.image.link?.trim()) c.link = withScheme(form.image.link)
      return c
    }
    case 'map': {
      const c: MapConfig = { address: form.map.address.trim() }
      if (form.map.label?.trim()) c.label = form.map.label.trim()
      return c
    }
    case 'gameid': {
      const c: GameIdConfig = {
        platform: form.gameid.platform,
        handle: form.gameid.handle.trim(),
      }
      if (form.gameid.url?.trim()) c.url = withScheme(form.gameid.url)
      return c
    }
    case 'games': {
      const c: GamesConfig = {
        items: form.games.items
          .filter((g) => g.name.trim())
          .map((g) => {
            const item: GameItem = { name: g.name.trim() }
            if (g.rank.trim()) item.rank = g.rank.trim()
            if (g.hours !== null && g.hours !== undefined && String(g.hours) !== '') item.hours = Number(g.hours)
            if (g.cover_url) item.cover_url = g.cover_url
            return item
          }),
      }
      if (form.games.title.trim()) c.title = form.games.title.trim()
      return c
    }
    case 'badges': {
      const c: BadgesConfig = {
        items: form.badges.items
          .filter((x) => x.title.trim())
          .map((x) => {
            const item: BadgeItem = { title: x.title.trim(), icon: x.icon }
            if (x.description.trim()) item.description = x.description.trim()
            return item
          }),
      }
      if (form.badges.title.trim()) c.title = form.badges.title.trim()
      return c
    }
    case 'embed': {
      const c: EmbedConfig = { provider: form.embed.provider, value: form.embed.value.trim() }
      if (form.embed.label?.trim()) c.label = form.embed.label.trim()
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
    case 'email':
      if (!form.email.email.trim()) return 'Informe o e-mail'
      if (!isValidEmail(form.email.email.trim())) return 'E-mail inválido'
      break
    case 'gameid':
      if (!form.gameid.handle.trim()) return 'Informe o seu ID'
      break
    case 'games':
      if (!form.games.items.some((g) => g.name.trim())) return 'Adicione ao menos um jogo'
      break
    case 'badges':
      if (!form.badges.items.some((x) => x.title.trim())) return 'Adicione ao menos uma conquista'
      break
    case 'embed':
      if (!form.embed.value.trim()) return 'Informe o canal, vídeo ou servidor'
      break
    case 'text':
      if (!form.text.content.trim()) return 'Escreva o texto'
      break
    case 'image':
      if (!form.image.url.trim()) return 'Informe a URL da imagem'
      break
    case 'map':
      if (!form.map.address.trim()) return 'Informe um endereço ou link do Google Maps'
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
          is_active: form.is_active,
          tab_id: props.tabId ?? null,
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
        <div v-if="!isEdit" role="radiogroup" aria-label="Tipo de bloco" class="grid grid-cols-3 gap-2 sm:grid-cols-5">
          <button
            v-for="t in orderedTypes"
            :key="t.value"
            type="button"
            role="radio"
            :aria-checked="form.type === t.value"
            class="relative flex flex-col items-center gap-1.5 rounded-lg border p-3 text-xs transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            :class="[
              form.type === t.value
                ? 'border-primary-500 ring-2 ring-primary-500/30'
                : 'border-gray-200 hover:border-gray-300 dark:border-gray-700',
              lockLabel(t.value) ? 'opacity-60' : '',
            ]"
            @click="selectType(t.value)"
          >
            <UIcon :name="t.icon" class="size-5" />
            {{ t.label }}
            <UBadge
              v-if="lockLabel(t.value)"
              color="primary"
              variant="subtle"
              size="sm"
            >
              {{ lockLabel(t.value) }}
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
          <div
            v-if="linkSuggestion"
            class="flex flex-col gap-3 rounded-lg border border-primary-200 bg-primary-50 p-3 text-sm sm:flex-row sm:items-center sm:justify-between dark:border-primary-900 dark:bg-primary-950/40"
            data-testid="link-suggestion"
          >
            <p class="text-gray-800 dark:text-gray-100">
              <template v-if="linkSuggestion.kind === 'social'">
                Este é um link do <strong>{{ networkLabel(linkSuggestion.network) }}</strong>. Quer mostrar como ícone de rede social, no topo da página?
              </template>
              <template v-else>
                Este é um link de <strong>WhatsApp</strong>. O botão de WhatsApp abre a conversa direto, com uma mensagem pronta se você quiser.
              </template>
            </p>
            <UButton size="sm" class="shrink-0 self-start sm:self-auto" @click="applyLinkSuggestion">
              {{ linkSuggestion.kind === 'social' ? 'Usar como rede social' : 'Usar botão de WhatsApp' }}
            </UButton>
          </div>
          <UFormField label="Ícone (opcional)">
            <div class="space-y-2">
              <div class="grid grid-cols-6 gap-1.5 sm:grid-cols-8">
                <button
                  v-for="ic in LINK_ICONS"
                  :key="ic"
                  type="button"
                  :aria-label="iconAriaLabel(ic)"
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
                  class="text-primary-600 dark:text-primary-400 hover:underline"
                >Lucide</a>
                (<code>i-lucide-nome</code>) ou marca do
                <a
                  href="https://simpleicons.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="text-primary-600 dark:text-primary-400 hover:underline"
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

        <template v-else-if="form.type === 'email'">
          <UFormField label="E-mail">
            <UInput
              v-model="form.email.email"
              type="email"
              placeholder="voce@exemplo.com"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Texto do botão (opcional)">
            <UInput
              v-model="form.email.label"
              placeholder="Enviar e-mail"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Assunto pré-preenchido (opcional)">
            <UInput
              v-model="form.email.subject"
              placeholder="Olá! Vim pela sua página"
              class="w-full"
            />
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

        <template v-else-if="form.type === 'map'">
          <UFormField
            label="Endereço"
            hint="Endereço, CEP, ou cole um link do Google Maps"
          >
            <UTextarea
              v-model="form.map.address"
              :rows="2"
              placeholder="Av. Paulista, 1578, São Paulo — ou cole o link do Google Maps"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Legenda (opcional)">
            <UInput v-model="form.map.label" placeholder="Nossa loja física" class="w-full" />
          </UFormField>
        </template>

        <template v-else-if="form.type === 'gameid'">
          <UFormField label="Plataforma">
            <USelect v-model="form.gameid.platform" :items="PLATFORM_OPTIONS" class="w-full" />
          </UFormField>
          <UFormField label="Seu ID">
            <UInput
              v-model="form.gameid.handle"
              maxlength="64"
              :placeholder="PLATFORMS[form.gameid.platform].placeholder"
              class="w-full"
            />
          </UFormField>
          <UFormField
            label="Link do perfil (opcional)"
            hint="Sem link, o visitante copia o ID"
          >
            <UInput v-model="form.gameid.url" placeholder="https://…" class="w-full" />
          </UFormField>
        </template>

        <template v-else-if="form.type === 'games'">
          <UFormField label="Título (opcional)">
            <UInput v-model="form.games.title" maxlength="60" placeholder="Mais jogados" class="w-full" />
          </UFormField>
          <div
            v-for="(game, i) in form.games.items"
            :key="i"
            class="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
            data-testid="game-row"
          >
            <div class="flex items-center gap-2">
              <UInput v-model="game.name" maxlength="60" placeholder="Nome do jogo" class="min-w-0 flex-1" :aria-label="`Nome do jogo ${i + 1}`" />
              <UButton
                v-if="form.games.items.length > 1"
                icon="i-lucide-x"
                size="sm"
                variant="ghost"
                color="neutral"
                :aria-label="`Remover jogo ${i + 1}`"
                @click="form.games.items.splice(i, 1)"
              />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <UInput v-model="game.rank" maxlength="40" placeholder="Elo / rank" :aria-label="`Rank do jogo ${i + 1}`" />
              <UInput v-model.number="game.hours" type="number" min="0" placeholder="Horas jogadas" :aria-label="`Horas do jogo ${i + 1}`" />
            </div>
            <ImageUploadField v-model="game.cover_url" :uploader="uploadImage" rounded="lg" button-label="Capa do jogo" />
          </div>
          <UButton
            variant="subtle"
            color="neutral"
            size="sm"
            icon="i-lucide-plus"
            data-testid="add-game"
            :disabled="maxGames > 3 && form.games.items.length >= maxGames"
            @click="addGame"
          >
            Adicionar jogo
          </UButton>
        </template>

        <template v-else-if="form.type === 'badges'">
          <UFormField label="Título (opcional)">
            <UInput v-model="form.badges.title" maxlength="60" placeholder="Conquistas" class="w-full" />
          </UFormField>
          <div
            v-for="(badge, i) in form.badges.items"
            :key="i"
            class="space-y-2 rounded-lg border border-gray-200 p-3 dark:border-gray-700"
          >
            <div class="flex items-center gap-2">
              <USelect v-model="badge.icon" :items="BADGE_ICON_OPTIONS" class="w-32 shrink-0" :aria-label="`Ícone da conquista ${i + 1}`" />
              <UInput v-model="badge.title" maxlength="40" placeholder="Top 500" class="min-w-0 flex-1" :aria-label="`Título da conquista ${i + 1}`" />
              <UButton
                v-if="form.badges.items.length > 1"
                icon="i-lucide-x"
                size="sm"
                variant="ghost"
                color="neutral"
                :aria-label="`Remover conquista ${i + 1}`"
                @click="form.badges.items.splice(i, 1)"
              />
            </div>
            <UInput v-model="badge.description" maxlength="80" placeholder="Detalhe (opcional)" class="w-full" :aria-label="`Detalhe da conquista ${i + 1}`" />
          </div>
          <UButton
            v-if="form.badges.items.length < 12"
            variant="subtle"
            color="neutral"
            size="sm"
            icon="i-lucide-plus"
            @click="form.badges.items.push(blankBadge())"
          >
            Adicionar conquista
          </UButton>
        </template>

        <template v-else-if="form.type === 'embed'">
          <UFormField label="Serviço">
            <USelect v-model="form.embed.provider" :items="EMBED_OPTIONS" class="w-full" />
          </UFormField>
          <UFormField :label="EMBED_PROVIDERS[form.embed.provider].hint">
            <UInput
              v-model="form.embed.value"
              :placeholder="EMBED_PROVIDERS[form.embed.provider].placeholder"
              class="w-full"
            />
          </UFormField>
          <UFormField label="Texto do botão (opcional)">
            <UInput v-model="form.embed.label" maxlength="60" :placeholder="EMBED_PROVIDERS[form.embed.provider].cta" class="w-full" />
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
