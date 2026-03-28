import React, { useState } from 'react';
import { ChevronRight, Plus, Search, X, UserPlus, Trash2, Edit2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { Collaborator, House } from '../types';

export const CollaboratorsPage = ({ collaborators, houses, onSave, onDelete, onCheckOut, onCheckInRequest }: { 
  collaborators: Collaborator[], 
  houses: House[],
  onSave: (c: Partial<Collaborator>) => Promise<void>,
  onDelete: (id: string) => void,
  onCheckOut: (houseId: string, roomId: string, bedIndex: number) => Promise<void>,
  onCheckInRequest: (collabId: string) => void
}) => {
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState<Partial<Collaborator> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getFullLoc = (c: Collaborator) => {
    for (const house of houses) {
      for (const room of house.rooms) {
        const bedIdx = room.occupants.findIndex(o => o === c.id);
        if (bedIdx !== -1) {
          return { houseId: house.id, roomId: room.id, bedIndex: bedIdx, label: `${house.name.split(' - ')[0]}, ${room.name}` };
        }
      }
    }
    return null;
  };

  const filtered = collaborators.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.cpf && c.cpf.includes(search))
  );
  
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing?.name) return;
    setIsLoading(true);
    try {
      await onSave({
        ...isEditing,
        name: isEditing.name?.toUpperCase(),
        role: isEditing.role?.toUpperCase(),
        company: isEditing.company?.toUpperCase(),
      });
      setIsEditing(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 pt-8 pb-32">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <p className="text-accent font-black text-xs uppercase tracking-widest mb-1">Equipe</p>
          <h1 className="text-4xl font-black text-primary-dark tracking-tighter uppercase">Pessoas</h1>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsEditing({})}
          className="w-12 h-12 bg-button text-white rounded-2xl flex items-center justify-center shadow-lg shadow-button/20 mb-1"
        >
          <Plus size={24} />
        </motion.button>
      </header>

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
        <input 
          type="text"
          placeholder="Buscar por nome ou CPF..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-semibold text-primary-dark placeholder:text-slate-300 focus:ring-2 focus:ring-primary-vibrant/20 transition-all shadow-sm uppercase text-sm"
        />
      </div>

      <div className="space-y-3">
        {filtered.map(c => {
          const locInfo = getFullLoc(c);
          const isAvailable = !locInfo;

          return (
            <motion.div 
              layout
              key={c.id} 
              className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="flex-1" onClick={() => setIsEditing(c)}>
                  <p className="font-bold text-primary-dark uppercase text-sm">{c.name}</p>
                  <div className="flex items-center mt-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase mr-2">{c.role}</span>
                    <span className={cn(
                      "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                      isAvailable ? "bg-emerald-50 text-emerald-600" : "bg-primary-dark/5 text-primary-dark"
                    )}>
                      {isAvailable ? "Disponível" : locInfo.label}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setIsEditing(c)} className="p-2 text-slate-300 hover:text-primary-dark transition-colors">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => onDelete(c.id)} className="p-2 text-slate-300 hover:text-accent transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="flex gap-2 border-t border-slate-50 pt-3">
                {isAvailable ? (
                  <button 
                    onClick={() => onCheckInRequest(c.id)}
                    className="flex-1 bg-primary-vibrant/5 text-primary-vibrant py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <Plus size={14} /> Alocar em Quarto
                  </button>
                ) : (
                  <>
                    <button 
                      onClick={() => onCheckInRequest(c.id)}
                      className="flex-1 bg-amber-50 text-amber-600 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <ChevronRight size={14} className="rotate-90" /> Transferir
                    </button>
                    <button 
                      onClick={() => onCheckOut(locInfo.houseId, locInfo.roomId, locInfo.bedIndex)}
                      className="flex-1 bg-accent/5 text-accent py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-2"
                    >
                      <X size={14} /> Retirar do Quarto
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Cadastro/Edição Modal */}
      <AnimatePresence>
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-[100] flex items-end"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-[40px] p-8 max-h-[95vh] overflow-y-auto max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-primary-dark tracking-tighter uppercase">
                  {isEditing.id ? 'Editar Pessoa' : 'Nova Pessoa'}
                </h2>
                <button onClick={() => setIsEditing(null)} className="p-2 text-slate-300">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome Completo</label>
                  <input 
                    type="text"
                    required
                    placeholder="NOME DO COLABORADOR"
                    value={isEditing.name || ''}
                    onChange={(e) => setIsEditing({ ...isEditing, name: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-semibold text-primary-dark uppercase text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">CPF</label>
                  <input 
                    type="text"
                    placeholder="000.000.000-00"
                    value={isEditing.cpf || ''}
                    onChange={(e) => setIsEditing({ ...isEditing, cpf: formatCPF(e.target.value) })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-semibold text-primary-dark text-sm"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Cargo</label>
                  <input 
                    type="text"
                    placeholder="CARGO"
                    value={isEditing.role || ''}
                    onChange={(e) => setIsEditing({ ...isEditing, role: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-semibold text-primary-dark uppercase text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Empresa</label>
                  <input 
                    type="text"
                    placeholder="EMPRESA"
                    value={isEditing.company || ''}
                    onChange={(e) => setIsEditing({ ...isEditing, company: e.target.value.toUpperCase() })}
                    className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-semibold text-primary-dark uppercase text-sm"
                  />
                </div>
       

                <div className="pt-6">
                  <motion.button 
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-button text-white py-5 rounded-3xl font-black shadow-xl shadow-button/20 text-sm tracking-widest uppercase flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isEditing.id ? "Salvar Alterações" : "Cadastrar Pessoa")}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
