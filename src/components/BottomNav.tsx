import React from 'react';
import { LayoutDashboard, Building2, Users, FileText, Plus } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

export const BottomNav = () => {
  const tabs = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Resumo', path: '/' },
    { id: 'housing', icon: Building2, label: 'Repúblicas', path: '/republicas' },
    { id: 'actions', icon: Plus, label: '', isCenter: true, path: '/acoes' },
    { id: 'collaborators', icon: Users, label: 'Pessoas', path: '/pessoas' },
    { id: 'reports', icon: FileText, label: 'Relatórios', path: '/relatorios' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 pb-6 pt-2 flex justify-between items-center z-50 max-w-md mx-auto">
      {tabs.map((tab) => (
        <NavLink
          key={tab.id}
          to={tab.path}
          className={({ isActive }) => cn(
            "flex flex-col items-center justify-center transition-all duration-200",
            tab.isCenter ? "bg-button text-white p-4 rounded-full -mt-10 shadow-lg shadow-primary-dark/20" : "flex-1",
            isActive && !tab.isCenter ? "text-primary-dark" : "text-slate-400"
          )}
        >
          <tab.icon size={tab.isCenter ? 28 : 24} />
          {tab.label && <span className="text-[10px] mt-1 font-semibold">{tab.label}</span>}
        </NavLink>
      ))}
    </nav>
  );
};
