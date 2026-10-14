'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, Rank } from '@/core/types/card';
import { SuitIcon } from './SuitIcon';
import { MinifigArt } from './MinifigArt';
import { useGameStore } from '@/store/useGameStore';

interface Card2DProps {
  card: Card;
  onClick?: () => void;
  isSelected?: boolean;
  isPlayable?: boolean;
  isDimmed?: boolean;
  isHighlighted?: boolean; // Para tutorial spotlight
  customBackId?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  id?: string;
}

export const Card2D: React.FC<Card2DProps> = ({
  card,
  onClick,
  isSelected = false,
  isPlayable = true,
  isDimmed = false,
  isHighlighted = false,
  customBackId,
  size = 'md',
  className = '',
  id,
}) => {
  const storeBack = useGameStore((s) => s.inventory.selectedCardBack);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const backId = customBackId || storeBack;

  // Dimensiones según tamaño
  const sizeStyles = {
    sm: 'w-16 h-24 text-xs',
    md: 'w-24 h-36 text-sm',
    lg: 'w-32 h-48 text-base',
  }[size];

  // Texto o etiqueta de rango
  const formatRank = (r: Rank): string => {
    switch (r) {
      case 1:
        return '1 (As)';
      case 10:
        return '10 (Sota)';
      case 11:
        return '11 (Cab.)';
      case 12:
        return '12 (Rey)';
      case 13:
        return '13 (Com.)';
      default:
        return String(r);
    }
  };

  const shortRank = (r: Rank): string => {
    switch (r) {
      case 10:
        return '10';
      case 11:
        return '11';
      case 12:
        return '12';
      case 13:
        return '13';
      default:
        return String(r);
    }
  };

  // Color de texto del rango
  const rankTextColor =
    card.color === 'warm'
      ? card.suit === 'oros'
        ? 'text-amber-600'
        : 'text-red-600'
      : card.suit === 'espadas'
      ? 'text-slate-700'
      : 'text-emerald-700';

  // Configuración del dorso de bloques según inventario
  const getBackDesign = (id: string) => {
    switch (id) {
      case 'back_cyber_neon':
        return {
          bg: 'bg-emerald-700',
          border: 'border-emerald-500',
          studColor: 'bg-emerald-400 border-emerald-300',
          accent: 'CIBER',
        };
      case 'back_gold_plate':
        return {
          bg: 'bg-amber-600',
          border: 'border-amber-400',
          studColor: 'bg-amber-300 border-amber-200',
          accent: 'ORO',
        };
      case 'back_cave_stone':
        return {
          bg: 'bg-slate-700',
          border: 'border-slate-500',
          studColor: 'bg-slate-500 border-slate-400',
          accent: 'ROCA',
        };
      case 'back_brick_red':
      default:
        return {
          bg: 'bg-red-700',
          border: 'border-red-500',
          studColor: 'bg-red-500 border-red-400',
          accent: 'BRICK',
        };
    }
  };

  const backDesign = getBackDesign(backId);

  return (
    <motion.div
      id={id || `card-${card.id}`}
      layout
      whileHover={isPlayable && card.faceUp ? { y: -8, scale: 1.04 } : {}}
      whileTap={isPlayable ? { scale: 0.96 } : {}}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      onClick={onClick}
      className={`relative select-none cursor-pointer rounded-brick perspective-1000 ${sizeStyles} ${className} ${
        isSelected ? 'ring-4 ring-amber-400 -translate-y-3 shadow-xl' : ''
      } ${isDimmed ? 'opacity-40 grayscale pointer-events-none' : ''} ${
        isHighlighted ? 'tutorial-highlight ring-4 ring-amber-400 shadow-2xl' : ''
      }`}
    >
      <div
        className={`w-full h-full relative transform-style-3d transition-transform duration-300 ${
          card.faceUp ? '' : 'rotate-y-180'
        }`}
      >
        {/* --- ANVERSO DE LA CARTA (FACE UP) --- */}
        <div
          className={`absolute inset-0 backface-hidden bg-[#FFFDF7] rounded-brick border-2 border-slate-300 shadow-card-brick flex flex-col justify-between p-1.5 overflow-hidden brick-bevel`}
        >
          {/* Studs de adorno sutil en esquinas superiores */}
          <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-slate-200 shadow-stud border border-slate-300 opacity-60" />

          {/* Índice Superior Izquierdo */}
          <div className="flex flex-col items-center leading-none z-10 w-fit">
            <span className={`font-black text-xs md:text-sm tracking-tighter ${rankTextColor}`}>
              {shortRank(card.rank)}
            </span>
            <SuitIcon suit={card.suit} size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />
          </div>

          {/* Cuerpo Central */}
          <div className="flex-1 flex items-center justify-center my-auto overflow-hidden">
            {card.rank >= 10 ? (
              <MinifigArt
                suit={card.suit}
                rank={card.rank as 10 | 11 | 12 | 13}
                size={size === 'sm' ? 48 : size === 'md' ? 76 : 100}
              />
            ) : (
              // Para números 1 al 9: Patrón geométrico de iconos
              <div className="flex flex-col items-center justify-center gap-1">
                <SuitIcon suit={card.suit} size={size === 'sm' ? 24 : size === 'md' ? 36 : 48} />
                <span className={`text-[10px] font-bold tracking-tight opacity-75 ${rankTextColor}`}>
                  {formatRank(card.rank)}
                </span>
              </div>
            )}
          </div>

          {/* Índice Inferior Derecho Invertido */}
          <div className="flex flex-col items-center leading-none z-10 self-end rotate-180 w-fit">
            <span className={`font-black text-xs md:text-sm tracking-tighter ${rankTextColor}`}>
              {shortRank(card.rank)}
            </span>
            <SuitIcon suit={card.suit} size={size === 'sm' ? 12 : size === 'md' ? 16 : 20} />
          </div>
        </div>

        {/* --- REVERSO DE LA CARTA (FACE DOWN) --- */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-brick ${backDesign.bg} border-2 ${backDesign.border} shadow-card-brick p-2 flex flex-col items-center justify-center overflow-hidden brick-bevel`}
        >
          {/* Matriz de Studs de Bloques 3D */}
          <div className="grid grid-cols-2 gap-2 md:gap-3 w-full h-full items-center justify-items-center opacity-90 p-1">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 md:w-5 md:h-5 rounded-full ${backDesign.studColor} border shadow-stud flex items-center justify-center`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white opacity-40" />
              </div>
            ))}
          </div>

          {/* Emblema central de bloque */}
          <div className="absolute inset-auto bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full border border-white/20">
            <span className="text-[8px] font-black tracking-widest text-white drop-shadow">
              {backDesign.accent}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
