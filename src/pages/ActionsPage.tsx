import React from 'react';
import { motion } from 'motion/react';
import { UserPlus, Home, PlusSquare, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ActionButton = ({ icon: Icon, title, desc, onClick, color }: { icon: any, title: string, desc: string, onClick: () => void, color: string }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="w-full bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm flex items-center text-left mb-4"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-4 shadow-lg ${color}`}>
      <Icon size={28} className="text-white" />
    </div>
    <div>
      <h3 className="font-black text-primary-dark tracking-tight">{title}</h3>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{desc}</p>
    </div>
  </motion.button>
);

export const ActionsPage = ({ onLogout }: { onLogout: () => void }) => {
  const navigate = useNavigate();

  return (
    <div className="px-6 pt-10 pb-32">
      <header className="mb-10">
        <p className="text-accent font-black text-xs uppercase tracking-widest mb-1">Central de Controle</p>
        <h1 className="text-4xl font-black text-primary-dark tracking-tighter">Ações</h1>
      </header>

      <div className="space-y-2">
        <ActionButton 
          icon={UserPlus} 
          title="Novo Colaborador" 
          desc="Cadastrar pessoa no RH" 
          onClick={() => navigate('/pessoas')} 
          color="bg-primary-vibrant shadow-primary-vibrant/20"
        />
        
        <ActionButton 
          icon={Home} 
          title="Novo Alojamento" 
          desc="Criar nova república" 
          onClick={() => navigate('/republicas')} 
          color="bg-primary-dark shadow-primary-dark/20"
        />

        <ActionButton 
          icon={PlusSquare} 
          title="Novo Quarto" 
          desc="Adicionar vagas em alojamento" 
          onClick={() => navigate('/republicas')} 
          color="bg-amber-400 shadow-amber-400/20"
        />

        <ActionButton 
          icon={Search} 
          title="Busca Global" 
          desc="Encontrar pessoas ou locais" 
          onClick={() => navigate('/busca')} 
          color="bg-slate-800 shadow-slate-800/20"
        />

        <div className="pt-10">
          <button 
            onClick={onLogout}
            className="w-full bg-slate-50 text-slate-400 py-5 rounded-3xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 border border-slate-100 hover:bg-slate-100 transition-colors"
          >
            <LogOut size={16} /> Encerrar Sessão
          </button>
        </div>
      </div>
    </div>
  );
};
