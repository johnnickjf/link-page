/**
 * Tipos do contrato consumido pelo front.
 * Alinhado ao backend (linkland-PROMPT-BACKEND.md, seção 7). Nenhum `any`.
 */

/** Ids são UUID (string) no backend. */
export type ID = string

/** Enum de plano do backend (seção 4). */
export type Plan = 'free' | 'premium' | 'custom'

// ---------------------------------------------------------------------------
// Auth / usuário
// ---------------------------------------------------------------------------

/** Resposta de POST /auth/token e /auth/refresh (JWT). Não há refresh token. */
export interface AuthToken {
  access_token: string
  token_type: string
  expires_in?: number
}

/** Limites efetivos do plano (null = ilimitado). */
export interface PlanLimits {
  max_pages: number | null
  max_blocks_per_page: number | null
}

/** Feature flags do plano custom (espelha CustomFeaturesSchema do backend). */
export interface CustomFeatures {
  max_pages?: number | null
  max_blocks_per_page?: number | null
  block_types: string[]
  templates: string[]
  custom_background: boolean
  custom_font: boolean
  hide_branding: boolean
  qr_code: boolean
}

/** GET /user/me — inclui `plan`, `email_verified` e os limites (aninhados). */
export interface User {
  id: ID
  email: string
  name: string
  plan: Plan
  is_superadmin: boolean
  is_active: boolean
  email_verified: boolean
  /** Limites efetivos resolvidos pelo back. */
  limits: PlanLimits
  /** Somente preenchido quando plan === 'custom'. */
  custom_features?: CustomFeatures | null
  created_at?: string
  updated_at?: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
  referral_code?: string
}

export interface VerifyEmailPayload {
  token: string
}

export interface ResendVerificationPayload {
  email: string
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  token: string
  new_password: string
}

export interface ChangePasswordPayload {
  current_password: string
  new_password: string
}

// ---------------------------------------------------------------------------
// Blocos
// ---------------------------------------------------------------------------

export type BlockType = 'link' | 'social' | 'whatsapp' | 'email' | 'text' | 'image'

export interface LinkConfig {
  label: string
  url: string
  icon?: string
}

export interface SocialConfig {
  /** ex.: 'instagram' | 'tiktok' | 'youtube' | 'x' | 'facebook' | 'linkedin'. */
  network: string
  url: string
}

export interface WhatsappConfig {
  /** Apenas dígitos no backend (ex.: 5511999998888). */
  phone: string
  message?: string
  label?: string
}

export interface EmailConfig {
  email: string
  label?: string
  subject?: string
}

export interface TextConfig {
  content: string
}

export interface ImageConfig {
  url: string
  alt?: string
  link?: string
}

/** Mapa type -> config correspondente. */
export interface BlockConfigByType {
  link: LinkConfig
  social: SocialConfig
  whatsapp: WhatsappConfig
  email: EmailConfig
  text: TextConfig
  image: ImageConfig
}

/** Bloco completo (rotas autenticadas), união discriminada por `type`. */
export type Block = {
  [K in BlockType]: {
    id: ID
    page_id: ID
    type: K
    config: BlockConfigByType[K]
    position: number
    is_active: boolean
  }
}[BlockType]

/** Bloco no shape leve do /public/{slug} (sem id/page_id/is_active). */
export type PublicBlock = {
  [K in BlockType]: {
    type: K
    config: BlockConfigByType[K]
    position: number
  }
}[BlockType]

export interface CreateBlockPayload<K extends BlockType = BlockType> {
  type: K
  config: BlockConfigByType[K]
  position?: number
  is_active?: boolean
}

export interface UpdateBlockPayload {
  config?: BlockConfigByType[BlockType]
  is_active?: boolean
}

export interface ReorderBlocksPayload {
  page_id: ID
  order: ID[]
}

// ---------------------------------------------------------------------------
// Páginas / templates
// ---------------------------------------------------------------------------

/**
 * Personalização da página (campo `theme`, JSON no back). Todos opcionais —
 * o template fornece os defaults e o theme sobrescreve só o que vier preenchido.
 * O índice livre tolera chaves futuras sem quebrar.
 */
export interface Theme {
  /** Formato do botão de link → muda o border-radius. */
  button_style?: 'rounded' | 'square' | 'pill'
  /** Cor de fundo do botão (hex). Também vira a cor de destaque. */
  button_color?: string
  /** Cor do texto do botão (hex). */
  button_text_color?: string
  /** Cor do texto (título/bio) (hex). */
  text_color?: string
  /** Tipo de fundo da página. */
  background_type?: 'color' | 'gradient' | 'image'
  /** Cor (color) ou URL (image). */
  background_value?: string
  /** Gradiente. */
  background_from?: string
  background_to?: string
  background_direction?: string
  /** Fonte (allowlist) — Tier 2. */
  font?: string
  /** Premium: oculta a assinatura "feito com LinkLand". */
  hide_branding?: boolean
  [key: string]: unknown
}

export interface Page {
  id: ID
  user_id?: ID
  slug: string
  title: string
  bio?: string | null
  avatar_url?: string | null
  /** Id do template (ex.: 'minimal'). */
  template: string
  theme?: Theme | null
  is_published: boolean
  created_at?: string
  updated_at?: string
}

export interface CreatePagePayload {
  slug: string
  title: string
  bio?: string
  avatar_url?: string
  template?: string
}

/** PUT /page não troca slug (seção 14.1 do back). */
export type UpdatePagePayload = Partial<
  Pick<Page, 'title' | 'bio' | 'avatar_url' | 'template' | 'theme'>
>

export interface PublishPayload {
  is_published: boolean
}

/** GET /template (público) — config estática do backend. */
export interface Template {
  id: string
  name: string
  description?: string
  premium?: boolean
}

/** Retorno de GET /public/{slug} (somente leitura, SSR). */
export interface PublicPage {
  slug: string
  title: string
  bio?: string | null
  avatar_url?: string | null
  template: string
  theme?: Theme | null
  blocks: PublicBlock[]
}

// ---------------------------------------------------------------------------
// Erros
// ---------------------------------------------------------------------------

/** Corpo de erro: `{ error }` (handlers do back) / `{ message }` / `{ detail }` (422). */
export interface ApiErrorBody {
  error?: string
  message?: string
  detail?: string | Array<{ msg: string; loc?: Array<string | number> }>
}

// ---------------------------------------------------------------------------
// Painel superadmin (/system)
// ---------------------------------------------------------------------------

/** AdminUserResponse — usuário no painel. Limites no nível raiz (≠ /user/me). */
export interface AdminUser {
  id: ID
  email: string
  name: string
  plan: Plan
  max_pages: number | null
  max_blocks_per_page: number | null
  is_superadmin: boolean
  is_active: boolean
  email_verified: boolean
  referral_code: string | null
  custom_features: CustomFeatures | null
  created_at?: string
  updated_at?: string
}

export interface AdminDashboard {
  total_users: number
  active_users: number
  users_by_plan: Partial<Record<Plan, number>>
  total_pages: number
  total_blocks: number
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  page_size: number
}

export interface AdminUserListParams {
  page?: number
  page_size?: number
  plan?: Plan
  q?: string
  has_referral?: boolean
}

/** PATCH /system/users/{id}/plan — custom exige custom_features. */
export interface UpdatePlanPayload {
  plan: Plan
  max_pages?: number | null
  max_blocks_per_page?: number | null
  custom_features?: CustomFeatures
}

export interface MessageResponse {
  message: string
}
