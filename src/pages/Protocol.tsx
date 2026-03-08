import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { loadLatestAIProtocol, generateAIProtocol, saveAIProtocol, type AIProtocolData } from '@/lib/aiProtocolService';
import { mapProfileToFormResponse, saveFormResponse } from '@/lib/protocolRuleEngine';
import { AlertTriangle, Clock, Dumbbell, DollarSign, Briefcase, Eye, RefreshCw } from 'lucide-react';
import ProtocolAssistant from '@/components/protocol/ProtocolAssistant';
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

  const [aiProtocol, setAiProtocol] = useState<AIProtocolData | null>(null);
  const [protocolDate, setProtocolDate] = useState<string>('');
  const [loadingProtocol, setLoadingProtocol] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const loadOrGenerate = async () => {
    if (!user) {
      setLoadingProtocol(false);
      return;
    }

    try {
      // Try to load existing AI protocol
      const existing = await loadLatestAIProtocol(user.id);
      if (existing) {
        setAiProtocol(existing.protocolData);
        setProtocolDate(existing.createdAt);
        setLoadingProtocol(false);
        return;
      }

      // No existing protocol — get profile (from store or DB fallback)
      let profileToUse = storeProfile;
      if (!profileToUse) {
        const { data } = await supabase
          .from('profiles')
          .select('profile_data')
          .eq('id', user.id)
          .single();
        if (data?.profile_data) {
          profileToUse = data.profile_data as any;
        }
      }

      if (profileToUse) {
        setGenerating(true);
        const result = await generateAIProtocol(profileToUse);
        if (result) {
          const mapped = mapProfileToFormResponse(profileToUse);
          const responseId = await saveFormResponse(user.id, mapped);
          if (responseId) {
            await saveAIProtocol(user.id, responseId, result);
          }
          setAiProtocol(result);
          setProtocolDate(new Date().toISOString());
        } else {
          setError('Não foi possível gerar o protocolo via IA. Tente novamente.');
        }
        setGenerating(false);
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar protocolo');
      setGenerating(false);
    } finally {
      setLoadingProtocol(false);
    }
  };

  useEffect(() => {
    if (!authLoading) loadOrGenerate();
  }, [user, authLoading, storeProfile]);

  const handleRegenerate = async () => {
    if (!user) return;
    let profileToUse = storeProfile;
    if (!profileToUse) {
      const { data } = await supabase.from('profiles').select('profile_data').eq('id', user.id).single();
      if (data?.profile_data) profileToUse = data.profile_data as any;
    }
    if (!profileToUse) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await generateAIProtocol(profileToUse);
      if (result) {
        const mapped = mapProfileToFormResponse(storeProfile);
        const responseId = await saveFormResponse(user.id, mapped);
        if (responseId) {
          await saveAIProtocol(user.id, responseId, result);
        }
        setAiProtocol(result);
        setProtocolDate(new Date().toISOString());
      } else {
        setError('Falha ao regenerar protocolo.');
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao regenerar');
    } finally {
      setGenerating(false);
    }
  };

  const profile = storeProfile;
  const isEntrepreneurEnabled = profile?.entrepreneur?.enabled || aiProtocol?.entrepreneur?.enabled;

  if (authLoading || loadingProtocol) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
          <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">Carregando protocolo...</p>
        </motion.div>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center max-w-md">
          <div className="w-10 h-10 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-6" />
          <h2 className="font-display text-lg font-bold mb-2">Gerando seu protocolo com IA...</h2>
          <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">
            Analisando seus dados e criando um plano 100% personalizado. Isso pode levar até 30 segundos.
          </p>
        </motion.div>
      </div>
    );
  }

  if (error && !aiProtocol) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <div className="glass-card p-8 max-w-md text-center">
          <AlertTriangle className="w-8 h-8 text-destructive mx-auto mb-4" />
          <h2 className="font-display text-lg font-bold mb-2">Erro ao carregar protocolo</h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={handleRegenerate} className="px-6 py-3 bg-primary text-primary-foreground text-sm font-display tracking-widest uppercase">
              Tentar Novamente
            </button>
            <button onClick={() => navigate('/onboarding')} className="px-6 py-3 border border-border text-sm font-display tracking-widest uppercase">
              Refazer Onboarding
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!aiProtocol && !profile) {
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

  const handleProtocolUpdated = (newProtocol: AIProtocolData) => {
    setAiProtocol(newProtocol);
  };

  return (
    <div className="min-h-screen bg-background">
      <ProtocolHeader
        user={user}
        signOut={signOut}
        protocolDate={protocolDate}
        formData={null}
        blocksCount={0}
      />

      {/* Tabs + Regenerate */}
      <div className="border-b border-border px-6 md:px-12 flex items-center gap-0 overflow-x-auto">
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
        <div className="ml-auto pl-4">
          <button
            onClick={handleRegenerate}
            disabled={generating}
            className="flex items-center gap-2 px-4 py-2 text-xs tracking-wider uppercase font-display text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${generating ? 'animate-spin' : ''}`} />
            Regenerar
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 md:px-12 py-8 max-w-5xl">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          {activeTab === 'overview' && <ProtocolOverview aiProtocol={aiProtocol} profile={profile} />}
          {activeTab === 'routine' && <ProtocolRoutine aiProtocol={aiProtocol} profile={profile} />}
          {activeTab === 'physical' && <ProtocolPhysical aiProtocol={aiProtocol} profile={profile} />}
          {activeTab === 'financial' && <ProtocolFinancial aiProtocol={aiProtocol} profile={profile} />}
          {activeTab === 'entrepreneur' && <ProtocolEntrepreneur aiProtocol={aiProtocol} profile={profile} />}
        </motion.div>
      </div>

      {/* AI Assistant */}
      <ProtocolAssistant aiProtocol={aiProtocol} onProtocolUpdated={handleProtocolUpdated} />
    </div>
  );
};

export default Protocol;
