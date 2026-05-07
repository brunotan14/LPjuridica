# LP Consultoria Jurídica — Plano de Execução

> Estratégia: interface primeiro, backend depois. Cada milestone entrega uma fatia vertical funcional e visualmente completa antes de conectar ao banco. Base técnica e visual herdada do PipeFlow CRM.

---

## Identidade Visual — Dark Theme

Herdada integralmente do PipeFlow CRM. Dark mode como tema padrão.

**Backgrounds (camadas):**

| Camada | Token Tailwind | Hex |
|---|---|---|
| Base (mais funda) | `zinc-950` | `#09090b` |
| Superfície (cards, modais) | `zinc-900` | `#18181b` |
| Elevado (dropdowns, tooltips) | `zinc-800` | `#27272a` |
| Borda | `zinc-700` | `#3f3f46` |

**Tipografia:**

| Uso | Token Tailwind | Hex |
|---|---|---|
| Título / destaque | `zinc-50` | `#fafafa` |
| Corpo / label | `zinc-300` | `#d4d4d8` |
| Texto secundário | `zinc-500` | `#71717a` |
| Placeholder | `zinc-600` | `#52525b` |

**Cores funcionais:**

| Papel | Token Tailwind | Hex |
|---|---|---|
| Primária (ação, botão, link) | `indigo-500` | `#6366f1` |
| Primária hover | `indigo-400` | `#818cf8` |
| Sucesso / absolvição | `emerald-500` | `#10b981` |
| Perda / crítico | `red-500` | `#ef4444` |
| Alerta / prazo próximo | `amber-400` | `#fbbf24` |
| Prazo crítico (D-1, hoje) | `red-400` | `#f87171` |
| Neutro / tag | `zinc-700` | `#3f3f46` |

**Aplicação por componente:**
- **Sidebar:** fundo `zinc-950`, links ativos com fundo `zinc-800` + texto `zinc-50` + borda esquerda `indigo-500`
- **Cards de processo:** fundo `zinc-900`, borda `zinc-800`, hover eleva para `zinc-800` com sombra sutil
- **Modais e drawers:** fundo `zinc-900`, overlay `zinc-950/80` com blur
- **Inputs e selects:** fundo `zinc-800`, borda `zinc-700`, focus com anel `indigo-500`
- **Botão primário:** fundo `indigo-600`, hover `indigo-500`, texto `zinc-50`
- **Botão ghost/outline:** borda `zinc-700`, hover fundo `zinc-800`
- **Badge de valor (R$):** fundo `emerald-950`, texto `emerald-400`
- **Badge de prazo próximo:** fundo `amber-950`, texto `amber-400`
- **Badge de prazo crítico:** fundo `red-950`, texto `red-400`

**Configuração no Tailwind (`tailwind.config.ts`):**

```ts
darkMode: 'class',
```

Adicionar `class="dark"` no `<html>` por padrão.

---

## M0 — Setup & Infraestrutura

**Branch:** `setup/project-foundation`
**Objetivo:** Projeto rodando localmente com toda a stack configurada e estrutura de pastas no lugar.
**Reaproveitamento PipeFlow:** Setup quase idêntico. Remover Stripe, adicionar `date-fns-tz`, `react-big-calendar` e `web-push`.

- [x] Inicializar projeto com `create-next-app` (TypeScript, App Router, Tailwind)
- [x] Configurar `tsconfig.json` com strict mode
- [x] Instalar e inicializar shadcn/ui (modo `dark` como padrão)
- [x] Criar estrutura de pastas (`app/`, `components/`, `lib/`, `types/`)
- [x] Configurar variáveis de ambiente (`.env.local` + `.env.example`)
- [x] Conectar projeto ao Supabase (criar projeto, copiar URL e anon key)
- [x] Instalar dependências: `@supabase/ssr`, `@dnd-kit/core`, `recharts`, `resend`, `zod`, `date-fns`, `date-fns-tz`, `react-big-calendar`, `web-push`, `react-dropzone`
- [x] Configurar `lib/supabase/client.ts` e `lib/supabase/server.ts`
- [ ] Configurar `middleware.ts` para proteção de rotas
- [x] Configurar ESLint + Prettier
- [x] Subir projeto no GitHub

**Commit final:** `chore: project setup with Next.js, Supabase, shadcn/ui and folder structure`

---

## M1 — Shell Visual da Aplicação

**Branch:** `feat/app-shell`
**Objetivo:** Layout autenticado completo com sidebar, header e navegação — sem dados reais, tudo estático.
**Reaproveitamento PipeFlow:** Componentes `Sidebar` e `Header` reaproveitados. Mudar links de navegação e adicionar badge de prazo na sidebar.

