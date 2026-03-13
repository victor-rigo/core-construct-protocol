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

interface FoodItem {
  item: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  alternative?: string;
}

interface Meal {
  name: string;
  time: string;
  foods: FoodItem[];
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
  const nutrition = profile.nutrition || {} as any;

  // Parse nutrition preferences
  const allergies = (nutrition.allergies || '').toLowerCase();
  const disliked = (nutrition.dislikedFoods || '').toLowerCase();
  const canAffordSupplements = nutrition.canAffordSupplements === 'sim';
  const maybeSupplements = nutrition.canAffordSupplements === 'depende';
  const mealsPerDay = parseInt(nutrition.mealsPerDay) || 4;
  const waterIntakeLabel = nutrition.dailyWaterIntake || '';
  const alcohol = nutrition.alcoholConsumption || 'não';
  const smoking = nutrition.smoking || 'não';

  // Helper to check if a food is forbidden
  const isForbidden = (food: string): boolean => {
    const lower = food.toLowerCase();
    const forbidden = [allergies, disliked].filter(Boolean);
    return forbidden.some(list => {
      const items = list.split(/[,;]+/).map(s => s.trim()).filter(Boolean);
      return items.some(item => lower.includes(item) || item.includes(lower.split(' ')[0]));
    });
  };

  // Mifflin-St Jeor BMR estimation
  const bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  const activityMultiplier = parseInt(profile.physical.trainingFrequency) >= 5 ? 1.725 : 1.55;
  const tdee = Math.round(bmr * activityMultiplier);

  let dailyCalories: number;
  let proteinPerKg: number;
  let fatPerKg: number;
  let goal: string;

