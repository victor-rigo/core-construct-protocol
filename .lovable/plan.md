

# Relatório de Otimização — KOR Protocol Platform

## Score de Saúde do Código

```text
Arquitetura:    6/10  ██████░░░░
Clean Code:     5/10  █████░░░░░
Performance:    5/10  █████░░░░░
Segurança:      6/10  ██████░░░░
Semântica:      6/10  ██████░░░░
Comunicação:    4/10  ████░░░░░░
────────────────────────────────
Score Geral:    5.3/10
```

---

## Top 10 Ações de Maior Impacto

| # | Finding | Severidade | Risco |
|---|---------|-----------|-------|
| 1 | [ARCH-001] Dashboard duplica toda a lógica do Protocol — 553 linhas redundantes | ALTO | CUIDADO |
| 2 | [PERF-001] protocolEngine.ts (869 linhas) é recalculado em cada render do Dashboard | ALTO | SEGURO |
| 3 | [COMM-001] useAuth cria nova instância em cada ProtectedRoute + cada página — múltiplos listeners | CRÍTICO | CUIDADO |
| 4 | [ARCH-002] protocolEngine.ts é God Module — workout, nutrition, entrepreneur, schedule em 1 arquivo | ALTO | CUIDADO |
| 5 | [CLEAN-001] Onboarding.tsx tem 343 linhas com todo o form inline — sem componentes por step | MÉDIO | SEGURO |
| 6 | [PERF-002] Dynamic imports no handleComplete do Onboarding (supabase, protocolRuleEngine, aiProtocolService) | MÉDIO | SEGURO |
| 7 | [SEC-001] ProtectedRoute verifica hasCompletedOnboarding do Zustand (client-side) — pode ser manipulado | ALTO | CUIDADO |
| 8 | [COMM-002] Dashboard e Protocol são dois dashboards paralelos exibindo os mesmos dados de formas diferentes | ALTO | CUIDADO |
| 9 | [CLEAN-002] Fallback components duplicados em cada Protocol tab (ProtocolRoutine, ProtocolPhysical, etc.) | MÉDIO | SEGURO |
| 10 | [SEM-001] Naming inconsistente: `generateProtocol` vs `generateAIProtocol` vs `generateRuleBasedProtocol` | BAIXO | SEGURO |

---

## Findings Detalhados

### Arquitetura (5 findings)

**[ARCH-001] Dashboard.tsx duplica Protocol.tsx — ALTO**
`Dashboard.tsx` (553 linhas) e `Protocol.tsx` (224 linhas) exibem essencialmente os mesmos dados (treino, nutrição, financeiro, empresário, rotina). O Dashboard usa `protocolEngine` diretamente enquanto Protocol usa dados da IA. Resultado: duas UIs paralelas para manter.
- Sugestão: Unificar em uma única página Protocol que aceita ambas as fontes de dados, ou transformar Dashboard em um resumo leve que linka para Protocol.

**[ARCH-002] protocolEngine.ts é God Module — ALTO**
869 linhas num único arquivo contendo: workout plans, nutrition plans, schedule logic, entrepreneur data, financial calculations, food database. Viola SRP.
- Sugestão: Separar em `workoutEngine.ts`, `nutritionEngine.ts`, `financialEngine.ts`, `entrepreneurEngine.ts`, `scheduleUtils.ts`.

**[ARCH-003] Sem camada de serviço unificada — MÉDIO**
Chamadas ao Supabase estão espalhadas: `useAuth.ts`, `Onboarding.tsx`, `protocolRuleEngine.ts`, `aiProtocolService.ts`, `useAppStore.ts`. Sem padrão de repositório.
- Sugestão: Criar `services/profileService.ts`, `services/protocolService.ts`.

**[ARCH-004] Onboarding não usa ProtectedRoute — MÉDIO**
A rota `/onboarding` não é protegida. Um usuário não autenticado pode preencher todo o formulário e só descobrir que precisa de conta no final.

**[ARCH-005] Duas rotas fazem a mesma coisa — MÉDIO**
`/dashboard` e `/protocol` são ambas protegidas e exibem protocolos. Confusão de propósito.

### Clean Code (6 findings)

**[CLEAN-001] Onboarding monolítico — MÉDIO**
343 linhas com 6 steps de formulário inline. Cada step deveria ser um componente separado (`PersonalStep`, `PhysicalStep`, etc.).

**[CLEAN-002] Fallback components duplicados — MÉDIO**
`FallbackRoutine`, `FallbackPhysical`, `FallbackFinancial`, `FallbackEntrepreneur` duplicam a mesma lógica de renderização. Se o AI data nunca estiver disponível, todo o código principal é dead code, e vice-versa.

**[CLEAN-003] Magic numbers no protocolEngine — BAIXO**
`1.725`, `1.55`, `350`, `500`, `2.0`, `2.3`, `0.8`, `35` (water multiplier) — sem constantes nomeadas.

**[CLEAN-004] parseNum duplicado — BAIXO**
`parseNum` / `parseFloat(str.replace(...))` pattern aparece em `protocolEngine.ts`, `protocolRuleEngine.ts`, `ProtocolFinancial.tsx`, `Dashboard.tsx`.

**[CLEAN-005] Type assertions com `as any` — MÉDIO**
`profile_data: profile as any`, `data.profile_data as any`, `protocolData as any` — Supabase types não estão tipados corretamente para JSONB.

