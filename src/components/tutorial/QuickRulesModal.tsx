'use client';

import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { GameType } from '@/core/types/card';
import { BrickButton } from '@/components/ui/BrickButton';
import { SuitIcon } from '@/components/cards/SuitIcon';
import { BookOpen, Trophy, Shield, Zap, Sparkles } from 'lucide-react';

interface QuickRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  gameType: GameType;
  onStartInteractiveTutorial?: () => void;
}

export const QuickRulesModal: React.FC<QuickRulesModalProps> = ({
  isOpen,
  onClose,
  gameType,
  onStartInteractiveTutorial,
}) => {
  const getRulesContent = () => {
    switch (gameType) {
      case 'mus':
        return {
          title: 'Reglas Rápidas: El Gran Mus de Bloques',
          badge: 'Estrategia y Envites Tradicionales',
          sections: [
            {
              icon: <Trophy className="text-amber-400" size={18} />,
              heading: 'Los 4 Lances Reglamentarios',
              text: 'Se juega en 4 fases sucesivas: 1. Grande (cartas más altas), 2. Chica (más bajas), 3. Pares (duples > medias > parejas) y 4. Juego (sumar 31 o más; si nadie llega, gana el Punto más cercano a 30).',
            },
            {
              icon: <Zap className="text-emerald-400" size={18} />,
              heading: 'Variantes de Reyes (4 u 8 Reyes)',
              text: 'En la variante estándar (4 Reyes), las figuras son 10, 11 y 12. En 8 Reyes, los 3 valen como Reyes (12) y los 2 valen como Ases (1), aumentando las probabilidades de lances altos.',
            },
            {
              icon: <Shield className="text-blue-400" size={18} />,
              heading: 'Panel de Señas (Modo 2v2)',
              text: 'Puedes transmitir en secreto a tu compañero de equipo las cartas clave: guiño de ojo (2 Reyes), morder labio (2 Ases), sacar la lengua (Medias) o torcer la boca (Duples).',
            },
          ],
        };

      case 'blackjack':
        return {
          title: 'Reglas Rápidas: Blackjack 21',
          badge: 'Probabilidad y Estrategia Casino',
          sections: [
            {
              icon: <Trophy className="text-amber-400" size={18} />,
              heading: 'Objetivo y Puntuación',
              text: 'Suma 21 puntos o supera al Crupier sin excederte. Cartas 2-9 valen su número; 10, Sota (10), Caballo (11), Rey (12) y Comodín (13) valen 10 puntos. El As vale 1 u 11.',
            },
            {
              icon: <Zap className="text-emerald-400" size={18} />,
              heading: 'Acciones Disponibles',
              text: 'Pedir (Hit) para recibir carta extra; Plantarse (Stand) para finalizar tu turno; Doblar (Double) para doblar tu apuesta recibiendo exactamente 1 carta más.',
            },
            {
              icon: <Shield className="text-blue-400" size={18} />,
              heading: 'Regla del Crupier',
              text: 'El Crupier está obligado a pedir carta mientras su total sea menor a 17, y debe plantarse automáticamente al llegar a 17 o más.',
            },
          ],
        };

      case 'klondike':
        return {
          title: 'Reglas Rápidas: Solitario Klondike',
          badge: 'El Clásico de 52 Cartas',
          sections: [
            {
              icon: <Trophy className="text-amber-400" size={18} />,
              heading: 'Objetivo de Fundaciones',
              text: 'Construye las 4 fundaciones superiores apilando en orden ascendente desde el As (1) hasta el Comodín (13) por cada uno de los 4 palos.',
            },
            {
              icon: <Zap className="text-emerald-400" size={18} />,
              heading: 'Alternancia de Colores en el Tablero',
              text: 'En las 7 columnas del tablero, las cartas deben apilarse en orden descendente alternando colores: Palos cálidos (Oros y Copas) sobre fríos (Espadas y Bastos).',
            },
            {
              icon: <Shield className="text-blue-400" size={18} />,
              heading: 'Mazo de Reserva y Espacios Vacíos',
              text: 'Roba cartas del mazo cuando no tengas movimientos disponibles. Las columnas vacías del tablero solo pueden ser ocupadas por un Rey o Comodín (rango 12 o 13).',
            },
          ],
        };

      case 'spider':
        return {
          title: 'Reglas Rápidas: Solitario Spider',
          badge: '104 Cartas y 10 Columnas',
          sections: [
            {
              icon: <Trophy className="text-amber-400" size={18} />,
              heading: 'Objetivo de 8 Escaleras',
              text: 'El objetivo es construir 8 escaleras completas en orden decreciente exacto desde el 13 (Comodín) hasta el 1 (As). Al completarse, la secuencia se retira automáticamente.',
            },
            {
              icon: <Zap className="text-emerald-400" size={18} />,
              heading: 'Movimiento de Pilas',
              text: 'Puedes colocar cualquier carta sobre otra de valor +1 (incluso de distinto palo). Sin embargo, solo podrás desplazar una pila junta si todas las cartas son del MISMO palo.',
            },
            {
              icon: <Shield className="text-blue-400" size={18} />,
              heading: 'Reparto de Fila',
              text: 'Cuando te bloquees, reparte una nueva tanda desde la reserva (1 carta para cada una de las 10 columnas). Asegúrate de no dejar columnas completamente vacías antes de repartir.',
            },
          ],
        };
    }
  };

  const content = getRulesContent();

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={content.title} maxWidth="lg">
      <div className="space-y-4">
        {/* Banner de bienvenida y palos */}
        <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="text-amber-400 shrink-0" size={20} />
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {content.badge}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-900 px-2 py-1 rounded-lg border border-slate-700">
            <SuitIcon suit="oros" size={16} />
            <SuitIcon suit="copas" size={16} />
            <SuitIcon suit="espadas" size={16} />
            <SuitIcon suit="bastos" size={16} />
          </div>
        </div>

        {/* Secciones explicativas con iconos */}
        <div className="space-y-3">
          {content.sections.map((sec, idx) => (
            <div
              key={idx}
              className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/80 hover:border-slate-600 transition-colors"
            >
              <div className="flex items-center gap-2 mb-1.5">
                {sec.icon}
                <h4 className="font-extrabold text-sm text-amber-300">{sec.heading}</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed pl-6">{sec.text}</p>
            </div>
          ))}
        </div>

        {/* Acciones del pie: Comenzar o Iniciar Tutorial Guiado */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-slate-700/80">
          {onStartInteractiveTutorial && (
            <BrickButton
              variant="ciber"
              size="sm"
              onClick={() => {
                onClose();
                onStartInteractiveTutorial();
              }}
              className="w-full sm:w-auto"
            >
              <Sparkles size={14} /> Modo Tutorial Guiado
            </BrickButton>
          )}
          <BrickButton variant="primary" size="sm" onClick={onClose} className="w-full sm:w-auto">
            ¡Entendido, a Jugar!
          </BrickButton>
        </div>
      </div>
    </Modal>
  );
};
