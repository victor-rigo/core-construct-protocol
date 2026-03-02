import { create } from 'zustand';
import { supabase } from '@/integrations/supabase/client';

export interface PersonalProfile {
  age: string;
  profession: string;
  maritalStatus: string;
  city: string;
  currentIncome: string;
  incomeGoal: string;
  currentRoutine: string;
  mainDistractions: string;
  biggestWeakness: string;
  biggestAmbition: string;
  workStartTime: string;
  workEndTime: string;
  workType: string;
  preferredTrainingTime: string;
}

export interface PhysicalProfile {
  weight: string;
  height: string;
  bodyFat: string;
  trainingFrequency: string;
  injuries: string;
  objective: string;
}

export interface MentalProfile {
  focusLevel: number;
  avgSleepHours: string;
  socialMediaHours: string;
  pornConsumption: string;
  readingFrequency: string;
  disciplineLevel: number;
}

export interface FinancialProfile {
  monthlyIncome: string;
  incomeSource: string;
  employmentType: string;
  debts: string;
  investments: string;
  marketingKnowledge: string;
  expenseHousing: string;
  expenseFood: string;
  expenseTransport: string;
  expenseHealth: string;
  expenseEducation: string;
  expenseLeisure: string;
  expenseSubscriptions: string;
  expenseOther: string;
  expenseToImprove: string;
}

export interface EntrepreneurProfile {
  enabled: boolean;
  monthlyRevenue: string;
  margin: string;
  businessModel: string;
  hasTeam: string;
  mainBottleneck: string;
  acquisitionChannel: string;
  paidTrafficKnowledge: string;
}

export interface UserProfile {
  personal: PersonalProfile;
  physical: PhysicalProfile;
  mental: MentalProfile;
  financial: FinancialProfile;
  entrepreneur: EntrepreneurProfile;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  type: 'daily' | 'weekly' | 'monthly' | 'annual';
}

interface AppState {
  profile: UserProfile | null;
  goals: Goal[];
  hasCompletedOnboarding: boolean;
  setProfile: (profile: UserProfile) => void;
  setHasCompletedOnboarding: (value: boolean) => void;
  addGoal: (goal: Goal) => void;
  toggleGoal: (id: string) => void;
  removeGoal: (id: string) => void;
  saveProfileToDB: (userId: string) => Promise<void>;
}

const defaultGoals: Goal[] = [
  { id: '1', text: 'Acordar no horário do protocolo', completed: false, type: 'daily' },
  { id: '2', text: 'Completar bloco de foco profundo', completed: false, type: 'daily' },
  { id: '3', text: 'Treino realizado', completed: false, type: 'daily' },
  { id: '4', text: 'Leitura estratégica (30 min)', completed: false, type: 'daily' },
  { id: '5', text: 'Zero redes sociais fora do horário', completed: false, type: 'daily' },
  { id: '6', text: 'Revisão semanal de metas', completed: false, type: 'weekly' },
  { id: '7', text: 'Ajuste estratégico do plano', completed: false, type: 'weekly' },
  { id: '8', text: 'Análise de evolução financeira', completed: false, type: 'monthly' },
  { id: '9', text: 'Corte de 1 distração permanente', completed: false, type: 'monthly' },
  { id: '10', text: 'Atingir meta de renda anual', completed: false, type: 'annual' },
];

export const useAppStore = create<AppState>((set) => ({
  profile: null,
  goals: defaultGoals,
  hasCompletedOnboarding: false,
  setProfile: (profile) => set({ profile }),
  setHasCompletedOnboarding: (value) => set({ hasCompletedOnboarding: value }),
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  toggleGoal: (id) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g)),
    })),
  removeGoal: (id) => set((state) => ({ goals: state.goals.filter((g) => g.id !== id) })),
  saveProfileToDB: async (userId: string) => {
    const state = useAppStore.getState();
    if (!state.profile) return;
    await supabase.from('profiles').update({
      profile_data: state.profile as any,
      has_completed_onboarding: true,
    }).eq('id', userId);
  },
}));
