import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import heroBg from '@/assets/hero-bg.jpg';
import { Check, Dumbbell, Brain, TrendingUp, Target, Clock, Shield, Zap, Crown } from 'lucide-react';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: 0.7 },
});

const Landing = () => {
  const navigate = useNavigate();
  const { hasCompletedOnboarding } = useAppStore();

  const pillars = [
    { icon: Clock, title: 'Protocolo Diário', desc: 'Rotina otimizada hora a hora com blocos de foco profundo, treino e recuperação.' },
    { icon: TrendingUp, title: 'Evolução Financeira', desc: 'Estratégia de aumento de renda, investimentos e monetização baseada no seu perfil.' },
    { icon: Dumbbell, title: 'Performance Física', desc: 'Treino periodizado com exercícios específicos, séries, reps e plano alimentar completo.' },
    { icon: Brain, title: 'Clareza Mental', desc: 'Controle de distrações, sono otimizado e protocolos de foco baseados em neurociência.' },
    { icon: Target, title: 'Sistema de Metas', desc: 'Metas diárias, semanais, mensais e anuais com tracking visual de progresso.' },
    { icon: Shield, title: 'Modo Empresário', desc: 'Funis, aquisição de clientes, KPIs, branding e estratégias de escala.' },
  ];

  const plans = [
    {
      name: 'Operacional',
      price: 'R$ 47',
      period: '/mês',
      desc: 'Para quem está começando a construir estrutura.',
      features: [
        'Protocolo diário personalizado',
        'Plano de treino básico',
        'Plano alimentar simplificado',
        'Sistema de metas',
        'Biblioteca estratégica',
      ],
      cta: 'Começar Agora',
      highlight: false,
    },
    {
      name: 'Protocolo',
      price: 'R$ 297',
      period: '/ano',
      desc: 'O sistema completo de evolução. Melhor custo-benefício.',
      features: [
        'Tudo do plano Operacional',
        'Treino periodizado detalhado',
        'Nutrição com macros e suplementação',
        'Protocolo semanal de revisão',
        'Protocolo financeiro completo',
        'Adaptação dinâmica do plano',
        'Modo Empresário',
      ],
      cta: 'Ativar Protocolo',
      highlight: true,
    },
    {
      name: 'Founder',
      price: 'R$ 997',
      period: '/ano',
      desc: 'Acesso vitalício. Para quem joga no nível mais alto.',
      features: [
        'Tudo do plano Protocolo',
        'Acesso vitalício ao sistema',
        'Atualizações prioritárias',
        'Protocolo de liderança avançado',
        'Estratégias de múltiplos 7 dígitos',
        'Comunidade exclusiva Founders',
        'Badge Founder no perfil',
      ],
      cta: 'Entrar como Founder',
      highlight: false,
    },
  ];

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Hero background */}
      <div className="absolute inset-0 h-screen">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
      </div>

      <div className="relative z-10">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-6">
          <motion.div {...fadeUp(0)} className="font-display text-xl font-bold tracking-widest">
            KOR
          </motion.div>
          <motion.div {...fadeUp(0)} className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
            Protocol
          </motion.div>
        </nav>

        {/* Hero */}
        <section className="min-h-[90vh] flex items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <motion.p {...fadeUp(0.2)} className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-8">
              Sistema de Evolução Pessoal
            </motion.p>
            <motion.h1 {...fadeUp(0.4)} className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] mb-6">
              Built From
              <br />
              <span className="text-gradient-gold">Within</span>
            </motion.h1>
            <motion.p {...fadeUp(0.7)} className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed">
              Disciplina. Estrutura. Crescimento interno que reflete externamente.
            </motion.p>
            <motion.div {...fadeUp(1)} className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate(hasCompletedOnboarding ? '/dashboard' : '/auth')}
                className="px-10 py-4 bg-primary text-primary-foreground font-display font-semibold text-sm tracking-widest uppercase hover:bg-primary/90 transition-all duration-300"
              >
                {hasCompletedOnboarding ? 'Acessar Protocolo' : 'Iniciar Protocolo'}
              </button>
              {!hasCompletedOnboarding && (
                <button
                  onClick={() => {
                    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-10 py-4 border border-border text-foreground font-display text-sm tracking-widest uppercase hover:bg-accent transition-all duration-300"
                >
                  Saiba Mais
                </button>
              )}
            </motion.div>
          </div>
        </section>

        {/* O que é o KOR */}
        <section id="about" className="py-24 md:py-32 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p {...fadeUp()} viewport={{ once: true }} whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-4">
              O que é o KOR Protocol
            </motion.p>
            <motion.h2 whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }} transition={{ delay: 0.1, duration: 0.7 }} className="text-3xl md:text-5xl font-display font-bold mb-8">
              Não é um app de produtividade.
              <br />
              <span className="text-muted-foreground">É um sistema operacional pessoal.</span>
            </motion.h2>
            <motion.p whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }} transition={{ delay: 0.2, duration: 0.7 }} className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              O KOR Protocol analisa profundamente seu perfil — físico, mental, financeiro e estratégico — e gera um protocolo de evolução completo e personalizado. Treinos com exercícios específicos. Dieta com alimentos e macros calculados. Rotina hora a hora. Estratégia financeira real. Tudo recalibrado dinamicamente conforme você evolui.
            </motion.p>
          </div>
        </section>

        {/* Como funciona */}
        <section className="py-16 md:py-24 px-6 md:px-12 border-t border-border/30">
          <div className="max-w-5xl mx-auto">
            <motion.p whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }} className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-4 text-center">
              Como funciona
            </motion.p>
            <motion.h2 whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-display font-bold mb-16 text-center">
              3 passos. Zero enrolação.
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: '01', title: 'Diagnóstico Profundo', desc: 'Preencha o formulário estratégico com dados sobre seu corpo, mente, finanças e objetivos. Quanto mais preciso, mais potente o protocolo.' },
                { step: '02', title: 'Geração do Protocolo', desc: 'O sistema processa seus dados e gera treinos detalhados, dieta com alimentos específicos, rotina otimizada e estratégia financeira personalizada.' },
                { step: '03', title: 'Execução & Adaptação', desc: 'Execute o protocolo. Ajuste metas, horários e intensidade. O sistema recalibra automaticamente para manter sua evolução constante.' },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 30 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.6 }}
                  className="relative"
                >
                  <span className="text-6xl font-display font-bold text-muted/30 absolute -top-2 -left-1">{item.step}</span>
                  <div className="pt-12">
                    <h3 className="font-display text-lg font-semibold mb-3">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pilares */}
        <section className="py-16 md:py-24 px-6 md:px-12 border-t border-border/30">
          <div className="max-w-5xl mx-auto">
            <motion.p whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }} className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-4 text-center">
              Os 6 pilares
            </motion.p>
            <motion.h2 whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-display font-bold mb-16 text-center">
              Cada área da sua vida. Coberta.
            </motion.h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/30">
              {pillars.map((p, i) => (
                <motion.div
                  key={p.title}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="bg-background p-8 group hover:bg-card/50 transition-colors duration-300"
                >
                  <p.icon className="w-5 h-5 text-muted-foreground mb-4 group-hover:text-foreground transition-colors" />
                  <h3 className="font-display text-sm font-semibold tracking-wide mb-2">{p.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Diferencial */}
        <section className="py-16 md:py-24 px-6 md:px-12 border-t border-border/30">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }}>
              <Zap className="w-6 h-6 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Isso não é autoajuda.
              </h2>
              <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
                O KOR Protocol não te motiva. Ele te organiza. Cada protocolo é gerado com base em referências profissionais — NSCA, ISSN, Mifflin-St Jeor, Schoenfeld, Helms — e adaptado ao seu perfil real. Treinos com séries, reps e descanso. Dieta com gramas e macros. Finanças com estratégia, não com frases bonitas.
              </p>
              <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
                {['NSCA Guidelines', 'ISSN Position Stand', 'Mifflin-St Jeor', 'Schoenfeld 2016', 'Alan Aragon'].map(ref => (
                  <span key={ref} className="px-3 py-1.5 border border-border/50 rounded-sm">{ref}</span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Planos */}
        <section className="py-16 md:py-32 px-6 md:px-12 border-t border-border/30">
          <div className="max-w-5xl mx-auto">
            <motion.p whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }} className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-4 text-center">
              Planos
            </motion.p>
            <motion.h2 whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="text-3xl md:text-4xl font-display font-bold mb-4 text-center">
              Escolha seu nível de comprometimento.
            </motion.h2>
            <motion.p whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="text-muted-foreground text-center mb-16 max-w-lg mx-auto">
              Sem trial. Sem enrolação. Você entra, constrói e evolui.
            </motion.p>

            <div className="grid md:grid-cols-3 gap-6 md:gap-4">
              {plans.map((plan, i) => (
                <motion.div
                  key={plan.name}
                  whileInView={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 30 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6 }}
                  className={`relative flex flex-col p-8 border transition-colors duration-300 ${
                    plan.highlight
                      ? 'border-foreground/20 bg-card/60'
                      : 'border-border/50 hover:border-border'
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-8">
                      <span className="text-[10px] tracking-[0.3em] uppercase font-display font-semibold px-3 py-1 bg-foreground text-background">
                        Recomendado
                      </span>
                    </div>
                  )}
                  <div className="mb-6">
                    <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-3">{plan.name}</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-display font-bold">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{plan.desc}</p>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <Check className="w-3.5 h-3.5 mt-0.5 text-muted-foreground shrink-0" />
                        <span className="text-foreground/80">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => navigate('/onboarding')}
                    className={`w-full py-3.5 font-display text-xs tracking-widest uppercase font-semibold transition-all duration-300 ${
                      plan.highlight
                        ? 'bg-foreground text-background hover:bg-foreground/90'
                        : 'border border-border text-foreground hover:bg-accent'
                    }`}
                  >
                    {plan.cta}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 md:py-32 px-6 md:px-12 border-t border-border/30">
          <div className="max-w-2xl mx-auto text-center">
            <motion.div whileInView={{ opacity: 1, y: 0 }} initial={{ opacity: 0, y: 24 }} viewport={{ once: true }}>
              <Crown className="w-6 h-6 mx-auto mb-6 text-muted-foreground" />
              <h2 className="text-3xl md:text-5xl font-display font-bold mb-6">
                Construa de dentro para fora.
              </h2>
              <p className="text-muted-foreground mb-10">
                O protocolo não espera. A sua evolução também não deveria.
              </p>
              <button
                onClick={() => navigate('/onboarding')}
                className="px-12 py-4 bg-primary text-primary-foreground font-display font-semibold text-sm tracking-widest uppercase hover:bg-primary/90 transition-all duration-300"
              >
                Iniciar Protocolo
              </button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/30 py-8 px-6 md:px-12">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-display text-sm font-bold tracking-widest">KOR</p>
            <p className="text-xs text-muted-foreground">© 2026 KOR Protocol. Built From Within.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