- [x] Criar layout base `app/(app)/layout.tsx`
- [x] Criar componente `Sidebar` com links de navegação: Dashboard, Partes, Processos, Pipeline, Agenda, Financeiro, Configurações
- [x] Adicionar badge numérico na sidebar no link Agenda (prazos críticos do dia — estático por ora)
- [x] Adicionar avatar do usuário + menu de conta na sidebar (estático, mockado)
- [x] Criar `Header` com título da página, breadcrumb e slot para ações contextuais
- [x] Criar páginas vazias (placeholder) para `/dashboard`, `/partes`, `/processos`, `/pipeline`, `/agenda`, `/financeiro`, `/configuracoes`
- [x] Aplicar paleta: indigo-600 primário, zinc-950 sidebar, zinc-900 superfície
- [x] Garantir responsividade básica (sidebar colapsável em mobile via Sheet/drawer)
- [x] Criar `app/(auth)/layout.tsx` com layout centralizado para telas de auth

**Commit final:** `feat: app shell with sidebar, navigation and base layout`

---

## M2 — Autenticação (UI → Backend)

**Branch:** `feat/authentication`
**Objetivo:** Fluxo de login e recuperação de senha funcionando com Supabase Auth. Sem registro público.
**Reaproveitamento PipeFlow:** Login e reset idênticos. Remover `/register`. Adicionar seed inicial.

**Interface primeiro:**
- [ ] Criar página `/login` com formulário (e-mail + senha) usando shadcn/ui `Form`
- [ ] Criar página `/forgot-password` com formulário de e-mail
- [ ] Criar página `/reset-password` para redefinição via link
- [ ] Adicionar validação client-side com Zod + react-hook-form
- [ ] Adicionar estados de loading, erro e sucesso nos formulários

**Backend:**
- [ ] Criar Server Actions em `lib/auth/actions.ts` (signIn, signOut, resetPassword)
- [ ] Configurar callback de auth em `app/auth/callback/route.ts`
- [ ] Proteger rotas `(app)/` no `middleware.ts` — redirecionar para `/login` se sem sessão
- [ ] Redirecionar usuário autenticado para `/dashboard` após login
- [ ] Implementar logout no menu de conta da sidebar
- [ ] Seed inicial: criar escritório do Dr. Leandro + usuário Titular via `scripts/seed.ts`

**Commit final:** `feat: authentication with Supabase Auth, login and password reset (no public register)`

---

## M3 — Cadastro de Partes (UI → Backend)

**Branch:** `feat/partes`
**Objetivo:** CRUD completo de partes com múltiplos papéis, listagem, busca, filtros e página de detalhe.
**Reaproveitamento PipeFlow:** Estrutura de CRUD/listagem/busca/paginação do M4 (Leads). Formulário e campos são novos (CPF, situação prisional, etc.).

**Interface primeiro:**
- [ ] Criar página `/partes` com tabela (nome, CPF, papel principal, telefone, processos vinculados, situação)
- [ ] Tabs/filtros por tipo: Todos | Clientes | Réus | Vítimas | Testemunhas | Autoridades
- [ ] Barra de busca (nome, CPF)
- [ ] Filtro adicional: situação prisional (para réus)
- [ ] Criar drawer/modal "Nova Parte" com formulário dinâmico:
  - Campos comuns: nome, CPF (com máscara e validação de dígito verificador), RG, data de nascimento, filiação, naturalidade, profissão, telefone, e-mail, endereço
  - Tipo de parte (select): Cliente, Réu, Vítima, Testemunha, Autoridade
  - Campos condicionais para Réu: situação prisional, unidade prisional (se preso)
  - Campos condicionais para Autoridade: cargo, comarca de atuação
- [ ] Criar página `/partes/[id]` com abas:
  - Dados Pessoais (formulário de edição inline)
  - Processos Vinculados (lista com papel em cada processo)
  - Observações (notas livres, textarea)
- [ ] Indicador visual para parte com múltiplos papéis
- [ ] Estados vazios (empty state) para listagem sem partes
- [ ] Paginação na listagem
- [ ] Alerta de duplicidade por CPF (avisa ao digitar, não bloqueia o cadastro)

**Banco de dados:**
- [ ] Migration: tabela `partes` com RLS por `office_id`
- [ ] Migration: tabela `parte_papeis_processo` (junction: parte + processo + papel)
- [ ] Migration: tabela `reus_situacao` (situação prisional + unidade, vinculada a réu)

**Backend:**
- [ ] Server Actions: criar, editar, arquivar parte
- [ ] Server Component para listar partes com filtros via searchParams
- [ ] Validação Zod: CPF com dígito verificador, telefone, campos obrigatórios por tipo

**Commit final:** `feat: parties management with multi-role support and criminal-specific fields`

---

## M4 — Cadastro de Processos (UI → Backend)

