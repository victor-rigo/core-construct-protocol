import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { loadLatestAIProtocol } from '@/lib/aiProtocolService';
import { ArrowRight, CheckCircle, Clock, LogOut, Dumbbell, Brain, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const profile = useAppStore((s) => s.profile);
  const [protocolReady, setProtocolReady] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) return;
    loadLatestAIProtocol(user.id).then((result) => {
      setProtocolReady(!!result);
    });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const name = profile?.personal?.profession || user?.email?.split('@')[0] || 'Usuário';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <span className="font-display text-lg font-bold tracking-widest">KOR</span>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display"
        >
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">Dashboard</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-2">Bem-vindo, {name}</h1>
          <p className="text-muted-foreground text-sm mb-10">Seu painel de controle estratégico.</p>
        </motion.div>

        {/* Protocol Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="border border-border p-6 md:p-8 mb-8"
        >
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h2 className="font-display text-lg font-bold mb-1">Protocolo Estratégico</h2>
              {protocolReady === null ? (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4 animate-pulse" /> Verificando...
                </p>
              ) : protocolReady ? (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-primary" /> Protocolo gerado e pronto para visualização.
                </p>
              ) : (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Protocolo ainda não gerado. Acesse para gerar agora.
                </p>
              )}
            </div>
            <button
              onClick={() => navigate('/protocol')}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-display font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors shrink-0"
            >
              {protocolReady ? 'Ver Protocolo' : 'Gerar Protocolo'} <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          {[
            { icon: Dumbbell, label: 'Físico', value: profile?.physical?.objective || 'Definir objetivo', color: 'text-primary' },
            { icon: Brain, label: 'Foco', value: profile?.mental?.focusLevel ? `Nível ${profile.mental.focusLevel}/10` : 'Avaliar', color: 'text-primary' },
            { icon: DollarSign, label: 'Financeiro', value: profile?.financial?.monthlyIncome ? `R$ ${profile.financial.monthlyIncome}/mês` : 'Definir renda', color: 'text-primary' },
          ].map((stat, i) => (
            <div key={i} className="border border-border p-5">
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                <span className="text-xs tracking-widest uppercase text-muted-foreground font-display">{stat.label}</span>
              </div>
              <p className="font-display text-sm font-semibold">{stat.value}</p>
            </div>
          ))}
        </motion.div>

        {/* Goals link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-8"
        >
          <button
            onClick={() => navigate('/goals')}
            className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display flex items-center gap-2"
          >
            Ver Metas <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
