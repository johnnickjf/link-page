/**
 * Preços do plano Gamer mostrados no site (telas de planos e Termos).
 * PRECISAM bater com os Prices criados no Stripe. Enquanto os Prices não
 * existirem, o checkout responde que o plano ainda não está disponível.
 */
export const GAMER_PRICE_MONTHLY = 29.9
export const GAMER_PRICE_YEARLY = 299.9

export function brl(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** O que o plano Gamer soma ao Premium. */
export const GAMER_EXCLUSIVE_FEATURES = [
  'Temas gamer HUD, Esports e Cozy',
  'Conquistas no perfil',
  'Player da Twitch, do YouTube e widget do Discord',
  'Cabeçalho com gamertag, jogo principal e status',
  'Até 24 jogos por bloco',
]

/** Destaques do cartão do Free. */
export const FREE_HIGHLIGHTS = [
  '1 página com até 10 blocos',
  'Templates Minimal, Classic, Dark e Arcade',
  'Blocos de Link, Social, WhatsApp e E-mail',
  'IDs de jogo e até 3 jogos na página',
  'Nível, XP e contagem de visitas e cliques',
]

/** O que o Premium soma ao Free. */
export const PREMIUM_HIGHLIGHTS = [
  'Até 10 páginas, com 100 blocos em cada',
  'Templates Gradient, Neon e Pixel',
  'Blocos de Texto, Imagem e Mapa, e seções',
  'Fontes e fundo personalizados',
  'QR Code e sem o "Criado por LinkLand"',
]

/** Valor de um plano na comparação: incluso, não incluso ou um limite. */
export type PlanCell = boolean | string

export interface PlanComparisonRow {
  label: string
  free: PlanCell
  premium: PlanCell
  gamer: PlanCell
}

/**
 * Comparação completa da tela de planos. Limites, blocos e templates precisam
 * bater com `link-land/src/utils/plan_catalog.py`, que é quem aplica as regras.
 */
export const PLAN_COMPARISON: { title: string, rows: PlanComparisonRow[] }[] = [
  {
    title: 'Estrutura',
    rows: [
      { label: 'Páginas', free: '1', premium: '10', gamer: '10' },
      { label: 'Blocos por página', free: '10', premium: '100', gamer: '100' },
      { label: 'Seções (abas) na página', free: false, premium: true, gamer: true },
    ],
  },
  {
    title: 'Templates',
    rows: [
      { label: 'Minimal, Classic, Dark e Arcade', free: true, premium: true, gamer: true },
      { label: 'Gradient, Neon e Pixel', free: false, premium: true, gamer: true },
      { label: 'HUD, Esports e Cozy', free: false, premium: false, gamer: true },
    ],
  },
  {
    title: 'Blocos',
    rows: [
      { label: 'Link, Social, WhatsApp e E-mail', free: true, premium: true, gamer: true },
      { label: 'Texto, Imagem e Mapa', free: false, premium: true, gamer: true },
    ],
  },
  {
    title: 'Personalização',
    rows: [
      { label: 'Fontes personalizadas', free: false, premium: true, gamer: true },
      { label: 'Fundo com cor, gradiente ou imagem', free: false, premium: true, gamer: true },
      { label: 'QR Code da página', free: false, premium: true, gamer: true },
      { label: 'Ocultar "Criado por LinkLand"', free: false, premium: true, gamer: true },
    ],
  },
  {
    title: 'Perfil gamer',
    rows: [
      { label: 'IDs de jogo, com botão de copiar', free: true, premium: true, gamer: true },
      { label: 'Lista de jogos', free: '3 na página', premium: '3 na página', gamer: '24 por bloco' },
      { label: 'Cabeçalho com gamertag, jogo principal e status', free: false, premium: false, gamer: true },
      { label: 'Conquistas no perfil', free: false, premium: false, gamer: true },
      { label: 'Player da Twitch, do YouTube e widget do Discord', free: false, premium: false, gamer: true },
    ],
  },
  {
    title: 'Alcance e suporte',
    rows: [
      { label: 'Nível, XP e contagem de visitas e cliques', free: true, premium: true, gamer: true },
      { label: 'SEO com título, descrição e prévia ao compartilhar', free: true, premium: true, gamer: true },
      { label: 'Novos recursos em primeira mão', free: false, premium: true, gamer: true },
      { label: 'Suporte prioritário', free: false, premium: true, gamer: true },
    ],
  },
]

/** O que todo mundo já tem, inclusive no Free. */
export const GAMER_FREE_FEATURES = [
  'IDs de jogo, com botão de copiar',
  'Até 3 jogos na página',
  'Tema gamer Arcade',
  'Nível e barra de XP',
  'Contagem anônima de visitas e cliques',
]
