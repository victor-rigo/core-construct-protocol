import { AlertTriangle } from 'lucide-react';
import type { UserProfile } from '@/store/useAppStore';
import type { AIProtocolData } from '@/lib/aiProtocolService';
import { generateProtocol } from '@/lib/protocolEngine';

interface Props {
  aiProtocol: AIProtocolData | null;
  profile: UserProfile | null;
}

const ProtocolRoutine = ({ aiProtocol, profile }: Props) => {
  // Use AI data if available
  const routineData = aiProtocol?.routine;

  if (!routineData && !profile) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertTriangle className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Dados insuficientes para gerar a rotina diária. Complete o onboarding.</p>
      </div>
    );
  }

  // Fallback to old engine if no AI data
  if (!routineData && profile) {
    const protocol = generateProtocol(profile);
    return <FallbackRoutine profile={profile} protocol={protocol} />;
  }

  if (!routineData) return null;

  return (
    <div className="space-y-8">
      {/* AI Alerts */}
      {routineData.alerts?.length > 0 && (
        <div className="space-y-3">
          {routineData.alerts.map((alert, i) => (
            <div key={i} className={`p-4 border rounded-lg ${
              alert.type === 'critical' || alert.type === 'danger'
                ? 'border-destructive/30 bg-destructive/5'
                : alert.type === 'success' || alert.type === 'good'
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-amber-500/30 bg-amber-500/5'
            }`}>
              <p className={`text-sm font-semibold ${
                alert.type === 'critical' || alert.type === 'danger' ? 'text-destructive'
                : alert.type === 'success' || alert.type === 'good' ? 'text-emerald-400'
                : 'text-amber-400'
              }`}>{alert.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{alert.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Daily timeline */}
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">
          Cronograma Diário
          {profile?.personal?.workStartTime && (
            <span className="text-muted-foreground font-normal"> — Baseado no horário {profile.personal.workStartTime}–{profile.personal.workEndTime}</span>
          )}
        </h3>
        <div className="space-y-1">
          {routineData.dailyProtocol.map((item, i) => (
            <div key={i} className="flex items-center gap-6 p-4 hover:bg-secondary/50 transition-colors group">
              <span className="text-sm font-display font-semibold w-14 text-muted-foreground">{item.time}</span>
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.activity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly focus */}
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">
          Foco Semanal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {routineData.weeklyProtocol.map((day, i) => (
            <div key={i} className="glass-card p-4">
              <span className="text-xs text-muted-foreground font-display tracking-wider uppercase">{day.day}</span>
              <h4 className="font-display font-semibold text-sm mt-1">{day.focus}</h4>
              <p className="text-xs text-muted-foreground mt-1">{day.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Fallback component using old engine
const FallbackRoutine = ({ profile, protocol }: { profile: UserProfile; protocol: any }) => {
  const socialMediaHours = parseInt(profile.mental.socialMediaHours) || 0;
  const focusLevel = profile.mental.focusLevel;
  const sleepHours = parseFloat(profile.mental.avgSleepHours) || 7;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        {socialMediaHours > 2 && (
          <div className="p-4 border border-destructive/30 bg-destructive/5 rounded-lg">
            <p className="text-sm font-semibold text-destructive">⚠️ Bloqueio de Distrações Ativado</p>
            <p className="text-xs text-muted-foreground mt-1">
              Você reportou {socialMediaHours}h/dia em redes sociais (limite: 2h).
            </p>
          </div>
        )}
        {focusLevel <= 5 && (
          <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-lg">
            <p className="text-sm font-semibold text-amber-400">🧠 Treino Mental Incluído</p>
            <p className="text-xs text-muted-foreground mt-1">Nível de foco {focusLevel}/10 detectado.</p>
          </div>
        )}
        {sleepHours < 7 && (
          <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-lg">
            <p className="text-sm font-semibold text-amber-400">😴 Alerta de Sono</p>
            <p className="text-xs text-muted-foreground mt-1">Você dorme apenas {sleepHours}h/noite. Mínimo recomendado: 7h.</p>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">
          Cronograma Diário — Baseado no horário {profile.personal.workStartTime}–{profile.personal.workEndTime}
        </h3>
        <div className="space-y-1">
          {protocol.dailyProtocol.map((item: any, i: number) => (
            <div key={i} className="flex items-center gap-6 p-4 hover:bg-secondary/50 transition-colors">
              <span className="text-sm font-display font-semibold w-14 text-muted-foreground">{item.time}</span>
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm">{item.activity}</span>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Foco Semanal</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {protocol.weeklyProtocol.map((day: any, i: number) => (
            <div key={i} className="glass-card p-4">
              <span className="text-xs text-muted-foreground font-display tracking-wider uppercase">{day.day}</span>
              <h4 className="font-display font-semibold text-sm mt-1">{day.focus}</h4>
              <p className="text-xs text-muted-foreground mt-1">{day.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProtocolRoutine;
