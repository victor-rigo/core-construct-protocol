import { supabase } from '@/integrations/supabase/client';
import type { UserProfile } from '@/store/useAppStore';

export interface AIProtocolData {
  routine: {
    dailyProtocol: { time: string; activity: string; icon: string }[];
    weeklyProtocol: { day: string; focus: string; detail: string }[];
    alerts: { type: string; title: string; description: string }[];
  };
  physical: {
    workoutPlan: {
      day: string;
      focus: string;
      warmup: string;
      duration: string;
      cooldown: string;
      exercises: { name: string; sets: number; reps: string; rest: string; notes?: string }[];
    }[];
    alerts: { type: string; title: string; description: string }[];
  };
  nutrition: {
    goal: string;
    dailyCalories: number;
    macros: { protein: number; carbs: number; fat: number };
    meals: {
      name: string;
      time: string;
      foods: { item: string; quantity: string; calories: number; protein: number; carbs: number; fat: number; alternative?: string }[];
      totalCalories: number;
      totalProtein: number;
    }[];
    hydration: {
      currentIntake: string;
      recommendedLiters: number;
      recommendedMl: number;
      difference: string;
    };
    supplements: { name: string; dosage: string; timing: string; reference: string }[];
    alerts: { type: string; title: string; description: string }[];
  };
  financial: {
    diagnosis: {
      income: number;
      totalExpenses: number;
      savings: number;
      savingsRate: string;
      debts?: number;
      investments?: number;
    };
    expenseBreakdown: { category: string; label: string; amount: number; percentage: string; recommendation?: string }[];
    incomeStrategy: string;
    skills: string[];
    investmentStrategy: string;
    monetization: string;
    alerts: { type: string; title: string; description: string }[];
  };
  entrepreneur: {
    enabled: boolean;
    financialDiagnosis?: { metric: string; value: string; status: 'good' | 'warning' | 'critical' }[];
    marginScenarios?: { scenario: string; newMargin: string; monthlyProfit: string; annualProfit: string; gain: string }[];
    acquisitionMetrics?: { channel: string; estimatedCAC: string; ltv: string; ltvCacRatio: string; status: 'good' | 'warning' | 'critical' }[];
    funnelStages?: { stage: string; conversionRate: string; volumeNeeded: string; benchmark: string; status: 'good' | 'warning' | 'critical' }[];
    scaleActions?: { action: string; impact: string; deadline: string; priority: number }[];
    kpiTargets?: { kpi: string; current: string; optimized: string; benchmark: string; status: 'good' | 'warning' | 'critical' }[];
    alerts?: { type: string; title: string; description: string }[];
  };
  overview: {
    summary: string;
    priorityActions: { action: string; category: string; priority: number }[];
    missingFields: string[];
  };
}

export async function generateAIProtocol(profile: UserProfile): Promise<AIProtocolData | null> {
  const { data, error } = await supabase.functions.invoke('generate-protocol', {
    body: { profile },
  });

  if (error) {
    console.error('Error calling generate-protocol:', error);
    return null;
  }

  if (data?.error) {
    console.error('AI protocol error:', data.error);
    return null;
  }

  return data?.protocol || null;
}

export async function saveAIProtocol(userId: string, responseId: string, protocolData: AIProtocolData): Promise<string | null> {
  const { data, error } = await supabase
    .from('generated_protocols')
    .insert({
      user_id: userId,
      response_id: responseId,
      ai_protocol_data: protocolData as any,
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error saving AI protocol:', error);
    return null;
  }
  return data.id;
}

export async function loadLatestAIProtocol(userId: string): Promise<{
  protocolData: AIProtocolData;
  createdAt: string;
} | null> {
  const { data, error } = await supabase
    .from('generated_protocols')
    .select('id, ai_protocol_data, created_at')
    .eq('user_id', userId)
    .not('ai_protocol_data', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data || !data.ai_protocol_data) return null;

  return {
    protocolData: data.ai_protocol_data as unknown as AIProtocolData,
    createdAt: data.created_at,
  };
}
