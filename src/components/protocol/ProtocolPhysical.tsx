import { Dumbbell, Apple, AlertTriangle } from 'lucide-react';
import type { UserProfile } from '@/store/useAppStore';
import { generateProtocol } from '@/lib/protocolEngine';

interface Props {
  profile: UserProfile | null;
}

const ProtocolPhysical = ({ profile }: Props) => {
  if (!profile) {
    return (
      <div className="glass-card p-8 text-center">
        <AlertTriangle className="w-6 h-6 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">Dados insuficientes para gerar treino e nutrição.</p>
      </div>
    );
  }

  const protocol = generateProtocol(profile);
  const bodyFat = parseFloat(profile.physical.bodyFat) || 18;
  const objective = profile.physical.objective;
  const injuries = profile.physical.injuries?.toLowerCase() || '';
  const hasNoInjuries = !injuries || injuries === 'nenhuma' || injuries === 'nao' || injuries === 'não';

  return (
    <div className="space-y-8">
      {/* Conditional alerts */}
      <div className="space-y-3">
        {objective === 'hipertrofia' && bodyFat <= 15 && (
          <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-lg">
            <p className="text-sm font-semibold text-emerald-400">✅ Superávit Leve Recomendado</p>
            <p className="text-xs text-muted-foreground mt-1">
              Gordura corporal {bodyFat}% (≤15%). Condição ideal para superávit calórico controlado (+350 kcal).
            </p>
          </div>
        )}
        {objective === 'hipertrofia' && bodyFat > 20 && (
          <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-lg">
            <p className="text-sm font-semibold text-amber-400">⚠️ Considere Mini-Cut Antes do Bulk</p>
            <p className="text-xs text-muted-foreground mt-1">
              Gordura corporal {bodyFat}% (acima de 20%). Recomendado um mini-cut de 4-6 semanas antes de iniciar superávit.
            </p>
          </div>
        )}
        {hasNoInjuries && (
          <div className="p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-lg">
            <p className="text-sm font-semibold text-emerald-400">✅ Exercícios Compostos Liberados</p>
            <p className="text-xs text-muted-foreground mt-1">
              Nenhuma lesão reportada. Todos os exercícios compostos (agachamento, terra, supino) estão habilitados.
            </p>
          </div>
        )}
        {!hasNoInjuries && (
          <div className="p-4 border border-amber-500/30 bg-amber-500/5 rounded-lg">
            <p className="text-sm font-semibold text-amber-400">⚠️ Adaptações por Lesão: {profile.physical.injuries}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Exercícios foram adaptados automaticamente para proteger as áreas afetadas.
            </p>
          </div>
        )}
      </div>

      {/* Workout */}
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <Dumbbell className="w-4 h-4" /> Divisão de Treino — {protocol.workoutPlan.length - 1}x/semana (Low Volume)
        </h3>
        <div className="space-y-3">
          {protocol.workoutPlan.map((day, i) => (
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
      <div>
        <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2">
          <Apple className="w-4 h-4" /> Nutrição — Estimativa Calórica (Mifflin-St Jeor)
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

          {/* Meals */}
          <h4 className="text-xs tracking-widest uppercase text-muted-foreground mb-3 font-display">Refeições</h4>
          <div className="space-y-3">
            {protocol.nutritionPlan.meals.map((meal, i) => (
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

          <p className="text-xs text-muted-foreground mt-4">💧 {protocol.nutritionPlan.hydration}</p>

          {/* Supplements */}
          <h4 className="text-xs tracking-widest uppercase text-muted-foreground mb-3 mt-6 font-display">Suplementação</h4>
          <div className="space-y-2">
            {protocol.nutritionPlan.supplements.map((sup, i) => (
              <div key={i} className="flex items-start gap-3 text-xs p-2 hover:bg-secondary/30 rounded">
                <span className="font-medium shrink-0">{sup.name}</span>
                <span className="text-muted-foreground">{sup.dosage} — {sup.timing}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* References */}
      <div className="p-4 bg-secondary/30 border border-border text-xs text-muted-foreground rounded-lg">
        <p className="font-semibold text-foreground mb-1">📚 Referências científicas</p>
        <p>NSCA • ACSM • Mifflin-St Jeor (BMR) • ISSN Position Stand (Jäger et al., 2017) • Samuel Meller — Low Volume • Eric Helms — Muscle & Strength Pyramid</p>
      </div>
    </div>
  );
};

export default ProtocolPhysical;
