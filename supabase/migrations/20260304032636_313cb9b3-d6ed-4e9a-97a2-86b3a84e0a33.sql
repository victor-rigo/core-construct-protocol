
-- 1. form_responses: respostas brutas do formulário
CREATE TABLE public.form_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  idade INT,
  profissao TEXT,
  renda_atual NUMERIC,
  meta_renda NUMERIC,
  horario_inicio TIME,
  horario_fim TIME,
  frequencia_treino INT,
  objetivo_fisico TEXT,
  nivel_foco INT,
  horas_redes_sociais INT,
  disciplina INT,
  faturamento NUMERIC,
  margem NUMERIC,
  modo_empresario BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.form_responses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own responses" ON public.form_responses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own responses" ON public.form_responses FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 2. protocol_blocks: biblioteca de blocos prontos
CREATE TABLE public.protocol_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  categoria TEXT NOT NULL CHECK (categoria IN ('rotina', 'fisico', 'financeiro', 'empresario')),
  titulo TEXT NOT NULL,
  descricao TEXT NOT NULL,
  prioridade INT NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT true
);

ALTER TABLE public.protocol_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read blocks" ON public.protocol_blocks FOR SELECT TO authenticated USING (true);

-- 3. protocol_rules: regras que conectam respostas a blocos
CREATE TABLE public.protocol_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  campo TEXT NOT NULL,
  operador TEXT NOT NULL CHECK (operador IN ('>', '<', '=', '>=', '<=')),
  valor TEXT NOT NULL,
  block_id UUID NOT NULL REFERENCES public.protocol_blocks(id) ON DELETE CASCADE
);

ALTER TABLE public.protocol_rules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone authenticated can read rules" ON public.protocol_rules FOR SELECT TO authenticated USING (true);

-- 4. generated_protocols: protocolo final gerado
CREATE TABLE public.generated_protocols (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  response_id UUID NOT NULL REFERENCES public.form_responses(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_protocols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own protocols" ON public.generated_protocols FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can read own protocols" ON public.generated_protocols FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 5. protocol_items: blocos ativados por protocolo
CREATE TABLE public.protocol_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  protocol_id UUID NOT NULL REFERENCES public.generated_protocols(id) ON DELETE CASCADE,
  block_id UUID NOT NULL REFERENCES public.protocol_blocks(id) ON DELETE CASCADE
);

ALTER TABLE public.protocol_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert own protocol items" ON public.protocol_items FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM public.generated_protocols WHERE id = protocol_id AND user_id = auth.uid())
);
CREATE POLICY "Users can read own protocol items" ON public.protocol_items FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.generated_protocols WHERE id = protocol_id AND user_id = auth.uid())
);

