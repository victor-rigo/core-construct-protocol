import { UserProfile } from '@/store/useAppStore';

export function generateProtocol(profile: UserProfile) {
  const { personal, physical, mental, financial, entrepreneur } = profile;
  const focusLevel = mental.focusLevel;
  const discipline = mental.disciplineLevel;
  const sleepHours = parseFloat(mental.avgSleepHours) || 7;

  const wakeUpHour = sleepHours >= 7 ? '05:30' : '06:00';
  const sleepHour = sleepHours >= 7 ? '22:00' : '22:30';

  const dailyProtocol = [
    { time: wakeUpHour, activity: 'Despertar — Sem celular por 30 min', icon: '⏰' },
    { time: '06:00', activity: 'Hidratação + Exposição solar (10 min)', icon: '☀️' },
    { time: '06:30', activity: physical.objective === 'hipertrofia' ? 'Treino de força — Hipertrofia' : physical.objective === 'definição' ? 'Treino HIIT + Força' : 'Treino funcional / Performance', icon: '🏋️' },
    { time: '08:00', activity: 'Refeição 1 — Alta proteína', icon: '🥩' },
    { time: '08:30', activity: `Bloco de foco profundo #1 (${focusLevel >= 7 ? '120' : '90'} min)`, icon: '🎯' },
    { time: '10:30', activity: 'Pausa estratégica — Caminhada ou respiração', icon: '🌬️' },
    { time: '11:00', activity: `Bloco de foco profundo #2 (${focusLevel >= 7 ? '120' : '90'} min)`, icon: '🎯' },
    { time: '13:00', activity: 'Refeição 2 — Balanceada', icon: '🥗' },
    { time: '14:00', activity: 'Bloco de execução — Tarefas operacionais', icon: '⚡' },
    { time: '16:00', activity: 'Refeição 3 — Leve', icon: '🍎' },
    { time: '16:30', activity: 'Leitura estratégica (30 min)', icon: '📚' },
    { time: '17:00', activity: 'Bloco de foco profundo #3 (90 min)', icon: '🎯' },
    { time: '19:00', activity: 'Refeição 4 — Jantar', icon: '🍽️' },
    { time: '20:00', activity: 'Tempo de lazer controlado (60 min)', icon: '🎮' },
    { time: '21:00', activity: 'Revisão do dia + Planejamento do próximo', icon: '📋' },
    { time: sleepHour, activity: 'Protocolo de sono — Sem telas', icon: '🌙' },
  ];

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

  return { dailyProtocol, weeklyProtocol, financialProtocol, entrepreneurProtocol, library };
}
