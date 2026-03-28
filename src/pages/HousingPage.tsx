import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Bed, Plus, X, Edit2, Trash2, MapPin, Loader2, ListOrdered } from 'lucide-react';
import { cn } from '../lib/utils';
import { House, Room } from '../types';
import { useNavigate } from 'react-router-dom';

export const HousingPage = ({ houses, onSave, onDelete, onSaveRoom, onDeleteRoom }: { 
  houses: House[], 
  onSave: (h: Partial<House>) => Promise<void>,
  onDelete: (id: string) => void,
  onSaveRoom: (r: any) => Promise<void>,
  onDeleteRoom: (id: string) => void
}) => {
  const [expandedHouse, setExpandedHouse] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<Partial<House> | null>(null);
  const [isEditingRoom, setIsEditingRoom] = useState<{ id?: string, name?: string, capacity?: number, houseId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSaveHouse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing?.name) return;
    setIsLoading(true);
    try {
      await onSave(isEditing);
      setIsEditing(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditingRoom?.name || !isEditingRoom.houseId) return;
    setIsLoading(true);
    try {
      await onSaveRoom({
        id: isEditingRoom.id,
        name: isEditingRoom.name,
        capacity: isEditingRoom.capacity || 0,
        occupants: [], // Placeholder for the type
        houseId: isEditingRoom.houseId
      });
      setIsEditingRoom(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-6 pt-8 pb-32">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <p className="text-accent font-black text-xs uppercase tracking-widest mb-1">Gestão</p>
          <h1 className="text-4xl font-black text-primary-dark tracking-tighter uppercase">Alojamentos</h1>
        </div>
        <motion.button 
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsEditing({})}
          className="w-12 h-12 bg-button text-white rounded-2xl flex items-center justify-center shadow-lg shadow-button/20 mb-1"
        >
          <Plus size={24} />
        </motion.button>
      </header>

      <div className="space-y-4">
        {houses.length === 0 ? (
          <div className="py-20 text-center text-slate-400">Nenhum alojamento cadastrado</div>
        ) : (
          houses.map(house => {
            const totalCapacity = house.rooms.reduce((acc, r) => acc + r.capacity, 0);
            const currentOccupancy = house.rooms.reduce((acc, r) => acc + r.occupants.filter(o => o !== null).length, 0);
            const isFull = currentOccupancy >= totalCapacity && totalCapacity > 0;

            return (
              <div key={house.id} className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:border-slate-200 transition-colors">
                <div className="flex">
                  <button 
                    onClick={() => setExpandedHouse(expandedHouse === house.id ? null : house.id)}
                    className="flex-1 p-5 flex justify-between items-center text-left"
                  >
                    <div>
                      <h3 className="font-black text-primary-dark text-lg leading-tight mb-1 uppercase tracking-tight">{house.name}</h3>
                      <div className="flex items-center gap-3">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{house.rooms.length} Quartos</p>
                        <span className={cn(
                          "text-[10px] font-black uppercase px-2 py-0.5 rounded-full",
                          isFull ? "bg-accent/10 text-accent" : "bg-primary-vibrant/10 text-primary-vibrant"
                        )}>
                          {currentOccupancy}/{totalCapacity} Vagas
                        </span>
                      </div>
                    </div>
                    <div className={cn(
                      "w-10 h-10 rounded-2xl flex items-center justify-center transition-all",
                      expandedHouse === house.id ? "bg-primary-dark text-white shadow-lg shadow-primary-dark/20" : "bg-slate-50 text-slate-300"
                    )}>
                      <ChevronRight 
                        size={20} 
                        className={cn("transition-transform", expandedHouse === house.id && "rotate-90")} 
                      />
                    </div>
                  </button>
                </div>
              
                <AnimatePresence>
                  {expandedHouse === house.id && (
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: 'auto' }}
                      exit={{ height: 0 }}
                      className="bg-slate-50 overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-2 border-t border-slate-100/50">
                        <div className="flex gap-2 mb-4">
                          <button onClick={() => setIsEditing(house)} className="flex-1 bg-white border border-slate-100 rounded-xl py-3 text-[10px] font-black uppercase text-slate-400 flex items-center justify-center gap-2 shadow-sm">
                            <Edit2 size={12} /> Editar Info
                          </button>
                          <button onClick={() => onDelete(house.id)} className="flex-1 bg-white border border-slate-100 rounded-xl py-3 text-[10px] font-black uppercase text-accent flex items-center justify-center gap-2 shadow-sm">
                            <Trash2 size={12} /> Excluir Rep
                          </button>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Quartos Disponíveis</p>
                            <button 
                              onClick={() => setIsEditingRoom({ houseId: house.id })}
                              className="text-[10px] font-black uppercase text-button px-2 py-1 rounded-lg bg-button/5 flex items-center gap-1"
                            >
                              <Plus size={10} /> Novo Quarto
                            </button>
                          </div>
                          {house.rooms.map(room => (
                            <div
                              key={room.id}
                              className="w-full bg-white p-4 rounded-2xl flex justify-between items-center shadow-sm border border-slate-100/50"
                            >
                              <div className="flex items-center flex-1" onClick={() => navigate(`/quarto/${house.id}/${room.id}`)}>
                                <div className="w-10 h-10 bg-primary-dark/5 rounded-xl flex items-center justify-center mr-3 text-primary-dark">
                                  <Bed size={20} />
                                </div>
                                <div className="text-left">
                                  <p className="font-bold text-primary-dark text-sm uppercase">{room.name}</p>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase">
                                    {room.occupants.filter(o => o !== null).length}/{room.capacity} Ocupados
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <button onClick={() => setIsEditingRoom({ id: room.id, name: room.name, capacity: room.capacity, houseId: house.id })} className="p-2 text-slate-300 hover:text-primary-dark">
                                  <Edit2 size={14} />
                                </button>
                                <button onClick={() => onDeleteRoom(room.id)} className="p-2 text-slate-300 hover:text-accent">
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>

      {/* Cadastro/Edição de República Modal */}
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
              animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-[40px] p-8 max-h-[90vh] overflow-y-auto max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-primary-dark uppercase tracking-tighter">
                  {isEditing.id ? 'Editar Alojamento' : 'Novo Alojamento'}
                </h2>
                <button onClick={() => setIsEditing(null)} className="p-2 text-slate-300">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveHouse} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Nome da República</label>
                  <input type="text" required placeholder="EX: REPÚBLICA PANTANAL" value={isEditing.name || ''} onChange={(e) => setIsEditing({ ...isEditing, name: e.target.value.toUpperCase() })} className="w-full bg-slate-50 border-none rounded-2xl py-4 px-6 font-semibold text-primary-dark uppercase" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Localização</label>
                  <div className="relative">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="text" placeholder="CIDADE, BAIRRO OU RUA" value={(isEditing as any).location || ''} onChange={(e) => setIsEditing({ ...isEditing, location: e.target.value.toUpperCase() } as any)} className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 font-semibold text-primary-dark uppercase" />
                  </div>
                </div>
                <div className="pt-6">
                  <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={isLoading} className="w-full bg-button text-white py-5 rounded-3xl font-black shadow-xl shadow-button/20 text-sm tracking-widest uppercase flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isEditing.id ? "Salvar Alterações" : "Cadastrar República")}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cadastro/Edição de QUARTO Modal */}
      <AnimatePresence>
        {isEditingRoom && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary-dark/60 backdrop-blur-sm z-[101] flex items-end"
          >
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bg-white w-full rounded-t-[40px] p-8 max-h-[90vh] overflow-y-auto max-w-md mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-button font-black text-[10px] uppercase tracking-widest mb-1">Quarto</p>
                  <h2 className="text-2xl font-black text-primary-dark uppercase tracking-tighter">
                    {isEditingRoom.id ? 'Editar Quarto' : 'Novo Quarto'}
                  </h2>
                </div>
                <button onClick={() => setIsEditingRoom(null)} className="p-2 text-slate-300">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSaveRoom} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Identificação / Nome</label>
                  <div className="relative">
                    <ListOrdered className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="text" required placeholder="EX: QUARTO 01" value={isEditingRoom.name || ''} onChange={(e) => setIsEditingRoom({ ...isEditingRoom, name: e.target.value.toUpperCase() })} className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 font-semibold text-primary-dark uppercase" />
                  </div>
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Capacidade (Nº de Vagas)</label>
                  <div className="relative">
                    <Bed className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input type="number" required min="1" max="20" placeholder="EX: 4" value={isEditingRoom.capacity || ''} onChange={(e) => setIsEditingRoom({ ...isEditingRoom, capacity: parseInt(e.target.value) })} className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 font-semibold text-primary-dark" />
                  </div>
                </div>

                <div className="pt-6">
                  <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={isLoading} className="w-full bg-primary-dark text-white py-5 rounded-3xl font-black shadow-xl shadow-primary-dark/20 text-sm tracking-widest uppercase flex items-center justify-center gap-2">
                    {isLoading ? <Loader2 className="animate-spin" size={20} /> : (isEditingRoom.id ? "Salvar Alterações" : "Adicionar Quarto")}
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
