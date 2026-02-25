import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, UserProfile } from '@/store/useAppStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const steps = ['Perfil Pessoal', 'Área Física', 'Área Mental', 'Área Financeira', 'Modo Empresário'];

const Onboarding = () => {
  const navigate = useNavigate();
  const { setProfile, setHasCompletedOnboarding } = useAppStore();
  const [step, setStep] = useState(0);

  const [personal, setPersonal] = useState({
    age: '', profession: '', maritalStatus: '', city: '',
    currentIncome: '', incomeGoal: '', currentRoutine: '',
    mainDistractions: '', biggestWeakness: '', biggestAmbition: '',
  });

  const [physical, setPhysical] = useState({
    weight: '', height: '', bodyFat: '', trainingFrequency: '',
    injuries: '', objective: 'hipertrofia',
  });

  const [mental, setMental] = useState({
    focusLevel: 5, avgSleepHours: '', socialMediaHours: '',
    pornConsumption: 'não', readingFrequency: '', disciplineLevel: 5,
  });

  const [financial, setFinancial] = useState({
    monthlyIncome: '', incomeSource: '', employmentType: 'clt',
    debts: '', investments: '', marketingKnowledge: '',
  });

  const [entrepreneur, setEntrepreneur] = useState({
    enabled: false, monthlyRevenue: '', margin: '', businessModel: '',
    hasTeam: 'não', mainBottleneck: '', acquisitionChannel: '',
    paidTrafficKnowledge: '',
  });

  const handleComplete = () => {
    const profile: UserProfile = { personal, physical, mental, financial, entrepreneur };
    setProfile(profile);
    setHasCompletedOnboarding(true);
    navigate('/dashboard');
  };

  const next = () => { if (step < steps.length - 1) setStep(step + 1); else handleComplete(); };
  const prev = () => { if (step > 0) setStep(step - 1); };

  const inputClass = "w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-kor-subtle transition-colors font-body";
  const labelClass = "block text-xs tracking-widest uppercase text-muted-foreground mb-2 font-display";
  const selectClass = inputClass;

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>Idade</label><input className={inputClass} placeholder="28" value={personal.age} onChange={(e) => setPersonal({ ...personal, age: e.target.value })} /></div>
            <div><label className={labelClass}>Profissão</label><input className={inputClass} placeholder="Engenheiro" value={personal.profession} onChange={(e) => setPersonal({ ...personal, profession: e.target.value })} /></div>
            <div><label className={labelClass}>Estado Civil</label>
              <select className={selectClass} value={personal.maritalStatus} onChange={(e) => setPersonal({ ...personal, maritalStatus: e.target.value })}>
                <option value="">Selecione</option><option value="solteiro">Solteiro</option><option value="casado">Casado</option><option value="divorciado">Divorciado</option>
              </select>
            </div>
            <div><label className={labelClass}>Cidade</label><input className={inputClass} placeholder="São Paulo" value={personal.city} onChange={(e) => setPersonal({ ...personal, city: e.target.value })} /></div>
            <div><label className={labelClass}>Renda Atual</label><input className={inputClass} placeholder="R$ 5.000" value={personal.currentIncome} onChange={(e) => setPersonal({ ...personal, currentIncome: e.target.value })} /></div>
            <div><label className={labelClass}>Meta de Renda</label><input className={inputClass} placeholder="R$ 20.000" value={personal.incomeGoal} onChange={(e) => setPersonal({ ...personal, incomeGoal: e.target.value })} /></div>
            <div className="md:col-span-2"><label className={labelClass}>Rotina Atual</label><textarea className={inputClass + " min-h-[80px] resize-none"} placeholder="Descreva sua rotina atual..." value={personal.currentRoutine} onChange={(e) => setPersonal({ ...personal, currentRoutine: e.target.value })} /></div>
            <div><label className={labelClass}>Principais Distrações</label><input className={inputClass} value={personal.mainDistractions} onChange={(e) => setPersonal({ ...personal, mainDistractions: e.target.value })} placeholder="Redes sociais, séries..." /></div>
            <div><label className={labelClass}>Maior Fraqueza</label><input className={inputClass} value={personal.biggestWeakness} onChange={(e) => setPersonal({ ...personal, biggestWeakness: e.target.value })} placeholder="Procrastinação..." /></div>
            <div className="md:col-span-2"><label className={labelClass}>Maior Ambição</label><input className={inputClass} value={personal.biggestAmbition} onChange={(e) => setPersonal({ ...personal, biggestAmbition: e.target.value })} placeholder="Liberdade financeira..." /></div>
          </div>
        );
      case 1:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>Peso (kg)</label><input className={inputClass} placeholder="80" value={physical.weight} onChange={(e) => setPhysical({ ...physical, weight: e.target.value })} /></div>
            <div><label className={labelClass}>Altura (cm)</label><input className={inputClass} placeholder="180" value={physical.height} onChange={(e) => setPhysical({ ...physical, height: e.target.value })} /></div>
            <div><label className={labelClass}>% Gordura</label><input className={inputClass} placeholder="15%" value={physical.bodyFat} onChange={(e) => setPhysical({ ...physical, bodyFat: e.target.value })} /></div>
            <div><label className={labelClass}>Frequência de Treino</label><input className={inputClass} placeholder="4x por semana" value={physical.trainingFrequency} onChange={(e) => setPhysical({ ...physical, trainingFrequency: e.target.value })} /></div>
            <div><label className={labelClass}>Lesões</label><input className={inputClass} placeholder="Nenhuma" value={physical.injuries} onChange={(e) => setPhysical({ ...physical, injuries: e.target.value })} /></div>
            <div><label className={labelClass}>Objetivo</label>
              <select className={selectClass} value={physical.objective} onChange={(e) => setPhysical({ ...physical, objective: e.target.value })}>
                <option value="hipertrofia">Hipertrofia</option><option value="definição">Definição</option><option value="performance">Performance</option><option value="saúde">Saúde</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className={labelClass}>Nível de Foco ({mental.focusLevel}/10)</label>
              <input type="range" min="1" max="10" value={mental.focusLevel} onChange={(e) => setMental({ ...mental, focusLevel: parseInt(e.target.value) })} className="w-full accent-foreground" />
            </div>
            <div><label className={labelClass}>Horas de Sono</label><input className={inputClass} placeholder="7" value={mental.avgSleepHours} onChange={(e) => setMental({ ...mental, avgSleepHours: e.target.value })} /></div>
            <div><label className={labelClass}>Horas em Redes Sociais</label><input className={inputClass} placeholder="3" value={mental.socialMediaHours} onChange={(e) => setMental({ ...mental, socialMediaHours: e.target.value })} /></div>
            <div><label className={labelClass}>Consumo de Pornografia</label>
              <select className={selectClass} value={mental.pornConsumption} onChange={(e) => setMental({ ...mental, pornConsumption: e.target.value })}>
                <option value="não">Não</option><option value="sim">Sim</option>
              </select>
            </div>
            <div><label className={labelClass}>Frequência de Leitura</label><input className={inputClass} placeholder="2 livros/mês" value={mental.readingFrequency} onChange={(e) => setMental({ ...mental, readingFrequency: e.target.value })} /></div>
            <div className="md:col-span-2">
              <label className={labelClass}>Nível de Disciplina ({mental.disciplineLevel}/10)</label>
              <input type="range" min="1" max="10" value={mental.disciplineLevel} onChange={(e) => setMental({ ...mental, disciplineLevel: parseInt(e.target.value) })} className="w-full accent-foreground" />
            </div>
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label className={labelClass}>Renda Mensal</label><input className={inputClass} placeholder="R$ 5.000" value={financial.monthlyIncome} onChange={(e) => setFinancial({ ...financial, monthlyIncome: e.target.value })} /></div>
            <div><label className={labelClass}>Fonte de Renda</label><input className={inputClass} placeholder="Salário" value={financial.incomeSource} onChange={(e) => setFinancial({ ...financial, incomeSource: e.target.value })} /></div>
            <div><label className={labelClass}>Tipo de Vínculo</label>
              <select className={selectClass} value={financial.employmentType} onChange={(e) => setFinancial({ ...financial, employmentType: e.target.value })}>
                <option value="clt">CLT</option><option value="autonomo">Autônomo</option><option value="empresario">Empresário</option>
              </select>
            </div>
            <div><label className={labelClass}>Dívidas</label><input className={inputClass} placeholder="R$ 0" value={financial.debts} onChange={(e) => setFinancial({ ...financial, debts: e.target.value })} /></div>
            <div><label className={labelClass}>Investimentos</label><input className={inputClass} placeholder="R$ 10.000" value={financial.investments} onChange={(e) => setFinancial({ ...financial, investments: e.target.value })} /></div>
            <div><label className={labelClass}>Conhecimento em Marketing</label><input className={inputClass} placeholder="Básico / Intermediário / Avançado" value={financial.marketingKnowledge} onChange={(e) => setFinancial({ ...financial, marketingKnowledge: e.target.value })} /></div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-secondary border border-border">
              <label className={labelClass + " mb-0"}>Ativar Modo Empresário</label>
              <button
                onClick={() => setEntrepreneur({ ...entrepreneur, enabled: !entrepreneur.enabled })}
                className={`w-12 h-6 rounded-full transition-colors ${entrepreneur.enabled ? 'bg-primary' : 'bg-muted'} relative`}
              >
                <span className={`block w-5 h-5 rounded-full transition-transform ${entrepreneur.enabled ? 'translate-x-6 bg-primary-foreground' : 'translate-x-0.5 bg-muted-foreground'}`} />
              </button>
            </div>
            {entrepreneur.enabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div><label className={labelClass}>Faturamento Mensal</label><input className={inputClass} placeholder="R$ 50.000" value={entrepreneur.monthlyRevenue} onChange={(e) => setEntrepreneur({ ...entrepreneur, monthlyRevenue: e.target.value })} /></div>
                <div><label className={labelClass}>Margem</label><input className={inputClass} placeholder="30%" value={entrepreneur.margin} onChange={(e) => setEntrepreneur({ ...entrepreneur, margin: e.target.value })} /></div>
                <div><label className={labelClass}>Modelo de Negócio</label><input className={inputClass} placeholder="SaaS, E-commerce..." value={entrepreneur.businessModel} onChange={(e) => setEntrepreneur({ ...entrepreneur, businessModel: e.target.value })} /></div>
                <div><label className={labelClass}>Equipe</label>
                  <select className={selectClass} value={entrepreneur.hasTeam} onChange={(e) => setEntrepreneur({ ...entrepreneur, hasTeam: e.target.value })}>
                    <option value="não">Não</option><option value="sim">Sim</option>
                  </select>
                </div>
                <div><label className={labelClass}>Principal Gargalo</label><input className={inputClass} value={entrepreneur.mainBottleneck} onChange={(e) => setEntrepreneur({ ...entrepreneur, mainBottleneck: e.target.value })} placeholder="Aquisição de clientes..." /></div>
                <div><label className={labelClass}>Canal de Aquisição</label><input className={inputClass} value={entrepreneur.acquisitionChannel} onChange={(e) => setEntrepreneur({ ...entrepreneur, acquisitionChannel: e.target.value })} placeholder="Instagram, Google Ads..." /></div>
                <div className="md:col-span-2"><label className={labelClass}>Conhecimento em Tráfego Pago</label><input className={inputClass} value={entrepreneur.paidTrafficKnowledge} onChange={(e) => setEntrepreneur({ ...entrepreneur, paidTrafficKnowledge: e.target.value })} placeholder="Básico / Intermediário / Avançado" /></div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <span className="font-display text-lg font-bold tracking-widest">KOR</span>
        <span className="text-xs text-muted-foreground tracking-widest uppercase">
          {step + 1} / {steps.length}
        </span>
      </div>

      {/* Progress */}
      <div className="h-px bg-border relative">
        <motion.div
          className="h-px bg-foreground"
          initial={{ width: '0%' }}
          animate={{ width: `${((step + 1) / steps.length) * 100}%` }}
          transition={{ duration: 0.4 }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-6 py-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">Etapa {step + 1}</p>
            <h2 className="font-display text-2xl md:text-3xl font-bold mb-8">{steps[step]}</h2>
            {renderStep()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between mt-12 pt-8 border-t border-border">
          <button
            onClick={prev}
            disabled={step === 0}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors disabled:opacity-30 disabled:cursor-not-allowed font-display tracking-wider uppercase"
          >
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
          <button
            onClick={next}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-primary-foreground text-sm font-display font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
          >
            {step === steps.length - 1 ? 'Gerar Protocolo' : 'Próximo'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
