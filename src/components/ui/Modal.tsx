'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { BrickButton } from './BrickButton';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
}) => {
  if (!isOpen) return null;

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className={`w-full ${maxWidthStyles} bg-slate-900 border-4 border-slate-700 rounded-brick shadow-[0_15px_30px_rgba(0,0,0,0.7)] overflow-hidden flex flex-col my-auto`}
        >
          {/* Barra superior estilo Bloque de Construcción con Studs */}
          <div className="bg-slate-800 px-4 py-3 border-b-2 border-slate-700 flex items-center justify-between relative">
            {/* Studs decorativos de la cabecera */}
            <div className="flex gap-2 opacity-60">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-inner" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-inner" />
              <div className="w-2.5 h-2.5 rounded-full bg-slate-500 shadow-inner" />
            </div>

            <h3 className="text-base md:text-lg font-black text-amber-400 uppercase tracking-wide drop-shadow text-center flex-1">
              {title}
            </h3>

            <button
              onClick={onClose}
              className="p-1 rounded-lg bg-slate-700 hover:bg-red-600 text-slate-300 hover:text-white transition-colors cursor-pointer border border-slate-600"
            >
              <X size={18} />
            </button>
          </div>

          {/* Contenido del modal */}
          <div className="p-5 max-h-[80vh] overflow-y-auto">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
