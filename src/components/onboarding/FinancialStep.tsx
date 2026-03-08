import type { FinancialProfile } from '@/store/useAppStore';

interface Props {
  data: FinancialProfile;
  onChange: (data: FinancialProfile) => void;
  inputClass: string;
  labelClass: string;
  selectClass: string;
}

const FinancialStep = ({ data, onChange, inputClass, labelClass, selectClass }: Props) => {
  const set = (field: Partial<FinancialProfile>) => onChange({ ...data, ...field });

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div><label className={labelClass}>Renda Mensal</label><input className={inputClass} placeholder="R$ 5.000" value={data.monthlyIncome} onChange={(e) => set({ monthlyIncome: e.target.value })} /></div>
        <div><label className={labelClass}>Fonte de Renda</label><input className={inputClass} placeholder="Salário" value={data.incomeSource} onChange={(e) => set({ incomeSource: e.target.value })} /></div>
        <div><label className={labelClass}>Tipo de Vínculo</label>
          <select className={selectClass} value={data.employmentType} onChange={(e) => set({ employmentType: e.target.value })}>
            <option value="clt">CLT</option><option value="autonomo">Autônomo</option><option value="empresario">Empresário</option>
          </select>
        </div>
        <div><label className={labelClass}>Dívidas</label><input className={inputClass} placeholder="R$ 0" value={data.debts} onChange={(e) => set({ debts: e.target.value })} /></div>
        <div><label className={labelClass}>Investimentos</label><input className={inputClass} placeholder="R$ 10.000" value={data.investments} onChange={(e) => set({ investments: e.target.value })} /></div>
        <div><label className={labelClass}>Conhecimento em Marketing</label><input className={inputClass} placeholder="Básico / Intermediário / Avançado" value={data.marketingKnowledge} onChange={(e) => set({ marketingKnowledge: e.target.value })} /></div>
      </div>

      <div>
        <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-1">Controle de gastos</p>
        <h3 className="font-display text-lg font-semibold mb-4">Quanto você gasta por mês em cada categoria?</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className={labelClass}>Moradia (aluguel, condomínio, etc)</label><input className={inputClass} placeholder="R$ 1.500" value={data.expenseHousing} onChange={(e) => set({ expenseHousing: e.target.value })} /></div>
          <div><label className={labelClass}>Alimentação</label><input className={inputClass} placeholder="R$ 800" value={data.expenseFood} onChange={(e) => set({ expenseFood: e.target.value })} /></div>
          <div><label className={labelClass}>Transporte</label><input className={inputClass} placeholder="R$ 400" value={data.expenseTransport} onChange={(e) => set({ expenseTransport: e.target.value })} /></div>
          <div><label className={labelClass}>Saúde (plano, academia, etc)</label><input className={inputClass} placeholder="R$ 300" value={data.expenseHealth} onChange={(e) => set({ expenseHealth: e.target.value })} /></div>
          <div><label className={labelClass}>Educação (cursos, livros)</label><input className={inputClass} placeholder="R$ 200" value={data.expenseEducation} onChange={(e) => set({ expenseEducation: e.target.value })} /></div>
          <div><label className={labelClass}>Lazer e entretenimento</label><input className={inputClass} placeholder="R$ 300" value={data.expenseLeisure} onChange={(e) => set({ expenseLeisure: e.target.value })} /></div>
          <div><label className={labelClass}>Assinaturas (streaming, apps)</label><input className={inputClass} placeholder="R$ 150" value={data.expenseSubscriptions} onChange={(e) => set({ expenseSubscriptions: e.target.value })} /></div>
          <div><label className={labelClass}>Outros gastos</label><input className={inputClass} placeholder="R$ 200" value={data.expenseOther} onChange={(e) => set({ expenseOther: e.target.value })} /></div>
        </div>
      </div>

      <div>
        <label className={labelClass}>Qual categoria de gasto você mais quer reduzir?</label>
        <select className={selectClass} value={data.expenseToImprove} onChange={(e) => set({ expenseToImprove: e.target.value })}>
          <option value="">Selecione</option>
          <option value="moradia">Moradia</option>
          <option value="alimentacao">Alimentação</option>
          <option value="transporte">Transporte</option>
          <option value="saude">Saúde</option>
          <option value="educacao">Educação</option>
          <option value="lazer">Lazer</option>
          <option value="assinaturas">Assinaturas</option>
          <option value="outros">Outros</option>
        </select>
      </div>
    </div>
  );
};

export default FinancialStep;
