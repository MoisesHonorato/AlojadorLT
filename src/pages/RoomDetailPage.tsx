import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Users, UserPlus, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';
import { House, Collaborator } from '../types';

export const RoomDetailPage = ({ houses, collaborators, onCheckOut, onCheckIn }: {
  houses: House[],
  collaborators: Collaborator[],
  onCheckOut: (houseId: string, roomId: string, bedIndex: number) => void,
  onCheckIn: (houseId: string, roomId: string, bedIndex: number) => void
}) => {
  const { houseId, roomId } = useParams();
  const navigate = useNavigate();

  const house = houses.find(h => h.id === houseId);
  const room = house?.rooms.find(r => r.id === roomId);

  if (!house || !room) {
    return <div className="p-10 text-center">Quarto não encontrado</div>;
  }

  return (
    <div className="px-6 pt-8 pb-32">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center text-primary-dark font-black text-sm">
        <ChevronRight size={20} className="rotate-180 mr-1" />
        Voltar
      </button>

      <header className="mb-8">
        <p className="text-accent font-black text-xs uppercase tracking-widest mb-1">{house.name}</p>
        <h1 className="text-4xl font-black text-primary-dark tracking-tighter">{room.name}</h1>
      </header>

      <div className="space-y-4">
        {room.occupants.map((occupantId, index) => {
          const collaborator = occupantId ? collaborators.find(c => c.id === occupantId) : null;
          
          return (
            <div key={index} className="bg-white p-5 rounded-3xl border border-slate-100 flex justify-between items-center shadow-sm">
              <div className="flex items-center">
                <div className={cn(
                  "w-12 h-12 rounded-2xl flex items-center justify-center mr-4",
                  collaborator ? "bg-primary-dark text-white" : "bg-slate-100 text-slate-300 border-2 border-dashed border-slate-200"
                )}>
                  {collaborator ? <Users size={24} /> : <UserPlus size={24} />}
                </div>
                <div>
                  <p className={cn("font-black text-sm", collaborator ? "text-primary-dark" : "text-slate-300 italic uppercase")}>
                    {collaborator ? collaborator.name : "[Vaga Livre]"}
                  </p>
                  {collaborator && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">{collaborator.role}</p>}
                </div>
              </div>

              {collaborator ? (
                <button 
                  onClick={() => onCheckOut(house.id, room.id, index)}
                  className="p-3 text-accent bg-accent/5 rounded-xl hover:bg-accent/10 transition-colors"
                >
                  <LogOut size={20} />
                </button>
              ) : (
                <button 
                  onClick={() => onCheckIn(house.id, room.id, index)}
                  className="px-4 py-2 bg-button text-white text-xs font-black rounded-xl shadow-md shadow-button/20 uppercase tracking-widest"
                >
                  ALOCAR
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
