import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
import {
  loadLatestProtocol,
  mapProfileToFormResponse,
  saveFormResponse,
  generateRuleBasedProtocol,
  type ProtocolBlock,
  type FormResponseData,
} from '@/lib/protocolRuleEngine';
import { generateProtocol } from '@/lib/protocolEngine';
import {
  Clock, Dumbbell, Apple, DollarSign, Briefcase,
  AlertTriangle, ArrowRight, LogOut, Target, Shield, Brain,
  Zap, BookOpen, TrendingUp, ChevronDown, ChevronUp, CheckCircle,
  User, Calendar
} from 'lucide-react';

const categoriaLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  rotina: { label: 'Rotina & Hábitos', icon: <Clock className="w-5 h-5" />, color: 'border-blue-500/30 bg-blue-500/5' },
  fisico: { label: 'Físico & Treino', icon: <Dumbbell className="w-5 h-5" />, color: 'border-emerald-500/30 bg-emerald-500/5' },
  financeiro: { label: 'Financeiro', icon: <DollarSign className="w-5 h-5" />, color: 'border-amber-500/30 bg-amber-500/5' },
  empresario: { label: 'Modo Empresário', icon: <Briefcase className="w-5 h-5" />, color: 'border-purple-500/30 bg-purple-500/5' },
};

