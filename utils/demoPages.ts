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

/** A vitrine abre no segundo item (ver `start`), com os vizinhos ao lado. */
export const DEMO_PAGES: DemoPage[] = [
  {
    template: 'classic',
    name: 'Classic',
    title: 'Café Aurora',
    bio: 'Torra própria e pão de fermentação natural, no centro de Curitiba.',
    blocks: demoBlocks(['Cardápio do dia', 'Reservar uma mesa', 'Como chegar'], ['instagram', 'whatsapp']),
  },
  {
    template: 'minimal',
    name: 'Minimal',
    title: 'Dra. Marina Rocha',
    bio: 'Nutricionista. Atendimento on-line para todo o Brasil.',
    blocks: demoBlocks(['Agendar consulta', 'Receitas gratuitas', 'Depoimentos'], ['instagram', 'whatsapp']),
    theme: { button_color: '#6f3ce0', button_text_color: '#ffffff' },
  },
  {
    template: 'dark',
    name: 'Dark',
    title: 'Rafa Souza',
    bio: 'Desenvolvedor. Escrevo sobre código e carreira.',
    blocks: demoBlocks(['Artigos', 'Projetos open source', 'Mentoria'], ['github', 'linkedin', 'x']),
  },
  {
    template: 'gradient',
    name: 'Gradient',
    title: 'Joana Cria',
    bio: 'Designer e criadora de conteúdo.',
    blocks: demoBlocks(['Meu portfólio', 'Curso de Canva', 'Newsletter semanal'], ['instagram', 'tiktok', 'linkedin']),
  },
  {
    template: 'neon',
    name: 'Neon',
    title: 'Kai Beats',
    bio: 'Produtor musical. Lançamento novo toda sexta.',
    blocks: demoBlocks(['Ouvir o novo single', 'Beats à venda', 'Agenda de shows'], ['spotify', 'instagram', 'youtube']),
  },
  {
    template: 'pixel',
    name: 'Pixel',
    title: 'PixelKid',
    bio: 'Speedruns e jogos retrô, ao vivo de terça a sábado.',
    blocks: demoBlocks(['Live na Twitch', 'Servidor no Discord', 'Meus recordes'], ['twitch', 'discord', 'youtube']),
  },
  {
    template: 'aurora',
    name: 'Aurora',
    title: 'Lia Martins',
    bio: 'Maquiadora e criadora de conteúdo de beleza.',
    blocks: demoBlocks(['Agendar maquiagem', 'Meus produtos favoritos', 'Curso de automaquiagem'], ['instagram', 'tiktok', 'youtube']),
  },
  {
    template: 'noir',
    name: 'Noir',
    title: 'Atelier Ventura',
    bio: 'Alfaiataria sob medida desde 1998.',
    blocks: demoBlocks(['Agendar prova', 'Coleção atual', 'Onde estamos'], ['instagram', 'whatsapp']),
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
    template: 'terminal',
    name: 'Terminal',
    title: 'Theo Dev',
    bio: 'Programo jogos indie e faço live de game jam.',
    profileMeta: { gamertag: 'theodev', main_game: 'Game jam' },
    blocks: gamerBlocks(
      [['steam', 'theodev']],
      [{ name: 'Bit Runner', hours: 410 }, { name: 'Code Dungeon', rank: 'Top 100' }, { name: 'Orbital', hours: 120 }],
      ['github', 'twitch', 'discord'],
    ),
  },
  {
    template: 'quest',
    name: 'Quest',
    title: 'Mago Rúbio',
    bio: 'Mestre de RPG de mesa e de MMO. Campanha nova toda lua cheia.',
    theme: { show_level: true },
    progress: { level: 31, xp: 23500, level_xp: 22792, next_level_xp: 24178 },
    profileMeta: { gamertag: 'magorubio', main_game: 'Reinos de Aster' },
    blocks: gamerBlocks(
      [['discord', 'mago_rubio']],
      [{ name: 'Reinos de Aster', rank: 'Arquimago' }, { name: 'Torre Sombria', hours: 860 }, { name: 'Dados & Dragões', hours: 300 }],
      ['youtube', 'twitch'],
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
