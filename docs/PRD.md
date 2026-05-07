# LP Consultoria Jurídica — Product Requirements Document (PRD)

> Sistema de gestão dedicado para escritório de advocacia criminal. Single-tenant, focado em produtividade do advogado criminalista e integridade de dados processuais.

---

## 1. Contexto & Problema

Escritórios de advocacia criminal enfrentam desafios únicos que ferramentas genéricas de CRM não resolvem. Prazos processuais vencem independentemente de feriados, fins de semana ou da agenda do advogado — e perder um prazo pode significar manter um cliente preso indevidamente. A gestão de processos criminais envolve sigilo profissional constitucional, dados sensíveis de réus (situação prisional, antecedentes, localização), múltiplos papéis para a mesma pessoa (o cliente pode ser réu em um processo e testemunha em outro), e documentação que precisa de controle de acesso granular.

Ferramentas como HubSpot e Pipedrive não conhecem o que é um habeas corpus, não calculam prescrição, não sabem que uma audiência de custódia tem prazo de 24 horas, e não possuem um campo para "situação prisional do réu". Planilhas e anotações soltas são a realidade atual — e representam risco real para os clientes do escritório.

---

## 2. Solução Proposta

Construir o **LP Consultoria Jurídica** — uma plataforma web SaaS dedicada para o escritório do Dr. Leandro Pedrosa, advogado criminalista. O sistema centraliza gestão de partes (clientes, réus, vítimas, testemunhas), processos criminais com validação CNJ, agenda de prazos com alertas redundantes, pipeline processual visual, documentos com versionamento e log de acesso, controle financeiro de honorários e um dashboard executivo.

O sistema é **single-tenant** — dedicado exclusivamente ao escritório do Dr. Leandro — o que simplifica a arquitetura, elimina a necessidade de monetização in-app e permite regras de negócio específicas do domínio criminal sem compromissos de generalidade.

---

## 3. Reaproveitamento do PipeFlow CRM

Este projeto herda diretamente a base técnica e visual do PipeFlow CRM, reduzindo o escopo de desenvolvimento novo significativamente.

**Adotado sem alteração:**
- Identidade visual completa: dark theme zinc/indigo, paleta de tokens, sistema de badges amber/emerald
- App shell: `Sidebar`, `Header`, layout base `(app)/layout.tsx`, drawer mobile, `(auth)/layout.tsx`
- Infraestrutura Supabase: `client.ts`, `server.ts`, `middleware.ts`, padrão de RLS
- Convenções de código: Zod + react-hook-form em formulários, Server Actions como padrão de mutação, Server Components com Suspense por seção
- Stack de e-mail: Resend para convites e notificações transacionais

**Adaptado:**
- Autenticação: mantém login/reset, remove registro público (usuários entram por convite ou seed)
- Tenant model: `workspace_id` vira `office_id`; single-tenant ao invés de multi-workspace
- Leads → Partes: mesma estrutura de CRUD/listagem/busca, com campo `tipo` e papéis por processo
- Pipeline Kanban: mesmo `@dnd-kit`, colunas viram fases processuais penais, mudanças auditadas
- Timeline: mesmo componente visual, vira andamentos com flag `confidencial` e restrição por role
- Dashboard: mesmo esqueleto de KPIs + Recharts, métricas viram prazos/audiências/financeiro
- Roles: Admin/Membro vira Titular/Associado/Secretária/Estagiário com permissões granulares

**Descartado:**
- Stripe / monetização / planos Free-Pro
- Onboarding multi-workspace
- Landing page de produto SaaS

---

## 4. Requisitos Funcionais

### 4.1 Autenticação e Acesso
- Login com e-mail e senha via Supabase Auth
- Recuperação de senha por e-mail (Resend)
- Sem registro público — usuários criados por seed (Titular) ou convite
- Proteção de rotas via middleware; redirecionamento automático para `/login`
- Logout seguro com limpeza de sessão

### 4.2 Gestão de Partes
- Cadastro completo: nome, CPF (com validação de dígito verificador), RG, data de nascimento, filiação, naturalidade, profissão, contatos (telefone/e-mail), endereço
- Tipos de parte: Cliente, Réu, Vítima, Testemunha, Autoridade (delegado, promotor, juiz)
- A mesma pessoa pode ter papéis diferentes em processos diferentes (ex: réu em um processo, testemunha em outro)
- Campos condicionais por tipo: situação prisional (Réu), comarca de atuação (Autoridade)
- Situação prisional do réu: solto, preso provisório, condenado, semi-aberto, foragido
- Unidade prisional vinculada (quando preso)
- Listagem com busca (nome, CPF), filtros por tipo e situação, paginação
- Página de detalhe com abas: Dados Pessoais, Processos Vinculados (com papel em cada um), Observações
- Alerta de duplicidade por CPF (avisa, não bloqueia)
- Soft delete (arquivar, nunca excluir permanentemente)
- Indicador visual para parte com múltiplos papéis

