import type { PersonalProfile } from '@/store/useAppStore';

interface Props {
  data: PersonalProfile;
  onChange: (data: PersonalProfile) => void;
  inputClass: string;
  labelClass: string;
  selectClass: string;
}

const PersonalStep = ({ data, onChange, inputClass, labelClass, selectClass }: Props) => {
  const set = (field: Partial<PersonalProfile>) => onChange({ ...data, ...field });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div><label className={labelClass}>Idade</label><input className={inputClass} placeholder="28" value={data.age} onChange={(e) => set({ age: e.target.value })} /></div>
      <div><label className={labelClass}>Profissão</label><input className={inputClass} placeholder="Engenheiro" value={data.profession} onChange={(e) => set({ profession: e.target.value })} /></div>
      <div><label className={labelClass}>Estado Civil</label>
        <select className={selectClass} value={data.maritalStatus} onChange={(e) => set({ maritalStatus: e.target.value })}>
          <option value="">Selecione</option><option value="solteiro">Solteiro</option><option value="casado">Casado</option><option value="divorciado">Divorciado</option>
        </select>
      </div>
      <div><label className={labelClass}>Cidade</label><input className={inputClass} placeholder="São Paulo" value={data.city} onChange={(e) => set({ city: e.target.value })} /></div>
      <div><label className={labelClass}>Renda Atual</label><input className={inputClass} placeholder="R$ 5.000" value={data.currentIncome} onChange={(e) => set({ currentIncome: e.target.value })} /></div>
      <div><label className={labelClass}>Meta de Renda</label><input className={inputClass} placeholder="R$ 20.000" value={data.incomeGoal} onChange={(e) => set({ incomeGoal: e.target.value })} /></div>
      <div className="md:col-span-2"><label className={labelClass}>Rotina Atual</label><textarea className={inputClass + " min-h-[80px] resize-none"} placeholder="Descreva sua rotina atual..." value={data.currentRoutine} onChange={(e) => set({ currentRoutine: e.target.value })} /></div>
      <div><label className={labelClass}>Principais Distrações</label><input className={inputClass} value={data.mainDistractions} onChange={(e) => set({ mainDistractions: e.target.value })} placeholder="Redes sociais, séries..." /></div>
      <div><label className={labelClass}>Maior Fraqueza</label><input className={inputClass} value={data.biggestWeakness} onChange={(e) => set({ biggestWeakness: e.target.value })} placeholder="Procrastinação..." /></div>
      <div className="md:col-span-2"><label className={labelClass}>Maior Ambição</label><input className={inputClass} value={data.biggestAmbition} onChange={(e) => set({ biggestAmbition: e.target.value })} placeholder="Liberdade financeira..." /></div>
      <div><label className={labelClass}>Horário de Início do Trabalho</label>
        <input type="time" className={inputClass} value={data.workStartTime} onChange={(e) => set({ workStartTime: e.target.value })} />
      </div>
      <div><label className={labelClass}>Horário de Fim do Trabalho</label>
        <input type="time" className={inputClass} value={data.workEndTime} onChange={(e) => set({ workEndTime: e.target.value })} />
      </div>
      <div><label className={labelClass}>Tipo de Trabalho</label>
        <select className={selectClass} value={data.workType} onChange={(e) => set({ workType: e.target.value })}>
          <option value="presencial">Presencial</option><option value="remoto">Remoto</option><option value="hibrido">Híbrido</option>
        </select>
      </div>
      <div><label className={labelClass}>Melhor Horário para Treinar</label>
        <select className={selectClass} value={data.preferredTrainingTime} onChange={(e) => set({ preferredTrainingTime: e.target.value })}>
          <option value="manha">Manhã (antes do trabalho)</option><option value="almoco">Horário de almoço</option><option value="tarde">Tarde (após o trabalho)</option><option value="noite">Noite</option>
        </select>
      </div>
    </div>
  );
};

export default PersonalStep;