**Branch:** `feat/processos`
**Objetivo:** CRUD de processos com validação CNJ, vínculo de partes, fases processuais e sigilo.
**Reaproveitamento PipeFlow:** Estrutura de listagem/busca/filtros e página de detalhe com abas. Formulário multi-step é novo.

**Interface primeiro:**
- [ ] Criar página `/processos` com tabela (CNJ, alcunha, cliente, réu, fase, comarca, responsável, sigilo)
- [ ] Barra de busca unificada (CNJ, alcunha, nome de cliente ou réu)
- [ ] Filtros: fase processual, comarca, responsável, sigilo, tipo penal
- [ ] Criar drawer/modal "Novo Processo" multi-step:
  - Step 1 — Identificação: CNJ (com máscara `NNNNNNN-DD.AAAA.J.TR.OOOO` e validação), número interno, alcunha
  - Step 2 — Localização: tribunal, comarca, vara, juiz
  - Step 3 — Tipificação: tipos penais (múltiplos, com marcação do principal, referência ao artigo do CP)
  - Step 4 — Partes: cliente contratante, réu (podem ser a mesma pessoa ou não), vítimas, testemunhas
  - Step 5 — Configuração: fase atual, sigilo (público / restrito / segredo de justiça), responsável interno
- [ ] Criar página `/processos/[id]` com abas:
  - Resumo: dados do processo + partes vinculadas + situação atual
  - Timeline (placeholder — M7)
  - Documentos (placeholder — M8)
  - Financeiro (placeholder — M9)
  - Prazos (lista dos prazos do processo — conecta ao M5)
- [ ] Indicador de sigilo destacado no header da página de detalhe
- [ ] Indicador de situação prisional do réu no header (se aplicável)
- [ ] Ícone de cadeado para processos em segredo de justiça na listagem

**Banco de dados:**
- [ ] Migration: tabela `processos` com RLS por `office_id`
- [ ] Migration: tabela `processos_tipos_penais` (junction processo + tipo penal)
- [ ] Coluna `andamento_source` (default `manual`) — reservada para v2 (integração PJe/Projudi)
- [ ] Coluna `ai_indexed_at` — reservada para v2

**Backend:**
- [ ] `lib/cnj/validator.ts`: validador de número CNJ com cálculo de dígito verificador
- [ ] Server Actions: criar, editar, arquivar processo (soft delete via campo `situacao`)
- [ ] Server Component para listar processos com filtros via searchParams
- [ ] Trigger de auditoria em mudanças de fase, sigilo e responsável (registra em `audit_log`)

**Commit final:** `feat: case management with CNJ validation, multi-party linking and confidentiality levels`

---

## M5 — Agenda de Prazos e Audiências ⚠️ CRÍTICO

**Branch:** `feat/agenda`
**Objetivo:** Módulo central do sistema. Agenda de prazos e audiências com alertas redundantes e dupla confirmação para marcar prazo como cumprido.
**Reaproveitamento PipeFlow:** Nenhum — módulo inteiramente novo, sem equivalente no PipeFlow.

> **Atenção:** Realizar testes manuais obrigatórios com 5 cenários reais antes do merge. Erros aqui têm consequência direta para clientes presos.

**Interface primeiro:**
- [ ] Criar página `/agenda` com 3 visualizações alternáveis via tabs:
  - Calendário mensal (`react-big-calendar` em modo dark com paleta zinc/indigo)
  - Lista semanal (agrupada por dia)
  - Lista do dia (foco nos eventos do dia)
- [ ] Chips coloridos por tipo de evento no calendário: prazo (indigo), audiência (amber), visita ao preso (red), reunião (emerald), diligência (zinc)
- [ ] Criar drawer/modal "Novo Evento" com formulário condicional por tipo:
  - **Prazo:** data de início, data fim (prazo fatal), processo vinculado (obrigatório), responsável, descrição
  - **Audiência:** data, hora, local (comarca + vara), processo (obrigatório), partes presentes esperadas
  - **Visita ao preso:** data, hora, unidade prisional, parte/réu (obrigatório)
  - **Reunião com cliente:** data, hora, local, parte/cliente — único tipo sem processo obrigatório
  - **Diligência:** data, hora, local, processo, descrição
- [ ] Indicadores de criticidade temporal:
  - Verde: > 7 dias
  - Âmbar: 3–7 dias
  - Vermelho: < 3 dias
  - Vermelho pulsante (animação CSS): vencendo hoje
  - Cinza com badge vermelho "Perdido": prazo perdido
- [ ] **Modal "Marcar como Cumprido"** (dupla confirmação):
  - Resumo do evento (tipo, data, processo, descrição)
  - Campo obrigatório "O que foi feito?" com validação de mínimo 10 caracteres
  - Dois botões: "Cancelar" (ghost) e "Confirmar Cumprimento" (primário)
