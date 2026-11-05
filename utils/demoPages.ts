import type { GameItem, GamePlatform, GamerProfile, PageProgress, PublicBlock, Theme } from '~/types/api'

/** Páginas fictícias da vitrine: mostram os templates reais funcionando. */
export interface DemoPage {
  template: string
  name: string
  title: string
  bio: string
  blocks: PublicBlock[]
  theme?: Theme
  profileMeta?: GamerProfile
  progress?: PageProgress
}

function demoBlocks(links: string[], networks: string[]): PublicBlock[] {
  return [
    ...networks.map((network, position) => ({
      type: 'social' as const,
      position,
      config: { network, url: '#' },
    })),
    ...links.map((label, i) => ({
      type: 'link' as const,
      position: networks.length + i,
      config: { label, url: '#' },
    })),
  ]
}

export const DEMO_PAGES: DemoPage[] = [
  {
    template: 'neon',
    name: 'Neon',
    title: 'Kai Beats',
    bio: 'Produtor musical. Lançamento novo toda sexta.',
    blocks: demoBlocks(['Ouvir o novo single', 'Beats à venda', 'Agenda de shows'], ['spotify', 'instagram', 'youtube']),
  },
  {
    template: 'classic',
    name: 'Classic',
    title: 'Café Aurora',
    bio: 'Torra própria e pão de fermentação natural, no centro de Curitiba.',
    blocks: demoBlocks(['Cardápio do dia', 'Reservar uma mesa', 'Como chegar'], ['instagram', 'whatsapp']),
  },
  {
    template: 'pixel',
    name: 'Pixel',
    title: 'PixelKid',
    bio: 'Speedruns e jogos retrô, ao vivo de terça a sábado.',
    blocks: demoBlocks(['Live na Twitch', 'Servidor no Discord', 'Meus recordes'], ['twitch', 'discord', 'youtube']),
  },
  {
    template: 'gradient',
    name: 'Gradient',
    title: 'Joana Cria',
    bio: 'Designer e criadora de conteúdo.',
    blocks: demoBlocks(['Meu portfólio', 'Curso de Canva', 'Newsletter semanal'], ['instagram', 'tiktok', 'linkedin']),
  },
  {
    template: 'minimal',
    name: 'Minimal',
    title: 'Dra. Marina Rocha',
    bio: 'Nutricionista. Atendimento on-line para todo o Brasil.',
    blocks: demoBlocks(['Agendar consulta', 'Receitas gratuitas', 'Depoimentos'], ['instagram', 'whatsapp']),
  },
  {
    template: 'dark',
    name: 'Dark',
    title: 'Rafa Souza',
    bio: 'Desenvolvedor. Escrevo sobre código e carreira.',
    blocks: demoBlocks(['Artigos', 'Projetos open source', 'Mentoria'], ['github', 'linkedin', 'x']),
  },
]

function gamerBlocks(
  ids: [GamePlatform, string][],
  games: GameItem[],
  networks: string[],
): PublicBlock[] {
  let position = 0
  const next = () => position++
  return [
    ...networks.map((network) => ({
      type: 'social' as const,
      position: next(),
      config: { network, url: '#' },
    })),
    ...ids.map(([platform, handle]) => ({
      type: 'gameid' as const,
      position: next(),
      config: { platform, handle },
    })),
    {
      type: 'games' as const,
      position: next(),
      config: { title: 'Mais jogados', items: games },
    },
  ]
}

/** Vitrine da home gamer: nomes e jogos fictícios, para não sugerir parceria. */
export const GAMER_DEMO_PAGES: DemoPage[] = [
  {
    template: 'arcade',
    name: 'Arcade',
    title: 'Luna Ferraz',
    bio: 'Jogo de luta toda quarta, torneio todo sábado.',
    theme: { show_level: true },
    progress: { level: 12, xp: 5230, level_xp: 3730, next_level_xp: 5690 },
    profileMeta: { gamertag: 'lunaf', region: 'Recife' },
    blocks: gamerBlocks(
      [['steam', 'LunaF'], ['discord', 'luna_f']],
      [{ name: 'Fliper Fighter', rank: 'Mestre' }, { name: 'Neon Racer', hours: 420 }, { name: 'Pixel Quest', hours: 310 }],
      ['twitch', 'youtube'],
    ),
  },
  {
    template: 'hud',
    name: 'HUD',
    title: 'Vitor Maia',
    bio: 'IGL em tempo integral. Procurando equipe para o split.',
    theme: { show_level: true },
    progress: { level: 24, xp: 15200, level_xp: 14260, next_level_xp: 16250 },
    profileMeta: { gamertag: 'vmaia', main_game: 'Tático 5v5', looking_for_group: true },
    blocks: gamerBlocks(
      [['riot', 'vmaia#BR1'], ['steam', 'vmaia']],
      [{ name: 'Tático 5v5', rank: 'Imortal', hours: 2100 }, { name: 'Battle Zone', hours: 640 }, { name: 'Arena Prime', hours: 350 }],
      ['twitch', 'discord'],
    ),
  },
  {
    template: 'esports',
    name: 'Esports',
    title: 'Time Trovão',
    bio: 'Equipe amadora de Curitiba. Treino aberto às terças.',
    blocks: gamerBlocks(
      [['discord', 'time_trovao']],
      [{ name: 'MOBA Legends', rank: 'Diamante' }, { name: 'Battle Zone', rank: 'Top 500' }, { name: 'Rocket Ball', hours: 900 }],
      ['youtube', 'instagram', 'twitch'],
    ),
  },
  {
    template: 'cozy',
    name: 'Cozy',
    title: 'Bia Campos',
    bio: 'Fazendinhas, chá e lives tranquilas no fim de tarde.',
    theme: { show_level: true },
    progress: { level: 7, xp: 1450, level_xp: 1252, next_level_xp: 1690 },
    profileMeta: { gamertag: 'biacozy' },
    blocks: gamerBlocks(
      [['nintendo', 'SW-1234-5678-9012']],
      [{ name: 'Vale Tranquilo', hours: 700 }, { name: 'Ilha dos Bichos', hours: 520 }, { name: 'Café da Vovó', hours: 180 }],
      ['twitch', 'tiktok'],
    ),
  },
  {
    template: 'pixel',
    name: 'Pixel',
    title: 'PixelKid',
    bio: 'Speedruns e jogos retrô, ao vivo de terça a sábado.',
    blocks: gamerBlocks(
      [['steam', 'pixelkid']],
      [{ name: 'Castelo 8-bit', rank: 'Recorde BR' }, { name: 'Salto Lunar', hours: 300 }, { name: 'Mina Sem Fim', hours: 260 }],
      ['twitch', 'discord', 'youtube'],
    ),
  },
]
