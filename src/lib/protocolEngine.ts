import { UserProfile } from '@/store/useAppStore';

// === WORKOUT PROTOCOLS ===
// Based on NSCA (National Strength and Conditioning Association) guidelines,
// ACSM (American College of Sports Medicine) recommendations,
// and evidence-based periodization models (Schoenfeld, 2010; Helms et al., 2015)

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
}

interface WorkoutDay {
  day: string;
  focus: string;
  warmup: string;
  exercises: Exercise[];
  cooldown: string;
  duration: string;
}

interface Meal {
  name: string;
  time: string;
  foods: { item: string; quantity: string; calories: number; protein: number; carbs: number; fat: number }[];
  totalCalories: number;
  totalProtein: number;
}

interface NutritionPlan {
  goal: string;
  dailyCalories: number;
  macros: { protein: number; carbs: number; fat: number };
  meals: Meal[];
  hydration: string;
  supplements: { name: string; dosage: string; timing: string; reference: string }[];
}

function generateWorkoutPlan(profile: UserProfile): WorkoutDay[] {
  const objective = profile.physical.objective;
  const injuries = profile.physical.injuries?.toLowerCase() || '';

  const hasKneeIssue = injuries.includes('joelho') || injuries.includes('knee');
  const hasShoulderIssue = injuries.includes('ombro') || injuries.includes('shoulder');
  const hasBackIssue = injuries.includes('costas') || injuries.includes('lombar') || injuries.includes('back');

  // =====================================================================
  // METODOLOGIA LOW VOLUME — Samuel Meller
  // Ref: "5 Pilares do Low Volume" (Samuel Meller, 2024)
  //
  // PILAR 1: BAIXO VOLUME — Poucas séries por grupo muscular (4-8 séries/semana)
  // PILAR 2: ALTA INTENSIDADE — Séries levadas próximas ou até a falha concêntrica
  // PILAR 3: EXERCÍCIOS COMPOSTOS como base — Máximo estímulo com mínimo volume
  // PILAR 4: PROGRESSÃO DE CARGA — Sobrecarga progressiva como driver principal
  // PILAR 5: RECUPERAÇÃO ADEQUADA — Menos volume = mais recuperação = mais crescimento
  //
  // Estrutura: 2-3 séries de trabalho por exercício (após warm-up sets)
  // Cada série: levar próximo à falha (RPE 8-10)
  // Treinos curtos: 30-45 min
  // Frequência: 3-5x/semana (cada músculo 2x/semana)
  // =====================================================================

  if (objective === 'hipertrofia') {
    // Upper/Lower Split — Low Volume — 4x/semana
    // ~6-8 séries de trabalho por grupo muscular por semana
    return [
      {
        day: 'Segunda',
        focus: 'Upper A — Peito, Costas, Ombro (Low Volume)',
        warmup: '2 séries progressivas do primeiro exercício (50% e 75% da carga de trabalho)',
        duration: '30-40 min',
        cooldown: 'Alongamento leve — 3 min',
        exercises: [
          { name: hasShoulderIssue ? 'Supino com halteres (neutro)' : 'Supino reto com barra', sets: 2, reps: '6-8', rest: '120-180s', notes: 'Séries de TRABALHO — RPE 9-10. Levar próximo à falha. Progressão de carga semanal.' },
          { name: 'Supino inclinado com halteres', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 9. Foco na contração e controle excêntrico (3s descida).' },
          { name: hasBackIssue ? 'Pulldown na polia' : 'Barra fixa (pronada)', sets: 2, reps: '6-10', rest: '120-180s', notes: 'RPE 9-10. Adicionar carga externa se necessário.' },
          { name: 'Remada curvada com barra', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 9. Puxar para a linha do umbigo. Pausa de 1s na contração.' },
          { name: hasShoulderIssue ? 'Elevação lateral com cabos' : 'Elevação lateral com halteres', sets: 2, reps: '10-15', rest: '90s', notes: 'RPE 10 (até a falha). Pausa no topo — 2s.' },
        ],
      },
      {
        day: 'Terça',
        focus: 'Lower A — Quadríceps, Posterior, Panturrilha (Low Volume)',
        warmup: '2 séries progressivas de agachamento (50% e 75% da carga)',
        duration: '30-40 min',
        cooldown: 'Alongamento de quadríceps e isquiotibiais — 3 min',
        exercises: [
          { name: hasKneeIssue ? 'Leg press 45°' : 'Agachamento livre com barra', sets: 2, reps: '6-8', rest: '180s', notes: 'RPE 9-10. Exercício composto principal. Profundidade completa se possível.' },
          { name: hasKneeIssue ? 'Leg press (pés altos)' : 'Agachamento búlgaro com halteres', sets: 2, reps: '8-10 (cada)', rest: '120s', notes: 'RPE 9. Exercício unilateral — corrige desequilíbrios.' },
          { name: 'Mesa flexora', sets: 2, reps: '8-12', rest: '120s', notes: 'RPE 9-10. Foco na excêntrica controlada (4s).' },
          { name: hasBackIssue ? 'Stiff com halteres (amplitude reduzida)' : 'Stiff com barra', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 8-9. Foco no alongamento dos isquiotibiais sob carga.' },
          { name: 'Panturrilha em pé (Smith)', sets: 3, reps: '10-15', rest: '90s', notes: 'RPE 10 (até a falha). Pausa de 2s no alongamento máximo.' },
        ],
      },
      {
        day: 'Quarta',
        focus: 'Descanso — Recuperação ativa',
        warmup: '-',
        duration: '20-30 min (opcional)',
        cooldown: '-',
        exercises: [
          { name: 'Caminhada leve ou mobilidade articular', sets: 1, reps: '20-30 min', rest: '-', notes: 'Low Volume exige recuperação. O músculo cresce no descanso. Ref: Samuel Meller — Pilar 5.' },
        ],
      },
      {
        day: 'Quinta',
        focus: 'Upper B — Peito, Costas, Braços (Low Volume)',
        warmup: '2 séries progressivas do primeiro exercício (50% e 75%)',
        duration: '30-40 min',
        cooldown: 'Alongamento leve — 3 min',
        exercises: [
          { name: 'Supino inclinado com barra', sets: 2, reps: '6-8', rest: '120-180s', notes: 'RPE 9-10. Variação de ângulo para estímulo diferente do Upper A.' },
          { name: hasBackIssue ? 'Remada na máquina' : 'Remada cavaleiro (T-bar)', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 9. Foco na retração escapular completa.' },
          { name: 'Pulldown pegada neutra', sets: 2, reps: '8-12', rest: '120s', notes: 'RPE 9-10. Ênfase no alongamento da dorsal na fase excêntrica.' },
          { name: 'Rosca direta com barra EZ', sets: 2, reps: '8-12', rest: '90s', notes: 'RPE 10 (falha). Bíceps: grupo pequeno = poucas séries bastam.' },
          { name: 'Tríceps na polia (corda)', sets: 2, reps: '10-15', rest: '90s', notes: 'RPE 10 (falha). Extensão completa + contração no pico.' },
        ],
      },
      {
        day: 'Sexta',
        focus: 'Lower B — Posterior, Quadríceps, Glúteos (Low Volume)',
        warmup: '2 séries progressivas do primeiro exercício (50% e 75%)',
        duration: '30-40 min',
        cooldown: 'Foam rolling + alongamento — 5 min',
        exercises: [
          { name: hasBackIssue ? 'Leg press 45°' : 'Terra (deadlift convencional)', sets: 2, reps: '5-6', rest: '180-240s', notes: 'RPE 9. Composto pesado. Técnica impecável > carga. Ref: Samuel Meller — Pilar 3.' },
          { name: 'Leg press 45°', sets: 2, reps: '8-12', rest: '120s', notes: 'RPE 9-10. Volume complementar para quadríceps.' },
          { name: 'Cadeira extensora', sets: 2, reps: '10-15', rest: '90s', notes: hasKneeIssue ? 'Amplitude parcial. RPE 9.' : 'RPE 10 (falha). Contração no topo — 2s.' },
          { name: 'Elevação pélvica (hip thrust)', sets: 2, reps: '8-12', rest: '120s', notes: 'RPE 9-10. Pausa de 2s na contração máxima do glúteo.' },
          { name: 'Panturrilha sentado', sets: 3, reps: '10-15', rest: '90s', notes: 'RPE 10 (falha). Sóleo — excêntrica lenta.' },
        ],
      },
      {
        day: 'Sábado / Domingo',
        focus: 'Descanso total ou recuperação ativa',
        warmup: '-',
        duration: '-',
        cooldown: '-',
        exercises: [
          { name: 'Descanso completo ou caminhada leve', sets: 1, reps: '-', rest: '-', notes: 'Recuperação é parte do protocolo. Low Volume = alta intensidade + recuperação plena.' },
        ],
      },
    ];
  }

  if (objective === 'definição') {
    // Low Volume em déficit — preservação muscular máxima
    // Volume AINDA MENOR em cutting para evitar overreaching
    // Ref: Samuel Meller — em déficit, reduza volume mas mantenha intensidade e carga
    return [
      {
        day: 'Segunda',
        focus: 'Upper — Push + Pull (Low Volume Cutting)',
        warmup: '2 séries progressivas (50% e 75%)',
        duration: '25-35 min',
        cooldown: 'Alongamento — 3 min',
        exercises: [
          { name: hasShoulderIssue ? 'Supino com halteres' : 'Supino reto com barra', sets: 2, reps: '6-8', rest: '120-180s', notes: 'RPE 9. MANTER A CARGA do bulk — sinal de preservação muscular.' },
          { name: hasBackIssue ? 'Pulldown na polia' : 'Barra fixa', sets: 2, reps: '6-10', rest: '120s', notes: 'RPE 9. Composto pesado — prioridade em cutting.' },
          { name: 'Remada curvada com barra', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 9. Manter força = manter músculo.' },
          { name: 'Elevação lateral com halteres', sets: 2, reps: '12-15', rest: '90s', notes: 'RPE 10. Deltoides respondem bem a poucas séries intensas.' },
        ],
      },
      {
        day: 'Terça',
        focus: 'Lower — Quadríceps e Posterior (Low Volume Cutting)',
        warmup: '2 séries progressivas (50% e 75%)',
        duration: '25-35 min',
        cooldown: 'Alongamento — 3 min',
        exercises: [
          { name: hasKneeIssue ? 'Leg press 45°' : 'Agachamento livre', sets: 2, reps: '6-8', rest: '180s', notes: 'RPE 9. Não reduza carga — reduza volume se necessário.' },
          { name: 'Mesa flexora', sets: 2, reps: '8-12', rest: '120s', notes: 'RPE 9-10.' },
          { name: hasBackIssue ? 'Stiff com halteres' : 'Stiff com barra', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 8-9.' },
          { name: 'Panturrilha em pé', sets: 2, reps: '10-15', rest: '90s', notes: 'RPE 10 (falha).' },
        ],
      },
      {
        day: 'Quarta',
        focus: 'Cardio LISS + Recuperação',
        warmup: '-',
        duration: '30-40 min',
        cooldown: 'Foam rolling — 5 min',
        exercises: [
          { name: 'Caminhada inclinada (esteira 10-15%)', sets: 1, reps: '30-40 min', rest: '-', notes: 'Zona 2 (60-70% FCmax). Cardio que não atrapalha a recuperação muscular.' },
        ],
      },
      {
        day: 'Quinta',
        focus: 'Upper — Push + Pull B (Low Volume Cutting)',
        warmup: '2 séries progressivas (50% e 75%)',
        duration: '25-35 min',
        cooldown: 'Alongamento — 3 min',
        exercises: [
          { name: 'Supino inclinado com halteres', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 9. Variação de ângulo.' },
          { name: 'Remada na polia baixa (triângulo)', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 9.' },
          { name: 'Rosca direta com barra EZ', sets: 2, reps: '8-12', rest: '90s', notes: 'RPE 10 (falha).' },
          { name: 'Tríceps na polia (corda)', sets: 2, reps: '10-15', rest: '90s', notes: 'RPE 10 (falha).' },
        ],
      },
      {
        day: 'Sexta',
        focus: 'Lower B (Low Volume Cutting)',
        warmup: '2 séries progressivas (50% e 75%)',
        duration: '25-35 min',
        cooldown: 'Alongamento — 3 min',
        exercises: [
          { name: hasBackIssue ? 'Leg press 45°' : 'Terra (deadlift)', sets: 2, reps: '5-6', rest: '180s', notes: 'RPE 9. Composto pesado — essencial para preservar força em cutting.' },
          { name: 'Leg press 45°', sets: 2, reps: '10-12', rest: '120s', notes: 'RPE 9.' },
          { name: 'Cadeira extensora', sets: 2, reps: '10-15', rest: '90s', notes: hasKneeIssue ? 'Amplitude parcial. RPE 9.' : 'RPE 10 (falha).' },
          { name: 'Panturrilha sentado', sets: 2, reps: '10-15', rest: '90s', notes: 'RPE 10 (falha).' },
        ],
      },
      {
        day: 'Sábado / Domingo',
        focus: 'Recuperação + Cardio leve (opcional)',
        warmup: '-',
        duration: '-',
        cooldown: '-',
        exercises: [
          { name: 'Descanso ou caminhada leve (30 min)', sets: 1, reps: '-', rest: '-', notes: 'Em déficit calórico, a recuperação é AINDA mais importante. Ref: Samuel Meller.' },
        ],
      },
    ];
  }

  // Performance / Saúde — Low Volume funcional
  return [
    {
      day: 'Segunda',
      focus: 'Upper Body — Compostos (Low Volume)',
      warmup: '2 séries progressivas (50% e 75%)',
      duration: '30-35 min',
      cooldown: 'Alongamento — 3 min',
      exercises: [
        { name: 'Supino reto com barra', sets: 2, reps: '6-8', rest: '120-180s', notes: 'RPE 9. Progressão de carga é o objetivo principal.' },
        { name: 'Remada curvada com barra', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 9.' },
        { name: hasShoulderIssue ? 'Elevação lateral com cabos' : 'Desenvolvimento com halteres', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 9.' },
        { name: 'Face pull na polia', sets: 2, reps: '12-15', rest: '60s', notes: 'Saúde do ombro. RPE 8.' },
      ],
    },
    {
      day: 'Terça',
      focus: 'Lower Body — Compostos (Low Volume)',
      warmup: '2 séries progressivas (50% e 75%)',
      duration: '30-35 min',
      cooldown: 'Foam rolling — 5 min',
      exercises: [
        { name: hasKneeIssue ? 'Leg press 45°' : 'Agachamento livre', sets: 2, reps: '6-8', rest: '180s', notes: 'RPE 9.' },
        { name: hasBackIssue ? 'Stiff com halteres' : 'Stiff com barra', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 9.' },
        { name: 'Agachamento búlgaro', sets: 2, reps: '8-10 (cada)', rest: '90s', notes: 'RPE 9.' },
        { name: 'Panturrilha em pé', sets: 3, reps: '10-15', rest: '90s', notes: 'RPE 10 (falha).' },
      ],
    },
    {
      day: 'Quarta',
      focus: 'Recuperação ativa + Mobilidade',
      warmup: '-',
      duration: '20-30 min',
      cooldown: '-',
      exercises: [
        { name: 'Caminhada ou mobilidade articular', sets: 1, reps: '20-30 min', rest: '-', notes: 'Recuperação ativa. Low Volume = treinos curtos e intensos + descanso real.' },
      ],
    },
    {
      day: 'Quinta',
      focus: 'Upper Body B (Low Volume)',
      warmup: '2 séries progressivas (50% e 75%)',
      duration: '30-35 min',
      cooldown: 'Alongamento — 3 min',
      exercises: [
        { name: 'Barra fixa', sets: 2, reps: '6-10', rest: '120s', notes: 'RPE 9-10.' },
        { name: 'Supino inclinado com halteres', sets: 2, reps: '8-10', rest: '120s', notes: 'RPE 9.' },
        { name: 'Rosca direta + Tríceps polia (bi-set)', sets: 2, reps: '10-12 cada', rest: '90s', notes: 'RPE 10 (falha). Braços: poucas séries intensas.' },
        { name: 'Elevação lateral', sets: 2, reps: '12-15', rest: '60s', notes: 'RPE 10 (falha).' },
      ],
    },
    {
      day: 'Sexta',
      focus: 'Lower Body B (Low Volume)',
      warmup: '2 séries progressivas (50% e 75%)',
      duration: '30-35 min',
      cooldown: 'Foam rolling — 5 min',
      exercises: [
        { name: hasBackIssue ? 'Leg press 45°' : 'Terra (deadlift)', sets: 2, reps: '5-6', rest: '180s', notes: 'RPE 9.' },
        { name: 'Leg press 45°', sets: 2, reps: '10-12', rest: '120s', notes: 'RPE 9.' },
        { name: 'Hip thrust', sets: 2, reps: '8-12', rest: '90s', notes: 'RPE 9-10.' },
        { name: 'Panturrilha sentado', sets: 3, reps: '10-15', rest: '90s', notes: 'RPE 10 (falha).' },
      ],
    },
  ];
}

// === SCHEDULE HELPER ===

function parseHour(timeStr: string): number {
  const [h] = (timeStr || '08:00').split(':').map(Number);
  return h;
}

function getScheduleSlots(profile: UserProfile) {
  const workStart = parseHour(profile.personal.workStartTime);
  const workEnd = parseHour(profile.personal.workEndTime);
  const pref = profile.personal.preferredTrainingTime || 'manha';

  let trainTime: number;
  if (pref === 'manha') trainTime = Math.max(workStart - 2, 5);
  else if (pref === 'almoco') trainTime = 12;
  else if (pref === 'tarde') trainTime = workEnd + 1;
  else trainTime = Math.max(workEnd + 2, 19);

  const wakeHour = pref === 'manha' ? trainTime - 1 : workStart - 2;
  const wake = Math.max(wakeHour, 4);

  // Meals around work + train
  const meal1 = wake; // right after waking
  const preTrain = trainTime - 1;
  const postTrain = trainTime + 1.5;
  const lunch = workStart <= 12 && workEnd >= 13 ? 12 : Math.round((workStart + workEnd) / 2);
  const dinner = Math.max(workEnd + 1, 19);
  const snack = Math.round((lunch + dinner) / 2);
  const ceia = dinner + 2;

  const fmt = (h: number) => {
    const hh = Math.floor(h);
    const mm = Math.round((h - hh) * 60);
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };

  return { trainTime: fmt(trainTime), wake: fmt(wake), meal1: fmt(meal1), preTrain: fmt(preTrain), postTrain: fmt(postTrain), lunch: fmt(lunch), dinner: fmt(dinner), snack: fmt(snack), ceia: fmt(ceia) };
}

// === NUTRITION PROTOCOLS ===
// Based on: ISSN Position Stands (Jäger et al., 2017), Alan Aragon's guidelines,
// Eric Helms' Muscle & Strength Pyramid, Layne Norton's research

function generateNutritionPlan(profile: UserProfile): NutritionPlan {
  const weight = parseFloat(profile.physical.weight) || 80;
  const height = parseFloat(profile.physical.height) || 175;
  const age = parseInt(profile.personal.age) || 25;
  const objective = profile.physical.objective;
  const bodyFat = parseFloat(profile.physical.bodyFat) || 18;

  // Mifflin-St Jeor BMR estimation
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  const activityMultiplier = parseInt(profile.physical.trainingFrequency) >= 5 ? 1.725 : 1.55;
  const tdee = Math.round(bmr * activityMultiplier);

  let dailyCalories: number;
  let proteinPerKg: number;
  let fatPerKg: number;
  let goal: string;

  if (objective === 'hipertrofia') {
    dailyCalories = tdee + 350; // Lean bulk — Ref: Iraki et al., 2019
    proteinPerKg = 2.0; // ISSN: 1.6-2.2g/kg
    fatPerKg = 1.0;
    goal = 'Superávit calórico controlado (+350 kcal) para ganho muscular com mínimo ganho de gordura';
  } else if (objective === 'definição') {
    dailyCalories = tdee - 500; // Moderate deficit — Helms et al., 2014
    proteinPerKg = 2.3; // Higher protein in deficit to preserve muscle
    fatPerKg = 0.8;
    goal = 'Déficit calórico moderado (-500 kcal) preservando massa muscular';
  } else {
    dailyCalories = tdee;
    proteinPerKg = 1.8;
    fatPerKg = 1.0;
    goal = 'Manutenção calórica para performance e saúde otimizadas';
  }

  const protein = Math.round(weight * proteinPerKg);
  const fat = Math.round(weight * fatPerKg);
  const carbCalories = dailyCalories - (protein * 4) - (fat * 9);
  const carbs = Math.round(carbCalories / 4);
  const schedule = getScheduleSlots(profile);

  const meals: Meal[] = objective === 'hipertrofia' ? [
    {
      name: 'Refeição 1 — Pré-treino',
      time: schedule.preTrain,
      foods: [
        { item: 'Aveia em flocos', quantity: '80g', calories: 300, protein: 10, carbs: 54, fat: 6 },
        { item: 'Whey protein isolado', quantity: '30g (1 scoop)', calories: 120, protein: 25, carbs: 2, fat: 1 },
        { item: 'Banana', quantity: '1 unidade', calories: 105, protein: 1, carbs: 27, fat: 0 },
        { item: 'Pasta de amendoim', quantity: '15g', calories: 90, protein: 4, carbs: 3, fat: 8 },
      ],
      totalCalories: 615,
      totalProtein: 40,
    },
    {
      name: 'Refeição 2 — Pós-treino',
      time: schedule.postTrain,
      foods: [
        { item: 'Peito de frango grelhado', quantity: '200g', calories: 330, protein: 62, carbs: 0, fat: 7 },
        { item: 'Arroz branco', quantity: '150g (cozido)', calories: 195, protein: 4, carbs: 43, fat: 0 },
        { item: 'Batata doce', quantity: '150g', calories: 130, protein: 2, carbs: 30, fat: 0 },
        { item: 'Brócolis', quantity: '100g', calories: 35, protein: 3, carbs: 7, fat: 0 },
      ],
      totalCalories: 690,
      totalProtein: 71,
    },
    {
      name: 'Refeição 3 — Almoço',
      time: schedule.lunch,
      foods: [
        { item: 'Patinho moído (carne vermelha magra)', quantity: '180g', calories: 280, protein: 45, carbs: 0, fat: 10 },
        { item: 'Arroz integral', quantity: '120g (cozido)', calories: 140, protein: 3, carbs: 30, fat: 1 },
        { item: 'Feijão preto', quantity: '100g (cozido)', calories: 130, protein: 9, carbs: 23, fat: 0 },
        { item: 'Salada verde (alface, tomate, pepino)', quantity: 'à vontade', calories: 30, protein: 2, carbs: 5, fat: 0 },
        { item: 'Azeite extra virgem', quantity: '10ml', calories: 88, protein: 0, carbs: 0, fat: 10 },
      ],
      totalCalories: 668,
      totalProtein: 59,
    },
    {
      name: 'Refeição 4 — Lanche da tarde',
      time: schedule.snack,
      foods: [
        { item: 'Ovos inteiros', quantity: '3 unidades', calories: 210, protein: 18, carbs: 0, fat: 15 },
        { item: 'Pão integral', quantity: '2 fatias', calories: 140, protein: 6, carbs: 24, fat: 2 },
        { item: 'Queijo cottage', quantity: '50g', calories: 50, protein: 6, carbs: 2, fat: 2 },
      ],
      totalCalories: 400,
      totalProtein: 30,
    },
    {
      name: 'Refeição 5 — Jantar',
      time: schedule.dinner,
      foods: [
        { item: 'Salmão grelhado', quantity: '180g', calories: 370, protein: 40, carbs: 0, fat: 22 },
        { item: 'Quinoa', quantity: '100g (cozida)', calories: 120, protein: 4, carbs: 21, fat: 2 },
        { item: 'Aspargos', quantity: '100g', calories: 20, protein: 2, carbs: 4, fat: 0 },
        { item: 'Abacate', quantity: '50g', calories: 80, protein: 1, carbs: 4, fat: 7 },
      ],
      totalCalories: 590,
      totalProtein: 47,
    },
    {
      name: 'Refeição 6 — Ceia (pré-sono)',
      time: schedule.ceia,
      foods: [
        { item: 'Caseína ou iogurte grego natural', quantity: '200g', calories: 130, protein: 20, carbs: 6, fat: 3 },
        { item: 'Castanha-do-pará', quantity: '3 unidades', calories: 60, protein: 1, carbs: 1, fat: 6 },
      ],
      totalCalories: 190,
      totalProtein: 21,
    },
  ] : objective === 'definição' ? [
    {
      name: 'Refeição 1 — Desjejum',
      time: schedule.meal1,
      foods: [
        { item: 'Ovos inteiros', quantity: '3 unidades', calories: 210, protein: 18, carbs: 0, fat: 15 },
        { item: 'Claras de ovo', quantity: '3 unidades', calories: 51, protein: 11, carbs: 0, fat: 0 },
        { item: 'Espinafre refogado', quantity: '100g', calories: 23, protein: 3, carbs: 4, fat: 0 },
        { item: 'Pão integral', quantity: '1 fatia', calories: 70, protein: 3, carbs: 12, fat: 1 },
      ],
      totalCalories: 354,
      totalProtein: 35,
    },
    {
      name: 'Refeição 2 — Almoço',
      time: schedule.lunch,
      foods: [
        { item: 'Peito de frango grelhado', quantity: '200g', calories: 330, protein: 62, carbs: 0, fat: 7 },
        { item: 'Arroz integral', quantity: '80g (cozido)', calories: 95, protein: 2, carbs: 20, fat: 1 },
        { item: 'Salada volumosa (folhas, tomate, pepino, cenoura)', quantity: 'à vontade', calories: 50, protein: 3, carbs: 10, fat: 0 },
        { item: 'Azeite extra virgem', quantity: '5ml', calories: 44, protein: 0, carbs: 0, fat: 5 },
      ],
      totalCalories: 519,
      totalProtein: 67,
    },
    {
      name: 'Refeição 3 — Lanche pré-treino',
      time: schedule.preTrain,
      foods: [
        { item: 'Whey protein isolado', quantity: '30g', calories: 120, protein: 25, carbs: 2, fat: 1 },
        { item: 'Banana', quantity: '1 unidade', calories: 105, protein: 1, carbs: 27, fat: 0 },
      ],
      totalCalories: 225,
      totalProtein: 26,
    },
    {
      name: 'Refeição 4 — Jantar (pós-treino)',
      time: schedule.postTrain,
      foods: [
        { item: 'Tilápia grelhada', quantity: '200g', calories: 200, protein: 42, carbs: 0, fat: 3 },
        { item: 'Batata doce', quantity: '120g', calories: 104, protein: 2, carbs: 24, fat: 0 },
        { item: 'Brócolis no vapor', quantity: '150g', calories: 53, protein: 5, carbs: 10, fat: 0 },
      ],
      totalCalories: 357,
      totalProtein: 49,
    },
    {
      name: 'Refeição 5 — Ceia',
      time: schedule.ceia,
      foods: [
        { item: 'Caseína ou iogurte grego 0%', quantity: '200g', calories: 100, protein: 18, carbs: 6, fat: 0 },
        { item: 'Semente de chia', quantity: '10g', calories: 49, protein: 2, carbs: 4, fat: 3 },
      ],
      totalCalories: 149,
      totalProtein: 20,
    },
  ] : [
    // Performance / Saúde
    {
      name: 'Refeição 1 — Desjejum',
      time: schedule.meal1,
      foods: [
        { item: 'Aveia em flocos', quantity: '60g', calories: 225, protein: 8, carbs: 41, fat: 4 },
        { item: 'Whey protein', quantity: '30g', calories: 120, protein: 25, carbs: 2, fat: 1 },
        { item: 'Frutas vermelhas (mix)', quantity: '100g', calories: 50, protein: 1, carbs: 12, fat: 0 },
        { item: 'Castanhas mistas', quantity: '20g', calories: 120, protein: 3, carbs: 4, fat: 10 },
      ],
      totalCalories: 515,
      totalProtein: 37,
    },
    {
      name: 'Refeição 2 — Almoço',
      time: schedule.lunch,
      foods: [
        { item: 'Frango ou peixe', quantity: '180g', calories: 300, protein: 50, carbs: 0, fat: 8 },
        { item: 'Arroz + Feijão', quantity: '150g + 80g', calories: 280, protein: 10, carbs: 50, fat: 2 },
        { item: 'Legumes variados', quantity: '150g', calories: 60, protein: 4, carbs: 12, fat: 0 },
        { item: 'Azeite', quantity: '10ml', calories: 88, protein: 0, carbs: 0, fat: 10 },
      ],
      totalCalories: 728,
      totalProtein: 64,
    },
    {
      name: 'Refeição 3 — Lanche',
      time: schedule.snack,
      foods: [
        { item: 'Ovos (inteiros)', quantity: '2 unidades', calories: 140, protein: 12, carbs: 0, fat: 10 },
        { item: 'Abacate', quantity: '80g', calories: 128, protein: 2, carbs: 7, fat: 12 },
        { item: 'Pão integral', quantity: '1 fatia', calories: 70, protein: 3, carbs: 12, fat: 1 },
      ],
      totalCalories: 338,
      totalProtein: 17,
    },
    {
      name: 'Refeição 4 — Jantar',
      time: schedule.dinner,
      foods: [
        { item: 'Carne vermelha magra', quantity: '180g', calories: 280, protein: 45, carbs: 0, fat: 10 },
        { item: 'Batata doce ou mandioca', quantity: '150g', calories: 130, protein: 2, carbs: 30, fat: 0 },
        { item: 'Salada verde', quantity: 'à vontade', calories: 30, protein: 2, carbs: 5, fat: 0 },
      ],
      totalCalories: 440,
      totalProtein: 49,
    },
    {
      name: 'Refeição 5 — Ceia',
      time: schedule.ceia,
      foods: [
        { item: 'Iogurte grego natural', quantity: '170g', calories: 100, protein: 17, carbs: 6, fat: 0 },
        { item: 'Castanha-do-pará', quantity: '2 unidades', calories: 40, protein: 1, carbs: 1, fat: 4 },
      ],
      totalCalories: 140,
      totalProtein: 18,
    },
  ];

  const supplements = [
    { name: 'Creatina monohidratada', dosage: '5g/dia', timing: 'Qualquer horário, com água', reference: 'ISSN Position Stand — Kreider et al., 2017' },
    { name: 'Whey Protein Isolado', dosage: '30g pós-treino', timing: 'Dentro de 2h após treino', reference: 'Schoenfeld & Aragon, 2018 — meta-analysis' },
    { name: 'Vitamina D3', dosage: '2000-4000 UI/dia', timing: 'Com refeição gordurosa', reference: 'Endocrine Society Guidelines' },
    { name: 'Ômega 3 (EPA/DHA)', dosage: '2-3g/dia', timing: 'Com refeições', reference: 'AHA Recommendations' },
    { name: 'Magnésio bisglicinato', dosage: '200-400mg', timing: 'Antes de dormir', reference: 'Ref: Andrew Huberman — sono e recuperação' },
  ];

  if (objective === 'definição') {
    supplements.push({ name: 'Cafeína', dosage: '200-400mg', timing: '30 min pré-treino (antes das 14h)', reference: 'Goldstein et al., 2010 — ISSN' });
  }

  return {
    goal,
    dailyCalories,
    macros: { protein, carbs, fat },
    meals,
    hydration: `${Math.round(weight * 0.035 * 10) / 10}L/dia mínimo (${Math.round(weight * 0.045 * 10) / 10}L em dias de treino)`,
    supplements,
  };
}

// === ORIGINAL PROTOCOL ENGINE ===

export function generateProtocol(profile: UserProfile) {
  const { personal, physical, mental, financial, entrepreneur } = profile;
  const focusLevel = mental.focusLevel;
  const sleepHours = parseFloat(mental.avgSleepHours) || 7;
  const schedule = getScheduleSlots(profile);

  const workStart = parseHour(personal.workStartTime);
  const workEnd = parseHour(personal.workEndTime);
  const sleepHour = sleepHours >= 7 ? '22:00' : '22:30';

  const trainLabel = physical.objective === 'hipertrofia' ? 'Treino de força — Hipertrofia' : physical.objective === 'definição' ? 'Treino HIIT + Força' : 'Treino funcional / Performance';

  const dailyProtocol = [
    { time: schedule.wake, activity: 'Despertar — Sem celular por 30 min', icon: '⏰' },
    { time: schedule.meal1, activity: 'Hidratação + Refeição 1', icon: '☀️' },
    { time: schedule.trainTime, activity: trainLabel, icon: '🏋️' },
    { time: schedule.postTrain, activity: 'Refeição pós-treino', icon: '🥩' },
    { time: `${String(workStart).padStart(2, '0')}:00`, activity: `Bloco de foco profundo #1 (${focusLevel >= 7 ? '120' : '90'} min)`, icon: '🎯' },
    { time: `${String(workStart + 2).padStart(2, '0')}:30`, activity: 'Pausa estratégica — Caminhada ou respiração', icon: '🌬️' },
    { time: `${String(workStart + 3).padStart(2, '0')}:00`, activity: `Bloco de foco profundo #2 (${focusLevel >= 7 ? '120' : '90'} min)`, icon: '🎯' },
    { time: schedule.lunch, activity: 'Refeição — Almoço', icon: '🥗' },
    { time: `${String(Math.min(workEnd - 2, 15)).padStart(2, '0')}:00`, activity: 'Bloco de execução — Tarefas operacionais', icon: '⚡' },
    { time: schedule.snack, activity: 'Refeição — Lanche', icon: '🍎' },
    { time: `${String(workEnd - 1).padStart(2, '0')}:30`, activity: 'Leitura estratégica (30 min)', icon: '📚' },
    { time: schedule.dinner, activity: 'Refeição — Jantar', icon: '🍽️' },
    { time: `${String(workEnd + 2).padStart(2, '0')}:00`, activity: 'Tempo de lazer controlado (60 min)', icon: '🎮' },
    { time: schedule.ceia, activity: 'Ceia + Revisão do dia', icon: '📋' },
    { time: sleepHour, activity: 'Protocolo de sono — Sem telas', icon: '🌙' },
  ].sort((a, b) => a.time.localeCompare(b.time));

  const weeklyProtocol = [
    { day: 'Segunda', focus: 'Bloco máximo de execução', detail: 'Dia de maior produtividade. Zero distrações.' },
    { day: 'Terça', focus: 'Desenvolvimento de habilidades', detail: 'Estudo técnico + prática deliberada.' },
    { day: 'Quarta', focus: 'Networking + Estratégia', detail: 'Conexões estratégicas e planejamento.' },
    { day: 'Quinta', focus: 'Execução criativa', detail: 'Projetos, conteúdo, inovação.' },
    { day: 'Sexta', focus: 'Revisão + Otimização', detail: 'Análise semanal e ajustes.' },
    { day: 'Sábado', focus: 'Desenvolvimento pessoal', detail: 'Leitura, treino extra, lazer ativo.' },
    { day: 'Domingo', focus: 'Descanso estratégico', detail: 'Recuperação e planejamento semanal.' },
  ];

  const employmentType = financial.employmentType;
  const financialProtocol = {
    incomeStrategy: employmentType === 'empresario'
      ? 'Escalar faturamento otimizando margem e aquisição de clientes'
      : employmentType === 'autonomo'
        ? 'Criar oferta premium + aumentar ticket médio + escalar com tráfego pago'
        : 'Desenvolver habilidade monetizável paralela + negociar aumento + investir',
    skills: employmentType === 'empresario'
      ? ['Gestão de equipe', 'Tráfego pago avançado', 'Vendas consultivas', 'Liderança estratégica']
      : ['Marketing digital', 'Copywriting', 'Vendas', 'Gestão financeira'],
    investmentStrategy: parseFloat(financial.monthlyIncome) > 10000
      ? 'Reserva de emergência + Renda fixa + Ações + FIIs + Cripto (5%)'
      : 'Reserva de emergência (6 meses) + Renda fixa + Começar FIIs',
    monetization: employmentType === 'autonomo'
      ? 'Criar produto digital + consultoria premium + recorrência'
      : 'Freela especializado + infoproduto + prestação de serviço de alto valor',
  };

  const entrepreneurProtocol = entrepreneur.enabled ? {
    acquisition: `Canal principal: ${entrepreneur.acquisitionChannel || 'Tráfego pago'}. Diversificar com conteúdo orgânico e parcerias.`,
    funnel: 'Topo: Conteúdo educativo → Meio: Lead magnet + Email → Fundo: Oferta direta + Prova social',
    scale: [
      'Automatizar processos operacionais',
      'Contratar para funções não-core',
      'Criar sistemas, não depender de pessoas',
      'Documentar SOPs de tudo',
    ],
    kpis: ['CAC', 'LTV', 'Churn Rate', 'MRR', 'Margem líquida', 'NPS'],
    leadership: [
      'Delegar com clareza: resultado esperado + prazo + critérios',
      'Feedback semanal estruturado',
      'Reuniões objetivas de 15 min',
      'Cultura de ownership na equipe',
    ],
    branding: 'Posicionamento de autoridade. Conteúdo que demonstra expertise. Consistência visual e verbal.',
  } : null;

  const library = {
    books: [
      { title: 'Atomic Habits', author: 'James Clear', category: 'Produtividade' },
      { title: 'O Ego é Seu Inimigo', author: 'Ryan Holiday', category: 'Mentalidade' },
      { title: 'Deep Work', author: 'Cal Newport', category: 'Foco' },
      { title: 'O Investidor Inteligente', author: 'Benjamin Graham', category: 'Finanças' },
      { title: 'A Arte da Guerra', author: 'Sun Tzu', category: 'Estratégia' },
      { title: '$100M Offers', author: 'Alex Hormozi', category: 'Negócios' },
    ],
    tools: [
      { name: 'Notion', use: 'Organização e planejamento' },
      { name: 'Toggl Track', use: 'Controle de tempo' },
      { name: 'Cold Turkey', use: 'Bloqueio de distrações' },
      { name: 'Whoop/Oura Ring', use: 'Monitoramento de sono e recovery' },
    ],
    podcasts: [
      { name: 'Huberman Lab', focus: 'Neurociência aplicada' },
      { name: 'My First Million', focus: 'Negócios e oportunidades' },
      { name: 'Lex Fridman', focus: 'Conversas profundas' },
    ],
  };

  const workoutPlan = generateWorkoutPlan(profile);
  const nutritionPlan = generateNutritionPlan(profile);

  return { dailyProtocol, weeklyProtocol, financialProtocol, entrepreneurProtocol, library, workoutPlan, nutritionPlan };
}