- [ ] **Modal "Marcar como Perdido"** (cor crítica, separado do cumprido):
  - Campo justificativa obrigatório (mínimo 20 caracteres)
  - Aviso explícito: "Esta ação será notificada ao Titular"
  - Botão de confirmação em vermelho
- [ ] Widget "Prazos Críticos" no dashboard (placeholder agora, dados reais no M10)
- [ ] Badge numérico na sidebar atualizado com prazos do dia

**Banco de dados:**
- [ ] Migration: tabela `prazos` com RLS por `office_id`
- [ ] Migration: tabela `prazos_alertas` (tipo: D-7 | D-3 | D-1 | dia, status: pendente | enviado)
- [ ] Migration: tabela `audit_log` (usada por todo o sistema — instituir aqui)
- [ ] Trigger PostgreSQL: toda mudança de status de prazo registra no `audit_log`

**Backend:**
- [ ] Server Actions: criar, editar prazo
- [ ] Server Action `marcarCumprido(prazoId, descricaoCumprimento)`: valida mínimo, registra no `audit_log`, atualiza status
- [ ] Server Action `marcarPerdido(prazoId, justificativa)`: valida mínimo, registra no `audit_log`, envia notificação ao Titular via Resend
- [ ] Cron job em `app/api/cron/prazos-alertas/route.ts` (roda diariamente às 6h):
  - Calcula prazos D-7, D-3, D-1 e do dia em relação a `data_fim`
  - Insere em `prazos_alertas` (evitando duplicatas)
  - Dispara e-mails via Resend para o responsável pelo prazo
  - (Push adicionado no M11)
- [ ] Validação: `data_fim` no passado não pode criar prazo com status `pendente`
- [ ] **Testes manuais obrigatórios** — 5 cenários antes do merge:
  1. Criar prazo hoje, verificar alerta "dia" enviado
  2. Criar prazo em D-1, verificar badge vermelho na sidebar
  3. Marcar prazo como cumprido com descrição válida e inválida
  4. Marcar prazo como perdido e verificar notificação ao Titular
  5. Tentar criar prazo com data fim no passado

**Commit final:** `feat: deadline & hearing scheduler with redundant alerts and double-confirmation (CRITICAL MODULE)`

---

## M6 — Pipeline Kanban Processual (UI → Backend)

**Branch:** `feat/pipeline`
**Objetivo:** Pipeline visual com drag-and-drop entre fases processuais, com auditoria de cada transição.
**Reaproveitamento PipeFlow:** Componente de Kanban com `@dnd-kit` reaproveitado integralmente. Colunas, cards e modal de confirmação são novos.

**Interface primeiro:**
- [ ] Criar página `/pipeline` com layout horizontal de colunas (scroll horizontal em mobile)
- [ ] Colunas fixas por fase processual: Pré-processual → Inquérito → Denúncia/Recebimento → Instrução → Memoriais → Sentença → Recursos → Execução → Arquivado
- [ ] Criar componente `FaseColuna` com header (nome + contador de processos)
- [ ] Criar componente `ProcessoCard`:
  - Alcunha do caso em destaque
  - Cliente (nome) + réu (se diferente do cliente)
  - Comarca + vara
  - Próximo prazo/audiência (data + tipo, com cor de criticidade)
  - Avatar do responsável interno
  - Ícone de cadeado se processo sigiloso
- [ ] Implementar drag-and-drop entre colunas com `@dnd-kit`
- [ ] **Modal de confirmação ao mover** (mudança de fase é auditada):
  - "Mover [alcunha] de [fase atual] para [nova fase]?"
  - Campo opcional: "Observação sobre a transição"
  - Confirmar ou Cancelar
- [ ] Filtros laterais: responsável, comarca, tipo penal, sigilo
- [ ] Indicador visual de coluna ativa durante drag
- [ ] Click no card abre `/processos/[id]`

**Backend:**
- [ ] Server Action `mudarFaseProcesso(processoId, novaFase, observacao?)`:
  - Atualiza `processos.fase_processual`
  - Insere em `andamentos` (tipo `oficial`, descricao `Fase alterada de X para Y`)
  - Insere em `audit_log`
- [ ] Server Component para carregar processos agrupados por fase
- [ ] RLS garante que apenas processos do `office_id` aparecem

**Commit final:** `feat: kanban pipeline with phase transitions and audit logging`

---

## M7 — Timeline de Andamentos (UI → Backend)

**Branch:** `feat/andamentos`
**Objetivo:** Timeline cronológica do processo com andamentos, peças, comunicações e anotações internas com flag de confidencialidade.
**Reaproveitamento PipeFlow:** Componente `ActivityTimeline` do M6 reaproveitado como base visual. Tipos de entrada, flag `confidencial` e restrição por role são novos.

