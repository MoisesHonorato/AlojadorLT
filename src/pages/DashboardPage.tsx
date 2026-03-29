import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ChevronRight, House as HouseIcon, Users, FileText, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { House } from '../types';
import { useNavigate } from 'react-router-dom';

const DonutChart = ({ percentage, colorClass }: { percentage: number, colorClass: string }) => {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-24 h-24 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="48" cy="48" r={radius} stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-100" />
        <circle
          cx="48" cy="48" r={radius}
          stroke="currentColor" strokeWidth="8" fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={colorClass}
          style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-black text-primary-dark">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
};

const ProgressBar = ({ current, total }: { current: number, total: number }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const isFull = current >= total && total > 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className={cn("text-xs font-bold", isFull ? "text-accent" : "text-primary-dark")}>
          {isFull ? "Sem vagas" : `${total - current} vaga${total - current === 1 ? '' : 's'} disponíve${total - current === 1 ? 'l' : 'is'}`}
        </span>
        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Ocupação</span>
      </div>
      <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          className={cn(
            "h-full rounded-full",
            isFull ? "bg-accent" : "bg-gradient-to-r from-primary-dark to-primary-vibrant"
          )}
        />
      </div>
    </div>
  );
};

const HouseCard = ({ house, onClick }: { house: House, onClick: () => void, key?: string }) => {
  const totalCapacity = house.rooms.reduce((acc, room) => acc + room.capacity, 0);
  const currentOccupancy = house.rooms.reduce((acc, room) =>
    acc + room.occupants.filter(o => o !== null).length, 0
  );

  const genderColor = house.gender === 'Masculino' ? 'bg-blue-50/70' : house.gender === 'Feminino' ? 'bg-pink-50/70' : 'bg-white';

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={cn("p-5 rounded-3xl border border-slate-100 shadow-sm", genderColor)}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-black text-lg text-primary-dark leading-tight uppercase tracking-tight">{house.name}</h3>
          <div className="flex items-center text-slate-400 mt-1">
            <MapPin size={12} className="mr-1" />
            <span className="text-xs font-medium uppercase">{house.location}</span>
          </div>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl">
          <ChevronRight size={20} className="text-slate-300" />
        </div>
      </div>
      <ProgressBar current={currentOccupancy} total={totalCapacity} />
    </motion.div>
  );
};

export const DashboardPage = ({ houses }: { houses: House[] }) => {
  const navigate = useNavigate();

  const totalBeds = houses.reduce((acc, h) =>
    acc + h.rooms.reduce((rAcc, r) => rAcc + r.capacity, 0), 0
  );
  const occupiedBeds = houses.reduce((acc, h) =>
    acc + h.rooms.reduce((rAcc, r) => rAcc + r.occupants.filter(o => o !== null).length, 0), 0
  );

  let vagasMasc = 0;
  let vagasFem = 0;
  let vagasMistas = 0;

  const housesWithVacancies = houses.filter(house => {
    const cap = house.rooms.reduce((acc, r) => acc + r.capacity, 0);
    const occ = house.rooms.reduce((acc, r) => acc + r.occupants.filter(o => o !== null).length, 0);
    const avail = cap - occ;
    
    if (avail > 0) {
      if (house.gender === 'Masculino') vagasMasc += avail;
      else if (house.gender === 'Feminino') vagasFem += avail;
      else vagasMistas += avail;
      return true;
    }
    return false;
  });

  const fullHouses = houses.filter(house => {
    const cap = house.rooms.reduce((acc, r) => acc + r.capacity, 0);
    const occ = house.rooms.reduce((acc, r) => acc + r.occupants.filter(o => o !== null).length, 0);
    return occ >= cap && cap > 0;
  });

  return (
    <div className="px-6 pt-8 pb-32">
      <header className="mb-6 flex justify-between items-end">
        <div>
          <p className="text-accent font-black text-xs uppercase tracking-widest mb-1">Visão Geral</p>
          <h1 className="text-4xl font-black text-primary-dark tracking-tighter uppercase">Resumo</h1>
        </div>
      </header>

      {/* Atalhos Rápidos */}
      <div className="flex gap-3 mb-8">
        <button onClick={() => navigate('/republicas')} className="flex-1 bg-button/10 text-button py-3 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
          <HouseIcon size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Nova Rep.</span>
        </button>
        <button onClick={() => navigate('/pessoas')} className="flex-1 bg-primary-vibrant/10 text-primary-vibrant py-3 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
          <Users size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Add Pessoa</span>
        </button>
        <button onClick={() => navigate('/relatorios')} className="flex-1 bg-accent/10 text-accent py-3 rounded-2xl flex flex-col items-center justify-center gap-1 active:scale-95 transition-transform">
          <FileText size={20} />
          <span className="text-[10px] font-black uppercase tracking-widest">Relatórios</span>
        </button>
      </div>

      {/* Ocupação e Gráfico */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 flex items-center justify-between mb-4 shadow-sm">
        <div>
          <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lotação Global</h2>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-4xl font-black text-primary-dark leading-none">{occupiedBeds}</span>
            <span className="text-sm font-bold text-slate-300 mb-1">/ {totalBeds}</span>
          </div>
          <p className="text-xs font-bold text-slate-400">
            {totalBeds - occupiedBeds} vagas livres
          </p>
        </div>
        <DonutChart 
          percentage={totalBeds > 0 ? (occupiedBeds / totalBeds) * 100 : 0} 
          colorClass={totalBeds > 0 && occupiedBeds / totalBeds > 0.9 ? 'text-accent' : 'text-primary-vibrant'} 
        />
      </div>

      {/* Quebra de Vagas por Tipo */}
      <div className="grid grid-cols-3 gap-2 mb-8">
        <div className="bg-blue-50/50 rounded-2xl py-3 text-center border border-blue-100">
          <p className="text-xl font-black text-blue-600 leading-none">{vagasMasc}</p>
          <p className="text-[8px] font-black uppercase text-blue-400 mt-1 tracking-widest">Masc.</p>
        </div>
        <div className="bg-pink-50/50 rounded-2xl py-3 text-center border border-pink-100">
          <p className="text-xl font-black text-pink-600 leading-none">{vagasFem}</p>
          <p className="text-[8px] font-black uppercase text-pink-400 mt-1 tracking-widest">Fem.</p>
        </div>
        <div className="bg-slate-50 rounded-2xl py-3 text-center border border-slate-100">
          <p className="text-xl font-black text-slate-600 leading-none">{vagasMistas}</p>
          <p className="text-[8px] font-black uppercase text-slate-400 mt-1 tracking-widest">Mistas</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black text-primary-dark tracking-tight">Tem vagas</h2>
        <button onClick={() => navigate('/republicas')} className="text-xs font-black text-button uppercase tracking-widest">Ver Todas</button>
      </div>

      <div className="grid gap-4 mb-8">
        {housesWithVacancies.length === 0 ? (
          <div className="py-10 text-center text-slate-400">Nenhuma vaga disponível</div>
        ) : (
          [...housesWithVacancies].sort((a, b) => a.name.localeCompare(b.name)).map(house => (
            <HouseCard key={house.id} house={house} onClick={() => navigate('/republicas')} />
          ))
        )}
      </div>

      {fullHouses.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4 mt-6">
            <h2 className="text-xl font-black text-accent tracking-tight flex items-center gap-2">
              <AlertCircle size={20} />
              Lotadas
            </h2>
          </div>
          <div className="grid gap-4">
            {[...fullHouses].sort((a, b) => a.name.localeCompare(b.name)).map(house => (
              <HouseCard key={house.id} house={house} onClick={() => navigate('/republicas')} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
