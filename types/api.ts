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

/** GET /user/me — inclui `plan` e os limites efetivos já resolvidos. */
export interface User {
  id: ID
  email: string
  name: string
  plan: Plan
  /** Limite efetivo de páginas (null = ilimitado). */
  max_pages: number | null
  /** Limite efetivo de blocos por página (null = ilimitado). */
  max_blocks_per_page: number | null
  is_superadmin: boolean
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export interface RegisterPayload {
  email: string
  password: string
  name: string
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

export type BlockType = 'link' | 'social' | 'whatsapp' | 'text' | 'image'

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

export interface Theme {
  primary?: string
  background?: string
  text?: string
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
