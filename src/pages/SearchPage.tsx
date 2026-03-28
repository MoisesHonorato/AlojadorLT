import React, { useState } from 'react';
import { Search, ChevronRight } from 'lucide-react';
import { Collaborator, House, Room } from '../types';
import { useNavigate } from 'react-router-dom';

export const SearchPage = ({ collaborators, houses }: { 
  collaborators: Collaborator[], 
  houses: House[]
}) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const filteredCollaborators = collaborators.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredHouses = houses.filter(h => 
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  const filteredRooms: { house: House, room: Room }[] = [];
  houses.forEach(h => {
    h.rooms.forEach(r => {
      if (r.name.toLowerCase().includes(search.toLowerCase())) {
        filteredRooms.push({ house: h, room: r });
      }
    });
  });

  const getLoc = (c: Collaborator) => {
    for (const house of houses) {
      for (const room of house.rooms) {
        if (room.occupants.includes(c.id)) {
          return `${house.name.split(' - ')[0]}, ${room.name}`;
        }
      }
    }
    return "Disponível";
  };

  return (
    <div className="px-6 pt-8 pb-32">
      <header className="mb-8">
        <p className="text-accent font-black text-xs uppercase tracking-widest mb-1">Busca Global</p>
        <h1 className="text-4xl font-black text-primary-dark tracking-tighter">Localizar</h1>
      </header>

      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
        <input 
          type="text"
          placeholder="Pessoas, casas ou quartos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-12 pr-4 font-semibold text-primary-dark placeholder:text-slate-300 focus:ring-2 focus:ring-primary-vibrant/20 transition-all shadow-sm"
        />
      </div>

      {search.length > 0 && (
        <div className="space-y-8">
          {filteredCollaborators.length > 0 && (
            <div>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 ml-1">Colaboradores</h3>
              <div className="space-y-2">
                {filteredCollaborators.map(c => (
                  <div key={c.id} className="bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center shadow-sm">
                    <div>
                      <p className="font-bold text-primary-dark">{c.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{getLoc(c)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {filteredHouses.length > 0 && (
            <div>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 ml-1">Repúblicas</h3>
              <div className="space-y-2">
                {filteredHouses.map(h => (
                  <button 
                    key={h.id} 
                    onClick={() => navigate('/republicas')}
                    className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center text-left shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-primary-dark">{h.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{h.location}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-200" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredRooms.length > 0 && (
            <div>
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3 ml-1">Quartos</h3>
              <div className="space-y-2">
                {filteredRooms.map(({ house, room }) => (
                  <button
                    key={room.id}
                    onClick={() => navigate(`/quarto/${house.id}/${room.id}`)}
                    className="w-full bg-white p-4 rounded-2xl border border-slate-100 flex justify-between items-center text-left shadow-sm"
                  >
                    <div>
                      <p className="font-bold text-primary-dark">{room.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">{house.name}</p>
                    </div>
                    <ChevronRight size={16} className="text-slate-200" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {search.length === 0 && (
        <div className="flex flex-col items-center justify-center pt-20 text-slate-300">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="opacity-20" />
          </div>
          <p className="font-bold text-xs uppercase tracking-widest">Digite para pesquisar em tudo</p>
        </div>
      )}
    </div>
  );
};
