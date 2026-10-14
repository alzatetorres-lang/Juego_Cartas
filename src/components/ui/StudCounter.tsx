'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';

interface StudCounterProps {
  className?: string;
  onClick?: () => void;
}

export const StudCounter: React.FC<StudCounterProps> = ({ className = '', onClick }) => {
  const studs = useGameStore((s) => s.studs);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`inline-flex items-center gap-2 bg-slate-900/90 border-2 border-amber-500/80 rounded-full px-3.5 py-1.5 shadow-[0_3px_0_#78350f,0_5px_10px_rgba(0,0,0,0.5)] cursor-pointer backdrop-blur-sm select-none ${className}`}
    >
      {/* Icono de Stud Dorado de Bloque */}
      <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 border border-amber-300 shadow-stud flex items-center justify-center shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-amber-200 shadow-inner" />
      </div>

      <div className="flex items-baseline gap-1">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={studs}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="font-black text-amber-300 text-sm md:text-base tracking-wide"
          >
            {studs.toLocaleString()}
          </motion.span>
        </AnimatePresence>
        <span className="text-[10px] font-bold text-amber-200/70 uppercase tracking-wider">
          Piezas
        </span>
      </div>
    </motion.div>
  );
};