const Protocol = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const storeProfile = useAppStore((s) => s.profile);

  const [blocks, setBlocks] = useState<ProtocolBlock[]>([]);
  const [formData, setFormData] = useState<FormResponseData | null>(null);
  const [protocolDate, setProtocolDate] = useState<string>('');
  const [loadingProtocol, setLoadingProtocol] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'protocol' | 'routine' | 'details'>('protocol');
  const [expandedCategoria, setExpandedCategoria] = useState<string | null>('rotina');

  useEffect(() => {
    const loadOrGenerate = async () => {
      if (!user) {
        setLoadingProtocol(false);
        return;
      }

      try {
        // Try to load existing protocol
        const existing = await loadLatestProtocol(user.id);

        if (existing && existing.blocks.length > 0) {
          setBlocks(existing.blocks);
          setFormData(existing.formData);
          setProtocolDate(existing.createdAt);
          setLoadingProtocol(false);
          return;
        }

        // No existing protocol — generate from store profile
        if (storeProfile) {
          const mapped = mapProfileToFormResponse(storeProfile);
          const responseId = await saveFormResponse(user.id, mapped);

          if (responseId) {
            const result = await generateRuleBasedProtocol(user.id, responseId, mapped);
            if (result) {
              setBlocks(result.blocks);
              setFormData(mapped);
              setProtocolDate(new Date().toISOString());
            }
          }
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar protocolo');
      } finally {
        setLoadingProtocol(false);
      }
    };

    if (!authLoading) loadOrGenerate();
  }, [user, authLoading, storeProfile]);

  // Also compute the detailed protocol (workout, nutrition, etc.) from protocolEngine
  const profile = storeProfile;
  const detailedProtocol = profile ? generateProtocol(profile) : null;

  if (authLoading || loadingProtocol) {
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
          <h2 className="font-display text-lg font-bold mb-2">Erro ao carregar protocolo</h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <button onClick={() => navigate('/onboarding')} className="px-6 py-3 bg-primary text-primary-foreground text-sm font-display tracking-widest uppercase">
            Refazer Onboarding
          </button>
        </div>
      </div>
    );
  }

  if (blocks.length === 0 && !detailedProtocol) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-lg font-bold mb-2">Nenhum protocolo encontrado</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Complete o onboarding para gerar seu protocolo personalizado baseado nas suas respostas.
          </p>
          <button onClick={() => navigate('/onboarding')} className="px-6 py-3 bg-primary text-primary-foreground text-sm font-display tracking-widest uppercase">
            Iniciar Onboarding
          </button>
        </div>
      </div>
    );
  }

  // Group blocks by category
  const blocksByCategory = blocks.reduce((acc, block) => {
    if (!acc[block.categoria]) acc[block.categoria] = [];
    acc[block.categoria].push(block);
    return acc;
  }, {} as Record<string, ProtocolBlock[]>);

  const categories = Object.keys(blocksByCategory);

  const tabs = [
    { id: 'protocol' as const, label: 'Plano de Ação', icon: <Target className="w-4 h-4" /> },
    { id: 'routine' as const, label: 'Rotina Diária', icon: <Clock className="w-4 h-4" /> },
    { id: 'details' as const, label: 'Treino & Nutrição', icon: <Dumbbell className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <span className="font-display text-lg font-bold tracking-widest">KOR</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display">
            <ArrowRight className="w-4 h-4" /> Dashboard
          </button>
          <button onClick={() => navigate('/goals')} className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display">
            <Target className="w-4 h-4" /> Metas
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
          <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-2">
            Protocolo gerado com base nas suas respostas do formulário
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
            Seu <span className="text-gradient-gold">Protocolo</span> Personalizado
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Cada bloco abaixo foi ativado por regras condicionais aplicadas às suas respostas.
            Nenhum conteúdo genérico — apenas blocos ativados quando suas respostas atendem os critérios definidos.
          </p>
          {protocolDate && (
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Gerado em {new Date(protocolDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </motion.div>
      </div>

      {/* Summary bar */}
      {formData && (
        <div className="px-6 md:px-12 py-4 border-b border-border bg-secondary/30">
          <div className="flex flex-wrap gap-4 text-xs">
            {formData.idade && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <User className="w-3 h-3" /> {formData.idade} anos
              </span>
            )}
            {formData.profissao && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Briefcase className="w-3 h-3" /> {formData.profissao}
              </span>
            )}
            {formData.objetivo_fisico && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Dumbbell className="w-3 h-3" /> {formData.objetivo_fisico}
              </span>
            )}
            {formData.renda_atual && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <DollarSign className="w-3 h-3" /> R$ {formData.renda_atual.toLocaleString('pt-BR')}
              </span>
            )}
            {formData.nivel_foco !== undefined && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Brain className="w-3 h-3" /> Foco: {formData.nivel_foco}/10
              </span>
            )}
            {formData.disciplina !== undefined && (
              <span className="flex items-center gap-1 text-muted-foreground">
                <Shield className="w-3 h-3" /> Disciplina: {formData.disciplina}/10
              </span>
            )}
            <span className="flex items-center gap-1 font-medium text-foreground">
              <Zap className="w-3 h-3" /> {blocks.length} blocos ativados
            </span>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-border px-6 md:px-12 flex gap-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-xs tracking-widest uppercase font-display transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 py-8 max-w-5xl">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

          {/* === PROTOCOL TAB === */}
          {activeTab === 'protocol' && (
            <div className="space-y-6">
              {categories.length === 0 ? (
                <div className="glass-card p-8 text-center">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-4" />
                  <h3 className="font-display text-lg font-bold mb-2">Nenhum alerta ativado</h3>
                  <p className="text-sm text-muted-foreground">
                    Suas respostas não ativaram nenhuma regra de alerta. Seu perfil está dentro dos parâmetros ideais.
                  </p>
                </div>
              ) : (
                categories.map((cat) => {
                  const catInfo = categoriaLabels[cat] || { label: cat, icon: <Target className="w-5 h-5" />, color: 'border-border bg-secondary/30' };
                  const isExpanded = expandedCategoria === cat;
                  const catBlocks = blocksByCategory[cat];

                  return (
                    <div key={cat} className={`border rounded-lg overflow-hidden ${catInfo.color}`}>
                      <button
                        onClick={() => setExpandedCategoria(isExpanded ? null : cat)}
                        className="w-full px-6 py-5 flex items-center justify-between text-left"
                      >
                        <div className="flex items-center gap-3">
                          {catInfo.icon}
                          <div>
                            <h3 className="font-display font-semibold text-sm tracking-wider uppercase">{catInfo.label}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{catBlocks.length} {catBlocks.length === 1 ? 'ação recomendada' : 'ações recomendadas'}</p>
                          </div>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                      </button>

                      {isExpanded && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border/50">
                          {catBlocks.map((block, i) => (
                            <div key={block.id} className={`px-6 py-4 ${i < catBlocks.length - 1 ? 'border-b border-border/30' : ''}`}>
                              <div className="flex items-start gap-3">
                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground/10 text-foreground text-xs font-bold mt-0.5 shrink-0">
                                  {block.prioridade}
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold">{block.titulo}</h4>
                                  <p className="text-sm text-muted-foreground mt-1">{block.descricao}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </div>
                  );
                })
              )}

              {/* Data source notice */}
              <div className="p-4 bg-secondary/30 border border-border text-xs text-muted-foreground rounded-lg">
                <p className="font-semibold text-foreground mb-1">🔒 Transparência dos dados</p>
                <p>
                  Este protocolo foi gerado 100% com base nas suas respostas do formulário armazenadas no banco de dados.
                  Cada bloco acima foi ativado por regras condicionais (tabela <code className="text-foreground">protocol_rules</code>)
                  que verificam campos específicos das suas respostas (tabela <code className="text-foreground">form_responses</code>).
                  Nenhum conteúdo foi gerado por IA ou inventado.
                </p>
              </div>
            </div>
          )}

          {/* === ROUTINE TAB === */}
          {activeTab === 'routine' && detailedProtocol && (
            <div className="space-y-1">
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-6">
                Rotina diária calculada com base nos seus horários de trabalho e preferência de treino
              </p>
              {detailedProtocol.dailyProtocol.map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-4 hover:bg-secondary/50 transition-colors group">
                  <span className="text-sm font-display font-semibold w-14 text-muted-foreground">{item.time}</span>
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.activity}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'routine' && !detailedProtocol && (
            <div className="glass-card p-8 text-center">
              <AlertTriangle className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Dados insuficientes para gerar a rotina diária. Complete o onboarding.</p>
            </div>
          )}

          {/* === DETAILS TAB === */}
          {activeTab === 'details' && detailedProtocol && (
            <div className="space-y-8">
              {/* Workout summary */}
              <div>
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4" /> Treino Low Volume
                </h3>
                <div className="space-y-3">
                  {detailedProtocol.workoutPlan.map((day, i) => (
                    <div key={i} className="glass-card p-5">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-muted-foreground font-display tracking-wider uppercase">{day.day}</span>
                        <span className="text-xs text-muted-foreground">{day.duration}</span>
                      </div>
                      <h4 className="font-display font-semibold text-sm">{day.focus}</h4>
                      <p className="text-xs text-muted-foreground mt-2">
                        {day.exercises.map(e => e.name).join(' • ')}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition overview */}
              <div>
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
                  <Apple className="w-4 h-4" /> Nutrição
                </h3>
                <div className="glass-card p-6">
                  <p className="text-sm text-muted-foreground mb-4">{detailedProtocol.nutritionPlan.goal}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-secondary/50 border border-border">
                      <p className="text-lg font-display font-bold">{detailedProtocol.nutritionPlan.dailyCalories}</p>
                      <p className="text-xs text-muted-foreground">kcal/dia</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 border border-border">
                      <p className="text-lg font-display font-bold">{detailedProtocol.nutritionPlan.macros.protein}g</p>
                      <p className="text-xs text-muted-foreground">Proteína</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 border border-border">
                      <p className="text-lg font-display font-bold">{detailedProtocol.nutritionPlan.macros.carbs}g</p>
                      <p className="text-xs text-muted-foreground">Carboidratos</p>
                    </div>
                    <div className="text-center p-3 bg-secondary/50 border border-border">
                      <p className="text-lg font-display font-bold">{detailedProtocol.nutritionPlan.macros.fat}g</p>
                      <p className="text-xs text-muted-foreground">Gorduras</p>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4">💧 {detailedProtocol.nutritionPlan.hydration}</p>
                </div>
              </div>

              <div className="p-4 bg-secondary/30 border border-border text-xs text-muted-foreground rounded-lg">
                <p className="font-semibold text-foreground mb-1">Referências científicas</p>
                <p>NSCA • ACSM • Mifflin-St Jeor (BMR) • ISSN Position Stand (Jäger et al., 2017) • Samuel Meller — Low Volume • Eric Helms — Muscle & Strength Pyramid</p>
              </div>
            </div>
          )}

          {activeTab === 'details' && !detailedProtocol && (
            <div className="glass-card p-8 text-center">
              <AlertTriangle className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Dados insuficientes para gerar detalhes de treino e nutrição.</p>
            </div>
          )}

        </motion.div>
      </div>
    </div>
  );
};

export default Protocol;
