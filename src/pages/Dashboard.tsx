import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { generateProtocol, type EntrepreneurData } from '@/lib/protocolEngine';
import { Target, BookOpen, TrendingUp, Briefcase, Clock, Calendar, DollarSign, Dumbbell, Apple, ChevronDown, ChevronUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

type Tab = 'daily' | 'weekly' | 'workout' | 'nutrition' | 'financial' | 'entrepreneur' | 'library';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('daily');
  const [expandedWorkout, setExpandedWorkout] = useState<number | null>(0);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(0);

  const protocol = useMemo(() => {
    if (!profile) return null;
    return generateProtocol(profile);
  }, [profile]);

  if (!profile || !protocol) {
    navigate('/onboarding');
    return null;
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'daily', label: 'Diário', icon: <Clock className="w-4 h-4" /> },
    { id: 'weekly', label: 'Semanal', icon: <Calendar className="w-4 h-4" /> },
    { id: 'workout', label: 'Treino', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'nutrition', label: 'Nutrição', icon: <Apple className="w-4 h-4" /> },
    { id: 'financial', label: 'Financeiro', icon: <DollarSign className="w-4 h-4" /> },
    ...(protocol.entrepreneurProtocol ? [{ id: 'entrepreneur' as Tab, label: 'Empresário', icon: <Briefcase className="w-4 h-4" /> }] : []),
    { id: 'library', label: 'Biblioteca', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <span className="font-display text-lg font-bold tracking-widest">KOR</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/goals')} className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display">
            <Target className="w-4 h-4" /> Metas
          </button>
          <button onClick={() => navigate('/onboarding')} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display">
            Recalibrar
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 md:px-12 py-8 border-b border-border">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-2">Seu Protocolo</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Protocolo <span className="text-gradient-gold">Ativo</span>
          </h1>
        </motion.div>
      </div>

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
          {activeTab === 'daily' && (
            <div className="space-y-1">
              {protocol.dailyProtocol.map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-4 hover:bg-secondary/50 transition-colors group">
                  <span className="text-sm font-display font-semibold w-14 text-muted-foreground">{item.time}</span>
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.activity}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'weekly' && (
            <div className="grid gap-4">
              {protocol.weeklyProtocol.map((item, i) => (
                <div key={i} className="p-6 glass-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold text-sm tracking-wider uppercase">{item.day}</h3>
                    <span className="text-xs text-muted-foreground">{item.focus}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          )}

          {/* WORKOUT TAB */}
          {activeTab === 'workout' && (
            <div className="space-y-4">
              <div className="mb-6">
                <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-1">Referências científicas</p>
                <p className="text-xs text-muted-foreground">NSCA • ACSM • Schoenfeld (2016) • Helms et al. (2015) • Stuart McGill</p>
              </div>
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
                      {/* Warmup */}
                      <div className="px-5 py-3 bg-secondary/30">
                        <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Aquecimento:</span> {day.warmup}</p>
                      </div>
                      {/* Exercises */}
                      <div className="divide-y divide-border">
                        {day.exercises.map((ex, j) => (
                          <div key={j} className="px-5 py-3 flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{ex.name}</p>
                              {ex.notes && <p className="text-xs text-muted-foreground mt-1">{ex.notes}</p>}
                            </div>
                            <div className="flex items-center gap-4 text-xs text-muted-foreground whitespace-nowrap">
                              <span>{ex.sets}x{ex.reps}</span>
                              {ex.rest !== '-' && <span className="text-xs px-2 py-0.5 bg-secondary border border-border">{ex.rest}</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Cooldown */}
                      <div className="px-5 py-3 bg-secondary/30">
                        <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">Volta à calma:</span> {day.cooldown}</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* NUTRITION TAB */}
          {activeTab === 'nutrition' && (
            <div className="space-y-8">
              {/* Overview */}
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Visão Geral</h3>
                <p className="text-sm text-muted-foreground mb-4">{protocol.nutritionPlan.goal}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <p className="text-xs text-muted-foreground mt-4">💧 Hidratação: {protocol.nutritionPlan.hydration}</p>
              </div>

              {/* Meals */}
              <div>
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Refeições Detalhadas</h3>
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
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border">
                          <div className="divide-y divide-border">
                            {/* Table header */}
                            <div className="px-5 py-2 bg-secondary/30 flex items-center gap-4 text-xs text-muted-foreground font-display tracking-wider uppercase">
                              <span className="flex-1">Alimento</span>
                              <span className="w-20 text-right">Qtd</span>
                              <span className="w-14 text-right">Kcal</span>
                              <span className="w-10 text-right hidden md:block">P</span>
                              <span className="w-10 text-right hidden md:block">C</span>
                              <span className="w-10 text-right hidden md:block">G</span>
                            </div>
                            {meal.foods.map((food, j) => (
                              <div key={j} className="px-5 py-3 flex items-center gap-4 text-sm">
                                <span className="flex-1">{food.item}</span>
                                <span className="w-20 text-right text-xs text-muted-foreground">{food.quantity}</span>
                                <span className="w-14 text-right text-xs">{food.calories}</span>
                                <span className="w-10 text-right text-xs text-muted-foreground hidden md:block">{food.protein}g</span>
                                <span className="w-10 text-right text-xs text-muted-foreground hidden md:block">{food.carbs}g</span>
                                <span className="w-10 text-right text-xs text-muted-foreground hidden md:block">{food.fat}g</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Supplements */}
              <div>
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Suplementação Baseada em Evidências</h3>
                <div className="space-y-3">
                  {protocol.nutritionPlan.supplements.map((sup, i) => (
                    <div key={i} className="glass-card p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h4 className="text-sm font-semibold">{sup.name}</h4>
                          <p className="text-xs text-muted-foreground mt-1">{sup.dosage} — {sup.timing}</p>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 italic">📖 {sup.reference}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-secondary/30 border border-border text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Referências científicas</p>
                <p>Cálculo baseado em Mifflin-St Jeor (BMR) • ISSN Position Stand (Jäger et al., 2017) • Alan Aragon's Guidelines • Eric Helms — Muscle & Strength Pyramid • Layne Norton Research</p>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-8">
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Estratégia de Renda</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{protocol.financialProtocol.incomeStrategy}</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3 flex items-center gap-2"><Dumbbell className="w-4 h-4" /> Habilidades para Desenvolver</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {protocol.financialProtocol.skills.map((s) => (
                    <span key={s} className="px-3 py-1 text-xs bg-secondary border border-border text-secondary-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Investimentos</h3>
                <p className="text-sm text-muted-foreground">{protocol.financialProtocol.investmentStrategy}</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3">Monetização</h3>
                <p className="text-sm text-muted-foreground">{protocol.financialProtocol.monetization}</p>
              </div>
            </div>
          )}

          {activeTab === 'entrepreneur' && protocol.entrepreneurProtocol && (() => {
            const ep = protocol.entrepreneurProtocol as EntrepreneurData;
            const statusColor = (s: string) => s === 'good' ? 'text-green-500' : s === 'warning' ? 'text-yellow-500' : 'text-red-500';
            const statusIcon = (s: string) => s === 'good' ? <CheckCircle className="w-3.5 h-3.5 text-green-500" /> : <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />;
            const impactColor = (i: string) => i === 'alto' ? 'bg-red-500/10 text-red-400 border-red-500/20' : i === 'médio' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' : 'bg-muted text-muted-foreground border-border';

            return (
            <div className="space-y-8">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="glass-card p-5 text-center">
                  <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-1">Faturamento</p>
                  <p className="text-2xl font-display font-bold">R$ {ep.summary.revenue.toLocaleString('pt-BR')}</p>
                </div>
                <div className="glass-card p-5 text-center">
                  <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-1">Lucro mensal</p>
                  <p className={`text-2xl font-display font-bold ${ep.summary.profit >= 10000 ? 'text-green-500' : 'text-yellow-500'}`}>R$ {ep.summary.profit.toLocaleString('pt-BR')}</p>
                </div>
                <div className="glass-card p-5 text-center">
                  <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-1">Gargalo principal</p>
                  <p className="text-lg font-display font-semibold capitalize">{ep.summary.mainBottleneck}</p>
                </div>
              </div>

              {/* Financial Diagnosis */}
              <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-display font-semibold text-sm tracking-wider uppercase flex items-center gap-2"><DollarSign className="w-4 h-4" /> Diagnóstico Financeiro</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Métrica</TableHead><TableHead className="text-right">Valor</TableHead><TableHead className="text-right">Status</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {ep.financialDiagnosis.map((d) => (
                      <TableRow key={d.metric}><TableCell className="font-medium text-sm">{d.metric}</TableCell><TableCell className={`text-right text-sm font-semibold ${statusColor(d.status)}`}>{d.value}</TableCell><TableCell className="text-right">{statusIcon(d.status)}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Margin Optimization */}
              <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-display font-semibold text-sm tracking-wider uppercase flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Cenários de Otimização de Margem</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Cenário</TableHead><TableHead className="text-right">Nova Margem</TableHead><TableHead className="text-right">Lucro/mês</TableHead><TableHead className="text-right">Lucro/ano</TableHead><TableHead className="text-right">Ganho</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {ep.marginScenarios.map((s) => (
                      <TableRow key={s.scenario}><TableCell className="font-medium text-sm">{s.scenario}</TableCell><TableCell className="text-right text-sm">{s.newMargin}</TableCell><TableCell className="text-right text-sm font-semibold">{s.monthlyProfit}</TableCell><TableCell className="text-right text-sm">{s.annualProfit}</TableCell><TableCell className="text-right text-sm text-green-500">{s.gain}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Acquisition Metrics */}
              <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-display font-semibold text-sm tracking-wider uppercase">Métricas de Aquisição por Canal</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Canal</TableHead><TableHead className="text-right">CAC estimado</TableHead><TableHead className="text-right">LTV</TableHead><TableHead className="text-right">LTV/CAC</TableHead><TableHead className="text-right">Status</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {ep.acquisitionMetrics.map((a) => (
                      <TableRow key={a.channel}><TableCell className="font-medium text-sm">{a.channel}</TableCell><TableCell className="text-right text-sm">{a.estimatedCAC}</TableCell><TableCell className="text-right text-sm">{a.ltv}</TableCell><TableCell className={`text-right text-sm font-semibold ${statusColor(a.status)}`}>{a.ltvCacRatio}</TableCell><TableCell className="text-right">{statusIcon(a.status)}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Funnel */}
              <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-display font-semibold text-sm tracking-wider uppercase">Funil de Vendas — Volume Necessário</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>Etapa</TableHead><TableHead className="text-right">Tx. Conversão</TableHead><TableHead className="text-right">Volume/mês</TableHead><TableHead className="text-right">Benchmark</TableHead><TableHead className="text-right">Status</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {ep.funnelStages.map((f) => (
                      <TableRow key={f.stage}><TableCell className="font-medium text-sm">{f.stage}</TableCell><TableCell className="text-right text-sm">{f.conversionRate}</TableCell><TableCell className="text-right text-sm font-semibold">{f.volumeNeeded}</TableCell><TableCell className="text-right text-sm text-muted-foreground">{f.benchmark}</TableCell><TableCell className="text-right">{statusIcon(f.status)}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Scale Actions */}
              <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-display font-semibold text-sm tracking-wider uppercase">Plano de Escala — Ações Priorizadas</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead className="w-8">#</TableHead><TableHead>Ação</TableHead><TableHead className="text-center">Impacto</TableHead><TableHead className="text-right">Prazo</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {ep.scaleActions.map((a) => (
                      <TableRow key={a.priority}><TableCell className="text-sm text-muted-foreground">{a.priority}</TableCell><TableCell className="font-medium text-sm">{a.action}</TableCell><TableCell className="text-center"><span className={`px-2 py-0.5 text-xs border rounded ${impactColor(a.impact)}`}>{a.impact}</span></TableCell><TableCell className="text-right text-sm text-muted-foreground">{a.deadline}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* KPI Targets */}
              <div className="glass-card overflow-hidden">
                <div className="p-5 border-b border-border">
                  <h3 className="font-display font-semibold text-sm tracking-wider uppercase">KPIs — Atual vs. Meta vs. Benchmark</h3>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow><TableHead>KPI</TableHead><TableHead className="text-right">Atual</TableHead><TableHead className="text-right">Meta otimizada</TableHead><TableHead className="text-right">Benchmark</TableHead><TableHead className="text-right">Status</TableHead></TableRow>
                  </TableHeader>
                  <TableBody>
                    {ep.kpiTargets.map((k) => (
                      <TableRow key={k.kpi}><TableCell className="font-medium text-sm">{k.kpi}</TableCell><TableCell className={`text-right text-sm ${statusColor(k.status)}`}>{k.current}</TableCell><TableCell className="text-right text-sm font-semibold">{k.optimized}</TableCell><TableCell className="text-right text-sm text-muted-foreground">{k.benchmark}</TableCell><TableCell className="text-right">{statusIcon(k.status)}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            );
          })()}

          {activeTab === 'library' && (
            <div className="space-y-10">
              <div>
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Livros Recomendados</h3>
                <div className="grid gap-3">
                  {protocol.library.books.map((b) => (
                    <div key={b.title} className="flex items-center justify-between p-4 glass-card">
                      <div><p className="text-sm font-semibold">{b.title}</p><p className="text-xs text-muted-foreground">{b.author}</p></div>
                      <span className="text-xs px-3 py-1 bg-secondary border border-border text-secondary-foreground">{b.category}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Ferramentas</h3>
                <div className="grid gap-3">
                  {protocol.library.tools.map((t) => (
                    <div key={t.name} className="flex items-center justify-between p-4 glass-card">
                      <span className="text-sm font-semibold">{t.name}</span>
                      <span className="text-xs text-muted-foreground">{t.use}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Podcasts</h3>
                <div className="grid gap-3">
                  {protocol.library.podcasts.map((p) => (
                    <div key={p.name} className="flex items-center justify-between p-4 glass-card">
                      <span className="text-sm font-semibold">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
