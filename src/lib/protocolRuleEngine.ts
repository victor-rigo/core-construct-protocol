import { supabase } from '@/integrations/supabase/client';

export interface FormResponseData {
  idade?: number;
  profissao?: string;
  renda_atual?: number;
  meta_renda?: number;
  horario_inicio?: string;
  horario_fim?: string;
  frequencia_treino?: number;
  objetivo_fisico?: string;
  nivel_foco?: number;
  horas_redes_sociais?: number;
  disciplina?: number;
  faturamento?: number;
  margem?: number;
  modo_empresario?: boolean;
}

export interface ProtocolBlock {
  id: string;
  categoria: string;
  titulo: string;
  descricao: string;
  prioridade: number;
}

export interface ProtocolRule {
  id: string;
  campo: string;
  operador: string;
  valor: string;
  block_id: string;
}

export interface GeneratedProtocolResult {
  protocolId: string;
  blocks: ProtocolBlock[];
  responseId: string;
}

/**
 * Maps UserProfile (from Zustand/onboarding) to flat form_responses fields
 */
export function mapProfileToFormResponse(profile: any): FormResponseData {
  return {
    idade: parseInt(profile.personal?.age) || undefined,
    profissao: profile.personal?.profession || undefined,
    renda_atual: parseFloat(profile.personal?.currentIncome?.replace(/[^\d.,]/g, '').replace(',', '.')) || parseFloat(profile.financial?.monthlyIncome?.replace(/[^\d.,]/g, '').replace(',', '.')) || undefined,
    meta_renda: parseFloat(profile.personal?.incomeGoal?.replace(/[^\d.,]/g, '').replace(',', '.')) || undefined,
    horario_inicio: profile.personal?.workStartTime || undefined,
    horario_fim: profile.personal?.workEndTime || undefined,
    frequencia_treino: parseInt(profile.physical?.trainingFrequency?.replace(/[^\d]/g, '')) || undefined,
    objetivo_fisico: profile.physical?.objective || undefined,
    nivel_foco: profile.mental?.focusLevel || undefined,
    horas_redes_sociais: parseInt(profile.mental?.socialMediaHours) || undefined,
    disciplina: profile.mental?.disciplineLevel || undefined,
    faturamento: parseFloat(profile.entrepreneur?.monthlyRevenue?.replace(/[^\d.,]/g, '').replace(',', '.')) || undefined,
    margem: parseFloat(profile.entrepreneur?.margin?.replace(/[^\d.,]/g, '').replace(',', '.')) || undefined,
    modo_empresario: profile.entrepreneur?.enabled || false,
  };
}

/**
 * Save form responses to the database
 */
export async function saveFormResponse(userId: string, data: FormResponseData): Promise<string | null> {
  const { data: result, error } = await supabase
    .from('form_responses')
    .insert({
      user_id: userId,
      ...data,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error saving form response:', error);
    return null;
  }
  return result.id;
}

/**
 * Evaluate a single rule against form response data
 */
function evaluateRule(rule: ProtocolRule, data: FormResponseData): boolean {
  const campo = rule.campo as keyof FormResponseData;
  const rawValue = data[campo];

  if (rawValue === undefined || rawValue === null) return false;

  // For string comparison (like objetivo_fisico)
  if (rule.operador === '=') {
    return String(rawValue).toLowerCase() === rule.valor.toLowerCase();
  }

  // For numeric comparisons
  const numValue = typeof rawValue === 'number' ? rawValue : parseFloat(String(rawValue));
  const ruleValue = parseFloat(rule.valor);

  if (isNaN(numValue) || isNaN(ruleValue)) return false;

  switch (rule.operador) {
    case '>': return numValue > ruleValue;
    case '<': return numValue < ruleValue;
    case '>=': return numValue >= ruleValue;
    case '<=': return numValue <= ruleValue;
    default: return false;
  }
}

/**
 * Fetch rules and blocks, evaluate, and generate protocol
 */
export async function generateRuleBasedProtocol(
  userId: string,
  responseId: string,
  formData: FormResponseData
): Promise<GeneratedProtocolResult | null> {
  // 1. Fetch all active blocks and rules
  const [blocksRes, rulesRes] = await Promise.all([
    supabase.from('protocol_blocks').select('*').eq('ativo', true),
    supabase.from('protocol_rules').select('*'),
  ]);

  if (blocksRes.error || rulesRes.error) {
    console.error('Error fetching blocks/rules:', blocksRes.error, rulesRes.error);
    return null;
  }

  const blocks = blocksRes.data as ProtocolBlock[];
  const rules = rulesRes.data as ProtocolRule[];

  // 2. Evaluate rules against form data
  const activatedBlockIds = new Set<string>();

  for (const rule of rules) {
    if (evaluateRule(rule, formData)) {
      activatedBlockIds.add(rule.block_id);
    }
  }

  // Filter entrepreneur blocks if not enabled
  const activatedBlocks = blocks
    .filter(b => activatedBlockIds.has(b.id))
    .filter(b => b.categoria !== 'empresario' || formData.modo_empresario)
    .sort((a, b) => a.prioridade - b.prioridade);

  // 3. Save generated protocol
  const { data: protocolData, error: protocolError } = await supabase
    .from('generated_protocols')
    .insert({ user_id: userId, response_id: responseId })
    .select('id')
    .single();

  if (protocolError || !protocolData) {
    console.error('Error creating protocol:', protocolError);
    return null;
  }

  // 4. Save protocol items
  if (activatedBlocks.length > 0) {
    const items = activatedBlocks.map(b => ({
      protocol_id: protocolData.id,
      block_id: b.id,
    }));

    const { error: itemsError } = await supabase
      .from('protocol_items')
      .insert(items);

    if (itemsError) {
      console.error('Error saving protocol items:', itemsError);
    }
  }

  return {
    protocolId: protocolData.id,
    blocks: activatedBlocks,
    responseId,
  };
}

/**
 * Load the most recent generated protocol for a user
 */
export async function loadLatestProtocol(userId: string): Promise<{
  blocks: ProtocolBlock[];
  formData: FormResponseData;
  createdAt: string;
} | null> {
  // Get latest protocol
  const { data: protocol, error: protocolError } = await supabase
    .from('generated_protocols')
    .select('id, response_id, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (protocolError || !protocol) return null;

  // Get protocol items with block details
  const { data: items, error: itemsError } = await supabase
    .from('protocol_items')
    .select('block_id')
    .eq('protocol_id', protocol.id);

  if (itemsError) return null;

  const blockIds = items?.map(i => i.block_id) || [];

  // Get blocks
  let blocks: ProtocolBlock[] = [];
  if (blockIds.length > 0) {
    const { data: blockData } = await supabase
      .from('protocol_blocks')
      .select('*')
      .in('id', blockIds);
    blocks = (blockData as ProtocolBlock[]) || [];
    blocks.sort((a, b) => a.prioridade - b.prioridade);
  }

  // Get form response
  const { data: formResponse } = await supabase
    .from('form_responses')
    .select('*')
    .eq('id', protocol.response_id)
    .single();

  return {
    blocks,
    formData: formResponse as unknown as FormResponseData,
    createdAt: protocol.created_at,
  };
}
