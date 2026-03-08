import type { PhysicalProfile } from '@/store/useAppStore';

interface Props {
  data: PhysicalProfile;
  onChange: (data: PhysicalProfile) => void;
  inputClass: string;
  labelClass: string;
  selectClass: string;
}

const PhysicalStep = ({ data, onChange, inputClass, labelClass, selectClass }: Props) => {
  const set = (field: Partial<PhysicalProfile>) => onChange({ ...data, ...field });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div><label className={labelClass}>Peso (kg)</label><input className={inputClass} placeholder="80" value={data.weight} onChange={(e) => set({ weight: e.target.value })} /></div>
      <div><label className={labelClass}>Altura (cm)</label><input className={inputClass} placeholder="180" value={data.height} onChange={(e) => set({ height: e.target.value })} /></div>
      <div><label className={labelClass}>% Gordura</label><input className={inputClass} placeholder="15%" value={data.bodyFat} onChange={(e) => set({ bodyFat: e.target.value })} /></div>
      <div><label className={labelClass}>Frequência de Treino</label><input className={inputClass} placeholder="4x por semana" value={data.trainingFrequency} onChange={(e) => set({ trainingFrequency: e.target.value })} /></div>
      <div><label className={labelClass}>Lesões</label><input className={inputClass} placeholder="Nenhuma" value={data.injuries} onChange={(e) => set({ injuries: e.target.value })} /></div>
      <div><label className={labelClass}>Objetivo</label>
        <select className={selectClass} value={data.objective} onChange={(e) => set({ objective: e.target.value })}>
          <option value="hipertrofia">Hipertrofia</option><option value="definição">Definição</option><option value="performance">Performance</option><option value="saúde">Saúde</option>
        </select>
      </div>
    </div>
  );
};

export default PhysicalStep;