### 4.3 Gestão de Processos
- Número CNJ com máscara e validação de dígito verificador (`lib/cnj/validator.ts`)
- Número interno e alcunha do caso (nome de referência interno)
- Dados de localização: tribunal, comarca, vara, juiz responsável
- Tipificação penal: múltiplos tipos penais por processo, com marcação do tipo principal (referência aos artigos do CP)
- Vínculo de partes: cliente contratante, réu (podem ser a mesma pessoa), vítimas, testemunhas
- Fase processual atual: Pré-processual → Inquérito → Denúncia/Recebimento → Instrução → Memoriais → Sentença → Recursos → Execução → Arquivado
- Nível de sigilo: público, restrito, segredo de justiça
- Responsável interno pelo processo
- Indicador visual de situação prisional do réu no header do processo
- Indicador de sigilo destacado no header
- Listagem com busca unificada (CNJ, alcunha, cliente, réu) e filtros por fase, comarca, responsável, sigilo
- Página de detalhe com abas: Resumo, Timeline, Documentos, Financeiro, Prazos
- Auditoria de mudanças de fase, responsável e sigilo
- Soft delete via campo `situacao`

### 4.4 Agenda de Prazos e Audiências ⚠️ Módulo Crítico
- Tipos de evento: Prazo processual, Audiência, Visita ao preso, Reunião com cliente, Diligência
- Campos por tipo de evento com formulário condicional (campos obrigatórios variam por tipo)
- Reunião com cliente é o único tipo que pode existir sem processo vinculado
- Três visualizações: calendário mensal, lista semanal, lista do dia
- Chips coloridos por tipo de evento no calendário
- Indicador de criticidade temporal:
  - Verde: mais de 7 dias
  - Âmbar: 3 a 7 dias
  - Vermelho: menos de 3 dias
  - Vermelho pulsante: vencendo hoje
  - Cinza + indicador vermelho: perdido
- Marcar como cumprido: modal de dupla confirmação com campo obrigatório "O que foi feito?" (mín. 10 caracteres)
- Marcar como perdido: modal separado com cor crítica, justificativa obrigatória (mín. 20 caracteres), notificação automática ao Titular
- Alertas escalonados: D-7, D-3, D-1 e dia do prazo (e-mail + push)
- Cron job diário às 6h para calcular e disparar alertas
- Validação: prazo com data fim no passado não pode ser criado como pendente
- Registro de cumprimento no audit_log
- Widget "Prazos Críticos" no dashboard

### 4.5 Pipeline Kanban Processual
- Colunas representando fases processuais penais (mesmas do 4.3)
- Cards de processo: alcunha, cliente, réu (se diferente), comarca/vara, próximo prazo/audiência, avatar do responsável, indicador de sigilo
- Drag-and-drop entre colunas com `@dnd-kit`
- Modal de confirmação ao mover: "Mover [alcunha] de [fase] para [fase]?" com campo opcional de observação
- Mudança de fase é evento auditado: registra em `andamentos` e `audit_log`
- Filtros laterais: responsável, comarca, tipo penal, sigilo
- Click no card abre `/processos/[id]`
- Contadores por coluna e agrupamento visual

### 4.6 Timeline de Andamentos
- Tipos: Andamento oficial, Peça produzida, Comunicação com cliente, Anotação interna, Evento de audiência
- Campos: tipo, data (padrão hoje, editável), descrição, flag `confidencial`
- Flag `confidencial` disponível apenas para tipo Anotação interna; visível só ao Titular
- Exibição: ícone por tipo, autor, data relativa ("há 2 dias")
- Ordenação decrescente por data
- Filtros por tipo (chips toggleáveis)
- Formulário inline de registro
- Upload de anexos (preparado na UI, integrado no M8)
- Estado vazio com CTA para registrar primeiro andamento

### 4.7 Gestão de Documentos
- Categorias: procuração, contrato de honorários, peça inicial, contestação, recurso, decisão judicial, prova documental, laudo pericial, mídia
- Upload via drag-and-drop (`react-dropzone`)
- Tamanho máximo: 50 MB por arquivo
- Tipos permitidos: PDF, DOC/DOCX, JPG, PNG, MP3, MP4
- Flag `sigiloso` por documento
- Versionamento: botão "Nova versão" preserva metadados e histórico, incrementa `versao`
- Visualizador inline para PDFs
- Log de acesso por documento (quem viu, baixou, editou e quando) — visível apenas ao Titular
- Bucket criptografado no Supabase Storage
- Acesso apenas via signed URLs geradas server-side (nunca URLs públicas)

