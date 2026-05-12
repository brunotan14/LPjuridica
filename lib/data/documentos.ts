import type { Documento } from '@/types/documentos'

export const documentosMock: Documento[] = [
  {
    id: 'doc-001',
    processoId: 'proc-001',
    titulo: 'Procuração Ad Judicia',
    categoria: 'procuracao',
    versaoAtual: 1,
    sigiloso: false,
    ultimoAcesso: '2025-05-08T10:00:00Z',
    tamanhoBytes: 245760,
    tipoArquivo: 'pdf',
    versoes: [
      {
        versao: 1,
        autor: 'Dr. Leandro Pedrosa',
        criadoEm: '2024-03-15T10:00:00Z',
        tamanhoBytes: 245760,
      },
    ],
    acessoLog: [
      {
        id: 'log-001',
        usuarioNome: 'Dr. Leandro Pedrosa',
        acao: 'upload',
        criadoEm: '2024-03-15T10:00:00Z',
      },
      {
        id: 'log-002',
        usuarioNome: 'Dr. Leandro Pedrosa',
        acao: 'visualizacao',
        criadoEm: '2025-05-08T10:00:00Z',
      },
    ],
    criadoEm: '2024-03-15T10:00:00Z',
  },
  {
    id: 'doc-002',
    processoId: 'proc-001',
    titulo: 'Memoriais Defensivos — Fase de Instrução',
    categoria: 'peca_inicial',
    versaoAtual: 2,
    sigiloso: false,
    ultimoAcesso: '2025-05-05T18:00:00Z',
    tamanhoBytes: 1048576,
    tipoArquivo: 'pdf',
    versoes: [
      {
        versao: 1,
        autor: 'Dr. Leandro Pedrosa',
        criadoEm: '2025-04-20T09:00:00Z',
        tamanhoBytes: 921600,
      },
      {
        versao: 2,
        autor: 'Dr. Leandro Pedrosa',
        criadoEm: '2025-05-05T18:00:00Z',
        tamanhoBytes: 1048576,
      },
    ],
    acessoLog: [
      {
        id: 'log-003',
        usuarioNome: 'Dr. Leandro Pedrosa',
        acao: 'upload',
        criadoEm: '2025-04-20T09:00:00Z',
      },
      {
        id: 'log-004',
        usuarioNome: 'Dr. Leandro Pedrosa',
        acao: 'nova_versao',
        criadoEm: '2025-05-05T18:00:00Z',
      },
      {
        id: 'log-005',
        usuarioNome: 'Dr. Leandro Pedrosa',
        acao: 'download',
        criadoEm: '2025-05-05T18:30:00Z',
      },
    ],
    criadoEm: '2025-04-20T09:00:00Z',
  },
  {
    id: 'doc-003',
    processoId: 'proc-001',
    titulo: 'Laudo Pericial Contraditório',
    categoria: 'laudo_pericial',
    versaoAtual: 1,
    sigiloso: true,
    ultimoAcesso: '2025-04-10T14:00:00Z',
    tamanhoBytes: 3145728,
    tipoArquivo: 'pdf',
    versoes: [
      {
        versao: 1,
        autor: 'Dr. Leandro Pedrosa',
        criadoEm: '2025-04-10T14:00:00Z',
        tamanhoBytes: 3145728,
      },
    ],
    acessoLog: [
      {
        id: 'log-006',
        usuarioNome: 'Dr. Leandro Pedrosa',
        acao: 'upload',
        criadoEm: '2025-04-10T14:00:00Z',
      },
    ],
    criadoEm: '2025-04-10T14:00:00Z',
  },
  {
    id: 'doc-004',
    processoId: 'proc-001',
    titulo: 'Gravação da Audiência de Instrução — 28/04/2025',
    categoria: 'midia',
    versaoAtual: 1,
    sigiloso: true,
    ultimoAcesso: '2025-04-28T16:00:00Z',
    tamanhoBytes: 524288000,
    tipoArquivo: 'mp4',
    versoes: [
      {
        versao: 1,
        autor: 'Dr. Leandro Pedrosa',
        criadoEm: '2025-04-28T16:00:00Z',
        tamanhoBytes: 524288000,
      },
    ],
    acessoLog: [
      {
        id: 'log-007',
        usuarioNome: 'Dr. Leandro Pedrosa',
        acao: 'upload',
        criadoEm: '2025-04-28T16:00:00Z',
      },
    ],
    criadoEm: '2025-04-28T16:00:00Z',
  },
]

export function getDocumentosByProcesso(processoId: string): Documento[] {
  return documentosMock
    .filter((d) => d.processoId === processoId)
    .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
}

export function formatarTamanho(bytes: number): string {
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${bytes} B`
}

export const CATEGORIAS_LABEL: Record<string, string> = {
  procuracao: 'Procuração',
  contrato_honorarios: 'Contrato de Honorários',
  peca_inicial: 'Peça',
  contestacao: 'Contestação',
  recurso: 'Recurso',
  decisao_judicial: 'Decisão Judicial',
  prova_documental: 'Prova Documental',
  laudo_pericial: 'Laudo Pericial',
  midia: 'Mídia',
}
