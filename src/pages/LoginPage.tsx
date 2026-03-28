import React, { useState } from 'react';
import { Building2, Loader2, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

const API_BASE_URL = window.location.hostname.includes('localhost') || window.location.hostname.includes('127.0.0.1')
  ? `http://${window.location.hostname}/AlojadorLT/backend`
  : '/backend';

export const LoginPage = ({ onLogin, onShowError }: { onLogin: (user: any) => void, onShowError: (msg: string) => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: password }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        onShowError(data.error || 'Erro ao fazer login');
      }
    } catch (err) {
      onShowError('Erro de conexão com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white px-8 pt-20 pb-10 flex flex-col justify-between max-w-md mx-auto">
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-gradient-to-br from-primary-dark to-primary-vibrant rounded-[32px] flex items-center justify-center mb-8 shadow-2xl shadow-primary-dark/30 rotate-12"
        >
          <Building2 size={48} className="text-white -rotate-12" />
        </motion.div>

        <h1 className="text-3xl font-black text-primary-dark text-center leading-tight mb-2">
          Alojador <span className="text-primary-vibrant">LT</span>
        </h1>
        <p className="text-slate-400 font-semibold text-center text-sm mb-12">
          Gerenciamento de Alojamentos para Linha de Transmissão
        </p>

        <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-semibold text-primary-dark placeholder:text-slate-300 focus:ring-2 focus:ring-primary-vibrant/20 transition-all"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-semibold text-primary-dark placeholder:text-slate-300 focus:ring-2 focus:ring-primary-vibrant/20 transition-all pr-14"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary-vibrant transition-colors"
                aria-label={showPassword ? "Ocultar senha" : "Exibir senha"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-xs font-black text-primary-vibrant uppercase tracking-widest">
              Esqueceu a senha?
            </button>
          </div>

          <div className="pt-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-button text-white py-5 rounded-2xl font-black shadow-xl shadow-button/20 text-sm tracking-widest uppercase flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Entrar no Sistema"}
            </motion.button>
          </div>
        </form>
      </div>

      <div>
        <p className="text-center text-[10px] text-slate-300 font-bold uppercase tracking-wider">
          Versão 1.0.0 • 2026 | Desenvolvido por Moisés Honorato
        </p>
      </div>
    </div>
  );
};
