import { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Dumbbell, DollarSign, Briefcase, Target, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react';
import type { ProtocolBlock, FormResponseData } from '@/lib/protocolRuleEngine';
import type { UserProfile } from '@/store/useAppStore';

const categoriaLabels: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  rotina: { label: 'Rotina & Hábitos', icon: <Clock className="w-5 h-5" />, color: 'border-blue-500/30 bg-blue-500/5' },
  fisico: { label: 'Físico & Treino', icon: <Dumbbell className="w-5 h-5" />, color: 'border-emerald-500/30 bg-emerald-500/5' },
  financeiro: { label: 'Financeiro', icon: <DollarSign className="w-5 h-5" />, color: 'border-amber-500/30 bg-amber-500/5' },
  empresario: { label: 'Modo Empresário', icon: <Briefcase className="w-5 h-5" />, color: 'border-purple-500/30 bg-purple-500/5' },
};

interface Props {
  blocks: ProtocolBlock[];
  formData: FormResponseData | null;
  profile: UserProfile | null;
}

const ProtocolOverview = ({ blocks, formData, profile }: Props) => {
  const [expandedCategoria, setExpandedCategoria] = useState<string | null>('rotina');

  const blocksByCategory = blocks.reduce((acc, block) => {
    if (!acc[block.categoria]) acc[block.categoria] = [];
    acc[block.categoria].push(block);
    return acc;
  }, {} as Record<string, ProtocolBlock[]>);

  const categories = Object.keys(blocksByCategory);

  // Missing fields detection
  const missingFields: string[] = [];
  if (!formData?.idade) missingFields.push('Idade');
  if (!formData?.profissao) missingFields.push('Profissão');
  if (!formData?.horario_inicio) missingFields.push('Horário de trabalho');
  if (!formData?.objetivo_fisico) missingFields.push('Objetivo físico');
  if (!formData?.renda_atual) missingFields.push('Renda atual');
  if (formData?.nivel_foco === undefined) missingFields.push('Nível de foco');

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

      {/* Missing fields warning */}
      {missingFields.length > 0 && (
        <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold">Campos ausentes detectados</p>
              <p className="text-xs text-muted-foreground mt-1">
                Os seguintes campos não foram preenchidos: <strong>{missingFields.join(', ')}</strong>.
                Isso pode limitar a precisão do seu protocolo. Refaça o onboarding para completar.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Blocks by category */}
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

      {/* Transparency notice */}
      <div className="p-4 bg-secondary/30 border border-border text-xs text-muted-foreground rounded-lg">
        <p className="font-semibold text-foreground mb-1">🔒 Transparência dos dados</p>
        <p>
          Este protocolo foi gerado 100% com base nas suas respostas armazenadas no banco de dados.
          Cada bloco foi ativado por regras condicionais — nenhum conteúdo foi inventado ou gerado por IA.
        </p>
      </div>
    </div>
  );
};

export default ProtocolOverview;
