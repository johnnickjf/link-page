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

/** O que todo mundo já tem, inclusive no Free. */
export const GAMER_FREE_FEATURES = [
  'IDs de jogo, com botão de copiar',
  'Até 3 jogos na página',
  'Tema gamer Arcade',
  'Nível e barra de XP',
  'Contagem anônima de visitas e cliques',
]
