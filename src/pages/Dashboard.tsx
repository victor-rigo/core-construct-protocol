import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { generateProtocol } from '@/lib/protocolEngine';
import { Target, BookOpen, TrendingUp, Briefcase, Clock, Calendar, DollarSign, Dumbbell } from 'lucide-react';

type Tab = 'daily' | 'weekly' | 'financial' | 'entrepreneur' | 'library';

const Dashboard = () => {
  const navigate = useNavigate();
  const { profile } = useAppStore();
  const [activeTab, setActiveTab] = useState<Tab>('daily');

  const protocol = useMemo(() => {
    if (!profile) return null;
    return generateProtocol(profile);
  }, [profile]);

  if (!profile || !protocol) {
    navigate('/onboarding');
    return null;
  }

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: 'daily', label: 'Diário', icon: <Clock className="w-4 h-4" /> },
    { id: 'weekly', label: 'Semanal', icon: <Calendar className="w-4 h-4" /> },
    { id: 'financial', label: 'Financeiro', icon: <DollarSign className="w-4 h-4" /> },
    ...(protocol.entrepreneurProtocol ? [{ id: 'entrepreneur' as Tab, label: 'Empresário', icon: <Briefcase className="w-4 h-4" /> }] : []),
    { id: 'library', label: 'Biblioteca', icon: <BookOpen className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <span className="font-display text-lg font-bold tracking-widest">KOR</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/goals')} className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display">
            <Target className="w-4 h-4" /> Metas
          </button>
          <button onClick={() => navigate('/onboarding')} className="text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display">
            Recalibrar
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 md:px-12 py-8 border-b border-border">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-2">Seu Protocolo</p>
          <h1 className="font-display text-3xl md:text-4xl font-bold">
            Protocolo <span className="text-gradient-gold">Ativo</span>
          </h1>
        </motion.div>
      </div>

      {/* Tabs */}
      <div className="border-b border-border px-6 md:px-12 flex gap-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-4 text-xs tracking-widest uppercase font-display transition-colors border-b-2 whitespace-nowrap ${
              activeTab === tab.id ? 'border-foreground text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 py-8 max-w-5xl">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'daily' && (
            <div className="space-y-1">
              {protocol.dailyProtocol.map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-4 hover:bg-secondary/50 transition-colors group">
                  <span className="text-sm font-display font-semibold w-14 text-muted-foreground">{item.time}</span>
                  <span className="text-lg">{item.icon}</span>
                  <span className="text-sm">{item.activity}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'weekly' && (
            <div className="grid gap-4">
              {protocol.weeklyProtocol.map((item, i) => (
                <div key={i} className="p-6 glass-card">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-display font-semibold text-sm tracking-wider uppercase">{item.day}</h3>
                    <span className="text-xs text-muted-foreground">{item.focus}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.detail}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-8">
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Estratégia de Renda</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{protocol.financialProtocol.incomeStrategy}</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3 flex items-center gap-2"><Dumbbell className="w-4 h-4" /> Habilidades para Desenvolver</h3>
                <div className="flex flex-wrap gap-2 mt-3">
                  {protocol.financialProtocol.skills.map((s) => (
                    <span key={s} className="px-3 py-1 text-xs bg-secondary border border-border text-secondary-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3 flex items-center gap-2"><DollarSign className="w-4 h-4" /> Investimentos</h3>
                <p className="text-sm text-muted-foreground">{protocol.financialProtocol.investmentStrategy}</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3">Monetização</h3>
                <p className="text-sm text-muted-foreground">{protocol.financialProtocol.monetization}</p>
              </div>
            </div>
          )}

          {activeTab === 'entrepreneur' && protocol.entrepreneurProtocol && (
            <div className="space-y-8">
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3">Aquisição de Clientes</h3>
                <p className="text-sm text-muted-foreground">{protocol.entrepreneurProtocol.acquisition}</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3">Estrutura de Funil</h3>
                <p className="text-sm text-muted-foreground">{protocol.entrepreneurProtocol.funnel}</p>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3">Escala</h3>
                <ul className="space-y-2">{protocol.entrepreneurProtocol.scale.map((s) => <li key={s} className="text-sm text-muted-foreground flex items-center gap-2"><span className="w-1 h-1 bg-muted-foreground rounded-full" />{s}</li>)}</ul>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3">KPIs</h3>
                <div className="flex flex-wrap gap-2">{protocol.entrepreneurProtocol.kpis.map((k) => <span key={k} className="px-3 py-1 text-xs bg-secondary border border-border text-secondary-foreground">{k}</span>)}</div>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3">Liderança</h3>
                <ul className="space-y-2">{protocol.entrepreneurProtocol.leadership.map((l) => <li key={l} className="text-sm text-muted-foreground flex items-center gap-2"><span className="w-1 h-1 bg-muted-foreground rounded-full" />{l}</li>)}</ul>
              </div>
              <div className="glass-card p-6">
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-3">Branding</h3>
                <p className="text-sm text-muted-foreground">{protocol.entrepreneurProtocol.branding}</p>
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="space-y-10">
              <div>
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4 flex items-center gap-2"><BookOpen className="w-4 h-4" /> Livros Recomendados</h3>
                <div className="grid gap-3">
                  {protocol.library.books.map((b) => (
                    <div key={b.title} className="flex items-center justify-between p-4 glass-card">
                      <div><p className="text-sm font-semibold">{b.title}</p><p className="text-xs text-muted-foreground">{b.author}</p></div>
                      <span className="text-xs px-3 py-1 bg-secondary border border-border text-secondary-foreground">{b.category}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Ferramentas</h3>
                <div className="grid gap-3">
                  {protocol.library.tools.map((t) => (
                    <div key={t.name} className="flex items-center justify-between p-4 glass-card">
                      <span className="text-sm font-semibold">{t.name}</span>
                      <span className="text-xs text-muted-foreground">{t.use}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-display font-semibold text-sm tracking-wider uppercase mb-4">Podcasts</h3>
                <div className="grid gap-3">
                  {protocol.library.podcasts.map((p) => (
                    <div key={p.name} className="flex items-center justify-between p-4 glass-card">
                      <span className="text-sm font-semibold">{p.name}</span>
                      <span className="text-xs text-muted-foreground">{p.focus}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
