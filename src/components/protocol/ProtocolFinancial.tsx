import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import type { UserProfile } from '@/store/useAppStore';
import type { AIProtocolData } from '@/lib/aiProtocolService';
import { generateProtocol } from '@/lib/protocolEngine';

interface Props {
  aiProtocol: AIProtocolData | null;
  profile: UserProfile | null;
}

const parseNum = (str: string) => parseFloat(str?.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;
const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

const ProtocolFinancial = ({ aiProtocol, profile }: Props) => {
  const financialData = aiProtocol?.financial;

  if (!financialData && !profile) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertTriangle className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Dados insuficientes para diagnóstico financeiro.</p>
      </div>
    );
  }

  // Fallback
  if (!financialData && profile) {
    return <FallbackFinancial profile={profile} />;
  }

  if (!financialData) return null;

  const { diagnosis, expenseBreakdown, incomeStrategy, skills, investmentStrategy, monetization, alerts } = financialData;

  return (
    <div className="space-y-8">
      {/* Alerts */}
      {alerts?.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, i) => (
            <div key={i} className={`p-4 border rounded-lg ${
              alert.type === 'critical' || alert.type === 'danger' ? 'border-destructive/30 bg-destructive/5'
              : alert.type === 'success' || alert.type === 'good' ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-amber-500/30 bg-amber-500/5'
            }`}>
              <p className={`text-sm font-semibold ${
                alert.type === 'critical' ? 'text-destructive' : alert.type === 'success' || alert.type === 'good' ? 'text-emerald-400' : 'text-amber-400'
              }`}>{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Diagnosis */}
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Diagnóstico Financeiro
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-lg font-display font-bold">{fmt(diagnosis.income)}</p>
            <p className="text-xs text-muted-foreground">Renda Mensal</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-lg font-display font-bold">{fmt(diagnosis.totalExpenses)}</p>
            <p className="text-xs text-muted-foreground">Despesas Totais</p>
          </div>
          <div className={`glass-card p-4 text-center ${diagnosis.savings < 0 ? 'border-destructive/30' : ''}`}>
            <p className={`text-lg font-display font-bold ${diagnosis.savings < 0 ? 'text-destructive' : ''}`}>{fmt(diagnosis.savings)}</p>
            <p className="text-xs text-muted-foreground">Sobra Mensal</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-lg font-display font-bold">{diagnosis.savingsRate}</p>
            <p className="text-xs text-muted-foreground">Taxa de Poupança</p>
          </div>
        </div>
      </div>

      {/* Expense breakdown */}
      {expenseBreakdown.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Distribuição de Gastos</h3>
          <div className="space-y-2">
            {expenseBreakdown
              .filter(e => e.amount > 0)
              .sort((a, b) => b.amount - a.amount)
              .map((expense, i) => (
                <div key={i} className="flex items-center gap-4 p-3 glass-card">
                  <span className="text-sm w-40 shrink-0">{expense.label}</span>
                  <div className="flex-1 bg-secondary/50 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-foreground/30 rounded-full" style={{ width: `${Math.min(parseFloat(expense.percentage), 100)}%` }} />
                  </div>
                  <span className="text-sm font-display font-semibold w-24 text-right">{fmt(expense.amount)}</span>
                  <span className="text-xs text-muted-foreground w-12 text-right">{expense.percentage}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Strategy */}
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Estratégia de Aumento de Renda
        </h3>
        <div className="glass-card p-6 space-y-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1 font-display">Estratégia Principal</p>
            <p className="text-sm">{incomeStrategy}</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2 font-display">Habilidades para Desenvolver</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="text-xs bg-secondary/50 border border-border px-3 py-1.5 rounded">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1 font-display">Estratégia de Investimento</p>
            <p className="text-sm">{investmentStrategy}</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1 font-display">Monetização Adicional</p>
            <p className="text-sm">{monetization}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Fallback using old engine
const FallbackFinancial = ({ profile }: { profile: UserProfile }) => {
  const protocol = generateProtocol(profile);
  const f = profile.financial;
  const income = parseNum(f.monthlyIncome);
  const expenses = {
    moradia: parseNum(f.expenseHousing), alimentacao: parseNum(f.expenseFood),
    transporte: parseNum(f.expenseTransport), saude: parseNum(f.expenseHealth),
    educacao: parseNum(f.expenseEducation), lazer: parseNum(f.expenseLeisure),
    assinaturas: parseNum(f.expenseSubscriptions), outros: parseNum(f.expenseOther),
  };
  const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
  const savings = income - totalExpenses;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : '0';
  const expenseLabels: Record<string, string> = {
    moradia: '🏠 Moradia', alimentacao: '🍽️ Alimentação', transporte: '🚗 Transporte',
    saude: '🏥 Saúde', educacao: '📚 Educação', lazer: '🎮 Lazer',
    assinaturas: '📱 Assinaturas', outros: '📦 Outros',
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Diagnóstico Financeiro
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center"><p className="text-lg font-display font-bold">{fmt(income)}</p><p className="text-xs text-muted-foreground">Renda Mensal</p></div>
          <div className="glass-card p-4 text-center"><p className="text-lg font-display font-bold">{fmt(totalExpenses)}</p><p className="text-xs text-muted-foreground">Despesas</p></div>
          <div className={`glass-card p-4 text-center ${savings < 0 ? 'border-destructive/30' : ''}`}><p className={`text-lg font-display font-bold ${savings < 0 ? 'text-destructive' : ''}`}>{fmt(savings)}</p><p className="text-xs text-muted-foreground">Sobra</p></div>
          <div className="glass-card p-4 text-center"><p className="text-lg font-display font-bold">{savingsRate}%</p><p className="text-xs text-muted-foreground">Taxa Poupança</p></div>
        </div>
      </div>
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Distribuição de Gastos</h3>
        <div className="space-y-2">
          {Object.entries(expenses).filter(([, v]) => v > 0).sort(([, a], [, b]) => b - a).map(([key, value]) => (
            <div key={key} className="flex items-center gap-4 p-3 glass-card">
              <span className="text-sm w-40 shrink-0">{expenseLabels[key]}</span>
              <div className="flex-1 bg-secondary/50 rounded-full h-2 overflow-hidden">
                <div className="h-full bg-foreground/30 rounded-full" style={{ width: `${Math.min(income > 0 ? (value / income) * 100 : 0, 100)}%` }} />
              </div>
              <span className="text-sm font-display font-semibold w-24 text-right">{fmt(value)}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Estratégia
        </h3>
        <div className="glass-card p-6 space-y-4">
          <div><p className="text-xs tracking-widest uppercase text-muted-foreground mb-1 font-display">Estratégia Principal</p><p className="text-sm">{protocol.financialProtocol.incomeStrategy}</p></div>
          <div><p className="text-xs tracking-widest uppercase text-muted-foreground mb-2 font-display">Habilidades</p><div className="flex flex-wrap gap-2">{protocol.financialProtocol.skills.map((s, i) => <span key={i} className="text-xs bg-secondary/50 border border-border px-3 py-1.5 rounded">{s}</span>)}</div></div>
          <div><p className="text-xs tracking-widest uppercase text-muted-foreground mb-1 font-display">Investimento</p><p className="text-sm">{protocol.financialProtocol.investmentStrategy}</p></div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolFinancial;
