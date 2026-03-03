import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore, type UserProfile } from '@/store/useAppStore';
import { generateProtocol } from '@/lib/protocolEngine';
import {
  Clock, Calendar, Dumbbell, Apple, DollarSign, Briefcase, BookOpen,
  Target, ChevronDown, ChevronUp, AlertTriangle, CheckCircle, ArrowRight,
  User, Brain, TrendingUp, Zap, Shield, LogOut
} from 'lucide-react';

type Section = 'summary' | 'actions' | 'timeline' | 'details';

const Protocol = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const storeProfile = useAppStore((s) => s.profile);
  const [dbProfile, setDbProfile] = useState<UserProfile | null>(null);
  const [loadingDB, setLoadingDB] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<Section>('summary');
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(0);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(0);

  // Fetch profile from Supabase
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoadingDB(false);
        return;
      }
      try {
        const { data, error: fetchError } = await supabase
          .from('profiles')
          .select('profile_data, has_completed_onboarding')
          .eq('id', user.id)
          .maybeSingle();

        if (fetchError) throw fetchError;

        if (data?.profile_data) {
          setDbProfile(data.profile_data as unknown as UserProfile);
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar perfil');
      } finally {
        setLoadingDB(false);
      }
    };
    if (!authLoading) fetchProfile();
  }, [user, authLoading]);

  // Use DB profile first, fallback to store
  const profile = dbProfile || storeProfile;

  const protocol = useMemo(() => {
    if (!profile) return null;
    return generateProtocol(profile);
  }, [profile]);

  if (authLoading || loadingDB) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Gerando seu protocolo...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-lg font-bold mb-2">Erro ao carregar dados</h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <button onClick={() => navigate('/onboarding')} className="px-6 py-3 bg-primary text-primary-foreground text-sm font-display tracking-widest uppercase">
            Refazer Onboarding
          </button>
        </div>
      </div>
    );
  }

  if (!profile || !protocol) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-lg font-bold mb-2">Dados ausentes</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Não encontramos dados do seu formulário. Complete o onboarding para gerar seu protocolo personalizado.
          </p>
          <button onClick={() => navigate('/onboarding')} className="px-6 py-3 bg-primary text-primary-foreground text-sm font-display tracking-widest uppercase">
            Iniciar Onboarding
          </button>
        </div>
      </div>
    );
  }

  const sections: { id: Section; label: string; icon: React.ReactNode }[] = [
    { id: 'summary', label: 'Resumo', icon: <User className="w-4 h-4" /> },
    { id: 'actions', label: 'Ações', icon: <Target className="w-4 h-4" /> },
    { id: 'timeline', label: 'Linha do Tempo', icon: <Clock className="w-4 h-4" /> },
    { id: 'details', label: 'Detalhes', icon: <BookOpen className="w-4 h-4" /> },
  ];

  // Parse numeric values
  const weight = parseFloat(profile.physical.weight) || 0;
  const height = parseFloat(profile.physical.height) || 0;
  const income = parseFloat(profile.financial.monthlyIncome) || 0;
  const incomeGoal = parseFloat(profile.personal.incomeGoal) || 0;
  const sleepHours = parseFloat(profile.mental.avgSleepHours) || 0;
  const socialMediaHours = parseFloat(profile.mental.socialMediaHours) || 0;

  // Compute warnings for missing data
  const missingFields: string[] = [];
  if (!profile.personal.age) missingFields.push('Idade');
  if (!profile.physical.weight) missingFields.push('Peso');
  if (!profile.physical.height) missingFields.push('Altura');
  if (!profile.financial.monthlyIncome) missingFields.push('Renda mensal');

  // Generate prioritized actions based on profile
  const actions: { text: string; priority: 'alta' | 'média' | 'baixa'; category: string; icon: React.ReactNode }[] = [];

  // Sleep
  if (sleepHours < 7) {
    actions.push({ text: `Aumentar sono de ${sleepHours}h para pelo menos 7h — impacto direto em foco e recuperação muscular`, priority: 'alta', category: 'Mental', icon: <Brain className="w-4 h-4" /> });
  }
  // Social media
  if (socialMediaHours > 3) {
    actions.push({ text: `Reduzir redes sociais de ${socialMediaHours}h/dia para no máximo 1h — usar Cold Turkey para bloqueio`, priority: 'alta', category: 'Mental', icon: <Shield className="w-4 h-4" /> });
  }
  // Porn
  if (profile.mental.pornConsumption === 'sim') {
    actions.push({ text: 'Eliminar consumo de pornografia — Ref: efeitos na dopamina e motivação (Huberman Lab)', priority: 'alta', category: 'Mental', icon: <Brain className="w-4 h-4" /> });
  }
  // Focus
  if (profile.mental.focusLevel < 6) {
    actions.push({ text: `Nível de foco em ${profile.mental.focusLevel}/10 — implementar blocos de Deep Work de 90 min com timer`, priority: 'alta', category: 'Produtividade', icon: <Zap className="w-4 h-4" /> });
  }
  // Income gap
  if (incomeGoal > 0 && income > 0 && incomeGoal > income * 1.5) {
    actions.push({ text: `Gap de renda: R$ ${income.toLocaleString('pt-BR')} → R$ ${incomeGoal.toLocaleString('pt-BR')} — ${protocol.financialProtocol.incomeStrategy}`, priority: 'alta', category: 'Financeiro', icon: <DollarSign className="w-4 h-4" /> });
  }
  // Training
  actions.push({ text: `Seguir protocolo de treino Low Volume (${profile.physical.objective}) — 4x/semana, 30-40 min`, priority: 'alta', category: 'Físico', icon: <Dumbbell className="w-4 h-4" /> });
  // Nutrition
  actions.push({ text: `Seguir plano nutricional: ${protocol.nutritionPlan.dailyCalories} kcal/dia — ${protocol.nutritionPlan.macros.protein}g proteína`, priority: 'alta', category: 'Nutrição', icon: <Apple className="w-4 h-4" /> });
  // Discipline
  if (profile.mental.disciplineLevel < 6) {
    actions.push({ text: 'Implementar sistema de metas diárias com checklist — acessar aba Metas', priority: 'média', category: 'Hábitos', icon: <Target className="w-4 h-4" /> });
  }
  // Reading
  if (!profile.mental.readingFrequency || profile.mental.readingFrequency === '0') {
    actions.push({ text: 'Iniciar hábito de leitura estratégica — mínimo 30 min/dia (ver Biblioteca)', priority: 'média', category: 'Desenvolvimento', icon: <BookOpen className="w-4 h-4" /> });
  }
  // Entrepreneur
  if (profile.entrepreneur.enabled) {
    actions.push({ text: `Modo Empresário ativo — foco no gargalo: ${profile.entrepreneur.mainBottleneck || 'indefinido'}`, priority: 'alta', category: 'Negócio', icon: <Briefcase className="w-4 h-4" /> });
  }
  // Financial skills
  protocol.financialProtocol.skills.forEach(s => {
    actions.push({ text: `Desenvolver: ${s}`, priority: 'média', category: 'Habilidades', icon: <TrendingUp className="w-4 h-4" /> });
  });

  // Sort by priority
  const priorityOrder = { alta: 0, média: 1, baixa: 2 };
  actions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  const priorityColor = (p: string) =>
    p === 'alta' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
    p === 'média' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
    'bg-muted text-muted-foreground border-border';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <span className="font-display text-lg font-bold tracking-widest">KOR</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display">
            <ArrowRight className="w-4 h-4" /> Dashboard Completo
          </button>
          {user && (
            <button onClick={signOut} className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-destructive transition-colors font-display">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 md:px-12 py-10 border-b border-border">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-2">Protocolo gerado com base nas suas respostas</p>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
            Seu <span className="text-gradient-gold">Protocolo</span> Personalizado
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Cada recomendação abaixo foi gerada exclusivamente com base nos dados que você forneceu.
            Nenhum conteúdo genérico ou inventado — apenas lógica condicional aplicada ao seu perfil.
          </p>
        </motion.div>
      </div>

      {/* Missing data warning */}
      {missingFields.length > 0 && (
        <div className="px-6 md:px-12 py-4 bg-yellow-500/5 border-b border-yellow-500/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-yellow-400">Dados ausentes detectados</p>
              <p className="text-xs text-muted-foreground mt-1">
                Os seguintes campos não foram preenchidos: <span className="text-foreground">{missingFields.join(', ')}</span>.
                Os cálculos podem ser imprecisos. <button onClick={() => navigate('/onboarding')} className="underline text-foreground hover:text-yellow-400">Completar dados →</button>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Section Tabs */}
      <div className="border-b border-border px-6 md:px-12 flex gap-0 overflow-x-auto">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-2 px-6 py-4 text-xs tracking-widest uppercase font-display transition-colors border-b-2 whitespace-nowrap ${
              activeSection === s.id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {s.icon} {s.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 py-8 max-w-5xl">
        <motion.div key={activeSection} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* ===== SUMMARY ===== */}
          {activeSection === 'summary' && (
            <div className="space-y-8">
              {/* Profile Overview Cards */}
              <div>
                <h2 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                  <User className="w-4 h-4" /> Resumo do Perfil
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Personal */}
                  <div className="glass-card p-5">
                    <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">Pessoal</p>
                    <div className="space-y-2 text-sm">
                      {profile.personal.age && <p><span className="text-muted-foreground">Idade:</span> {profile.personal.age} anos</p>}
                      {profile.personal.profession && <p><span className="text-muted-foreground">Profissão:</span> {profile.personal.profession}</p>}
                      {profile.personal.city && <p><span className="text-muted-foreground">Cidade:</span> {profile.personal.city}</p>}
                      {profile.personal.maritalStatus && <p><span className="text-muted-foreground">Estado civil:</span> <span className="capitalize">{profile.personal.maritalStatus}</span></p>}
                      {profile.personal.workType && <p><span className="text-muted-foreground">Trabalho:</span> <span className="capitalize">{profile.personal.workType}</span> ({profile.personal.workStartTime}–{profile.personal.workEndTime})</p>}
                    </div>
                  </div>

                  {/* Physical */}
                  <div className="glass-card p-5">
                    <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">Físico</p>
                    <div className="space-y-2 text-sm">
                      {weight > 0 && <p><span className="text-muted-foreground">Peso:</span> {weight}kg</p>}
                      {height > 0 && <p><span className="text-muted-foreground">Altura:</span> {height}cm</p>}
                      {profile.physical.bodyFat && <p><span className="text-muted-foreground">Gordura:</span> {profile.physical.bodyFat}%</p>}
                      <p><span className="text-muted-foreground">Objetivo:</span> <span className="capitalize">{profile.physical.objective}</span></p>
                      {profile.physical.injuries && profile.physical.injuries.toLowerCase() !== 'nenhuma' && (
                        <p className="text-yellow-500"><span className="text-muted-foreground">Lesões:</span> {profile.physical.injuries}</p>
                      )}
                    </div>
                  </div>

                  {/* Mental */}
                  <div className="glass-card p-5">
                    <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">Mental</p>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Foco:</span> {profile.mental.focusLevel}/10</p>
                      <p><span className="text-muted-foreground">Disciplina:</span> {profile.mental.disciplineLevel}/10</p>
                      {sleepHours > 0 && <p><span className="text-muted-foreground">Sono:</span> {sleepHours}h/noite {sleepHours < 7 ? '⚠️' : '✅'}</p>}
                      {socialMediaHours > 0 && <p><span className="text-muted-foreground">Redes sociais:</span> {socialMediaHours}h/dia {socialMediaHours > 3 ? '⚠️' : '✅'}</p>}
                    </div>
                  </div>

                  {/* Financial */}
                  <div className="glass-card p-5">
                    <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">Financeiro</p>
                    <div className="space-y-2 text-sm">
                      {income > 0 && <p><span className="text-muted-foreground">Renda:</span> R$ {income.toLocaleString('pt-BR')}</p>}
                      {incomeGoal > 0 && <p><span className="text-muted-foreground">Meta:</span> R$ {incomeGoal.toLocaleString('pt-BR')}</p>}
                      {profile.financial.employmentType && <p><span className="text-muted-foreground">Vínculo:</span> <span className="uppercase">{profile.financial.employmentType}</span></p>}
                    </div>
                  </div>

                  {/* Nutrition Overview */}
                  <div className="glass-card p-5">
                    <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">Nutrição</p>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Calorias:</span> {protocol.nutritionPlan.dailyCalories} kcal/dia</p>
                      <p><span className="text-muted-foreground">Proteína:</span> {protocol.nutritionPlan.macros.protein}g</p>
                      <p><span className="text-muted-foreground">Carbos:</span> {protocol.nutritionPlan.macros.carbs}g</p>
                      <p><span className="text-muted-foreground">Gorduras:</span> {protocol.nutritionPlan.macros.fat}g</p>
                    </div>
                  </div>

                  {/* Ambition */}
                  <div className="glass-card p-5">
                    <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">Ambição & Fraqueza</p>
                    <div className="space-y-2 text-sm">
                      {profile.personal.biggestAmbition && <p><span className="text-muted-foreground">🎯 Ambição:</span> {profile.personal.biggestAmbition}</p>}
                      {profile.personal.biggestWeakness && <p><span className="text-muted-foreground">⚡ Fraqueza:</span> {profile.personal.biggestWeakness}</p>}
                      {profile.personal.mainDistractions && <p><span className="text-muted-foreground">📱 Distrações:</span> {profile.personal.mainDistractions}</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 glass-card">
                  <p className="text-2xl font-display font-bold">{protocol.nutritionPlan.dailyCalories}</p>
                  <p className="text-xs text-muted-foreground mt-1">kcal/dia</p>
                </div>
                <div className="text-center p-4 glass-card">
                  <p className="text-2xl font-display font-bold">{protocol.workoutPlan.filter(d => d.exercises.length > 1).length}x</p>
                  <p className="text-xs text-muted-foreground mt-1">treinos/semana</p>
                </div>
                <div className="text-center p-4 glass-card">
                  <p className="text-2xl font-display font-bold">{protocol.nutritionPlan.meals.length}</p>
                  <p className="text-xs text-muted-foreground mt-1">refeições/dia</p>
                </div>
                <div className="text-center p-4 glass-card">
                  <p className="text-2xl font-display font-bold">{actions.filter(a => a.priority === 'alta').length}</p>
                  <p className="text-xs text-muted-foreground mt-1">ações prioritárias</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== ACTIONS ===== */}
          {activeSection === 'actions' && (
            <div className="space-y-6">
              <div>
                <h2 className="font-display font-semibold text-sm tracking-wider uppercase mb-1 flex items-center gap-2">
                  <Target className="w-4 h-4" /> Plano de Ação Personalizado
                </h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Ações geradas com base nas suas respostas — priorizadas por impacto.
                </p>
              </div>

              {actions.map((action, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-5 flex items-start gap-4"
                >
                  <div className="mt-0.5 shrink-0">{action.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-2 py-0.5 text-xs border rounded ${priorityColor(action.priority)}`}>
                        {action.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">{action.category}</span>
                    </div>
                    <p className="text-sm">{action.text}</p>
                  </div>
                </motion.div>
              ))}

              {/* Strategy blocks */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
                <div className="glass-card p-5">
                  <h3 className="font-display font-semibold text-xs tracking-wider uppercase mb-2 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" /> Estratégia Financeira
                  </h3>
                  <p className="text-sm text-muted-foreground">{protocol.financialProtocol.incomeStrategy}</p>
                </div>
                <div className="glass-card p-5">
                  <h3 className="font-display font-semibold text-xs tracking-wider uppercase mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" /> Investimentos
                  </h3>
                  <p className="text-sm text-muted-foreground">{protocol.financialProtocol.investmentStrategy}</p>
                </div>
              </div>
            </div>
          )}

          {/* ===== TIMELINE ===== */}
          {activeSection === 'timeline' && (
            <div className="space-y-8">
              <div>
                <h2 className="font-display font-semibold text-sm tracking-wider uppercase mb-1 flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Sua Rotina Diária
                </h2>
                <p className="text-xs text-muted-foreground mb-6">
                  Cronograma calculado com base no seu horário de trabalho ({profile.personal.workStartTime}–{profile.personal.workEndTime})
                  e preferência de treino ({profile.personal.preferredTrainingTime === 'manha' ? 'manhã' : profile.personal.preferredTrainingTime}).
                </p>
              </div>

              {/* Timeline visual */}
              <div className="relative">
                <div className="absolute left-[27px] top-0 bottom-0 w-px bg-border" />
                {protocol.dailyProtocol.map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 py-3 relative"
                  >
                    <div className="w-14 text-right shrink-0">
                      <span className="text-xs font-display font-semibold text-muted-foreground">{item.time}</span>
                    </div>
                    <div className="w-3 h-3 rounded-full bg-border border-2 border-background shrink-0 z-10" />
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm">{item.activity}</span>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Weekly overview */}
              <div className="mt-10">
                <h2 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Visão Semanal
                </h2>
                <div className="grid gap-3">
                  {protocol.weeklyProtocol.map((item, i) => (
                    <div key={i} className="glass-card p-5">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-display font-semibold text-sm tracking-wider uppercase">{item.day}</h3>
                        <span className="text-xs text-muted-foreground">{item.focus}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ===== DETAILS ===== */}
          {activeSection === 'details' && (
            <div className="space-y-10">
              {/* Workout preview */}
              <div>
                <h2 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" /> Treino — Low Volume ({profile.physical.objective})
                </h2>
                <div className="space-y-3">
                  {protocol.workoutPlan.map((day, i) => (
                    <div key={i} className="glass-card overflow-hidden">
                      <button
                        onClick={() => setExpandedWorkout(expandedWorkout === i ? null : i)}
                        className="w-full p-5 flex items-center justify-between text-left"
                      >
                        <div>
                          <span className="text-xs text-muted-foreground font-display tracking-wider uppercase">{day.day}</span>
                          <h3 className="font-display font-semibold text-sm mt-1">{day.focus}</h3>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground">{day.duration}</span>
                          {expandedWorkout === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>
                      {expandedWorkout === i && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border">
                          <div className="px-5 py-3 bg-secondary/30">
                            <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Aquecimento:</span> {day.warmup}</p>
                          </div>
                          <div className="divide-y divide-border">
                            {day.exercises.map((ex, j) => (
                              <div key={j} className="px-5 py-3 flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{ex.name}</p>
                                  {ex.notes && <p className="text-xs text-muted-foreground mt-1">{ex.notes}</p>}
                                </div>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground whitespace-nowrap">
                                  <span>{ex.sets}x{ex.reps}</span>
                                  {ex.rest !== '-' && <span className="px-2 py-0.5 bg-secondary border border-border">{ex.rest}</span>}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="px-5 py-3 bg-secondary/30">
                            <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Volta à calma:</span> {day.cooldown}</p>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition preview */}
              <div>
                <h2 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                  <Apple className="w-4 h-4" /> Plano Nutricional
                </h2>
                <div className="glass-card p-5 mb-4">
                  <p className="text-sm text-muted-foreground mb-3">{protocol.nutritionPlan.goal}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="text-center p-3 bg-secondary/50 border border-border">
                      <p className="text-lg font-display font-bold">{protocol.nutritionPlan.dailyCalories}</p>
                      <p className="text-xs text-muted-foreground">kcal/dia</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 border border-border">
                      <p className="text-lg font-display font-bold">{protocol.nutritionPlan.macros.protein}g</p>
                      <p className="text-xs text-muted-foreground">Proteína</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 border border-border">
                      <p className="text-lg font-display font-bold">{protocol.nutritionPlan.macros.carbs}g</p>
                      <p className="text-xs text-muted-foreground">Carboidratos</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 border border-border">
                      <p className="text-lg font-display font-bold">{protocol.nutritionPlan.macros.fat}g</p>
                      <p className="text-xs text-muted-foreground">Gorduras</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">💧 {protocol.nutritionPlan.hydration}</p>
                </div>

                {/* Meals */}
                <div className="space-y-3">
                  {protocol.nutritionPlan.meals.map((meal, i) => (
                    <div key={i} className="glass-card overflow-hidden">
                      <button
                        onClick={() => setExpandedMeal(expandedMeal === i ? null : i)}
                        className="w-full p-5 flex items-center justify-between text-left"
                      >
                        <div>
                          <span className="text-xs text-muted-foreground">{meal.time}</span>
                          <h4 className="font-display font-semibold text-sm mt-1">{meal.name}</h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className="text-sm font-display font-bold">{meal.totalCalories} kcal</span>
                            <p className="text-xs text-muted-foreground">{meal.totalProtein}g prot</p>
                          </div>
                          {expandedMeal === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>
                      {expandedMeal === i && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border divide-y divide-border">
                          {meal.foods.map((food, j) => (
                            <div key={j} className="px-5 py-3 flex items-center justify-between gap-4 text-sm">
                              <span className="flex-1">{food.item}</span>
                              <span className="text-xs text-muted-foreground">{food.quantity}</span>
                              <span className="text-xs w-14 text-right">{food.calories} kcal</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="glass-card p-6 text-center">
                <p className="text-sm text-muted-foreground mb-4">Acesse o dashboard completo para ver todas as abas, gráficos financeiros e modo empresário.</p>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-8 py-3 bg-primary text-primary-foreground text-sm font-display tracking-widest uppercase hover:bg-primary/90 transition-colors"
                >
                  Ir para o Dashboard →
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Protocol;
