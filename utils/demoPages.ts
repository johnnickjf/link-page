import type { PublicBlock } from '~/types/api'

/** Páginas fictícias da vitrine: mostram os templates reais funcionando. */
export interface DemoPage {
  template: string
  name: string
  title: string
  bio: string
  blocks: PublicBlock[]
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
