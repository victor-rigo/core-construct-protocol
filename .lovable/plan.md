

## Plano: Tabelas de Dados e Otimizações no Modo Empresário

### Contexto
A aba "Empresário" no Dashboard atualmente exibe apenas textos genéricos (aquisição, funil, escala, KPIs como badges). O objetivo é gerar **tabelas com dados reais calculados a partir do formulário** — métricas atuais vs. otimizadas, diagnósticos e planos de ação concretos.

### Alterações

#### 1. Expandir o Protocol Engine (`src/lib/protocolEngine.ts`)
Refatorar `entrepreneurProtocol` para gerar dados tabulares baseados no formulário:

- **Tabela de Diagnóstico Financeiro**: faturamento atual, margem real (R$), custo operacional estimado, ponto de equilíbrio — tudo calculado a partir de `monthlyRevenue` e `margin`.
- **Tabela de Otimização de Margem**: cenários de melhoria (5%, 10%, 20%) com projeção de lucro líquido mensal e anual.
- **Tabela de Métricas de Aquisição**: CAC estimado por canal (orgânico, tráfego pago, indicação), LTV projetado, relação LTV/CAC, e meta de clientes/mês para atingir a meta de renda.
- **Tabela de Funil de Vendas**: etapas (topo, meio, fundo) com taxas de conversão benchmark por modelo de negócio e volume necessário em cada etapa.
- **Tabela de Plano de Escala**: ações priorizadas com impacto estimado (alto/médio/baixo), prazo sugerido e status.
- **Tabela de KPIs com metas**: métrica atual (inferida do formulário) vs. meta otimizada vs. benchmark do setor.

Todas as interfaces tipadas (ex: `MarginScenario`, `AcquisitionMetric`, `FunnelStage`, `ScaleAction`, `KPITarget`).

#### 2. Atualizar o Dashboard (`src/pages/Dashboard.tsx`)
Substituir a aba "Empresário" atual por seções com tabelas usando os componentes `Table` já existentes (`src/components/ui/table.tsx`):

- Cada seção com header descritivo + tabela de dados
- Células com formatação condicional (verde para métricas boas, vermelho para gargalos)
- Cards de resumo no topo (faturamento, margem, gargalo principal)
- Manter o design premium minimalista (glass-card, font-display, tracking)

### Resultado Esperado
O empresário verá seus números reais processados em tabelas acionáveis, com cenários de otimização calculados a partir do que informou no formulário — não apenas texto genérico.

