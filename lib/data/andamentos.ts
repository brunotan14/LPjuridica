import type { Andamento } from '@/types/andamentos'

export const andamentosMock: Andamento[] = [
  {
    id: 'and-001',
    processoId: 'proc-001',
    tipo: 'andamento_oficial',
    data: '2025-05-08T14:00:00Z',
    descricao:
      'Despacho judicial determinando a juntada dos laudos periciais ao processo. Prazo de 15 dias para manifestação das partes.',
    autor: 'Dr. Leandro Pedrosa',
    confidencial: false,
    criadoEm: '2025-05-08T14:30:00Z',
  },
  {
    id: 'and-002',
    processoId: 'proc-001',
    tipo: 'peca_produzida',
    data: '2025-05-05T10:00:00Z',
    descricao:
      'Memoriais defensivos apresentados com 28 páginas, abordando a insuficiência probatória e requerendo a absolvição do réu por aplicação do princípio in dubio pro reo.',
    autor: 'Dr. Leandro Pedrosa',
    confidencial: false,
    anexoUrl: '/docs/memoriais-2025-05-05.pdf',
    criadoEm: '2025-05-05T18:00:00Z',
  },
  {
    id: 'and-003',
    processoId: 'proc-001',
    tipo: 'evento_audiencia',
    data: '2025-04-28T09:00:00Z',
    descricao:
      'Audiência de instrução realizada. Ouvidas 2 testemunhas de acusação e 1 de defesa. Próxima audiência designada para 12/06/2025.',
    autor: 'Dr. Leandro Pedrosa',
    confidencial: false,
    criadoEm: '2025-04-28T13:00:00Z',
  },
  {
    id: 'and-004',
    processoId: 'proc-001',
    tipo: 'comunicacao_cliente',
    data: '2025-04-20T16:00:00Z',
    descricao:
      'Reunião com Rafael Mendonça para atualização do andamento processual. Cliente informado sobre o resultado da audiência de instrução e próximos passos da defesa.',
    autor: 'Dr. Leandro Pedrosa',
    confidencial: false,
    criadoEm: '2025-04-20T17:00:00Z',
  },
  {
    id: 'and-005',
    processoId: 'proc-001',
    tipo: 'anotacao_interna',
    data: '2025-04-15T11:00:00Z',
    descricao:
      'Testemunha-chave da acusação demonstrou contradições no depoimento em relação ao boletim de ocorrência original. Explorar no contra-interrogatório da próxima audiência.',
    autor: 'Dr. Leandro Pedrosa',
    confidencial: true,
    criadoEm: '2025-04-15T11:30:00Z',
  },
  {
    id: 'and-006',
    processoId: 'proc-001',
    tipo: 'andamento_oficial',
    data: '2025-03-10T08:00:00Z',
    descricao:
      'Recebimento da denúncia pelo juízo. Réu citado e prazo de defesa prévia iniciado (10 dias corridos, Art. 396 CPP).',
    autor: 'Dr. Leandro Pedrosa',
    confidencial: false,
    criadoEm: '2025-03-10T09:00:00Z',
  },
]

export function getAndamentosByProcesso(processoId: string): Andamento[] {
  return andamentosMock
    .filter((a) => a.processoId === processoId)
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
}