### 4.8 Módulo Financeiro
- Tipos de contrato: contratual, êxito, pro bono, dativo
- Contrato contratual: valor total, parcelamento (quantidade, primeira parcela, intervalo), geração automática de parcelas em transação
- Contrato de êxito: gatilho (absolvição, desclassificação, redução de pena), percentual, valor estimado
- Registro de parcelas: número, valor, vencimento, status (em aberto, pago, atrasado)
- Marcar parcela como paga: data do pagamento, forma (PIX, transferência, dinheiro, boleto), observações
- Cron diário que move parcelas vencidas para status `atrasado`
- Despesas reembolsáveis: categoria (custas, perícia, deslocamento, cópias, honorários periciais), valor, data, comprovante
- Status de reembolso por despesa: pendente / reembolsado
- Página `/financeiro` com visão consolidada do escritório:
  - Card Inadimplência: total em R$ + lista de clientes com parcelas atrasadas e dias de atraso
  - Card Faturamento do Mês: valor recebido + comparativo mês anterior
  - Card A Receber (próximos 30 dias)
  - Tabela de parcelas com filtros por status, vencimento e cliente

### 4.9 Dashboard Executivo
- KPIs: processos ativos, audiências da semana, prazos nos próximos 7 dias, inadimplência total (R$)
- Destaque vermelho no KPI de prazos se houver evento D-1 ou do dia
- Seção "Próximas Audiências": data, hora, comarca/vara, processo, cliente
- Seção "Prazos Críticos": ordenada por proximidade com escalada visual (vermelho pulsante, vermelho, âmbar)
- Gráfico de barras horizontais (Recharts): distribuição de processos por fase processual
- Card Faturamento do Mês com sparkline opcional
- Atalhos rápidos: + Novo Processo, + Novo Prazo, + Nova Parte
- Saudação personalizada: "Bom dia, Dr. Leandro"
- Skeleton loading por seção com Suspense

### 4.10 Notificações Push Mobile
- Web Push API + Service Worker
- Banner discreto pedindo permissão na primeira visita
- Tipos de notificação configuráveis: prazo D-7, D-3, D-1, do dia, audiências, mudanças de status
- Notificações disparadas pelo mesmo cron que envia e-mails (em paralelo)
- Botão "Testar notificação" nas configurações
- Gestão automática de subscriptions inválidas

### 4.11 Roles e Permissões
- Titular: acesso total, incluindo documentos confidenciais, financeiro e audit log
- Associado: acesso a processos e partes do próprio escritório; pode marcar prazos como cumpridos
- Secretária: acesso a processos e partes (exceto sigilosos e financeiro); não marca prazos
- Estagiário: somente leitura em processos e partes (exceto sigilosos); não executa ações
- Convite por e-mail com token expirado em 48h
- Página `/invite/[token]` para aceite e definição de senha
- Enforcement server-side em todas as Server Actions (função `can(user, action, resource)`)
- Indicadores visuais de permissão insuficiente com tooltip explicativo

### 4.12 Site Institucional (Opcional)
- Landing page do escritório do Dr. Leandro Pedrosa
- Seções: hero, áreas de atuação, sobre, diferenciais, formulário de contato
- Formulário de contato envia e-mail via Resend (não cria registro no CRM)
- Navbar com "Área Restrita" (link para `/login`)
- SEO básico: metatags, Open Graph, foco em "advogado criminalista [cidade]"
- Responsiva para mobile e tablet

---

## 5. Requisitos Não-Funcionais

**Segurança e LGPD:**
- RLS em todas as tabelas sem exceção, escopado por `office_id`
- Dados de processos criminais são dados sensíveis — logs de acesso obrigatórios
- Signed URLs para todos os documentos (nunca URLs públicas do Storage)
- Variáveis sensíveis exclusivamente server-side (nunca expostas no client)
- Audit log de todas as ações críticas (mudança de fase, cumprimento de prazo, acesso a documento sigiloso)
- Soft delete em partes e processos (retenção de histórico para fins legais)
- Política de privacidade e termos de uso publicados antes de ir a produção

**Sigilo Profissional:**
- Processos em segredo de justiça com nível de acesso restrito
- Documentos sigilosos acessíveis apenas ao Titular
- Anotações internas confidenciais visíveis apenas ao Titular
- Múltiplos níveis de acesso dentro do mesmo escritório

**Confiabilidade (crítico para prazos):**
- Alertas redundantes: e-mail + push para todo prazo
- Cron job com retry automático em caso de falha
- Testes manuais obrigatórios com 5 cenários reais antes do deploy do M5
- Validação de CNJ com dígito verificador antes de persistir

**Performance:**
- Skeleton loading em todas as listagens e dashboards
- Cache de 60s em queries pesadas do dashboard
- Queries escopadas por `office_id` via RLS (não dependem de filtros manuais)

