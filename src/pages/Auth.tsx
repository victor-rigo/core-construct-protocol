import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showForgot, setShowForgot] = useState(false);

  // If already logged in, show option to continue or switch account
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <span className="font-display text-lg tracking-widest text-muted-foreground animate-pulse">KOR</span>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="border-b border-border px-6 md:px-12 py-4">
          <span className="font-display text-lg font-bold tracking-widest">KOR</span>
        </div>
        <div className="flex-1 flex items-center justify-center px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md text-center space-y-6">
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">Sessão Ativa</p>
            <h1 className="font-display text-3xl font-bold">Bem-vindo de volta</h1>
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 bg-primary text-primary-foreground text-sm font-display font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors"
              >
                Ir para Dashboard
              </button>
              <button
                onClick={async () => {
                  await signOut();
                }}
                className="w-full py-3 border border-border text-foreground text-sm font-display tracking-widest uppercase hover:bg-accent transition-colors"
              >
                Trocar de Conta
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('has_completed_onboarding')
            .eq('id', user.id)
            .single();

          navigate(profileData?.has_completed_onboarding ? '/dashboard' : '/onboarding');
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;

        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          navigate('/onboarding');
        } else {
          setMessage('Verifique seu email para confirmar a conta.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao autenticar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setMessage('Email de recuperação enviado. Verifique sua caixa de entrada.');
    } catch (err: any) {
      setError(err.message || 'Erro ao enviar email');
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = "w-full bg-secondary border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 transition-colors font-body";
  const labelClass = "block text-xs tracking-widest uppercase text-muted-foreground mb-2 font-display";

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="border-b border-border px-6 md:px-12 py-4">
        <span className="font-display text-lg font-bold tracking-widest cursor-pointer" onClick={() => navigate('/')}>KOR</span>
      </div>

      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-2">
              {showForgot ? 'Recuperação' : 'Acesso'}
            </p>
            <h1 className="font-display text-3xl font-bold">
              {showForgot ? 'Resetar Senha' : isLogin ? 'Entrar' : 'Criar Conta'}
            </h1>
          </div>

          {showForgot ? (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              {message && <p className="text-sm text-emerald-400">{message}</p>}
              <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-primary-foreground text-sm font-display font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? 'Enviando...' : 'Enviar Link'}
              </button>
              <button type="button" onClick={() => setShowForgot(false)} className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors">
                Voltar ao login
              </button>
            </form>
          ) : (
            <form onSubmit={handleAuth} className="space-y-6">
              <div>
                <label className={labelClass}>Email</label>
                <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required />
              </div>
              <div>
                <label className={labelClass}>Senha</label>
                <div className="relative">
                  <input className={inputClass + " pr-12"} type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}
              {message && <p className="text-sm text-emerald-400">{message}</p>}

              <button type="submit" disabled={submitting} className="w-full py-3 bg-primary text-primary-foreground text-sm font-display font-semibold tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-50">
                {submitting ? 'Processando...' : isLogin ? 'Entrar' : 'Criar Conta'}
              </button>

              <div className="flex justify-between text-sm">
                <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }} className="text-muted-foreground hover:text-foreground transition-colors">
                  {isLogin ? 'Criar conta' : 'Já tenho conta'}
                </button>
                {isLogin && (
                  <button type="button" onClick={() => setShowForgot(true)} className="text-muted-foreground hover:text-foreground transition-colors">
                    Esqueci a senha
                  </button>
                )}
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
