import React from 'react';
import { Suit, Rank, FIGURE_TITLES } from '@/core/types/card';

interface MinifigArtProps {
  suit: Suit;
  rank: 10 | 11 | 12 | 13;
  className?: string;
  size?: number;
}

export const MinifigArt: React.FC<MinifigArtProps> = ({ suit, rank, className = '', size = 120 }) => {
  const info = FIGURE_TITLES[suit]?.[rank];

  // Colores base de juguete por facción
  const factionColors = {
    oros: { skin: '#FBBF24', primary: '#D97706', secondary: '#F59E0B', accent: '#78350F', glow: '#FEF3C7' },
    copas: { skin: '#FCD34D', primary: '#DC2626', secondary: '#EF4444', accent: '#991B1B', glow: '#FEE2E2' },
    espadas: { skin: '#FBBF24', primary: '#475569', secondary: '#64748B', accent: '#1E293B', glow: '#F1F5F9' },
    bastos: { skin: '#34D399', primary: '#059669', secondary: '#10B981', accent: '#065F46', glow: '#ECFDF5' },
  }[suit];

  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 110"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="drop-shadow-sm"
      >
        {/* Sombra base */}
        <ellipse cx="50" cy="104" rx="28" ry="4" fill="rgba(0,0,0,0.2)" />

        {/* --- PIERNAS Y CADERA DE BLOQUE --- */}
        <rect x="36" y="80" width="28" height="6" rx="1" fill={factionColors.accent} />
        {/* Pierna Izquierda */}
        <rect x="36" y="85" width="12" height="18" rx="2" fill={factionColors.primary} stroke={factionColors.accent} strokeWidth="1" />
        <rect x="36" y="99" width="12" height="4" fill={factionColors.accent} />
        {/* Pierna Derecha */}
        <rect x="52" y="85" width="12" height="18" rx="2" fill={factionColors.primary} stroke={factionColors.accent} strokeWidth="1" />
        <rect x="52" y="99" width="12" height="4" fill={factionColors.accent} />

        {/* --- TORSO TRAPEZOIDAL DE BLOQUE --- */}
        <path
          d="M32 46L36 80H64L68 46H32Z"
          fill={factionColors.secondary}
          stroke={factionColors.accent}
          strokeWidth="1.5"
        />

        {/* Detalles específicos del torso según Rango */}
        {rank === 10 && (
          // Sota: Arnés cruzado o placa de reconocimiento
          <g>
            <line x1="38" y1="48" x2="62" y2="78" stroke={factionColors.glow} strokeWidth="3" />
            <line x1="62" y1="48" x2="38" y2="78" stroke={factionColors.glow} strokeWidth="3" />
            <circle cx="50" cy="63" r="4" fill={factionColors.accent} />
          </g>
        )}

        {rank === 11 && (
          // Caballo: Coraza o propulsor
          <g>
            <rect x="42" y="52" width="16" height="20" rx="3" fill={factionColors.glow} opacity="0.9" />
            <path d="M44 62H56" stroke={factionColors.primary} strokeWidth="2" />
            <path d="M44 66H56" stroke={factionColors.primary} strokeWidth="2" />
          </g>
        )}

        {rank === 12 && (
          // Rey: Manto real o escudo de armas
          <g>
            {/* Capa detrás */}
            <path d="M30 48L24 82H76L70 48Z" fill={factionColors.accent} opacity="0.3" />
            {/* Pechera dorada */}
            <circle cx="50" cy="63" r="8" fill={factionColors.glow} stroke={factionColors.accent} strokeWidth="1" />
            <polygon points="50,58 52,63 57,63 53,66 55,71 50,68 45,71 47,66 43,63 48,63" fill={factionColors.primary} />
          </g>
        )}

        {rank === 13 && (
          // Comodín: Núcleo de poder místico/cuántico pulsante
          <g>
            <circle cx="50" cy="63" r="10" fill={factionColors.glow} stroke={factionColors.primary} strokeWidth="2" />
            <circle cx="50" cy="63" r="5" fill="#FFFFFF" />
            <path d="M50 48V78" stroke={factionColors.accent} strokeWidth="1" strokeDasharray="2 2" />
            <path d="M35 63H65" stroke={factionColors.accent} strokeWidth="1" strokeDasharray="2 2" />
          </g>
        )}

        {/* --- BRAZOS Y MANOS DE PINZA DE BLOQUE --- */}
        {/* Brazo izquierdo */}
        <path d="M32 48L22 66L26 70L36 52Z" fill={factionColors.secondary} stroke={factionColors.accent} strokeWidth="1" />
        {/* Mano C-clamp izquierda */}
        <path d="M21 68C18 70 18 76 21 78C23 79 26 77 26 75C24 75 23 73 23 72C23 71 24 70 25 70" stroke={factionColors.skin} strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* Brazo derecho */}
        <path d="M68 48L78 66L74 70L64 52Z" fill={factionColors.secondary} stroke={factionColors.accent} strokeWidth="1" />
        {/* Mano C-clamp derecha */}
        <path d="M79 68C82 70 82 76 79 78C77 79 74 77 74 75C76 75 77 73 77 72C77 71 76 70 75 70" stroke={factionColors.skin} strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* --- CUELLO DE BLOQUE --- */}
        <rect x="46" y="42" width="8" height="5" fill={factionColors.skin} />

        {/* --- CABEZA CILÍNDRICA DE JUGUETE --- */}
        <rect x="40" y="22" width="20" height="21" rx="4" fill={factionColors.skin} stroke="#78350F" strokeWidth="1.2" />
        {/* Stud superior de la cabeza */}
        <rect x="45" y="18" width="10" height="4" rx="1.5" fill={factionColors.skin} stroke="#78350F" strokeWidth="1" />

        {/* Ojos de juguete clásicos (dos puntos negros con brillo blanco) */}
        <circle cx="45" cy="31" r="1.8" fill="#1E293B" />
        <circle cx="44.4" cy="30.4" r="0.6" fill="#FFFFFF" />
        <circle cx="55" cy="31" r="1.8" fill="#1E293B" />
        <circle cx="54.4" cy="30.4" r="0.6" fill="#FFFFFF" />

        {/* Sonrisa de bloque */}
        <path d="M46 37C48 39 52 39 54 37" stroke="#1E293B" strokeWidth="1.2" strokeLinecap="round" fill="none" />

        {/* --- TOCADOS / CASCOS ESPECÍFICOS SEGÚN RANGO Y FACCIÓN --- */}
        {suit === 'oros' && rank === 10 && (
          // Escudero: Casco cónico medieval
          <path d="M38 24L50 8L62 24H38Z" fill="#D97706" stroke="#78350F" strokeWidth="1" />
        )}
        {suit === 'oros' && rank === 11 && (
          // Caballero: Casco con celada y penacho rojo
          <g>
            <rect x="38" y="19" width="24" height="12" rx="2" fill="#D97706" stroke="#78350F" strokeWidth="1" />
            <line x1="42" y1="26" x2="58" y2="26" stroke="#1E293B" strokeWidth="2" strokeDasharray="2 2" />
            <path d="M50 19C50 12 55 10 58 7" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
          </g>
        )}
        {suit === 'oros' && rank === 12 && (
          // Rey Arturo: Corona dorada con 3 picos y studs
          <path d="M37 23L41 12L46 18L50 10L54 18L59 12L63 23H37Z" fill="#FBBF24" stroke="#B45309" strokeWidth="1.2" />
        )}
        {suit === 'oros' && rank === 13 && (
          // Dragón Dorado: Cresta con cuernos dorados
          <path d="M36 22L30 14L40 18L50 12L60 18L70 14L64 22H36Z" fill="#F59E0B" stroke="#78350F" strokeWidth="1.2" />
        )}

        {suit === 'copas' && rank === 10 && (
          // Vigilante: Antifaz enmascarado
          <path d="M39 28H61V33H39V28Z" fill="#1E293B" />
        )}
        {suit === 'copas' && rank === 11 && (
          // Velocista: Casco aerodinámico con relámpagos laterales
          <g>
            <path d="M38 18H62V24H38V18Z" fill="#DC2626" />
            <polygon points="36,20 31,24 37,25" fill="#FBBF24" />
            <polygon points="64,20 69,24 63,25" fill="#FBBF24" />
          </g>
        )}
        {suit === 'copas' && rank === 12 && (
          // Capitán Titán: Casco con alas doradas
          <g>
            <path d="M39 18H61V24H39V18Z" fill="#991B1B" />
            <circle cx="50" cy="21" r="3" fill="#FBBF24" />
          </g>
        )}
        {suit === 'copas' && rank === 13 && (
          // Guardián Cósmico: Tiara estelar con gema flotante
          <g>
            <circle cx="50" cy="14" r="5" fill="#EF4444" stroke="#FFFFFF" strokeWidth="1.5" />
            <path d="M40 22C44 19 56 19 60 22" stroke="#DC2626" strokeWidth="2" />
          </g>
        )}

        {suit === 'espadas' && rank === 10 && (
          // Cazador: Cinta con pluma de ave prehistórica
          <g>
            <rect x="39" y="21" width="22" height="3" fill="#78350F" />
            <path d="M60 21L66 12L63 21" fill="#FFFFFF" stroke="#475569" strokeWidth="0.8" />
          </g>
        )}
        {suit === 'espadas' && rank === 11 && (
          // Jinete: Cráneo óseo de raptor
          <path d="M38 23L44 14L56 14L62 23H38Z" fill="#E2E8F0" stroke="#334155" strokeWidth="1" />
        )}
        {suit === 'espadas' && rank === 12 && (
          // Jefe Mamut: Tocado de colmillos de mamut gigantes
          <g>
            <path d="M36 24C30 18 32 10 30 6" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="round" />
            <path d="M64 24C70 18 68 10 70 6" stroke="#F1F5F9" strokeWidth="3" strokeLinecap="round" />
            <rect x="38" y="20" width="24" height="4" fill="#475569" />
          </g>
        )}
        {suit === 'espadas' && rank === 13 && (
          // Chamán: Máscara ritual de madera con fuego
          <g>
            <path d="M36 20H64V25H36V20Z" fill="#78350F" />
            <polygon points="50,6 46,14 54,14" fill="#F97316" />
          </g>
        )}

        {suit === 'bastos' && rank === 10 && (
          // Androide: Visor ciclope de datos
          <g>
            <rect x="42" y="29" width="16" height="4" rx="2" fill="#10B981" />
            <circle cx="50" cy="31" r="1.5" fill="#FFFFFF" />
            <line x1="58" y1="21" x2="62" y2="14" stroke="#10B981" strokeWidth="1.5" />
          </g>
        )}
        {suit === 'bastos' && rank === 11 && (
          // Mecha: Casco de combate cibernético blindado
          <g>
            <path d="M37 18H63V26H37V18Z" fill="#065F46" stroke="#10B981" strokeWidth="1" />
            <line x1="43" y1="23" x2="57" y2="23" stroke="#34D399" strokeWidth="2" />
          </g>
        )}
        {suit === 'bastos' && rank === 12 && (
          // Emperador Ciber: Diadema de circuitos y procesadores
          <g>
            <rect x="38" y="17" width="24" height="6" fill="#047857" />
            <line x1="42" y1="14" x2="42" y2="17" stroke="#34D399" strokeWidth="2" />
            <line x1="50" y1="12" x2="50" y2="17" stroke="#34D399" strokeWidth="2" />
            <line x1="58" y1="14" x2="58" y2="17" stroke="#34D399" strokeWidth="2" />
          </g>
        )}
        {suit === 'bastos' && rank === 13 && (
          // IA Suprema: Halo cuántico flotante de nodos de datos
          <g>
            <circle cx="50" cy="12" r="7" stroke="#34D399" strokeWidth="2" strokeDasharray="3 3" />
            <circle cx="50" cy="12" r="3" fill="#ECFDF5" />
          </g>
        )}
      </svg>
      {info && (
        <div className="text-center mt-1">
          <div className="text-[10px] font-bold text-slate-800 leading-tight tracking-tight uppercase">
            {info.name}
          </div>
          <div className="text-[8px] font-semibold text-slate-500 uppercase tracking-widest">
            {info.subtitle}
          </div>
        </div>
      )}
    </div>
  );
};
