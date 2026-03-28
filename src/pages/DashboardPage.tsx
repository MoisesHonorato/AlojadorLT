import React from 'react';
import { motion } from 'motion/react';
import { MapPin, ChevronRight, House as HouseIcon, Bed } from 'lucide-react';
import { cn } from '../lib/utils';
import { House } from '../types';
import { useNavigate } from 'react-router-dom';

const ProgressBar = ({ current, total }: { current: number, total: number }) => {
  const percentage = total > 0 ? (current / total) * 100 : 0;
  const isFull = current >= total && total > 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className={cn("text-xs font-bold", isFull ? "text-accent" : "text-primary-dark")}>
          {current}/{total} Vagas
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

  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-4"
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

const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center">
    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center mr-3", color)}>
      <Icon size={20} />
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{label}</p>
      <p className="text-xl font-black text-primary-dark leading-none">{value}</p>
    </div>
  </div>
);

export const DashboardPage = ({ houses }: { houses: House[] }) => {
  const navigate = useNavigate();

  const totalHouses = houses.length;
  const totalRooms = houses.reduce((acc, h) => acc + h.rooms.length, 0);
  const totalBeds = houses.reduce((acc, h) => 
    acc + h.rooms.reduce((rAcc, r) => rAcc + r.capacity, 0), 0
  );
  const occupiedBeds = houses.reduce((acc, h) => 
    acc + h.rooms.reduce((rAcc, r) => rAcc + r.occupants.filter(o => o !== null).length, 0), 0
  );

  return (
    <div className="px-6 pt-8 pb-32">
      <header className="mb-8">
        <p className="text-accent font-black text-xs uppercase tracking-widest mb-1">Visão Geral</p>
        <h1 className="text-4xl font-black text-primary-dark tracking-tighter uppercase">Resumo</h1>
      </header>

      <div className="grid grid-cols-2 gap-3 mb-8">
        <StatCard 
          label="Repúblicas" 
          value={totalHouses} 
          icon={HouseIcon} 
          color="bg-primary-vibrant/10 text-primary-vibrant" 
        />
        <StatCard 
          label="Quartos" 
          value={totalRooms} 
          icon={Bed} 
          color="bg-amber-100 text-amber-600" 
        />
        <div className="col-span-2">
          <StatCard 
            label="Ocupação Geral" 
            value={`${occupiedBeds} / ${totalBeds} Vagas`} 
            icon={MapPin} 
            color="bg-primary-dark/5 text-primary-dark" 
          />
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-black text-primary-dark tracking-tight">Destaques</h2>
        <button onClick={() => navigate('/republicas')} className="text-xs font-black text-button uppercase tracking-widest">Ver Todas</button>
      </div>

      <div className="grid gap-2">
        {houses.length === 0 ? (
          <div className="py-10 text-center text-slate-400">Nenhum dado disponível</div>
        ) : (
          houses.slice(0, 5).map(house => (
            <HouseCard key={house.id} house={house} onClick={() => navigate('/republicas')} />
          ))
        )}
      </div>
    </div>
  );
};
