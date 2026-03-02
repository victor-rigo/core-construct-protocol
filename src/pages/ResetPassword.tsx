import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check if we have a recovery session
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    if (hashParams.get('type') !== 'recovery') {
      // Also check URL params for newer Supabase versions
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('type') !== 'recovery') {
        // Still allow access - user might have been redirected properly
      }
    }
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage('Senha atualizada com sucesso!');
      setTimeout(() => navigate('/auth'), 2000);
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar senha');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-kor-subtle transition-colors font-body";
  const labelClass = "block text-xs tracking-widest uppercase text-muted-foreground mb-2 font-display";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border px-6 md:px-12 py-4">
        <span className="font-display text-lg font-bold tracking-widest">KOR</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">Segurança</p>
            <h1 className="font-display text-3xl font-bold">Nova Senha</h1>
          </div>

          <form onSubmit={handleReset} className="space-y-6">
            <div>
              <label className={labelClass}>Nova Senha</label>
              <input className={inputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <div>
              <label className={labelClass}>Confirmar Senha</label>
              <input className={inputClass} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-emerald-400">{message}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground text-sm font-display font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50">
              {loading ? 'Atualizando...' : 'Atualizar Senha'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ResetPassword;