-- 6. Seed: blocos de protocolo padrão
INSERT INTO public.protocol_blocks (id, categoria, titulo, descricao, prioridade) VALUES
  -- ROTINA
  ('a1000000-0000-0000-0000-000000000001', 'rotina', 'Bloqueio de Redes Sociais', 'Limitar uso de redes sociais a no máximo 30 minutos por dia. Usar bloqueadores de apps e definir horários específicos.', 1),
  ('a1000000-0000-0000-0000-000000000002', 'rotina', 'Protocolo de Sono', 'Dormir no mínimo 7 horas por noite. Criar rotina de desligamento 1h antes de dormir, sem telas.', 1),
  ('a1000000-0000-0000-0000-000000000003', 'rotina', 'Bloco de Foco Profundo', 'Reservar 2-4 horas diárias de trabalho sem interrupções. Desativar notificações e usar técnica Pomodoro.', 2),
  ('a1000000-0000-0000-0000-000000000004', 'rotina', 'Rotina Matinal Estruturada', 'Acordar no mesmo horário todos os dias. Incluir exercício, leitura e planejamento antes de começar o trabalho.', 3),
  ('a1000000-0000-0000-0000-000000000005', 'rotina', 'Leitura Estratégica Diária', 'Dedicar 30 minutos diários a leitura de livros técnicos ou de desenvolvimento pessoal.', 3),
  
  -- FÍSICO
  ('b1000000-0000-0000-0000-000000000001', 'fisico', 'Treino de Alta Frequência', 'Treinar 5-6x por semana com foco em volume progressivo. Ideal para quem já tem base de treino.', 1),
  ('b1000000-0000-0000-0000-000000000002', 'fisico', 'Treino Iniciante Progressivo', 'Começar com 3x por semana, full body. Foco em aprender os movimentos e criar o hábito.', 1),
  ('b1000000-0000-0000-0000-000000000003', 'fisico', 'Protocolo de Emagrecimento', 'Déficit calórico moderado (300-500kcal) combinado com treino de força para preservar massa muscular.', 2),
  ('b1000000-0000-0000-0000-000000000004', 'fisico', 'Protocolo de Hipertrofia', 'Superávit calórico controlado (200-400kcal) com treino focado em sobrecarga progressiva.', 2),
  ('b1000000-0000-0000-0000-000000000005', 'fisico', 'Protocolo de Recomposição', 'Dieta na manutenção com alto teor proteico (2g/kg). Treino focado em força e volume.', 2),

  -- FINANCEIRO
  ('c1000000-0000-0000-0000-000000000001', 'financeiro', 'Corte de Gastos Supérfluos', 'Auditar todos os gastos mensais e eliminar assinaturas e compras desnecessárias. Meta: reduzir 20% dos gastos variáveis.', 1),
  ('c1000000-0000-0000-0000-000000000002', 'financeiro', 'Plano de Aumento de Renda', 'Criar estratégia para aumentar renda em 50% nos próximos 6 meses. Identificar habilidades monetizáveis e oportunidades.', 1),
  ('c1000000-0000-0000-0000-000000000003', 'financeiro', 'Fundo de Emergência', 'Construir reserva de 6 meses de despesas. Automatizar transferência mensal de pelo menos 10% da renda.', 2),
  ('c1000000-0000-0000-0000-000000000004', 'financeiro', 'Controle Financeiro Rigoroso', 'Registrar todas as despesas diariamente. Criar orçamento mensal e revisar semanalmente.', 2),
  ('c1000000-0000-0000-0000-000000000005', 'financeiro', 'Investimento em Educação', 'Alocar 5-10% da renda em cursos e capacitação profissional para aumentar valor de mercado.', 3),

  -- EMPRESÁRIO
  ('d1000000-0000-0000-0000-000000000001', 'empresario', 'Otimização de Margem', 'Revisar estrutura de custos e precificação. Meta: aumentar margem em pelo menos 10 pontos percentuais.', 1),
  ('d1000000-0000-0000-0000-000000000002', 'empresario', 'Estruturação de Funil', 'Criar funil de vendas completo: atração, nutrição e conversão. Implementar automações de marketing.', 1),
  ('d1000000-0000-0000-0000-000000000003', 'empresario', 'Escala com Tráfego Pago', 'Iniciar campanhas de tráfego pago com orçamento controlado. Testar criativos e otimizar ROI.', 2),
  ('d1000000-0000-0000-0000-000000000004', 'empresario', 'Formação de Equipe', 'Contratar primeiro colaborador ou freelancer para delegar tarefas operacionais e focar em estratégia.', 3),
  ('d1000000-0000-0000-0000-000000000005', 'empresario', 'Escala de Faturamento', 'Plano para dobrar faturamento em 12 meses. Diversificar canais de aquisição e aumentar ticket médio.', 2);

-- 7. Seed: regras de protocolo
INSERT INTO public.protocol_rules (campo, operador, valor, block_id) VALUES
  -- Rotina
  ('horas_redes_sociais', '>', '2', 'a1000000-0000-0000-0000-000000000001'),
  ('nivel_foco', '<', '6', 'a1000000-0000-0000-0000-000000000003'),
  ('disciplina', '<', '6', 'a1000000-0000-0000-0000-000000000004'),
  ('disciplina', '<', '5', 'a1000000-0000-0000-0000-000000000005'),
  ('horas_redes_sociais', '>', '1', 'a1000000-0000-0000-0000-000000000002'),
  
  -- Físico
  ('frequencia_treino', '>=', '5', 'b1000000-0000-0000-0000-000000000001'),
  ('frequencia_treino', '<', '4', 'b1000000-0000-0000-0000-000000000002'),
  ('objetivo_fisico', '=', 'emagrecer', 'b1000000-0000-0000-0000-000000000003'),
  ('objetivo_fisico', '=', 'hipertrofia', 'b1000000-0000-0000-0000-000000000004'),
  ('objetivo_fisico', '=', 'recomposição', 'b1000000-0000-0000-0000-000000000005'),

  -- Financeiro
  ('renda_atual', '<', '5000', 'c1000000-0000-0000-0000-000000000001'),
  ('meta_renda', '>', '10000', 'c1000000-0000-0000-0000-000000000002'),
  ('renda_atual', '<', '8000', 'c1000000-0000-0000-0000-000000000003'),
  ('disciplina', '<', '7', 'c1000000-0000-0000-0000-000000000004'),
  ('renda_atual', '<', '10000', 'c1000000-0000-0000-0000-000000000005'),

  -- Empresário
  ('margem', '<', '30', 'd1000000-0000-0000-0000-000000000001'),
  ('faturamento', '<', '50000', 'd1000000-0000-0000-0000-000000000002'),
  ('faturamento', '>', '10000', 'd1000000-0000-0000-0000-000000000003'),
  ('faturamento', '>', '30000', 'd1000000-0000-0000-0000-000000000004'),
  ('faturamento', '>', '20000', 'd1000000-0000-0000-0000-000000000005');
