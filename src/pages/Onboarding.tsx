import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore, UserProfile } from '@/store/useAppStore';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { mapProfileToFormResponse, saveFormResponse } from '@/lib/protocolRuleEngine';
import { generateAIProtocol, saveAIProtocol } from '@/lib/aiProtocolService';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PersonalStep from '@/components/onboarding/PersonalStep';
import PhysicalStep from '@/components/onboarding/PhysicalStep';
import NutritionStep from '@/components/onboarding/NutritionStep';
import MentalStep from '@/components/onboarding/MentalStep';
import FinancialStep from '@/components/onboarding/FinancialStep';
import EntrepreneurStep from '@/components/onboarding/EntrepreneurStep';

const steps = ['Perfil Pessoal', 'Área Física', 'Nutrição', 'Área Mental', 'Área Financeira', 'Modo Empresário'];

const Onboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setProfile, setHasCompletedOnboarding } = useAppStore();
  const [step, setStep] = useState(0);

  const [personal, setPersonal] = useState({
    age: '', profession: '', maritalStatus: '', city: '',
    currentIncome: '', incomeGoal: '', currentRoutine: '',
    mainDistractions: '', biggestWeakness: '', biggestAmbition: '',
    workStartTime: '08:00', workEndTime: '18:00', workType: 'presencial',
    preferredTrainingTime: 'manha',
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
    expenseHousing: '', expenseFood: '', expenseTransport: '',
    expenseHealth: '', expenseEducation: '', expenseLeisure: '',
    expenseSubscriptions: '', expenseOther: '', expenseToImprove: '',
  });

  const [nutrition, setNutrition] = useState({
    canAffordSupplements: '', allergies: '', likedFoods: '',
    dislikedFoods: '', dailyWaterIntake: '', alcoholConsumption: 'não',
    smoking: 'não', mealsPerDay: '4',
  });

  const [entrepreneur, setEntrepreneur] = useState({
    enabled: false, monthlyRevenue: '', margin: '', businessModel: '',
    hasTeam: 'não', mainBottleneck: '', acquisitionChannel: '',
    paidTrafficKnowledge: '',
  });

  const handleComplete = async () => {
    const profile: UserProfile = { personal, physical, mental, financial, entrepreneur, nutrition };
    setProfile(profile);

    if (user) {
      // Save profile data
      await supabase.from('profiles').update({
        profile_data: profile as any,
        has_completed_onboarding: true,
      }).eq('id', user.id);

      // Save form responses
      const mapped = mapProfileToFormResponse(profile);
      const responseId = await saveFormResponse(user.id, mapped);

      // Generate AI protocol
      if (responseId) {
        try {
          const aiResult = await generateAIProtocol(profile);
          if (aiResult) {
            await saveAIProtocol(user.id, responseId, aiResult);
          }
        } catch (err) {
          console.error('AI protocol generation failed, will retry on protocol page:', err);
        }
      }

      setHasCompletedOnboarding(true);
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  const next = () => { if (step < steps.length - 1) setStep(step + 1); else handleComplete(); };
  const prev = () => { if (step > 0) setStep(step - 1); };

  const inputClass = "w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-kor-subtle transition-colors font-body";
  const labelClass = "block text-xs tracking-widest uppercase text-muted-foreground mb-2 font-display";
  const selectClass = inputClass;

  const renderStep = () => {
    const props = { inputClass, labelClass, selectClass };
    switch (step) {
      case 0: return <PersonalStep data={personal} onChange={setPersonal} {...props} />;
      case 1: return <PhysicalStep data={physical} onChange={setPhysical} {...props} />;
      case 2: return <NutritionStep data={nutrition} onChange={setNutrition} {...props} />;
      case 3: return <MentalStep data={mental} onChange={setMental} {...props} />;
      case 4: return <FinancialStep data={financial} onChange={setFinancial} {...props} />;
      case 5: return <EntrepreneurStep data={entrepreneur} onChange={setEntrepreneur} {...props} />;
      default: return null;
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