  if (objective === 'hipertrofia') {
    dailyCalories = tdee + 350;
    proteinPerKg = 2.0;
    fatPerKg = 1.0;
    goal = 'Superávit calórico controlado (+350 kcal) para ganho muscular com mínimo ganho de gordura';
  } else if (objective === 'definição') {
    dailyCalories = tdee - 500;
    proteinPerKg = 2.3;
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

  // === FOOD DATABASE WITH ALTERNATIVES ===
  type FoodEntry = { item: string; alt: string; quantity: string; calories: number; protein: number; carbs: number; fat: number };

  const proteinSources: FoodEntry[] = [
    { item: 'Peito de frango grelhado', alt: 'Carne moída magra', quantity: '200g', calories: 330, protein: 62, carbs: 0, fat: 7 },
    { item: 'Patinho moído', alt: 'Peito de peru', quantity: '180g', calories: 280, protein: 45, carbs: 0, fat: 10 },
    { item: 'Tilápia grelhada', alt: 'Frango desfiado', quantity: '200g', calories: 200, protein: 42, carbs: 0, fat: 3 },
    { item: 'Salmão grelhado', alt: 'Sardinha em lata (escorrida)', quantity: '180g', calories: 370, protein: 40, carbs: 0, fat: 22 },
    { item: 'Ovos inteiros', alt: 'Peito de frango em cubos', quantity: '3 unidades', calories: 210, protein: 18, carbs: 0, fat: 15 },
  ];

  const carbSources: FoodEntry[] = [
    { item: 'Arroz branco', alt: 'Macarrão integral', quantity: '150g (cozido)', calories: 195, protein: 4, carbs: 43, fat: 0 },
    { item: 'Batata doce', alt: 'Mandioca cozida', quantity: '150g', calories: 130, protein: 2, carbs: 30, fat: 0 },
    { item: 'Arroz integral', alt: 'Arroz branco', quantity: '120g (cozido)', calories: 140, protein: 3, carbs: 30, fat: 1 },
    { item: 'Aveia em flocos', alt: 'Tapioca', quantity: '80g', calories: 300, protein: 10, carbs: 54, fat: 6 },
    { item: 'Pão integral', alt: 'Cuscuz', quantity: '2 fatias', calories: 140, protein: 6, carbs: 24, fat: 2 },
  ];

  const fatSources: FoodEntry[] = [
    { item: 'Pasta de amendoim', alt: 'Azeite extra virgem (10ml)', quantity: '15g', calories: 90, protein: 4, carbs: 3, fat: 8 },
    { item: 'Abacate', alt: 'Castanhas mistas', quantity: '50g', calories: 80, protein: 1, carbs: 4, fat: 7 },
    { item: 'Castanha-do-pará', alt: 'Nozes', quantity: '3 unidades', calories: 60, protein: 1, carbs: 1, fat: 6 },
    { item: 'Azeite extra virgem', alt: 'Óleo de coco', quantity: '10ml', calories: 88, protein: 0, carbs: 0, fat: 10 },
  ];

  const supplementProteins: FoodEntry[] = [
    { item: 'Whey protein isolado', alt: '4 ovos inteiros', quantity: '30g (1 scoop)', calories: 120, protein: 25, carbs: 2, fat: 1 },
    { item: 'Caseína', alt: 'Iogurte grego natural (200g)', quantity: '30g', calories: 120, protein: 24, carbs: 3, fat: 1 },
  ];

  const vegSources: FoodEntry[] = [
    { item: 'Brócolis', alt: 'Couve-flor', quantity: '100g', calories: 35, protein: 3, carbs: 7, fat: 0 },
    { item: 'Espinafre refogado', alt: 'Couve refogada', quantity: '100g', calories: 23, protein: 3, carbs: 4, fat: 0 },
    { item: 'Salada verde (alface, tomate, pepino)', alt: 'Legumes variados', quantity: 'à vontade', calories: 30, protein: 2, carbs: 5, fat: 0 },
  ];

  // Pick a food that's not forbidden, with alternative
  const pickFood = (options: FoodEntry[]): FoodItem | null => {
    for (const f of options) {
      if (!isForbidden(f.item)) {
        const altStr = !isForbidden(f.alt) ? f.alt : undefined;
        return { item: f.item, quantity: f.quantity, calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat, alternative: altStr };
      }
      // Try alt as primary
      if (!isForbidden(f.alt)) {
        return { item: f.alt, quantity: f.quantity, calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat };
      }
    }
    return options.length > 0 ? { item: options[0].item, quantity: options[0].quantity, calories: options[0].calories, protein: options[0].protein, carbs: options[0].carbs, fat: options[0].fat, alternative: options[0].alt } : null;
  };

  const pickProteinSupp = (): FoodItem | null => {
    if (!canAffordSupplements && !maybeSupplements) {
      // Use whole food alternative directly
      for (const f of supplementProteins) {
        if (!isForbidden(f.alt)) {
          return { item: f.alt, quantity: f.quantity, calories: f.calories, protein: f.protein, carbs: f.carbs, fat: f.fat };
        }
      }
    }
    return pickFood(supplementProteins);
  };

  // Build meals based on mealsPerDay
  const mealSlots: { name: string; time: string }[] = [];
  if (mealsPerDay >= 2) {
    mealSlots.push({ name: 'Refeição 1 — Desjejum', time: schedule.meal1 });
    mealSlots.push({ name: `Refeição ${mealsPerDay} — Jantar`, time: schedule.dinner });
  }
  if (mealsPerDay >= 3) {
    mealSlots.splice(1, 0, { name: 'Refeição 2 — Almoço', time: schedule.lunch });
  }
  if (mealsPerDay >= 4) {
    mealSlots.splice(1, 0, { name: 'Refeição 2 — Pré-treino', time: schedule.preTrain });
    // Rename others
    for (let i = 0; i < mealSlots.length; i++) {
      const num = i + 1;
      if (i === 0) mealSlots[i].name = `Refeição ${num} — Desjejum`;
      else if (i === mealSlots.length - 1) mealSlots[i].name = `Refeição ${num} — Jantar`;
      else if (mealSlots[i].time === schedule.lunch) mealSlots[i].name = `Refeição ${num} — Almoço`;
      else if (mealSlots[i].time === schedule.preTrain) mealSlots[i].name = `Refeição ${num} — Pré-treino`;
    }
  }
  if (mealsPerDay >= 5) {
    mealSlots.splice(mealSlots.length - 1, 0, { name: `Refeição ${mealsPerDay - 1} — Lanche`, time: schedule.snack });
    for (let i = 0; i < mealSlots.length; i++) mealSlots[i].name = mealSlots[i].name.replace(/^Refeição \d+/, `Refeição ${i + 1}`);
  }
  if (mealsPerDay >= 6) {
    mealSlots.push({ name: `Refeição ${mealsPerDay} — Ceia`, time: schedule.ceia });
    // Fix dinner name
    for (let i = 0; i < mealSlots.length; i++) mealSlots[i].name = mealSlots[i].name.replace(/^Refeição \d+/, `Refeição ${i + 1}`);
  }

  // Distribute calories across meals
  const calPerMeal = Math.round(dailyCalories / mealSlots.length);

  const meals: Meal[] = mealSlots.map((slot, idx) => {
    const foods: FoodItem[] = [];
    const isBreakfast = idx === 0;
    const isPreTrain = slot.time === schedule.preTrain;
    const isDinner = slot.name.includes('Jantar') || slot.name.includes('Ceia');

    // Add protein source
    const protIdx = idx % proteinSources.length;
    if (isBreakfast || isPreTrain) {
      const suppProt = pickProteinSupp();
      if (suppProt) foods.push(suppProt);
      const egg = pickFood([proteinSources[4]]);
      if (!isPreTrain && egg) foods.push(egg);
    } else {
      const prot = pickFood([proteinSources[protIdx % 4]]);
      if (prot) foods.push(prot);
    }

    // Add carb source
    const carbIdx = idx % carbSources.length;
    const carb = pickFood(isBreakfast ? [carbSources[3], carbSources[4]] : [carbSources[carbIdx]]);
    if (carb) foods.push(carb);

    // Add veg (lunch/dinner)
    if (!isBreakfast && !isPreTrain) {
      const veg = pickFood([vegSources[idx % vegSources.length]]);
      if (veg) foods.push(veg);
    }

    // Add fat source for some meals
    if (idx % 2 === 0 || isDinner) {
      const fatFood = pickFood([fatSources[idx % fatSources.length]]);
      if (fatFood) foods.push(fatFood);
    }

    // Add fruit for breakfast/pre-train
    if (isBreakfast || isPreTrain) {
      if (!isForbidden('banana')) {
        foods.push({ item: 'Banana', quantity: '1 unidade', calories: 105, protein: 1, carbs: 27, fat: 0, alternative: 'Maçã' });
      } else if (!isForbidden('maçã')) {
        foods.push({ item: 'Maçã', quantity: '1 unidade', calories: 95, protein: 0, carbs: 25, fat: 0 });
      }
    }

    // Add feijão for lunch
    if (slot.name.includes('Almoço') && !isForbidden('feijão')) {
      foods.push({ item: 'Feijão preto', quantity: '100g (cozido)', calories: 130, protein: 9, carbs: 23, fat: 0, alternative: 'Lentilha' });
    }

    const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);
    const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);

    return { name: slot.name, time: slot.time, foods, totalCalories, totalProtein };
  });

  // === SCALE PORTIONS TO MATCH TARGET CALORIES ===
  const actualTotal = meals.reduce((sum, m) => sum + m.totalCalories, 0);
  if (actualTotal > 0 && Math.abs(actualTotal - dailyCalories) > 50) {
    const scaleFactor = dailyCalories / actualTotal;
    for (const meal of meals) {
      for (const food of meal.foods) {
        food.calories = Math.round(food.calories * scaleFactor);
        food.protein = Math.round(food.protein * scaleFactor);
        food.carbs = Math.round(food.carbs * scaleFactor);
        food.fat = Math.round(food.fat * scaleFactor);
        // Scale quantity text if numeric
        const qtyMatch = food.quantity.match(/^(\d+(?:\.\d+)?)(.*)/);
        if (qtyMatch) {
          const newQty = Math.round(parseFloat(qtyMatch[1]) * scaleFactor);
          food.quantity = `${newQty}${qtyMatch[2]}`;
        }
      }
      meal.totalCalories = meal.foods.reduce((s, f) => s + f.calories, 0);
      meal.totalProtein = meal.foods.reduce((s, f) => s + f.protein, 0);
    }
  }

  // === HYDRATION ===
  const recommendedWaterMl = Math.round(weight * 35);
  const recommendedWaterL = (recommendedWaterMl / 1000).toFixed(1);
  const currentWaterMap: Record<string, string> = {
    'menos_1L': '< 1L', '1L': '1L', '2L': '2L', '3L': '3L', 'mais_3L': '> 3L',
  };
  const currentWater = currentWaterMap[waterIntakeLabel] || 'Não informado';
  const currentWaterNum = waterIntakeLabel === 'menos_1L' ? 0.7 : waterIntakeLabel === '1L' ? 1 : waterIntakeLabel === '2L' ? 2 : waterIntakeLabel === '3L' ? 3 : waterIntakeLabel === 'mais_3L' ? 3.5 : 0;
  const waterDiff = (recommendedWaterMl / 1000) - currentWaterNum;

  let hydrationText = `💧 Consumo atual: ${currentWater} | Recomendado: ${recommendedWaterL}L/dia (${weight}kg × 35ml)`;
  if (waterDiff > 0.3) {
    hydrationText += ` | ⚠️ Aumente ${waterDiff.toFixed(1)}L para atingir o ideal`;
  } else if (currentWaterNum > 0) {
    hydrationText += ` | ✅ Consumo adequado`;
  }

  // === SUPPLEMENTS (conditional) ===
  const supplements: { name: string; dosage: string; timing: string; reference: string }[] = [];

  if (canAffordSupplements || maybeSupplements) {
    supplements.push(
      { name: 'Creatina monohidratada', dosage: '5g/dia', timing: 'Qualquer horário, com água', reference: 'ISSN Position Stand — Kreider et al., 2017' },
      { name: 'Whey Protein Isolado', dosage: '30g pós-treino', timing: 'Dentro de 2h após treino', reference: 'Schoenfeld & Aragon, 2018' },
    );
    if (maybeSupplements) {
      supplements.forEach(s => s.name += ' (opcional)');
    }
    supplements.push(
      { name: 'Vitamina D3', dosage: '2000-4000 UI/dia', timing: 'Com refeição gordurosa', reference: 'Endocrine Society Guidelines' },
      { name: 'Magnésio bisglicinato', dosage: '200-400mg', timing: 'Antes de dormir', reference: 'Andrew Huberman — sono e recuperação' },
    );
    if (objective === 'definição') {
      supplements.push({ name: 'Cafeína', dosage: '200-400mg', timing: '30 min pré-treino (antes das 14h)', reference: 'Goldstein et al., 2010 — ISSN' });
    }
  }

  // Alcohol/smoking warnings in goal
  let warnings = '';
  if (alcohol === 'frequentemente') {
    warnings += ' ⚠️ Consumo frequente de álcool compromete síntese proteica e recuperação muscular.';
  } else if (alcohol === 'socialmente') {
    warnings += ' ℹ️ Consumo social de álcool: priorize refeições ricas em proteína antes e hidratação extra.';
  }
  if (smoking === 'sim') {
    warnings += ' ⚠️ Tabagismo regular reduz VO2max e dificulta ganho muscular.';
  }
  if (warnings) goal += warnings;

  return {
    goal,
    dailyCalories,
    macros: { protein, carbs, fat },
    meals,
    hydration: hydrationText,
    supplements,
  };
}

