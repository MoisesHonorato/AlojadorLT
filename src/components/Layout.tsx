import React from 'react';
import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { Building2, LogOut } from 'lucide-react';

export const Layout = ({ onLogout, children }: { onLogout: () => void, children?: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-white font-sans">
      <main className="max-w-md mx-auto relative min-h-screen pb-20">
        <div className="p-6 flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-dark rounded-lg flex items-center justify-center text-white">
              <Building2 size={16} />
            </div>
            <span className="font-black text-sm text-primary-dark tracking-tighter uppercase">ALOJADOR <span className="text-primary-vibrant">LT</span></span>
          </div>
          <button onClick={onLogout} className="text-slate-400 p-2 hover:bg-slate-50 rounded-xl transition-colors">
            <LogOut size={20} />
          </button>
        </div>

        {children || <Outlet />}

        <BottomNav />
      </main>
    </div>
  );
};
