import type { MentalProfile } from '@/store/useAppStore';

interface Props {
  data: MentalProfile;
  onChange: (data: MentalProfile) => void;
  inputClass: string;
  labelClass: string;
  selectClass: string;
}

const MentalStep = ({ data, onChange, inputClass, labelClass, selectClass }: Props) => {
  const set = (field: Partial<MentalProfile>) => onChange({ ...data, ...field });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2">
        <label className={labelClass}>Nível de Foco ({data.focusLevel}/10)</label>
        <input type="range" min="1" max="10" value={data.focusLevel} onChange={(e) => set({ focusLevel: parseInt(e.target.value) })} className="w-full accent-foreground" />
      </div>
      <div><label className={labelClass}>Horas de Sono</label><input className={inputClass} placeholder="7" value={data.avgSleepHours} onChange={(e) => set({ avgSleepHours: e.target.value })} /></div>
      <div><label className={labelClass}>Horas em Redes Sociais</label><input className={inputClass} placeholder="3" value={data.socialMediaHours} onChange={(e) => set({ socialMediaHours: e.target.value })} /></div>
      <div><label className={labelClass}>Consumo de Pornografia</label>
        <select className={selectClass} value={data.pornConsumption} onChange={(e) => set({ pornConsumption: e.target.value })}>
          <option value="não">Não</option><option value="sim">Sim</option>
        </select>
      </div>
      <div><label className={labelClass}>Frequência de Leitura</label><input className={inputClass} placeholder="2 livros/mês" value={data.readingFrequency} onChange={(e) => set({ readingFrequency: e.target.value })} /></div>
      <div className="md:col-span-2">
        <label className={labelClass}>Nível de Disciplina ({data.disciplineLevel}/10)</label>
        <input type="range" min="1" max="10" value={data.disciplineLevel} onChange={(e) => set({ disciplineLevel: parseInt(e.target.value) })} className="w-full accent-foreground" />
      </div>
    </div>
  );
};

export default MentalStep;
