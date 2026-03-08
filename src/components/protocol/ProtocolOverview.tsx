import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Dumbbell, DollarSign, Briefcase, Target, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react';
import type { UserProfile } from '@/store/useAppStore';
import type { AIProtocolData } from '@/lib/aiProtocolService';

interface Props {
  aiProtocol: AIProtocolData | null;
  profile: UserProfile | null;
}

const categoriaLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  rotina: { label: 'Rotina & Hábitos', icon: <Clock className="w-5 h-5" />, color: 'border-blue-500/30 bg-blue-500/5' },
  fisico: { label: 'Físico & Treino', icon: <Dumbbell className="w-5 h-5" />, color: 'border-emerald-500/30 bg-emerald-500/5' },
  financeiro: { label: 'Financeiro', icon: <DollarSign className="w-5 h-5" />, color: 'border-amber-500/30 bg-amber-500/5' },
  empresario: { label: 'Modo Empresário', icon: <Briefcase className="w-5 h-5" />, color: 'border-purple-500/30 bg-purple-500/5' },
};

const ProtocolOverview = ({ aiProtocol, profile }: Props) => {
  const [expandedSection, setExpandedSection] = useState<string | null>('actions');

  if (!aiProtocol) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertTriangle className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Protocolo não disponível. Regenere ou refaça o onboarding.</p>
      </div>
    );
  }

  const overview = aiProtocol.overview;
  const missingFields = overview.missingFields || [];

  return (
    <div className="space-y-6">
      {/* Profile Summary */}
      {profile && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5">
            <h4 className="text-xs tracking-widest uppercase text-muted-foreground mb-3 font-display">Perfil Pessoal</h4>
            <div className="space-y-2 text-sm">
              {profile.personal.age && <p><span className="text-muted-foreground">Idade:</span> {profile.personal.age} anos</p>}
              {profile.personal.profession && <p><span className="text-muted-foreground">Profissão:</span> {profile.personal.profession}</p>}
              {profile.personal.workStartTime && <p><span className="text-muted-foreground">Horário:</span> {profile.personal.workStartTime} – {profile.personal.workEndTime}</p>}
              {profile.personal.workType && <p><span className="text-muted-foreground">Tipo:</span> {profile.personal.workType}</p>}
            </div>
          </div>
          <div className="glass-card p-5">
            <h4 className="text-xs tracking-widest uppercase text-muted-foreground mb-3 font-display">Perfil Físico</h4>
            <div className="space-y-2 text-sm">
              {profile.physical.weight && <p><span className="text-muted-foreground">Peso:</span> {profile.physical.weight}kg</p>}
              {profile.physical.height && <p><span className="text-muted-foreground">Altura:</span> {profile.physical.height}cm</p>}
              {profile.physical.bodyFat && <p><span className="text-muted-foreground">% Gordura:</span> {profile.physical.bodyFat}%</p>}
              {profile.physical.objective && <p><span className="text-muted-foreground">Objetivo:</span> {profile.physical.objective}</p>}
            </div>
          </div>
          <div className="glass-card p-5">
            <h4 className="text-xs tracking-widest uppercase text-muted-foreground mb-3 font-display">Perfil Mental & Financeiro</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-muted-foreground">Foco:</span> {profile.mental.focusLevel}/10</p>
              <p><span className="text-muted-foreground">Disciplina:</span> {profile.mental.disciplineLevel}/10</p>
              {profile.mental.avgSleepHours && <p><span className="text-muted-foreground">Sono:</span> {profile.mental.avgSleepHours}h</p>}
              {profile.financial.monthlyIncome && <p><span className="text-muted-foreground">Renda:</span> R$ {profile.financial.monthlyIncome}</p>}
            </div>
          </div>
        </div>
      )}

      {/* AI Summary */}
      <div className="glass-card p-6">
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3">📋 Resumo do Protocolo</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{overview.summary}</p>
      </div>

      {/* Missing fields warning */}
      {missingFields.length > 0 && (
        <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Campos ausentes detectados</p>
              <p className="text-xs text-muted-foreground mt-1">
                Os seguintes campos não foram preenchidos: <strong>{missingFields.join(', ')}</strong>.
                Isso pode limitar a precisão do seu protocolo.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Priority Actions */}
      <div className="border rounded-lg overflow-hidden border-border">
        <button
          onClick={() => setExpandedSection(expandedSection === 'actions' ? null : 'actions')}
          className="w-full px-6 py-5 flex items-center justify-between text-left bg-secondary/20"
        >
          <div className="flex items-center gap-3">
            <Target className="w-5 h-5" />
            <div>
              <h3 className="font-display font-semibold text-sm tracking-wider uppercase">Ações Prioritárias</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{overview.priorityActions.length} ações identificadas pela IA</p>
            </div>
          </div>
          {expandedSection === 'actions' ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {expandedSection === 'actions' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-t border-border/50">
            {overview.priorityActions
              .sort((a, b) => a.priority - b.priority)
              .map((action, i) => {
                const catInfo = categoriaLabels[action.category] || { label: action.category, icon: <Target className="w-4 h-4" />, color: '' };
                return (
                  <div key={i} className={`px-6 py-4 ${i < overview.priorityActions.length - 1 ? 'border-b border-border/30' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground/10 text-foreground text-xs font-bold mt-0.5 shrink-0">
                        {action.priority}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{action.action}</p>
                        <span className="text-xs text-muted-foreground mt-1 inline-flex items-center gap-1">
                          {catInfo.icon} {catInfo.label}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
          </motion.div>
        )}
      </div>

      {/* Transparency notice */}
      <div className="p-4 bg-secondary/30 border border-border text-xs text-muted-foreground rounded-lg">
        <p className="font-semibold text-foreground mb-1">🤖 Protocolo gerado por IA</p>
        <p>
          Este protocolo foi gerado com base nas suas respostas do formulário usando inteligência artificial.
          Todos os dados utilizados vieram exclusivamente do seu perfil — nenhuma informação foi inventada.
        </p>
      </div>
    </div>
  );
};

export default ProtocolOverview;
