import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import heroBg from '@/assets/hero-bg.jpg';

const Landing = () => {
  const navigate = useNavigate();
  const { hasCompletedOnboarding } = useAppStore();

  return (
    <div className="relative min-h-screen bg-background overflow-hidden">
      {/* Hero background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 md:px-12 py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="font-display text-xl font-bold tracking-widest"
          >
            KOR
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="text-xs tracking-[0.3em] text-muted-foreground uppercase"
          >
            Protocol
          </motion.div>
        </nav>

        {/* Hero */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="max-w-3xl text-center">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-8"
            >
              Sistema de Evolução Pessoal
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-[0.9] mb-6"
            >
              Built From
              <br />
              <span className="text-gradient-gold">Within</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-muted-foreground text-lg md:text-xl max-w-xl mx-auto mb-12 leading-relaxed"
            >
              Disciplina. Estrutura. Crescimento interno que reflete externamente.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <button
                onClick={() => navigate(hasCompletedOnboarding ? '/dashboard' : '/onboarding')}
                className="px-10 py-4 bg-primary text-primary-foreground font-display font-semibold text-sm tracking-widest uppercase hover:bg-primary/90 transition-all duration-300"
              >
                {hasCompletedOnboarding ? 'Acessar Protocolo' : 'Iniciar Protocolo'}
              </button>
              {!hasCompletedOnboarding && (
                <button
                  onClick={() => navigate('/onboarding')}
                  className="px-10 py-4 border border-border text-foreground font-display text-sm tracking-widest uppercase hover:bg-accent transition-all duration-300"
                >
                  Saiba Mais
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Bottom features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.3, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border/50 border-t border-border/50"
        >
          {[
            { label: 'Protocolo Diário', desc: 'Rotina otimizada' },
            { label: 'Evolução Financeira', desc: 'Estratégia de renda' },
            { label: 'Performance Física', desc: 'Treino & nutrição' },
            { label: 'Modo Empresário', desc: 'Escala & liderança' },
          ].map((item) => (
            <div key={item.label} className="bg-background/80 px-6 py-8 text-center">
              <p className="font-display text-sm font-semibold tracking-wide mb-1">{item.label}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Landing;