**[CLEAN-006] Dead code: protocolRuleEngine.ts — BAIXO**
O sistema de regras baseado em banco (`protocol_blocks`, `protocol_rules`) parece não ser usado ativamente desde a introdução da IA. `generateRuleBasedProtocol` é chamado mas seus resultados não aparecem na UI.

### Performance (4 findings)

**[PERF-001] generateProtocol recalculado a cada render — ALTO**
Em `Dashboard.tsx`, `useMemo` protege parcialmente, mas cada componente Fallback chama `generateProtocol(profile)` independentemente. Se 3 tabs usam fallback, são 3 recálculos do engine inteiro (869 linhas de lógica).

**[PERF-002] Dynamic imports desnecessários no Onboarding — MÉDIO**
```typescript
const { supabase } = await import('@/integrations/supabase/client');
const { mapProfileToFormResponse } = await import('@/lib/protocolRuleEngine');
```
Esses módulos já são importados em outros pontos do bundle. Dynamic import aqui não economiza nada e adiciona latência.

**[PERF-003] useAuth dispara setTimeout para DB call — BAIXO**
`setTimeout(async () => { ... }, 0)` para evitar deadlock, mas isso cria uma race condition: `setLoading(false)` é chamado ANTES do profile ser carregado do banco. O ProtectedRoute pode redirecionar para `/onboarding` antes do `has_completed_onboarding` ser lido.

**[PERF-004] Recharts importado no Dashboard inteiro — BAIXO**
`PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend` são importados no topo do Dashboard mas só usados na tab `financial`. Deveria ser lazy loaded.

### Segurança (3 findings)

**[SEC-001] Onboarding gate baseado em client-side state — ALTO**
`hasCompletedOnboarding` vem do Zustand store. O `useAuth` hook popula isso via `setTimeout`, criando uma janela onde o valor é `false` mesmo para usuários que completaram o onboarding. Pior: um usuário pode manipular o Zustand state no devtools.
- Sugestão: Verificar `has_completed_onboarding` diretamente do Supabase no ProtectedRoute, com loading state até a resposta chegar.

**[SEC-002] Profile data sem validação — MÉDIO**
O formulário de onboarding não valida inputs. Um usuário pode enviar strings arbitrárias nos campos numéricos (peso, renda, etc.), que são salvos no banco sem sanitização.

**[SEC-003] Edge function sem validação de input — MÉDIO**
`generate-protocol/index.ts` recebe `profile` do body e passa direto para o prompt da IA sem validar a estrutura.

### Semântica (3 findings)

**[SEM-001] Naming inconsistente de geradores — BAIXO**
`generateProtocol` (rule engine), `generateAIProtocol` (AI), `generateRuleBasedProtocol` (DB rules) — 3 funções com propósitos similares e nomes confusos.

**[SEM-002] Mistura de português e inglês — BAIXO**
Interfaces em inglês (`UserProfile`, `WorkoutDay`), campos do banco em português (`profissao`, `renda_atual`), componentes em inglês, labels em português.

**[SEM-003] `protocol` usado para 3 conceitos diferentes — MÉDIO**
"Protocol" refere-se a: (1) o output do `protocolEngine.ts`, (2) os dados AI do `aiProtocolService.ts`, (3) registros na tabela `generated_protocols`. Mesma palavra, 3 estruturas diferentes.

### Comunicação (3 findings)

**[COMM-001] useAuth instanciado múltiplas vezes — CRÍTICO**
`useAuth()` é chamado em `ProtectedRoute`, `Dashboard`, `Protocol`, e potencialmente em cada página. Cada instância cria um novo `onAuthStateChange` listener e `getSession` call. Com 3 rotas protegidas, são 3+ listeners simultâneos.
- Sugestão: Mover auth state para um context provider (`AuthProvider`) no topo do app, ou manter no Zustand store com um único listener.

**[COMM-002] Store e DB desincronizados — ALTO**
O Zustand store (`useAppStore`) mantém `profile` e `hasCompletedOnboarding` em memória. O `useAuth` hook tenta sincronizar do banco, mas com `setTimeout` há uma race condition. Não existe um single source of truth claro.

**[COMM-003] Protocol page re-gera AI ao carregar — MÉDIO**
Se o `storeProfile` existe mas não há protocolo salvo no banco, a página Protocol chama `generateAIProtocol` automaticamente. Se o usuário navegar para fora e voltar, isso pode gerar protocolo duplicado.

---

## Plano de Implementação Sugerido

### Sprint 1 — Quick Wins (SEGURO)
1. Extrair constantes do `protocolEngine.ts` (magic numbers)
2. Criar `parseNum` util compartilhado
3. Remover dynamic imports do Onboarding (usar imports normais)
4. Cachear resultado do `generateProtocol` nos fallback components

### Sprint 2 — Melhorias Estruturais (CUIDADO)
1. Criar `AuthProvider` context para evitar múltiplos `useAuth` listeners
2. Separar `protocolEngine.ts` em módulos menores
3. Extrair steps do Onboarding em componentes separados
4. Resolver race condition do `setTimeout` no `useAuth` (await profile antes de setLoading)
5. Unificar Dashboard e Protocol (ou definir propósito claro de cada um)

### Sprint 3 — Refatorações Maiores (RISCO)
1. Verificar `has_completed_onboarding` server-side no ProtectedRoute
2. Adicionar validação Zod no formulário de onboarding
3. Adicionar validação de input na edge function
4. Remover sistema de fallback se decisão for "AI-only"
5. Criar camada de serviços unificada para Supabase

