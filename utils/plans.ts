/**
 * Planos em ordem de preço: Free → Gamer → Premium. Cada plano tem a própria
 * lista de recursos (sem herança): o Gamer leva só o pacote gamer, e o Premium
 * é o plano completo, com tudo do Gamer. As regras valem no backend, em
 * `link-land/src/utils/plan_catalog.py`; aqui fica só o que aparece na tela.
 *
 * Os preços PRECISAM bater com os Prices criados no Stripe. Enquanto os Prices
 * do Gamer não existirem, o checkout responde que o plano ainda não está
 * disponível.
 */
export const GAMER_PRICE_MONTHLY = 9.9
export const GAMER_PRICE_YEARLY = 99.9

export const PREMIUM_PRICE_MONTHLY = 19.9
export const PREMIUM_PRICE_YEARLY = 199.9

/**
 * Primeiro mês com o cupom de 90% (código DESCONTO, que vai junto no cadastro
 * pelos botões de assinar da home e da /gamer).
 */
export const FIRST_MONTH_COUPON = 'DESCONTO'
export const GAMER_PRICE_FIRST_MONTH = 0.99
export const PREMIUM_PRICE_FIRST_MONTH = 1.99

export function brl(value: number): string {
  return value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/** Destaques do cartão do Free. */
export const FREE_HIGHLIGHTS = [
  '1 página com até 10 blocos',
  'Templates Minimal, Classic, Dark e Arcade',
  'Blocos de Link, Social, WhatsApp e E-mail',
  'IDs de jogo e até 3 jogos na página',
  'Nível, XP e contagem de visitas e cliques',
]

/** O que o Gamer soma ao Free. */
export const GAMER_HIGHLIGHTS = [
  '1 página com até 30 blocos',
  'Temas gamer HUD, Esports, Cozy, Terminal e Quest',
  'Cabeçalho com gamertag, conquistas e até 24 jogos',
  'Player da Twitch, do YouTube e widget do Discord',
  'Sem o "Criado por LinkLand"',
]

/** O que o Premium soma ao Gamer. */
export const PREMIUM_HIGHLIGHTS = [
  'Até 10 páginas, com 100 blocos em cada',
  'Templates Gradient, Neon, Pixel, Aurora e Noir',
  'Blocos de Texto, Imagem e Mapa, e seções',
  'Fontes e fundo personalizados',
  'QR Code da página',
]

/** Valor de um plano na comparação: incluso, não incluso ou um limite. */
export type PlanCell = boolean | string

export interface PlanComparisonRow {
  label: string
  free: PlanCell
  gamer: PlanCell
  premium: PlanCell
}

/**
 * Comparação completa da tela de planos. Limites, blocos e templates precisam
 * bater com `link-land/src/utils/plan_catalog.py`, que é quem aplica as regras.
 */
export const PLAN_COMPARISON: { title: string, rows: PlanComparisonRow[] }[] = [
  {
    title: 'Estrutura',
    rows: [
      { label: 'Páginas', free: '1', gamer: '1', premium: '10' },
      { label: 'Blocos por página', free: '10', gamer: '30', premium: '100' },
      { label: 'Seções (abas) na página', free: false, gamer: false, premium: true },
    ],
  },
  {
    title: 'Templates',
    rows: [
      { label: 'Minimal, Classic, Dark e Arcade', free: true, gamer: true, premium: true },
      { label: 'HUD, Esports, Cozy, Terminal e Quest', free: false, gamer: true, premium: true },
      { label: 'Gradient, Neon, Pixel, Aurora e Noir', free: false, gamer: false, premium: true },
    ],
  },
  {
    title: 'Blocos',
    rows: [
      { label: 'Link, Social, WhatsApp e E-mail', free: true, gamer: true, premium: true },
      { label: 'Texto, Imagem e Mapa', free: false, gamer: false, premium: true },
    ],
  },
  {
    title: 'Perfil gamer',
    rows: [
      { label: 'IDs de jogo, com botão de copiar', free: true, gamer: true, premium: true },
      { label: 'Lista de jogos', free: '3 na página', gamer: '24 por bloco', premium: '24 por bloco' },
      { label: 'Cabeçalho com gamertag, jogo principal e status', free: false, gamer: true, premium: true },
      { label: 'Conquistas no perfil', free: false, gamer: true, premium: true },
      { label: 'Player da Twitch, do YouTube e widget do Discord', free: false, gamer: true, premium: true },
    ],
  },
  {
    title: 'Personalização',
    rows: [
      { label: 'Ocultar "Criado por LinkLand"', free: false, gamer: true, premium: true },
      { label: 'Fontes personalizadas', free: false, gamer: false, premium: true },
      { label: 'Fundo com cor, gradiente ou imagem', free: false, gamer: false, premium: true },
      { label: 'QR Code da página', free: false, gamer: false, premium: true },
    ],
  },
  {
    title: 'Alcance e suporte',
    rows: [
      { label: 'Nível, XP e contagem de visitas e cliques', free: true, gamer: true, premium: true },
      { label: 'SEO com título, descrição e prévia ao compartilhar', free: true, gamer: true, premium: true },
      { label: 'Novos recursos em primeira mão', free: false, gamer: false, premium: true },
      { label: 'Suporte prioritário', free: false, gamer: false, premium: true },
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
