import { Dumbbell, Apple, AlertTriangle } from 'lucide-react';
import type { UserProfile } from '@/store/useAppStore';
import type { AIProtocolData } from '@/lib/aiProtocolService';
import { generateProtocol } from '@/lib/protocolEngine';

interface Props {
  aiProtocol: AIProtocolData | null;
  profile: UserProfile | null;
}

const ProtocolPhysical = ({ aiProtocol, profile }: Props) => {
  const physicalData = aiProtocol?.physical;
  const nutritionData = aiProtocol?.nutrition;

  if (!physicalData && !profile) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertTriangle className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Dados insuficientes para gerar treino e nutrição.</p>
      </div>
    );
  }

  // Fallback
  if (!physicalData && profile) {
    const protocol = generateProtocol(profile);
    return <FallbackPhysical profile={profile} protocol={protocol} />;
  }

  if (!physicalData) return null;

  return (
    <div className="space-y-8">
      {/* Alerts */}
      {physicalData.alerts?.length > 0 && (
        <div className="space-y-3">
          {physicalData.alerts.map((alert, i) => (
            <div key={i} className={`p-4 border rounded-lg ${
              alert.type === 'critical' || alert.type === 'danger' ? 'border-destructive/30 bg-destructive/5'
              : alert.type === 'success' || alert.type === 'good' ? 'border-emerald-500/30 bg-emerald-500/5'
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

      {/* Workout Plan */}
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <Dumbbell className="w-4 h-4" /> Divisão de Treino (Low Volume)
        </h3>
        <div className="space-y-3">
          {physicalData.workoutPlan.map((day, i) => (
            <div key={i} className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-display tracking-wider uppercase">{day.day}</span>
                <span className="text-xs text-muted-foreground">{day.duration}</span>
              </div>
              <h4 className="font-display font-semibold text-sm mb-1">{day.focus}</h4>
              {day.warmup !== '-' && <p className="text-xs text-muted-foreground mb-2">Aquecimento: {day.warmup}</p>}
              <div className="space-y-2 mt-3">
                {day.exercises.map((ex, j) => (
                  <div key={j} className="flex items-start gap-3 text-xs">
                    <span className="text-muted-foreground w-5 text-right shrink-0">{j + 1}.</span>
                    <div>
                      <span className="font-medium">{ex.name}</span>
                      {ex.sets > 0 && ex.reps !== '-' && (
                        <span className="text-muted-foreground"> — {ex.sets}x{ex.reps} (descanso: {ex.rest})</span>
                      )}
                      {ex.notes && <p className="text-muted-foreground mt-0.5">{ex.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nutrition */}
      {nutritionData && (
        <div>
          <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
            <Apple className="w-4 h-4" /> Nutrição — Plano Personalizado pela IA
          </h3>

          {/* Nutrition alerts */}
          {nutritionData.alerts?.length > 0 && (
            <div className="space-y-3 mb-4">
              {nutritionData.alerts.map((alert, i) => (
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

          <div className="glass-card p-6">
            <p className="text-sm text-muted-foreground mb-4">{nutritionData.goal}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-secondary/50 border border-border rounded">
                <p className="text-lg font-display font-bold">{nutritionData.dailyCalories}</p>
                <p className="text-xs text-muted-foreground">kcal/dia</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 border border-border rounded">
                <p className="text-lg font-display font-bold">{nutritionData.macros.protein}g</p>
                <p className="text-xs text-muted-foreground">Proteína</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 border border-border rounded">
                <p className="text-lg font-display font-bold">{nutritionData.macros.carbs}g</p>
                <p className="text-xs text-muted-foreground">Carboidratos</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 border border-border rounded">
                <p className="text-lg font-display font-bold">{nutritionData.macros.fat}g</p>
                <p className="text-xs text-muted-foreground">Gorduras</p>
              </div>
            </div>

            {/* Hydration */}
            {nutritionData.hydration && (
              <div className="p-4 bg-secondary/30 border border-border rounded-lg mb-4">
                <h4 className="text-xs tracking-widest uppercase text-muted-foreground mb-2 font-display">💧 Hidratação</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-muted-foreground">Atual:</span> {nutritionData.hydration.currentIntake}</div>
                  <div><span className="text-muted-foreground">Recomendado:</span> {nutritionData.hydration.recommendedLiters}L</div>
                  <div><span className="text-muted-foreground">({nutritionData.hydration.recommendedMl}ml)</span></div>
                  <div className="font-semibold">{nutritionData.hydration.difference}</div>
                </div>
              </div>
            )}

            {/* Meals */}
            <h4 className="text-xs tracking-widest uppercase text-muted-foreground mb-3 font-display">Refeições</h4>
            <div className="space-y-3">
              {nutritionData.meals.map((meal, i) => (
                <div key={i} className="p-4 bg-secondary/30 border border-border/50 rounded">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">{meal.name}</span>
                    <span className="text-xs text-muted-foreground">{meal.time} — {meal.totalCalories} kcal | {meal.totalProtein}g prot</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {meal.foods.map((food, j) => (
                      <span key={j} className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                        {food.item} ({food.quantity})
                        {food.alternative && (
                          <span className="text-emerald-400 ml-1">ou {food.alternative}</span>
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Supplements */}
            {nutritionData.supplements.length > 0 && (
              <>
                <h4 className="text-xs tracking-widest uppercase text-muted-foreground mb-3 mt-6 font-display">Suplementação</h4>
                <div className="space-y-2">
                  {nutritionData.supplements.map((sup, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs p-2 hover:bg-secondary/30 rounded">
                      <span className="font-medium shrink-0">{sup.name}</span>
                      <span className="text-muted-foreground">{sup.dosage} — {sup.timing}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* References */}
      <div className="p-4 bg-secondary/30 border border-border text-xs text-muted-foreground rounded-lg">
        <p className="font-semibold text-foreground mb-1">📚 Referências científicas</p>
        <p>NSCA • ACSM • Mifflin-St Jeor (BMR) • ISSN Position Stand (Jäger et al., 2017) • Samuel Meller — Low Volume • Eric Helms — Muscle & Strength Pyramid</p>
      </div>
    </div>
  );
};

// Fallback using old engine
const FallbackPhysical = ({ profile, protocol }: { profile: UserProfile; protocol: any }) => {
  const bodyFat = parseFloat(profile.physical.bodyFat) || 18;
  const objective = profile.physical.objective;
  const injuries = profile.physical.injuries?.toLowerCase() || '';
  const hasNoInjuries = !injuries || injuries === 'nenhuma' || injuries === 'nao' || injuries === 'não';

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        {objective === 'hipertrofia' && bodyFat <= 15 && (
          <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-lg">
            <p className="text-sm font-semibold text-emerald-400">✅ Superávit Leve Recomendado</p>
            <p className="text-xs text-muted-foreground mt-1">Gordura corporal {bodyFat}% (≤15%).</p>
          </div>
        )}
        {hasNoInjuries && (
          <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-lg">
            <p className="text-sm font-semibold text-emerald-400">✅ Exercícios Compostos Liberados</p>
            <p className="text-xs text-muted-foreground mt-1">Nenhuma lesão reportada.</p>
          </div>
        )}
      </div>
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <Dumbbell className="w-4 h-4" /> Divisão de Treino (Low Volume)
        </h3>
        <div className="space-y-3">
          {protocol.workoutPlan.map((day: any, i: number) => (
            <div key={i} className="glass-card p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground font-display tracking-wider uppercase">{day.day}</span>
                <span className="text-xs text-muted-foreground">{day.duration}</span>
              </div>
              <h4 className="font-display font-semibold text-sm mb-1">{day.focus}</h4>
              {day.warmup !== '-' && <p className="text-xs text-muted-foreground mb-2">Aquecimento: {day.warmup}</p>}
              <div className="space-y-2 mt-3">
                {day.exercises.map((ex: any, j: number) => (
                  <div key={j} className="flex items-start gap-3 text-xs">
                    <span className="text-muted-foreground w-5 text-right shrink-0">{j + 1}.</span>
                    <div>
                      <span className="font-medium">{ex.name}</span>
                      {ex.sets > 0 && ex.reps !== '-' && (
                        <span className="text-muted-foreground"> — {ex.sets}x{ex.reps} (descanso: {ex.rest})</span>
                      )}
                      {ex.notes && <p className="text-muted-foreground mt-0.5">{ex.notes}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <Apple className="w-4 h-4" /> Nutrição
        </h3>
        <div className="glass-card p-6">
          <p className="text-sm text-muted-foreground mb-4">{protocol.nutritionPlan.goal}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-secondary/50 border border-border rounded">
              <p className="text-lg font-display font-bold">{protocol.nutritionPlan.dailyCalories}</p>
              <p className="text-xs text-muted-foreground">kcal/dia</p>
            </div>
            <div className="text-center p-3 bg-secondary/50 border border-border rounded">
              <p className="text-lg font-display font-bold">{protocol.nutritionPlan.macros.protein}g</p>
              <p className="text-xs text-muted-foreground">Proteína</p>
            </div>
            <div className="text-center p-3 bg-secondary/50 border border-border rounded">
              <p className="text-lg font-display font-bold">{protocol.nutritionPlan.macros.carbs}g</p>
              <p className="text-xs text-muted-foreground">Carboidratos</p>
            </div>
            <div className="text-center p-3 bg-secondary/50 border border-border rounded">
              <p className="text-lg font-display font-bold">{protocol.nutritionPlan.macros.fat}g</p>
              <p className="text-xs text-muted-foreground">Gorduras</p>
            </div>
          </div>
          <h4 className="text-xs tracking-widest uppercase text-muted-foreground mb-3 font-display">Refeições</h4>
          <div className="space-y-3">
            {protocol.nutritionPlan.meals.map((meal: any, i: number) => (
              <div key={i} className="p-4 bg-secondary/30 border border-border/50 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{meal.name}</span>
                  <span className="text-xs text-muted-foreground">{meal.time} — {meal.totalCalories} kcal</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {meal.foods.map((food: any, j: number) => (
                    <span key={j} className="text-xs text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                      {food.item} ({food.quantity})
                      {food.alternative && <span className="text-emerald-400 ml-1">ou {food.alternative}</span>}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">💧 {protocol.nutritionPlan.hydration}</p>
        </div>
      </div>
    </div>
  );
};

export default ProtocolPhysical;
