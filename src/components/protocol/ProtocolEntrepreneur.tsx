import { Briefcase, AlertTriangle, TrendingUp } from 'lucide-react';
import type { UserProfile } from '@/store/useAppStore';
import type { AIProtocolData } from '@/lib/aiProtocolService';
import { generateProtocol } from '@/lib/protocolEngine';

interface Props {
  aiProtocol: AIProtocolData | null;
  profile: UserProfile | null;
}

const statusColors = {
  good: 'text-emerald-400',
  warning: 'text-amber-400',
  critical: 'text-destructive',
};

const ProtocolEntrepreneur = ({ aiProtocol, profile }: Props) => {
  const entData = aiProtocol?.entrepreneur;

  if (entData && !entData.enabled) {
    return (
      <div className="glass-card p-8 text-center">
        <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-lg font-bold mb-2">Modo Empresário Desativado</h3>
        <p className="text-sm text-muted-foreground">Este módulo só é exibido quando "Ativar Modo Empresário" é marcado no formulário.</p>
      </div>
    );
  }

  if (!entData && profile && !profile.entrepreneur.enabled) {
    return (
      <div className="glass-card p-8 text-center">
        <Briefcase className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
        <h3 className="font-display text-lg font-bold mb-2">Modo Empresário Desativado</h3>
        <p className="text-sm text-muted-foreground">Este módulo só é exibido quando "Ativar Modo Empresário" é marcado no formulário.</p>
      </div>
    );
  }

  // Fallback to old engine
  if (!entData && profile) {
    return <FallbackEntrepreneur profile={profile} />;
  }

  if (!entData) return null;

  return (
    <div className="space-y-8">
      {/* Alerts */}
      {entData.alerts && entData.alerts.length > 0 && (
        <div className="space-y-3">
          {entData.alerts.map((alert, i) => (
            <div key={i} className={`p-4 border rounded-lg ${
              alert.type === 'critical' ? 'border-destructive/30 bg-destructive/5' : 'border-amber-500/30 bg-amber-500/5'
            }`}>
              <p className={`text-sm font-semibold ${alert.type === 'critical' ? 'text-destructive' : 'text-amber-400'}`}>{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Financial Diagnosis */}
      {entData.financialDiagnosis && entData.financialDiagnosis.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
            <Briefcase className="w-4 h-4" /> Diagnóstico Financeiro do Negócio
          </h3>
          <div className="space-y-2">
            {entData.financialDiagnosis.map((d, i) => (
              <div key={i} className="flex items-center justify-between p-3 glass-card">
                <span className="text-sm">{d.metric}</span>
                <span className={`text-sm font-display font-bold ${statusColors[d.status]}`}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Margin Scenarios */}
      {entData.marginScenarios && entData.marginScenarios.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Cenários de Otimização de Margem</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left p-3">Cenário</th>
                  <th className="text-right p-3">Nova Margem</th>
                  <th className="text-right p-3">Lucro/Mês</th>
                  <th className="text-right p-3">Lucro/Ano</th>
                  <th className="text-right p-3">Ganho</th>
                </tr>
              </thead>
              <tbody>
                {entData.marginScenarios.map((s, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-secondary/30">
                    <td className="p-3 font-medium">{s.scenario}</td>
                    <td className="p-3 text-right">{s.newMargin}</td>
                    <td className="p-3 text-right">{s.monthlyProfit}</td>
                    <td className="p-3 text-right">{s.annualProfit}</td>
                    <td className="p-3 text-right text-emerald-400">{s.gain}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Acquisition Metrics */}
      {entData.acquisitionMetrics && entData.acquisitionMetrics.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Métricas de Aquisição (CAC / LTV)</h3>
          <div className="space-y-2">
            {entData.acquisitionMetrics.map((m, i) => (
              <div key={i} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{m.channel}</span>
                  <p className="text-xs text-muted-foreground mt-0.5">CAC: {m.estimatedCAC} | LTV: {m.ltv}</p>
                </div>
                <span className={`text-sm font-display font-bold ${statusColors[m.status]}`}>{m.ltvCacRatio}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Funnel */}
      {entData.funnelStages && entData.funnelStages.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Funil de Vendas</h3>
          <div className="space-y-2">
            {entData.funnelStages.map((s, i) => (
              <div key={i} className="glass-card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{s.stage}</span>
                  <span className={`text-xs font-bold ${statusColors[s.status]}`}>{s.conversionRate}</span>
                </div>
                <p className="text-xs text-muted-foreground">Volume necessário: {s.volumeNeeded} | Benchmark: {s.benchmark}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Scale Actions */}
      {entData.scaleActions && entData.scaleActions.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4" /> Plano Estratégico de Escala
          </h3>
          <div className="space-y-2">
            {entData.scaleActions.map((a, i) => (
              <div key={i} className="glass-card p-4 flex items-start gap-3">
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground/10 text-foreground text-xs font-bold shrink-0">
                  {a.priority}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{a.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Prazo: {a.deadline} | Impacto: {a.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* KPIs */}
      {entData.kpiTargets && entData.kpiTargets.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Metas de KPIs</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground uppercase tracking-wider">
                  <th className="text-left p-3">KPI</th>
                  <th className="text-right p-3">Atual</th>
                  <th className="text-right p-3">Otimizado</th>
                  <th className="text-right p-3">Benchmark</th>
                </tr>
              </thead>
              <tbody>
                {entData.kpiTargets.map((k, i) => (
                  <tr key={i} className="border-b border-border/30 hover:bg-secondary/30">
                    <td className="p-3">{k.kpi}</td>
                    <td className={`p-3 text-right ${statusColors[k.status]}`}>{k.current}</td>
                    <td className="p-3 text-right text-emerald-400">{k.optimized}</td>
                    <td className="p-3 text-right text-muted-foreground">{k.benchmark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

// Fallback using old engine
const FallbackEntrepreneur = ({ profile }: { profile: UserProfile }) => {
  const protocol = generateProtocol(profile);
  const data = protocol.entrepreneurProtocol;
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <Briefcase className="w-4 h-4" /> Diagnóstico Financeiro do Negócio
        </h3>
        <div className="space-y-2">
          {data.financialDiagnosis.map((d, i) => (
            <div key={i} className="flex items-center justify-between p-3 glass-card">
              <span className="text-sm">{d.metric}</span>
              <span className={`text-sm font-display font-bold ${statusColors[d.status]}`}>{d.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" /> Plano Estratégico de Escala
        </h3>
        <div className="space-y-2">
          {data.scaleActions.map((a, i) => (
            <div key={i} className="glass-card p-4 flex items-start gap-3">
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-foreground/10 text-foreground text-xs font-bold shrink-0">{a.priority}</div>
              <div className="flex-1">
                <p className="text-sm font-medium">{a.action}</p>
                <p className="text-xs text-muted-foreground mt-0.5">Prazo: {a.deadline} | Impacto: {a.impact}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProtocolEntrepreneur;