**Interface primeiro:**
- [ ] Implementar aba "Timeline" em `/processos/[id]`
- [ ] Componente `Timeline` com itens cronológicos (mais recente primeiro)
- [ ] Ícone distinto por tipo: andamento oficial, peça produzida, comunicação com cliente, anotação interna, evento de audiência
- [ ] Badge "Confidencial" em anotações marcadas (visível apenas ao Titular)
- [ ] Formulário inline "Registrar andamento":
  - Tipo (select)
  - Data (default: hoje, editável)
  - Descrição (textarea)
  - Checkbox "Marcar como confidencial" (visível apenas se tipo = Anotação interna)
  - Botão de upload de anexo (UI pronta, integração completa no M8)
- [ ] Exibir autor + data relativa ("há 2 dias") em cada item
- [ ] Filtros por tipo (chips toggleáveis no topo)
- [ ] Estado vazio com CTA para registrar primeiro andamento

**Banco de dados:**
- [ ] Migration: tabela `andamentos` com RLS por `office_id`
- [ ] Coluna `confidencial` boolean (default false)
- [ ] Coluna `andamento_source` (default `manual`, reservado para v2)
- [ ] RLS adicional: registro com `confidencial = true` visível apenas se `auth.uid()` é Titular

**Backend:**
- [ ] Server Action: criar andamento (valida campos por tipo)
- [ ] Server Component para carregar timeline, ordenada por `data DESC`
- [ ] Enforcement de confidencialidade no Server Component (não retorna andamentos confidenciais para não-Titular)

**Commit final:** `feat: process timeline with multiple entry types and confidential notes`

---

## M8 — Gestão de Documentos (UI → Backend)

**Branch:** `feat/documentos`
**Objetivo:** Upload, categorização, versionamento e log de acesso de documentos por processo, com armazenamento criptografado.
**Reaproveitamento PipeFlow:** Nenhum — módulo inteiramente novo.

**Interface primeiro:**
- [ ] Implementar aba "Documentos" em `/processos/[id]`
- [ ] Tabela de documentos: título, categoria, versão atual, sigiloso, último acesso, ações (visualizar, baixar, nova versão)
- [ ] Categorias: procuração, contrato de honorários, peça inicial, contestação, recurso, decisão judicial, prova documental, laudo pericial, mídia
- [ ] Drag-and-drop para upload com `react-dropzone`
- [ ] Modal "Adicionar documento": arquivo, título, categoria, checkbox "Documento sigiloso"
- [ ] Visualizador inline para PDFs (via signed URL temporária)
- [ ] Botão "Nova versão": abre upload preservando metadados, incrementa `versao`, mantém histórico
- [ ] Aba "Histórico de versões" por documento (versão, data, autor)
- [ ] Aba "Log de acesso" por documento — visível apenas ao Titular (quem viu, baixou, editou e quando)
- [ ] Badge "Sigiloso" destacado em documentos sensíveis

**Banco de dados:**
- [ ] Migration: tabela `documentos` com RLS por `office_id`
- [ ] Migration: tabela `documentos_versoes` (versão, caminho no Storage, author, created_at)
- [ ] Migration: tabela `documentos_acesso_log` (user_id, documento_id, acao, created_at)
- [ ] Bucket `documentos` no Supabase Storage com criptografia em repouso
- [ ] RLS no Storage: acesso somente via signed URLs geradas server-side

**Backend:**
- [ ] Server Action: upload (gera path único no Storage, registra metadados, registra acesso `upload`)
- [ ] Server Action: gerar signed URL para download (registra acesso `download`, expiração 15 min)
- [ ] Server Action: nova versão (cria nova entrada em `documentos_versoes`, atualiza `versao_atual`)
- [ ] Validação: tamanho máximo 50 MB, tipos permitidos (PDF, DOC, DOCX, JPG, PNG, MP3, MP4)
- [ ] RLS adicional: documento sigiloso visível apenas ao Titular

**Commit final:** `feat: document management with versioning, encrypted storage and access log`

---

## M9 — Módulo Financeiro (UI → Backend)

**Branch:** `feat/financeiro`
**Objetivo:** Honorários contratuais com parcelamento, honorários de êxito, despesas reembolsáveis e visão de inadimplência.
**Reaproveitamento PipeFlow:** Nenhum — módulo inteiramente novo.

**Interface primeiro:**
- [ ] Implementar aba "Financeiro" em `/processos/[id]`
- [ ] Card resumo do processo: total contratado, total recebido, total a receber, despesas a reembolsar
- [ ] Seção "Contratos de Honorários":
  - Botão "Novo Contrato" com modal:
    - Tipo: contratual | êxito | pro bono | dativo
    - Parte contratante (select das partes vinculadas ao processo)
    - Se contratual: valor total, quantidade de parcelas, data da primeira parcela, intervalo (mensal/quinzenal)
    - Se êxito: gatilho (absolvição | desclassificação | redução de pena), percentual (%), valor estimado
  - Lista de contratos com expansão para ver parcelas geradas
