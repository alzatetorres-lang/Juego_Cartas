import React from 'react';
import { Suit } from '@/core/types/card';

interface SuitIconProps {
  suit: Suit;
  className?: string;
  size?: number;
}

export const SuitIcon: React.FC<SuitIconProps> = ({ suit, className = '', size = 24 }) => {
  switch (suit) {
    case 'oros':
      // Moneda / Stud Medieval Dorado
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Borde exterior biselado */}
          <circle cx="16" cy="16" r="14" fill="#D97706" stroke="#92400E" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="12" fill="#F59E0B" />
          {/* Stud de bloque central */}
          <circle cx="16" cy="16" r="7" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />
          <circle cx="16" cy="16" r="5" fill="#FDE68A" />
          <circle cx="14" cy="14" r="1.5" fill="#FFFFFF" opacity="0.8" />
          {/* 4 Remaches de bloque en cuadrante */}
          <circle cx="16" cy="6" r="1.2" fill="#78350F" />
          <circle cx="16" cy="26" r="1.2" fill="#78350F" />
          <circle cx="6" cy="16" r="1.2" fill="#78350F" />
          <circle cx="26" cy="16" r="1.2" fill="#78350F" />
        </svg>
      );

    case 'copas':
      // Cáliz / Trofeo de Poder de Superhéroe
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Base del cáliz */}
          <path d="M10 27H22V29H10V27Z" fill="#991B1B" />
          <path d="M12 24H20V27H12V24Z" fill="#DC2626" />
          {/* Tallo */}
          <rect x="14.5" y="19" width="3" height="5" fill="#EF4444" stroke="#7F1D1D" strokeWidth="0.5" />
          {/* Copa con reactor de energía */}
          <path
            d="M7 6H25C25 14 21 19 16 19C11 19 7 14 7 6Z"
            fill="#DC2626"
            stroke="#991B1B"
            strokeWidth="1.5"
          />
          {/* Gema de reactor central */}
          <circle cx="16" cy="12" r="4" fill="#FCA5A5" stroke="#7F1D1D" strokeWidth="1" />
          <circle cx="16" cy="12" r="2.5" fill="#FEF2F2" />
          <circle cx="15" cy="11" r="1" fill="#FFFFFF" />
          {/* Alas / Asas de superhéroe */}
          <path d="M7 8C4 8 3 11 5 14C6 12 7 10 7 8Z" fill="#EF4444" />
          <path d="M25 8C28 8 29 11 27 14C26 12 25 10 25 8Z" fill="#EF4444" />
        </svg>
      );

    case 'espadas':
      // Espada de Piedra y Hueso Cavernícola
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Hoja de piedra tallada */}
          <path
            d="M16 3L20 8L18 20L16 23L14 20L12 8L16 3Z"
            fill="#64748B"
            stroke="#1E293B"
            strokeWidth="1.2"
          />
          {/* Borde biselado de la piedra */}
          <path d="M16 3V23" stroke="#94A3B8" strokeWidth="1" strokeLinecap="round" />
          <path d="M13 10L16 14L19 10" stroke="#334155" strokeWidth="0.8" />
          {/* Guarda de hueso */}
          <rect x="9" y="22" width="14" height="3" rx="1.5" fill="#E2E8F0" stroke="#475569" strokeWidth="1" />
          {/* Empuñadura de tiras de cuero */}
          <rect x="14" y="25" width="4" height="4" fill="#78350F" />
          {/* Pomo de piedra */}
          <circle cx="16" cy="29.5" r="2" fill="#475569" stroke="#1E293B" strokeWidth="0.8" />
        </svg>
      );

    case 'bastos':
      // Cilindro de Plasma Neón Futurista
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={className}
        >
          {/* Núcleo de energía de plasma */}
          <rect x="13" y="4" width="6" height="24" rx="3" fill="#10B981" stroke="#047857" strokeWidth="1.2" />
          {/* Anillos de contención magnética */}
          <rect x="11" y="8" width="10" height="2" rx="1" fill="#34D399" />
          <rect x="11" y="15" width="10" height="2" rx="1" fill="#34D399" />
          <rect x="11" y="22" width="10" height="2" rx="1" fill="#34D399" />
          {/* Centro de luz neón concentrada */}
          <line x1="16" y1="6" x2="16" y2="26" stroke="#ECFDF5" strokeWidth="1.8" strokeLinecap="round" />
          {/* Emisores superior e inferior */}
          <circle cx="16" cy="4" r="2.5" fill="#065F46" />
          <circle cx="16" cy="28" r="2.5" fill="#065F46" />
        </svg>
      );
  }
};