// === ENTREPRENEUR DATA TABLES ===

export interface FinancialDiagnosis {
  metric: string;
  value: string;
  status: 'good' | 'warning' | 'critical';
}

export interface MarginScenario {
  scenario: string;
  newMargin: string;
  monthlyProfit: string;
  annualProfit: string;
  gain: string;
}

export interface AcquisitionMetric {
  channel: string;
  estimatedCAC: string;
  ltv: string;
  ltvCacRatio: string;
  status: 'good' | 'warning' | 'critical';
}

export interface FunnelStage {
  stage: string;
  conversionRate: string;
  volumeNeeded: string;
  benchmark: string;
  status: 'good' | 'warning' | 'critical';
}

export interface ScaleAction {
  action: string;
  impact: 'alto' | 'médio' | 'baixo';
  deadline: string;
  priority: number;
}

export interface KPITarget {
  kpi: string;
  current: string;
  optimized: string;
  benchmark: string;
  status: 'good' | 'warning' | 'critical';
}

export interface EntrepreneurData {
  financialDiagnosis: FinancialDiagnosis[];
  marginScenarios: MarginScenario[];
  acquisitionMetrics: AcquisitionMetric[];
  funnelStages: FunnelStage[];
  scaleActions: ScaleAction[];
  kpiTargets: KPITarget[];
  summary: { revenue: number; profit: number; marginPercent: number; mainBottleneck: string };
}