- [ ] Seção "Parcelas": número, valor, vencimento, status (em aberto / pago / atrasado), ações
- [ ] Modal "Marcar parcela como paga": data do pagamento, forma (PIX, transferência, dinheiro, boleto), observações
- [ ] Seção "Despesas Reembolsáveis":
  - Botão "Nova Despesa": categoria, descrição, valor, data, upload de comprovante
  - Status: pendente | reembolsado
  - Ação: marcar como reembolsado
- [ ] Criar página `/financeiro` com visão consolidada:
  - Card "Inadimplência": total em R$ + lista de clientes com parcelas atrasadas e dias de atraso
  - Card "Faturamento do Mês": valor recebido + comparativo mês anterior
  - Card "A Receber (próximos 30 dias)"
  - Tabela de parcelas com filtros por status, vencimento e cliente

**Banco de dados:**
- [ ] Migration: tabelas `contratos_honorarios`, `parcelas`, `honorarios_exito`, `despesas`
- [ ] RLS por `office_id` em todas
- [ ] Trigger: mudança de status de parcela para `pago` registra no `audit_log`
- [ ] Cron diário: mover parcelas vencidas (`em_aberto` + `vencimento < hoje`) para `atrasado`

**Backend:**
- [ ] Server Action `criarContrato(...)`: cria contrato e gera parcelas em transação única
- [ ] Server Action `marcarParcelaPaga(parcelaId, dadosPagamento)`: atualiza status, registra auditoria
- [ ] Server Action: criar despesa, marcar despesa como reembolsada
- [ ] Queries agregadas para a página `/financeiro`
- [ ] Validações Zod: valores positivos com 2 casas decimais, datas válidas

**Commit final:** `feat: financial module with contracts, installments, success fees and reimbursable expenses`

---

## M10 — Dashboard Executivo (UI → Backend)

**Branch:** `feat/dashboard`
**Objetivo:** Dashboard com visão consolidada: prazos críticos, audiências, distribuição por fase e faturamento.
**Reaproveitamento PipeFlow:** Estrutura de KPIs + Recharts + Suspense por seção do M7. Métricas são novas.

**Interface primeiro:**
- [ ] Criar página `/dashboard` com grid responsivo
- [ ] **KPIs superiores:**
  - Processos ativos (count)
  - Audiências esta semana (count)
  - Prazos nos próximos 7 dias — destaque vermelho se houver D-1 ou do dia
  - Inadimplência total (R$)
- [ ] **Seção "Próximas Audiências"**: data, hora, comarca/vara, processo (alcunha), cliente
- [ ] **Seção "Prazos Críticos"** (substituir widget placeholder do M5):
  - Ordenada por proximidade
  - Vermelho pulsante para vencendo hoje
  - Vermelho para D-1
  - Âmbar para D-3 a D-7
- [ ] **Distribuição por Fase** — gráfico de barras horizontais (Recharts) com total de processos por fase
- [ ] **Card Faturamento do Mês** — valor recebido + comparativo mês anterior
- [ ] **Atalhos rápidos**: + Novo Processo, + Novo Prazo, + Nova Parte
- [ ] Saudação personalizada: "Bom dia, Dr. Leandro" (com período do dia)
- [ ] Skeleton loading para todos os cards

**Backend:**
- [ ] Queries agregadas para cada KPI, escopadas por `office_id` via RLS
- [ ] Server Component com Suspense por bloco (KPIs, audiências, prazos, gráfico, financeiro)
- [ ] Cache de 60s em queries pesadas (gráfico de fase, faturamento)
- [ ] Badge da sidebar atualizado com count real de prazos do dia

**Commit final:** `feat: executive dashboard with KPIs, deadlines, hearings and phase distribution`

---

## M11 — Notificações Push Mobile (UI → Backend)

**Branch:** `feat/push-notifications`
**Objetivo:** Alertas de prazo no celular via Web Push API. Crítico para uso fora do escritório.
**Reaproveitamento PipeFlow:** Nenhum — módulo inteiramente novo.

**Interface primeiro:**
- [ ] Criar Service Worker em `public/sw.js` (intercepta push, exibe notificação)
- [ ] Componente `PushPermissionPrompt` — banner discreto na primeira visita após login:
  - Explica a importância (prazos processuais vencem mesmo offline)
  - Botão "Ativar alertas" e link "Agora não"
- [ ] Aba "Notificações" em `/configuracoes`:
  - Status atual (ativadas / desativadas)
  - Toggle por tipo: prazo D-7, D-3, D-1, do dia, audiências, mudanças de status
  - Botão "Testar notificação" (envia push imediato de teste)
  - Botão "Desativar notificações" (revoga a subscription)