---

## 6. Stack Técnica

| Camada | Tecnologia |
|---|---|
| Frontend | Next.js 15 (App Router) + React 19 + Tailwind CSS + shadcn/ui |
| Backend/API | Next.js API Routes + Server Actions |
| Banco de dados | Supabase (PostgreSQL + RLS + Realtime) |
| Autenticação | Supabase Auth |
| Storage | Supabase Storage (bucket criptografado) |
| E-mail | Resend |
| Push notifications | Web Push API + VAPID keys |
| Drag-and-drop | @dnd-kit/core |
| Gráficos | Recharts |
| Validação | Zod + react-hook-form |
| Datas | date-fns + date-fns-tz |
| Calendário | react-big-calendar |
| Linguagem | TypeScript 5 (strict mode) |
| Deploy | Vercel (frontend) + Supabase (backend/DB) |
| Versionamento | Git + GitHub |

---

## 7. Identidade Visual

Herdada diretamente do PipeFlow CRM. Dark mode como tema padrão.

**Backgrounds:**

| Camada | Token Tailwind | Hex |
|---|---|---|
| Base | `zinc-950` | `#09090b` |
| Superfície | `zinc-900` | `#18181b` |
| Elevado | `zinc-800` | `#27272a` |
| Borda | `zinc-700` | `#3f3f46` |

**Tipografia:**

| Uso | Token Tailwind | Hex |
|---|---|---|
| Título / destaque | `zinc-50` | `#fafafa` |
| Corpo / label | `zinc-300` | `#d4d4d8` |
| Texto secundário | `zinc-500` | `#71717a` |
| Placeholder | `zinc-600` | `#52525b` |

**Cores funcionais:**

| Papel | Token | Hex |
|---|---|---|
| Primária (ação, link) | `indigo-500` | `#6366f1` |
| Primária hover | `indigo-400` | `#818cf8` |
| Sucesso / absolvição | `emerald-500` | `#10b981` |
| Perda / crítico | `red-500` | `#ef4444` |
| Alerta / prazo próximo | `amber-400` | `#fbbf24` |
| Neutro / tag | `zinc-700` | `#3f3f46` |

**Aplicação por componente:**
- Sidebar: `zinc-950`, link ativo = `zinc-800` + `zinc-50` + borda esquerda `indigo-500`
- Cards de processo: `zinc-900`, borda `zinc-800`, hover eleva para `zinc-800`
- Modais/drawers: `zinc-900`, overlay `zinc-950/80` com blur
- Inputs: `zinc-800`, borda `zinc-700`, focus com anel `indigo-500`
- Botão primário: `indigo-600`, hover `indigo-500`, texto `zinc-50`
- Badge de valor (R$): fundo `emerald-950`, texto `emerald-400`
- Badge de prazo urgente: fundo `amber-950`, texto `amber-400`
- Badge de prazo crítico: fundo `red-950`, texto `red-400`

---

## 8. Personas

**Dr. Leandro Pedrosa — Titular**
Advogado criminalista com carteira ativa de processos em múltiplas varas e comarcas. Trabalha fora do escritório frequentemente (tribunal, presídios, delegacias). Precisa de alertas de prazo no celular, visão rápida do que está urgente, e acesso seguro a documentos sigilosos de qualquer lugar. É o único com acesso total ao sistema no MVP.

**Associado (futuro)**
Advogado colaborador que gerencia processos próprios dentro do escritório. Vê apenas seus processos no dashboard, pode registrar andamentos e marcar prazos como cumpridos. Não tem acesso ao financeiro nem a documentos sigilosos de outros advogados.

**Secretária (futuro)**
Responsável por agenda, cadastro de partes e acompanhamento de prazos administrativos. Não acessa financeiro nem documentos sigilosos. Pode registrar reuniões e diligências.

**Estagiário (futuro)**
Somente leitura em processos não sigilosos. Pode visualizar andamentos, mas não executa ações críticas.

---

## 9. Observações Estratégicas

- O módulo de prazos (M5) é o coração do sistema e não pode ser entregue com bugs. Validar com 5 cenários reais antes de qualquer deploy.
- O sistema é dedicado (single-tenant): não há necessidade de Stripe, onboarding multi-empresa ou landing de produto SaaS.
- A v2 pode incluir integração com PJe, Projudi, eproc e ESAJ para importação automática de andamentos. A arquitetura já reserva `andamento_source` e `ai_indexed_at` para isso.
- Validação contínua: ao final de cada milestone, demo de 15 min com o Dr. Leandro usando dados reais de 2-3 processos antes de avançar.
- Roles além do Titular só são ativados (M12) quando o escritório efetivamente crescer.
