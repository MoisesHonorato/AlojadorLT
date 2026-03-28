import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { AlertCircle, CheckCircle2, X } from 'lucide-react';
import { cn } from '../lib/utils';

export const Toast = ({ message, type, onClose }: { message: string, type: 'error' | 'success', onClose: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[300] w-full max-w-xs px-6 pointer-events-none">
      <motion.div 
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
        className={cn(
          "pointer-events-auto bg-white p-4 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-4 border border-slate-50",
          type === 'error' ? "ring-1 ring-red-100" : "ring-1 ring-emerald-100"
        )}
      >
        <div className={cn(
          "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
          type === 'error' ? "bg-accent/10 text-accent shadow-accent/10" : "bg-emerald-50 text-emerald-600 shadow-emerald-50"
        )}>
          {type === 'error' ? <AlertCircle size={24} /> : <CheckCircle2 size={24} />}
        </div>
        
        <div className="flex-1 overflow-hidden pr-2">
          <p className={cn(
            "text-[10px] font-black uppercase tracking-[0.15em] mb-0.5",
            type === 'error' ? "text-accent" : "text-emerald-500"
          )}>
            {type === 'error' ? 'Atenção' : 'Sucesso'}
          </p>
          <p className="text-sm font-black text-primary-dark tracking-tight leading-tight uppercase line-clamp-2">
            {message}
          </p>
        </div>
        
        <button onClick={onClose} className="text-slate-200">
          <X size={16} />
        </button>
      </motion.div>
    </div>
  );
};
