import { useNavigate } from 'react-router-dom';
import { ArrowRight, Target, LogOut, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import type { FormResponseData } from '@/lib/protocolRuleEngine';

interface Props {
  user: any;
  signOut: () => void;
  protocolDate: string;
  formData: FormResponseData | null;
  blocksCount: number;
}

const ProtocolHeader = ({ user, signOut, protocolDate, formData, blocksCount }: Props) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Nav */}
      <div className="border-b border-border px-6 md:px-12 py-4 flex items-center justify-between">
        <span className="font-display text-lg font-bold tracking-widest">KOR</span>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display">
            <ArrowRight className="w-4 h-4" /> Dashboard
          </button>
          <button onClick={() => navigate('/goals')} className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-foreground transition-colors font-display">
            <Target className="w-4 h-4" /> Metas
          </button>
          {user && (
            <button onClick={signOut} className="flex items-center gap-2 text-xs tracking-widest uppercase text-muted-foreground hover:text-destructive transition-colors font-display">
              <LogOut className="w-4 h-4" /> Sair
            </button>
          )}
        </div>
      </div>

      {/* Hero */}
      <div className="px-6 md:px-12 py-10 border-b border-border">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-xs tracking-[0.4em] text-muted-foreground uppercase mb-2">
            Baseado 100% nas suas respostas do formulário
          </p>
          <h1 className="font-display text-3xl md:text-5xl font-bold mb-3">
            Seu <span className="text-gradient-gold">Protocolo Estratégico</span>
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Cada módulo foi construído com lógica condicional aplicada às suas respostas reais.
            Nenhum conteúdo genérico — apenas dados e ações baseados no seu perfil.
          </p>
          {protocolDate && (
            <p className="text-xs text-muted-foreground mt-3 flex items-center gap-2">
              <Calendar className="w-3 h-3" />
              Gerado em {new Date(protocolDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          )}
        </motion.div>
      </div>

      {/* Summary bar */}
      {formData && (
        <div className="px-6 md:px-12 py-4 border-b border-border bg-secondary/30">
          <div className="flex flex-wrap gap-4 text-xs">
            {formData.idade && <span className="text-muted-foreground">📅 {formData.idade} anos</span>}
            {formData.profissao && <span className="text-muted-foreground">💼 {formData.profissao}</span>}
            {formData.objetivo_fisico && <span className="text-muted-foreground">🏋️ {formData.objetivo_fisico}</span>}
            {formData.renda_atual && <span className="text-muted-foreground">💰 R$ {formData.renda_atual.toLocaleString('pt-BR')}</span>}
            {formData.nivel_foco !== undefined && <span className="text-muted-foreground">🧠 Foco: {formData.nivel_foco}/10</span>}
            {formData.disciplina !== undefined && <span className="text-muted-foreground">🛡️ Disciplina: {formData.disciplina}/10</span>}
            <span className="font-medium text-foreground">⚡ {blocksCount} blocos ativados</span>
          </div>
        </div>
      )}
    </>
  );
};

export default ProtocolHeader;
