import { DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';
import type { UserProfile } from '@/store/useAppStore';
import { generateProtocol } from '@/lib/protocolEngine';

interface Props {
  profile: UserProfile | null;
}

const parseNum = (str: string) => parseFloat(str?.replace(/[^\d.,]/g, '').replace(',', '.')) || 0;

const ProtocolFinancial = ({ profile }: Props) => {
  if (!profile) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertTriangle className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Dados insuficientes para diagnóstico financeiro.</p>
      </div>
    );
  }

  const protocol = generateProtocol(profile);
  const f = profile.financial;
  const income = parseNum(f.monthlyIncome);
  const currentIncome = parseNum(profile.personal.currentIncome) || income;
  const incomeGoal = parseNum(profile.personal.incomeGoal);
  const investments = parseNum(f.investments);
  const debts = parseNum(f.debts);

  // Calculate expenses
  const expenses = {
    moradia: parseNum(f.expenseHousing),
    alimentacao: parseNum(f.expenseFood),
    transporte: parseNum(f.expenseTransport),
    saude: parseNum(f.expenseHealth),
    educacao: parseNum(f.expenseEducation),
    lazer: parseNum(f.expenseLeisure),
    assinaturas: parseNum(f.expenseSubscriptions),
    outros: parseNum(f.expenseOther),
  };

  const totalExpenses = Object.values(expenses).reduce((a, b) => a + b, 0);
  const savings = income - totalExpenses;
  const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(1) : '0';
  const incomeGap = incomeGoal > 0 ? incomeGoal - currentIncome : 0;

  const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

  const expenseLabels: Record<string, string> = {
    moradia: '🏠 Moradia',
    alimentacao: '🍽️ Alimentação',
    transporte: '🚗 Transporte',
    saude: '🏥 Saúde',
    educacao: '📚 Educação',
    lazer: '🎮 Lazer',
    assinaturas: '📱 Assinaturas',
    outros: '📦 Outros',
  };

  return (
    <div className="space-y-8">
      {/* Conditional alerts */}
      <div className="space-y-3">
        {incomeGap > 0 && (
          <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-lg">
            <p className="text-sm font-semibold text-amber-400">📊 Gap de Renda Detectado</p>
            <p className="text-xs text-muted-foreground mt-1">
              Sua renda atual ({fmt(currentIncome)}) está {fmt(incomeGap)} abaixo da sua meta ({fmt(incomeGoal)}).
              Plano de aumento de renda incluído abaixo.
            </p>
          </div>
        )}
        {savings < 0 && (
          <div className="p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
            <p className="text-sm font-semibold text-destructive">🚨 Déficit Financeiro</p>
            <p className="text-xs text-muted-foreground mt-1">
              Suas despesas ({fmt(totalExpenses)}) excedem sua renda ({fmt(income)}). Déficit de {fmt(Math.abs(savings))}/mês.
            </p>
          </div>
        )}
        {investments > 0 && (
          <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-lg">
            <p className="text-sm font-semibold text-emerald-400">📈 Aumento Progressivo de Investimentos</p>
            <p className="text-xs text-muted-foreground mt-1">
              Patrimônio investido: {fmt(investments)}. Meta: aumentar aportes em 10% a cada trimestre.
            </p>
          </div>
        )}
        {debts > 0 && (
          <div className="p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
            <p className="text-sm font-semibold text-destructive">⚠️ Dívidas Pendentes: {fmt(debts)}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Priorize a quitação antes de investir. Use o método bola de neve ou avalanche.
            </p>
          </div>
        )}
      </div>

      {/* Diagnosis */}
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4" /> Diagnóstico Financeiro
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-card p-4 text-center">
            <p className="text-lg font-display font-bold">{fmt(income)}</p>
            <p className="text-xs text-muted-foreground">Renda Mensal</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-lg font-display font-bold">{fmt(totalExpenses)}</p>
            <p className="text-xs text-muted-foreground">Despesas Totais</p>
          </div>
          <div className={`glass-card p-4 text-center ${savings >= 0 ? '' : 'border-destructive/30'}`}>
            <p className={`text-lg font-display font-bold ${savings < 0 ? 'text-destructive' : ''}`}>{fmt(savings)}</p>
            <p className="text-xs text-muted-foreground">Sobra Mensal</p>
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-lg font-display font-bold">{savingsRate}%</p>
            <p className="text-xs text-muted-foreground">Taxa de Poupança</p>
          </div>
        </div>
      </div>

      {/* Expense breakdown */}
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">
          Distribuição de Gastos
        </h3>
        <div className="space-y-2">
          {Object.entries(expenses)
            .filter(([, v]) => v > 0)
            .sort(([, a], [, b]) => b - a)
            .map(([key, value]) => {
              const pct = income > 0 ? ((value / income) * 100).toFixed(1) : '0';
              return (
                <div key={key} className="flex items-center gap-4 p-3 glass-card">
                  <span className="text-sm w-40 shrink-0">{expenseLabels[key] || key}</span>
                  <div className="flex-1 bg-secondary/50 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-foreground/30 rounded-full" style={{ width: `${Math.min(parseFloat(pct), 100)}%` }} />
                  </div>
                  <span className="text-sm font-display font-semibold w-24 text-right">{fmt(value)}</span>
                  <span className="text-xs text-muted-foreground w-12 text-right">{pct}%</span>
                </div>
              );
            })}
        </div>
        {f.expenseToImprove && (
          <p className="text-xs text-muted-foreground mt-3">
            🎯 Meta de redução prioritária: <strong className="text-foreground">{f.expenseToImprove}</strong>
          </p>
        )}
      </div>

      {/* Income strategy */}
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Estratégia de Aumento de Renda
        </h3>
        <div className="glass-card p-6 space-y-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1 font-display">Estratégia Principal</p>
            <p className="text-sm">{protocol.financialProtocol.incomeStrategy}</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-2 font-display">Habilidades para Desenvolver</p>
            <div className="flex flex-wrap gap-2">
              {protocol.financialProtocol.skills.map((skill, i) => (
                <span key={i} className="text-xs bg-secondary/50 border border-border px-3 py-1.5 rounded">{skill}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1 font-display">Estratégia de Investimento</p>
            <p className="text-sm">{protocol.financialProtocol.investmentStrategy}</p>
          </div>
          <div>
            <p className="text-xs tracking-widest uppercase text-muted-foreground mb-1 font-display">Monetização Adicional</p>
            <p className="text-sm">{protocol.financialProtocol.monetization}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProtocolFinancial;
