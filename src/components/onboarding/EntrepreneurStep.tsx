import type { EntrepreneurProfile } from '@/store/useAppStore';

interface Props {
  data: EntrepreneurProfile;
  onChange: (data: EntrepreneurProfile) => void;
  inputClass: string;
  labelClass: string;
  selectClass: string;
}

const EntrepreneurStep = ({ data, onChange, inputClass, labelClass, selectClass }: Props) => {
  const set = (field: Partial<EntrepreneurProfile>) => onChange({ ...data, ...field });

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-secondary border border-border">
        <label className={labelClass + " mb-0"}>Ativar Modo Empresário</label>
        <button
          onClick={() => set({ enabled: !data.enabled })}
          className={`w-12 h-6 rounded-full transition-colors ${data.enabled ? 'bg-primary' : 'bg-muted'} relative`}
        >
          <span className={`block w-5 h-5 rounded-full transition-transform ${data.enabled ? 'translate-x-6 bg-primary-foreground' : 'translate-x-0.5 bg-muted-foreground'}`} />
        </button>
      </div>
      {data.enabled && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div><label className={labelClass}>Faturamento Mensal</label><input className={inputClass} placeholder="R$ 50.000" value={data.monthlyRevenue} onChange={(e) => set({ monthlyRevenue: e.target.value })} /></div>
          <div><label className={labelClass}>Margem</label><input className={inputClass} placeholder="30%" value={data.margin} onChange={(e) => set({ margin: e.target.value })} /></div>
          <div><label className={labelClass}>Modelo de Negócio</label><input className={inputClass} placeholder="SaaS, E-commerce..." value={data.businessModel} onChange={(e) => set({ businessModel: e.target.value })} /></div>
          <div><label className={labelClass}>Equipe</label>
            <select className={selectClass} value={data.hasTeam} onChange={(e) => set({ hasTeam: e.target.value })}>
              <option value="não">Não</option><option value="sim">Sim</option>
            </select>
          </div>
          <div><label className={labelClass}>Principal Gargalo</label><input className={inputClass} value={data.mainBottleneck} onChange={(e) => set({ mainBottleneck: e.target.value })} placeholder="Aquisição de clientes..." /></div>
          <div><label className={labelClass}>Canal de Aquisição</label><input className={inputClass} value={data.acquisitionChannel} onChange={(e) => set({ acquisitionChannel: e.target.value })} placeholder="Instagram, Google Ads..." /></div>
          <div className="md:col-span-2"><label className={labelClass}>Conhecimento em Tráfego Pago</label><input className={inputClass} value={data.paidTrafficKnowledge} onChange={(e) => set({ paidTrafficKnowledge: e.target.value })} placeholder="Básico / Intermediário / Avançado" /></div>
        </div>
      )}
    </div>
  );
};

export default EntrepreneurStep;
