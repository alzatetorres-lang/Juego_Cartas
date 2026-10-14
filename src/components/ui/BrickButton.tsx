'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { sfx } from '@/core/sound/sfx';
import { useGameStore } from '@/store/useGameStore';

interface BrickButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'dark' | 'ciber';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  isHighlighted?: boolean;
  id?: string;
  studsCount?: number;
}

export const BrickButton: React.FC<BrickButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  isHighlighted = false,
  id,
  studsCount = 4,
}) => {
  const soundEnabled = useGameStore((s) => s.soundEnabled);

  const handleClick = () => {
    if (disabled) return;
    if (soundEnabled) {
      sfx.playBrickSnap();
    }
    onClick?.();
  };

  const variantStyles = {
    primary:
      'bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white border-blue-400 shadow-[0_5px_0_#1e3a8a,0_8px_12px_rgba(0,0,0,0.35)]',
    success:
      'bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white border-emerald-400 shadow-[0_5px_0_#064e3b,0_8px_12px_rgba(0,0,0,0.35)]',
    danger:
      'bg-red-600 hover:bg-red-500 active:bg-red-700 text-white border-red-400 shadow-[0_5px_0_#7f1d1d,0_8px_12px_rgba(0,0,0,0.35)]',
    warning:
      'bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-900 border-amber-300 shadow-[0_5px_0_#78350f,0_8px_12px_rgba(0,0,0,0.35)]',
    dark:
      'bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white border-slate-600 shadow-[0_5px_0_#0f172a,0_8px_12px_rgba(0,0,0,0.35)]',
    ciber:
      'bg-teal-600 hover:bg-teal-500 active:bg-teal-700 text-white border-teal-300 shadow-[0_5px_0_#134e4a,0_8px_12px_rgba(0,0,0,0.35)]',
  }[variant];

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-lg font-bold',
    md: 'px-5 py-2.5 text-sm rounded-brick font-extrabold',
    lg: 'px-7 py-3.5 text-base rounded-brick font-black tracking-wide',
  }[size];

  return (
    <motion.button
      id={id}
      whileHover={disabled ? {} : { scale: 1.02 }}
      whileTap={disabled ? {} : { translateY: 4 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={disabled}
      onClick={handleClick}
      className={`relative inline-flex flex-col items-center justify-center select-none cursor-pointer border-t-2 border-l border-r ${variantStyles} ${sizeStyles} ${className} ${
        disabled ? 'opacity-45 cursor-not-allowed filter grayscale shadow-none' : ''
      } ${isHighlighted ? 'tutorial-highlight ring-4 ring-amber-400' : ''}`}
    >
      {/* Fila de Studs superiores decorativos */}
      {studsCount > 0 && size !== 'sm' && (
        <div className="flex gap-2 mb-1 justify-center opacity-85">
          {[...Array(studsCount)].map((_, i) => (
            <div
              key={i}
              className="w-2.5 h-1 rounded-full bg-white/40 shadow-inner"
            />
          ))}
        </div>
      )}
      <span className="flex items-center gap-2 drop-shadow-sm uppercase">
        {children}
      </span>
    </motion.button>
  );
};