function generateEntrepreneurData(profile: UserProfile): EntrepreneurData {
  const revenue = parseFloat(profile.entrepreneur.monthlyRevenue) || 10000;
  const marginPercent = parseFloat(profile.entrepreneur.margin) || 20;
  const profit = revenue * (marginPercent / 100);
  const opCost = revenue - profit;
  const breakEven = opCost;
  const model = profile.entrepreneur.businessModel || 'serviço';
  const bottleneck = profile.entrepreneur.mainBottleneck || 'aquisição';
  const channel = profile.entrepreneur.acquisitionChannel || 'tráfego pago';
  const incomeGoal = parseFloat(profile.personal.incomeGoal) || revenue * 1.5;

  const fmt = (v: number) => `R$ ${v.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}`;

  // Financial Diagnosis
  const financialDiagnosis: FinancialDiagnosis[] = [
    { metric: 'Faturamento mensal', value: fmt(revenue), status: revenue >= 50000 ? 'good' : revenue >= 15000 ? 'warning' : 'critical' },
    { metric: 'Margem real (%)', value: `${marginPercent}%`, status: marginPercent >= 30 ? 'good' : marginPercent >= 15 ? 'warning' : 'critical' },
    { metric: 'Lucro líquido mensal', value: fmt(profit), status: profit >= 10000 ? 'good' : profit >= 3000 ? 'warning' : 'critical' },
    { metric: 'Custo operacional', value: fmt(opCost), status: opCost / revenue <= 0.6 ? 'good' : opCost / revenue <= 0.8 ? 'warning' : 'critical' },
    { metric: 'Ponto de equilíbrio', value: fmt(breakEven), status: breakEven < revenue * 0.7 ? 'good' : 'warning' },
    { metric: 'Lucro anual projetado', value: fmt(profit * 12), status: profit * 12 >= 120000 ? 'good' : 'warning' },
  ];

  // Margin Optimization Scenarios
  const scenarios = [5, 10, 15, 20];
  const marginScenarios: MarginScenario[] = scenarios.map(bump => {
    const newMargin = marginPercent + bump;
    const newProfit = revenue * (newMargin / 100);
    const gainVal = newProfit - profit;
    return {
      scenario: `+${bump}% margem`,
      newMargin: `${newMargin}%`,
      monthlyProfit: fmt(newProfit),
      annualProfit: fmt(newProfit * 12),
      gain: `+${fmt(gainVal)}/mês`,
    };
  });

  // Acquisition Metrics
  const ticketMedio = model === 'saas' ? revenue / 50 : model === 'ecommerce' ? revenue / 200 : revenue / 15;
  const ltvMultiplier = model === 'saas' ? 12 : model === 'ecommerce' ? 3 : 6;
  const ltv = ticketMedio * ltvMultiplier;
  const clientesNecessarios = Math.ceil(incomeGoal / ticketMedio);

  const acquisitionMetrics: AcquisitionMetric[] = [
    { channel: 'Orgânico (conteúdo)', estimatedCAC: fmt(ticketMedio * 0.1), ltv: fmt(ltv), ltvCacRatio: `${(ltv / (ticketMedio * 0.1)).toFixed(1)}x`, status: 'good' },
    { channel: 'Tráfego pago', estimatedCAC: fmt(ticketMedio * 0.3), ltv: fmt(ltv), ltvCacRatio: `${(ltv / (ticketMedio * 0.3)).toFixed(1)}x`, status: ltv / (ticketMedio * 0.3) >= 3 ? 'good' : 'warning' },
    { channel: 'Indicação / Referral', estimatedCAC: fmt(ticketMedio * 0.05), ltv: fmt(ltv * 1.2), ltvCacRatio: `${(ltv * 1.2 / (ticketMedio * 0.05)).toFixed(1)}x`, status: 'good' },
    { channel: 'Outbound / Prospecção', estimatedCAC: fmt(ticketMedio * 0.25), ltv: fmt(ltv), ltvCacRatio: `${(ltv / (ticketMedio * 0.25)).toFixed(1)}x`, status: ltv / (ticketMedio * 0.25) >= 3 ? 'good' : 'warning' },
  ];

  // Funnel Stages
  const funnelBenchmarks = model === 'saas'
    ? { topo: 3, meio: 15, fundo: 25 }
    : model === 'ecommerce'
      ? { topo: 2, meio: 10, fundo: 20 }
      : { topo: 5, meio: 20, fundo: 30 };

  const monthlyClients = Math.ceil(revenue / ticketMedio);
  const fundoNeeded = Math.ceil(monthlyClients / (funnelBenchmarks.fundo / 100));
  const meioNeeded = Math.ceil(fundoNeeded / (funnelBenchmarks.meio / 100));
  const topoNeeded = Math.ceil(meioNeeded / (funnelBenchmarks.topo / 100));

  const funnelStages: FunnelStage[] = [
    { stage: 'Topo — Alcance / Visitantes', conversionRate: `${funnelBenchmarks.topo}%`, volumeNeeded: topoNeeded.toLocaleString('pt-BR'), benchmark: `${funnelBenchmarks.topo}% (${model})`, status: 'warning' },
    { stage: 'Meio — Leads / Interessados', conversionRate: `${funnelBenchmarks.meio}%`, volumeNeeded: meioNeeded.toLocaleString('pt-BR'), benchmark: `${funnelBenchmarks.meio}% (${model})`, status: 'warning' },
    { stage: 'Fundo — Vendas / Clientes', conversionRate: `${funnelBenchmarks.fundo}%`, volumeNeeded: fundoNeeded.toLocaleString('pt-BR'), benchmark: `${funnelBenchmarks.fundo}% (${model})`, status: monthlyClients >= 10 ? 'good' : 'warning' },
  ];

  // Scale Actions
  const scaleActions: ScaleAction[] = [
    { action: bottleneck === 'aquisição' ? 'Implementar canal de tráfego pago validado' : 'Otimizar processo de entrega', impact: 'alto', deadline: '30 dias', priority: 1 },
    { action: 'Documentar SOPs dos processos-chave', impact: 'alto', deadline: '15 dias', priority: 2 },
    { action: marginPercent < 25 ? 'Renegociar custos e cortar gastos improdutivos' : 'Criar oferta premium de ticket maior', impact: 'alto', deadline: '30 dias', priority: 3 },
    { action: profile.entrepreneur.hasTeam === 'sim' ? 'Implementar reuniões semanais de 15 min' : 'Contratar primeiro assistente para tarefas operacionais', impact: 'médio', deadline: '45 dias', priority: 4 },
    { action: 'Criar sistema de indicação com incentivo', impact: 'médio', deadline: '30 dias', priority: 5 },
    { action: 'Automatizar follow-up e nutrição de leads', impact: 'médio', deadline: '60 dias', priority: 6 },
    { action: 'Lançar produto/serviço recorrente (MRR)', impact: 'alto', deadline: '90 dias', priority: 7 },
    { action: 'Implementar NPS e pesquisa de satisfação', impact: 'baixo', deadline: '15 dias', priority: 8 },
  ];

  // KPI Targets
  const kpiTargets: KPITarget[] = [
    { kpi: 'Faturamento mensal', current: fmt(revenue), optimized: fmt(revenue * 1.5), benchmark: fmt(revenue * 2), status: revenue >= 50000 ? 'good' : 'warning' },
    { kpi: 'Margem líquida', current: `${marginPercent}%`, optimized: `${Math.min(marginPercent + 10, 50)}%`, benchmark: model === 'saas' ? '70-80%' : model === 'serviço' ? '40-60%' : '25-35%', status: marginPercent >= 30 ? 'good' : 'warning' },
    { kpi: 'CAC médio', current: fmt(ticketMedio * 0.3), optimized: fmt(ticketMedio * 0.15), benchmark: `< ${fmt(ticketMedio * 0.2)}`, status: 'warning' },
    { kpi: 'LTV', current: fmt(ltv), optimized: fmt(ltv * 1.5), benchmark: fmt(ltv * 2), status: ltv / (ticketMedio * 0.3) >= 3 ? 'good' : 'critical' },
    { kpi: 'LTV / CAC', current: `${(ltv / (ticketMedio * 0.3)).toFixed(1)}x`, optimized: `${(ltv * 1.5 / (ticketMedio * 0.15)).toFixed(1)}x`, benchmark: '> 3x', status: ltv / (ticketMedio * 0.3) >= 3 ? 'good' : 'critical' },
    { kpi: 'Clientes/mês', current: `${monthlyClients}`, optimized: `${clientesNecessarios}`, benchmark: `${Math.ceil(clientesNecessarios * 1.2)}`, status: monthlyClients >= clientesNecessarios ? 'good' : 'warning' },
    { kpi: 'Taxa de conversão do funil', current: `${funnelBenchmarks.fundo}%`, optimized: `${funnelBenchmarks.fundo + 10}%`, benchmark: `${funnelBenchmarks.fundo + 5}% (${model})`, status: 'warning' },
  ];

  return {
    financialDiagnosis,
    marginScenarios,
    acquisitionMetrics,
    funnelStages,
    scaleActions,
    kpiTargets,
    summary: { revenue, profit, marginPercent, mainBottleneck: bottleneck },
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

  const entrepreneurProtocol = entrepreneur.enabled ? generateEntrepreneurData(profile) : null;

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