**Banco de dados:**
- [ ] Migration: tabela `push_subscriptions` (`user_id`, `endpoint`, `p256dh`, `auth`, `created_at`, `active`)

**Backend:**
- [ ] Server Action `salvarSubscription(subscription)`: persiste no banco vinculada ao user
- [ ] Server Action `revogarSubscription()`: marca como inativa
- [ ] Integrar `web-push` no cron de alertas do M5:
  - Para cada alerta gerado, buscar subscriptions ativas do responsável
  - Disparar push em paralelo ao e-mail (Promise.allSettled para não bloquear)
  - Subscription inválida (410 Gone) → marcar `active = false` automaticamente
- [ ] Configurar VAPID keys em variáveis de ambiente (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`)
- [ ] Endpoint de teste em `app/api/push/test/route.ts`

**Commit final:** `feat: web push notifications for deadline alerts`

---

## M12 — Roles e Permissões Ativas (UI → Backend)

**Branch:** `feat/roles-permissions`
**Objetivo:** Ativar os roles Associado, Secretária e Estagiário com enforcement server-side.
**Reaproveitamento PipeFlow:** Estrutura de convite por token e `can(user, action, resource)` do M8. Roles e granularidade são novos.

> **Nota:** Executar apenas quando o escritório contratar colaboradores. A estrutura de RLS já está pronta desde M2.

**Interface primeiro:**
- [ ] Aba "Equipe" em `/configuracoes`:
  - Listagem de membros com role atual, status (ativo/pendente) e ações
  - Botão "Convidar membro" → modal (e-mail + select de role)
  - Ações: editar role, remover membro
- [ ] Criar página pública `/invite/[token]` para aceite de convite:
  - Valida token e expiração (48h)
  - Formulário de definição de senha
  - Ativa conta e redireciona para `/dashboard`
- [ ] Indicadores de permissão insuficiente na UI:
  - Botões desabilitados com tooltip explicativo (ex: "Apenas Titular ou Associado")
  - Seções ocultas por role (ex: Financeiro invisível para Secretária e Estagiário)

**Banco de dados:**
- [ ] Migration: tabela `office_members` (já tem base, adicionar `role` e convites)
- [ ] Migration: tabela `invites` (`token`, `email`, `role`, `expires_at`, `accepted_at`)
- [ ] Atualizar RLS policies: documentos sigilosos e andamentos confidenciais → apenas Titular
- [ ] Policy financeiro: apenas Titular e Associado senior

**Backend:**
- [ ] `lib/permissions/can.ts`: função `can(user, action, resource)` consultada server-side em todas as actions sensíveis
- [ ] Server Actions: criar convite, aceitar convite, alterar role, remover membro
- [ ] Resend: e-mail de convite com link tokenizado e prazo de validade
- [ ] Enforcement em todas as Server Actions (nunca confiar apenas na UI):
  - `marcarCumprido`: bloqueia Estagiário
  - `marcarPerdido`: bloqueia Secretária e Estagiário
  - `criarContrato`: apenas Titular
  - `verDocumentoSigiloso`: apenas Titular
- [ ] Dashboard do Associado: filtra para mostrar apenas processos onde é responsável

**Commit final:** `feat: role-based access control for associates, secretaries and interns`

---

## M13 — Site Institucional (Opcional)

**Branch:** `feat/landing-page`
**Objetivo:** Página pública institucional do escritório do Dr. Leandro Pedrosa.
**Reaproveitamento PipeFlow:** Estrutura da landing page (navbar, hero, footer, metatags). Conteúdo é totalmente novo.

> **Nota:** Opcional. Executar apenas se o Dr. Leandro não tiver site institucional ou quiser um na mesma base do sistema.

- [ ] Criar `app/page.tsx` como landing institucional pública
- [ ] Navbar minimalista: logo + "Área Restrita" (link para `/login`)
- [ ] Seção Hero: nome do escritório, subtítulo "Advocacia Criminal", CTA "Agendar consulta"
- [ ] Seção Áreas de Atuação: cards com Tribunal do Júri, Crimes Patrimoniais, Tráfico, Crimes Cibernéticos, Violência Doméstica, Crimes Financeiros
- [ ] Seção Sobre: bio do Dr. Leandro, número OAB, formação, anos de atuação
- [ ] Seção Diferenciais: sigilo, dedicação, experiência em júri, atuação 24h para presos
- [ ] Formulário de contato: nome, e-mail, telefone, breve descrição → envia e-mail via Resend ao escritório (não cria registro no CRM)
- [ ] Footer: telefone, e-mail, OAB, endereço, redes sociais
- [ ] Responsiva para mobile e tablet
- [ ] Metatags e Open Graph: foco em "advogado criminalista [cidade]"
- [ ] Animações com `prefers-reduced-motion`

**Commit final:** `feat: institutional landing page for Dr. Leandro Pedrosa criminal law office`

---

## M14 — Deploy & Produção

**Branch:** `feat/production-deploy`
**Objetivo:** Aplicação em produção na Vercel com Supabase configurado, domínio próprio e validação de segurança.
**Reaproveitamento PipeFlow:** Checklist de deploy idêntico. Sem Stripe.

- [ ] Criar projeto na Vercel e conectar repositório GitHub
- [ ] Configurar variáveis de ambiente na Vercel (todas do `.env.example`)
- [ ] Configurar domínio customizado (`crm.leandropedrosa.adv.br` ou similar)
- [ ] Rodar todas as migrations no banco de produção do Supabase
- [ ] Ativar RLS e verificar todas as policies em produção (audit completo)
- [ ] Configurar Resend com domínio verificado (`@leandropedrosa.adv.br`)
- [ ] Configurar VAPID keys de produção para push
- [ ] Configurar cron jobs na Vercel (`vercel.json` com schedule do alerta de prazos — 6h BRT)
- [ ] Backup automático no Supabase (daily, retenção 30 dias)
- [ ] Seed de produção: criar escritório + usuário Titular
- [ ] Testar fluxo completo em produção com dados reais:
  - Login do Titular
  - Criar parte (cliente + réu)
  - Criar processo com CNJ válido
  - Lançar prazo e verificar alerta D-1 (e-mail + push)
  - Mover processo no pipeline e verificar auditoria
  - Lançar honorário e marcar parcela paga
  - Upload de documento sigiloso e verificar log de acesso
- [ ] Configurar `NEXT_PUBLIC_APP_URL` com URL de produção
- [ ] Revisão final de segurança:
  - Variáveis sensíveis nunca expostas no client
  - RLS ativa em todas as tabelas
  - Signed URLs em todo acesso ao Storage
  - Audit log funcionando
  - Documentos sigilosos inacessíveis para roles incorretos
  - LGPD: política de privacidade e termos publicados

**Commit final:** `chore: production deployment with security audit and LGPD compliance`

---

## Resumo dos Milestones

| # | Branch | Entrega | Reaproveitamento PipeFlow |
|---|---|---|---|
| M0 | `setup/project-foundation` | Stack configurada, projeto no GitHub | Alto — mesma stack, sem Stripe |
| M1 | `feat/app-shell` | Layout com sidebar e navegação | Alto — componentes idênticos |
| M2 | `feat/authentication` | Login, reset, seed do Titular | Alto — sem registro público |
| M3 | `feat/partes` | CRUD de partes com múltiplos papéis | Médio — estrutura igual, campos novos |
| M4 | `feat/processos` | Processos com CNJ, sigilo e partes | Médio — listagem igual, formulário novo |
| M5 | `feat/agenda` | **⚠️ Agenda de prazos — módulo crítico** | Nenhum — inteiramente novo |
| M6 | `feat/pipeline` | Kanban processual com auditoria | Alto — dnd-kit reaproveitado, colunas novas |
| M7 | `feat/andamentos` | Timeline com notas confidenciais | Médio — visual igual, tipos e flag novos |
| M8 | `feat/documentos` | Documentos versionados com log de acesso | Nenhum — inteiramente novo |
| M9 | `feat/financeiro` | Honorários, parcelas, êxito, despesas | Nenhum — inteiramente novo |
| M10 | `feat/dashboard` | Dashboard executivo | Alto — estrutura igual, métricas novas |
| M11 | `feat/push-notifications` | Alertas push no mobile | Nenhum — inteiramente novo |
| M12 | `feat/roles-permissions` | Roles ativos (Associado, Secretária, Estagiário) | Médio — padrão de convite igual, roles novos |
| M13 | `feat/landing-page` | Site institucional (opcional) | Médio — estrutura igual, conteúdo novo |
| M14 | `feat/production-deploy` | Deploy em produção | Alto — checklist igual, sem Stripe |

---

## Observações Estratégicas

- **M5 é o coração do sistema.** Não avançar para outros milestones se a agenda de prazos não estiver robusta. Testar com 5 cenários reais antes do merge. Prazos processuais vencem independentemente de bugs de software.
- **M12 só é executado quando o escritório crescer.** Se for apenas o Dr. Leandro, entrega em produção após M11.
- **M13 é opcional** — pular direto para M14 se o cliente já tiver site institucional ou não quiser um.
- **Validação contínua:** ao final de cada milestone, demo de 15 min com o Dr. Leandro usando dados reais de 2-3 processos reais antes de avançar.
- **v2 (fora deste plano):** integração com PJe Push, Projudi, eproc e ESAJ para importação automática de andamentos. A arquitetura já reserva `andamento_source` e `ai_indexed_at` para isso. Calculadora de prescrição (art. 109 CP) e cálculo de progressão de regime são candidatos naturais para v2.
