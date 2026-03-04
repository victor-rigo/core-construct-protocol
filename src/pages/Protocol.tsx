import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
import {
  loadLatestProtocol,
  mapProfileToFormResponse,
  saveFormResponse,
  generateRuleBasedProtocol,
  type ProtocolBlock,
  type FormResponseData,
} from '@/lib/protocolRuleEngine';
import { AlertTriangle, Clock, Dumbbell, DollarSign, Briefcase, Eye } from 'lucide-react';
import ProtocolHeader from '@/components/protocol/ProtocolHeader';
import ProtocolOverview from '@/components/protocol/ProtocolOverview';
import ProtocolRoutine from '@/components/protocol/ProtocolRoutine';
import ProtocolPhysical from '@/components/protocol/ProtocolPhysical';
import ProtocolFinancial from '@/components/protocol/ProtocolFinancial';
import ProtocolEntrepreneur from '@/components/protocol/ProtocolEntrepreneur';

type TabId = 'overview' | 'routine' | 'physical' | 'financial' | 'entrepreneur';

const Protocol = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, signOut } = useAuth();
  const storeProfile = useAppStore((s) => s.profile);

  const [blocks, setBlocks] = useState<ProtocolBlock[]>([]);
  const [formData, setFormData] = useState<FormResponseData | null>(null);
  const [protocolDate, setProtocolDate] = useState<string>('');
  const [loadingProtocol, setLoadingProtocol] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  useEffect(() => {
    const loadOrGenerate = async () => {
      if (!user) {
        setLoadingProtocol(false);
        return;
      }

      try {
        const existing = await loadLatestProtocol(user.id);

        if (existing && existing.blocks.length > 0) {
          setBlocks(existing.blocks);
          setFormData(existing.formData);
          setProtocolDate(existing.createdAt);
          setLoadingProtocol(false);
          return;
        }

        if (storeProfile) {
          const mapped = mapProfileToFormResponse(storeProfile);
          const responseId = await saveFormResponse(user.id, mapped);

          if (responseId) {
            const result = await generateRuleBasedProtocol(user.id, responseId, mapped);
            if (result) {
              setBlocks(result.blocks);
              setFormData(mapped);
              setProtocolDate(new Date().toISOString());
            }
          }
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao carregar protocolo');
      } finally {
        setLoadingProtocol(false);
      }
    };

    if (!authLoading) loadOrGenerate();
  }, [user, authLoading, storeProfile]);

  const profile = storeProfile;
  const isEntrepreneurEnabled = profile?.entrepreneur?.enabled || formData?.modo_empresario;

  if (authLoading || loadingProtocol) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Gerando seu protocolo estratégico...</p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-lg font-bold mb-2">Erro ao carregar protocolo</h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <button onClick={() => navigate('/onboarding')} className="px-6 py-3 bg-primary text-primary-foreground text-sm font-display tracking-widest uppercase">
            Refazer Onboarding
          </button>
        </div>
      </div>
    );
  }

  if (blocks.length === 0 && !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertTriangle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
          <h2 className="font-display text-lg font-bold mb-2">Nenhum protocolo encontrado</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Complete o onboarding para gerar seu protocolo estratégico personalizado.
          </p>
          <button onClick={() => navigate('/onboarding')} className="px-6 py-3 bg-primary text-primary-foreground text-sm font-display tracking-widest uppercase">
            Iniciar Onboarding
          </button>
        </div>
      </div>
    );
  }

  const tabs: { id: TabId; label: string; icon: React.ReactNode; conditional?: boolean }[] = [
    { id: 'overview', label: 'Visão Geral', icon: <Eye className="w-4 h-4" /> },
    { id: 'routine', label: 'Rotina', icon: <Clock className="w-4 h-4" /> },
    { id: 'physical', label: 'Físico', icon: <Dumbbell className="w-4 h-4" /> },
    { id: 'financial', label: 'Financeiro', icon: <DollarSign className="w-4 h-4" /> },
    { id: 'entrepreneur', label: 'Empresário', icon: <Briefcase className="w-4 h-4" />, conditional: !isEntrepreneurEnabled },
  ];

  const visibleTabs = tabs.filter(t => !t.conditional);

  return (
    <div className="min-h-screen bg-background">
      <ProtocolHeader
        user={user}
        signOut={signOut}
        protocolDate={protocolDate}
        formData={formData}
        blocksCount={blocks.length}
      />

      {/* Tabs */}
      <div className="border-b border-border px-6 md:px-12 flex gap-0 overflow-x-auto">
        {visibleTabs.map((tab) => (
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
          {activeTab === 'overview' && <ProtocolOverview blocks={blocks} formData={formData} profile={profile} />}
          {activeTab === 'routine' && <ProtocolRoutine profile={profile} />}
          {activeTab === 'physical' && <ProtocolPhysical profile={profile} />}
          {activeTab === 'financial' && <ProtocolFinancial profile={profile} />}
          {activeTab === 'entrepreneur' && <ProtocolEntrepreneur profile={profile} />}
        </motion.div>
      </div>
    </div>
  );
};

export default Protocol;
