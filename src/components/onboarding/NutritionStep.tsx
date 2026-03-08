import type { NutritionProfile } from '@/store/useAppStore';

interface Props {
  data: NutritionProfile;
  onChange: (data: NutritionProfile) => void;
  inputClass: string;
  labelClass: string;
  selectClass: string;
}

const NutritionStep = ({ data, onChange, inputClass, labelClass, selectClass }: Props) => {
  const set = (field: Partial<NutritionProfile>) => onChange({ ...data, ...field });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div><label className={labelClass}>Condição para suplementos</label>
        <select className={selectClass} value={data.canAffordSupplements} onChange={(e) => set({ canAffordSupplements: e.target.value })}>
          <option value="">Selecione</option><option value="sim">Sim</option><option value="não">Não</option><option value="depende">Talvez / depende do custo</option>
        </select>
      </div>
      <div><label className={labelClass}>Quantas refeições por dia?</label>
        <select className={selectClass} value={data.mealsPerDay} onChange={(e) => set({ mealsPerDay: e.target.value })}>
          <option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6 ou mais</option>
        </select>
      </div>
      <div><label className={labelClass}>Consumo de água diário</label>
        <select className={selectClass} value={data.dailyWaterIntake} onChange={(e) => set({ dailyWaterIntake: e.target.value })}>
          <option value="">Selecione</option><option value="menos_1L">Menos de 1L</option><option value="1L">1L</option><option value="2L">2L</option><option value="3L">3L</option><option value="mais_3L">Mais de 3L</option>
        </select>
      </div>
      <div><label className={labelClass}>Consumo de álcool</label>
        <select className={selectClass} value={data.alcoholConsumption} onChange={(e) => set({ alcoholConsumption: e.target.value })}>
          <option value="não">Não</option><option value="raramente">Raramente</option><option value="socialmente">Socialmente (finais de semana)</option><option value="frequentemente">Frequentemente</option>
        </select>
      </div>
      <div><label className={labelClass}>Você fuma?</label>
        <select className={selectClass} value={data.smoking} onChange={(e) => set({ smoking: e.target.value })}>
          <option value="não">Não</option><option value="ocasionalmente">Ocasionalmente</option><option value="sim">Sim, regularmente</option>
        </select>
      </div>
      <div className="md:col-span-2"><label className={labelClass}>Alergias ou intolerâncias alimentares</label><textarea className={inputClass + " min-h-[60px] resize-none"} placeholder="Ex: lactose, glúten, frutos do mar... (deixe vazio se não tiver)" value={data.allergies} onChange={(e) => set({ allergies: e.target.value })} /></div>
      <div className="md:col-span-2"><label className={labelClass}>Alimentos que você GOSTA e quer na dieta</label><textarea className={inputClass + " min-h-[60px] resize-none"} placeholder="Ex: frango, arroz, banana, churrasco no fim de semana..." value={data.likedFoods} onChange={(e) => set({ likedFoods: e.target.value })} /></div>
      <div className="md:col-span-2"><label className={labelClass}>Alimentos que você NÃO GOSTA ou quer evitar</label><textarea className={inputClass + " min-h-[60px] resize-none"} placeholder="Ex: aveia, peixe, brócolis..." value={data.dislikedFoods} onChange={(e) => set({ dislikedFoods: e.target.value })} /></div>
    </div>
  );
};

export default NutritionStep;
