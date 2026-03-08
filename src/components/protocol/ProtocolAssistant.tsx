import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Sparkles, RefreshCw, Utensils, Dumbbell, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { AIProtocolData } from '@/lib/aiProtocolService';
import ReactMarkdown from 'react-markdown';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ProtocolAssistantProps {
  aiProtocol: AIProtocolData | null;
  onProtocolUpdated: (newProtocol: AIProtocolData) => void;
}

const QUICK_ACTIONS = [
  { label: 'Explicar protocolo', icon: Sparkles, message: 'Explique meu protocolo de forma resumida.' },
  { label: 'Ajustar treino', icon: Dumbbell, message: 'Quero ajustar meu plano de treino.' },
  { label: 'Trocar alimentos', icon: Utensils, message: 'Quero trocar alguns alimentos do meu plano nutricional.' },
  { label: 'Ajustar rotina', icon: Clock, message: 'Quero ajustar minha rotina diária.' },
];

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/protocol-assistant`;

export default function ProtocolAssistant({ aiProtocol, onProtocolUpdated }: ProtocolAssistantProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<{ module: string; changes: any } | null>(null);
  const [applyingUpdate, setApplyingUpdate] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const { session } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const extractProtocolUpdate = (text: string): { module: string; changes: any } | null => {
    const match = text.match(/===PROTOCOL_UPDATE===\s*([\s\S]*?)\s*===END_UPDATE===/);
    if (!match) return null;
    try {
      const parsed = JSON.parse(match[1]);
      return { module: parsed.módulo || parsed.module, changes: parsed.changes };
    } catch {
      return null;
    }
  };

  const cleanResponseText = (text: string): string => {
    return text.replace(/===PROTOCOL_UPDATE===[\s\S]*?===END_UPDATE===/g, '').trim();
  };

  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isStreaming || !session) return;

    const userMsg: Message = { role: 'user', content: messageText.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setIsStreaming(true);
    setPendingUpdate(null);

    let assistantContent = '';

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ messages: allMessages }),
      });

      if (!resp.ok || !resp.body) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Erro ${resp.status}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let streamDone = false;

      while (!streamDone) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, newlineIndex);
          buffer = buffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') {
            streamDone = true;
            break;
          }

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) => i === prev.length - 1 ? { ...m, content: cleanResponseText(assistantContent) } : m);
                }
                return [...prev, { role: 'assistant', content: cleanResponseText(assistantContent) }];
              });
            }
          } catch {
            buffer = line + '\n' + buffer;
            break;
          }
        }
      }

      // Check for protocol update in final content
      const update = extractProtocolUpdate(assistantContent);
      if (update) {
        setPendingUpdate(update);
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ ${e.message || 'Erro ao processar mensagem.'}` }]);
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming, session]);

  const applyProtocolUpdate = async () => {
    if (!pendingUpdate || !aiProtocol || !session) return;
    setApplyingUpdate(true);

    try {
      const updatedProtocol = { ...aiProtocol, [pendingUpdate.module]: pendingUpdate.changes };

      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ action: 'update_protocol', protocolUpdate: updatedProtocol }),
      });

      if (!resp.ok) throw new Error('Falha ao salvar');

      onProtocolUpdated(updatedProtocol);
      setPendingUpdate(null);
      setMessages(prev => [...prev, { role: 'assistant', content: '✅ Protocolo atualizado com sucesso!' }]);
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'assistant', content: `❌ Erro ao atualizar protocolo: ${e.message}` }]);
    } finally {
      setApplyingUpdate(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
          >
            <MessageCircle className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] bg-card border border-border rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary/30">
              <div className="flex items-center gap-2">
                <Bot className="w-5 h-5 text-foreground" />
                <div>
                  <p className="text-sm font-display font-semibold tracking-wide">KOR Assistant</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Consultor de Protocolo</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-accent transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
              {messages.length === 0 && (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <Bot className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">Como posso te ajudar com seu protocolo?</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {QUICK_ACTIONS.map((qa) => (
                      <button
                        key={qa.label}
                        onClick={() => sendMessage(qa.message)}
                        className="flex items-center gap-2 p-3 rounded-lg border border-border text-xs text-muted-foreground hover:text-foreground hover:border-foreground/20 transition-colors text-left"
                      >
                        <qa.icon className="w-3.5 h-3.5 shrink-0" />
                        {qa.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary/50 text-foreground'
                    }`}
                  >
                    {msg.role === 'assistant' ? (
                      <div className="prose prose-sm prose-invert max-w-none [&>p]:mb-2 [&>p:last-child]:mb-0 [&>ul]:mb-2 [&>ol]:mb-2">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    ) : (
                      msg.content
                    )}
                  </div>
                  {msg.role === 'user' && (
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-1">
                      <User className="w-3.5 h-3.5 text-foreground" />
                    </div>
                  )}
                </div>
              ))}

              {isStreaming && messages[messages.length - 1]?.role !== 'assistant' && (
                <div className="flex gap-2 items-start">
                  <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                  <div className="bg-secondary/50 rounded-lg px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}

              {/* Pending update banner */}
              {pendingUpdate && (
                <div className="border border-border rounded-lg p-3 bg-accent/30">
                  <p className="text-xs font-display uppercase tracking-wider text-muted-foreground mb-2">
                    Alteração sugerida: {pendingUpdate.module}
                  </p>
                  <button
                    onClick={applyProtocolUpdate}
                    disabled={applyingUpdate}
                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-primary text-primary-foreground text-xs font-display uppercase tracking-wider rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {applyingUpdate ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    Aplicar alteração no protocolo
                  </button>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="border-t border-border px-3 py-3">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pergunte sobre seu protocolo..."
                  rows={1}
                  className="flex-1 resize-none bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30 max-h-24"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || isStreaming}
                  className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 hover:opacity-90 transition-opacity shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
