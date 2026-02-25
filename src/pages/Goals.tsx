import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore, Goal } from '@/store/useAppStore';
import { ArrowLeft, Plus, Check, X, Trash2 } from 'lucide-react';

const GoalsPage = () => {
  const navigate = useNavigate();
  const { goals, toggleGoal, addGoal, removeGoal } = useAppStore();
  const [activeType, setActiveType] = useState<Goal['type']>('daily');
  const [newGoalText, setNewGoalText] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const filteredGoals = goals.filter((g) => g.type === activeType);
  const completedCount = filteredGoals.filter((g) => g.completed).length;
  const progress = filteredGoals.length > 0 ? (completedCount / filteredGoals.length) * 100 : 0;

  const handleAdd = () => {
    if (!newGoalText.trim()) return;
    addGoal({ id: Date.now().toString(), text: newGoalText, completed: false, type: activeType });
    setNewGoalText('');
    setShowAdd(false);
  };

  const types: { id: Goal['type']; label: string }[] = [
    { id: 'daily', label: 'Diárias' },
    { id: 'weekly', label: 'Semanais' },
    { id: 'monthly', label: 'Mensais' },
    { id: 'annual', label: 'Anual' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <span className="font-display text-lg font-bold tracking-widest">KOR</span>
        </div>
        <span className="text-xs tracking-widest uppercase text-muted-foreground font-display">Metas</span>
      </div>

      <div className="px-6 md:px-12 py-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-display text-3xl font-bold mb-8">Sistema de <span className="text-gradient-gold">Metas</span></h1>

          {/* Type tabs */}
          <div className="flex gap-0 border-b border-border mb-8">
            {types.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveType(t.id)}
                className={`px-6 py-3 text-xs tracking-widest uppercase font-display border-b-2 transition-colors ${
                  activeType === t.id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-muted-foreground font-display tracking-wider uppercase">Progresso</span>
              <span className="text-xs text-muted-foreground">{completedCount}/{filteredGoals.length}</span>
            </div>
            <div className="h-1 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-foreground"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>

          {/* Goals */}
          <div className="space-y-2 mb-6">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className="flex items-center gap-4 p-4 glass-card group">
                <button
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 transition-colors ${
                    goal.completed ? 'bg-foreground border-foreground' : 'border-muted-foreground hover:border-foreground'
                  }`}
                >
                  {goal.completed && <Check className="w-3 h-3 text-background" />}
                </button>
                <span className={`text-sm flex-1 ${goal.completed ? 'line-through text-muted-foreground' : ''}`}>{goal.text}</span>
                <button onClick={() => removeGoal(goal.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {/* Add goal */}
          {showAdd ? (
            <div className="flex items-center gap-3">
              <input
                autoFocus
                className="flex-1 bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-kor-subtle font-body"
                placeholder="Nova meta..."
                value={newGoalText}
                onChange={(e) => setNewGoalText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
              <button onClick={handleAdd} className="p-3 bg-primary text-primary-foreground"><Check className="w-4 h-4" /></button>
              <button onClick={() => { setShowAdd(false); setNewGoalText(''); }} className="p-3 bg-secondary text-secondary-foreground"><X className="w-4 h-4" /></button>
            </div>
          ) : (
            <button
              onClick={() => setShowAdd(true)}
              className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display"
            >
              <Plus className="w-4 h-4" /> Adicionar Meta
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GoalsPage;
