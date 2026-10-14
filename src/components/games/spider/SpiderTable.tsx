'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Card2D } from '@/components/cards/Card2D';
import { BrickButton } from '@/components/ui/BrickButton';
import { SuitIcon } from '@/components/cards/SuitIcon';
import {
  SpiderGameState,
  initSpiderGame,
  dealFromSpiderStock,
  isValidMovableSpiderStack,
  canPlaceOnSpiderColumn,
  checkAndRemoveSpiderRun,
} from '@/core/engines/spiderEngine';
import { sfx } from '@/core/sound/sfx';
import { useGameStore } from '@/store/useGameStore';
import { Trophy, RefreshCw, Layers } from 'lucide-react';

interface SpiderTableProps {
  suitsCount?: 1 | 2 | 4;
  onGameEnd?: (won: boolean) => void;
}

export const SpiderTable: React.FC<SpiderTableProps> = ({
  suitsCount = 1,
  onGameEnd,
}) => {
  const [gameState, setGameState] = useState<SpiderGameState>(() =>
    initSpiderGame(suitsCount)
  );
  const [selectedColIndex, setSelectedColIndex] = useState<number | null>(null);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null);

  const addStuds = useGameStore((s) => s.addStuds);
  const recordResult = useGameStore((s) => s.recordGameResult);

  // Repartir fila de 10 cartas desde la reserva
  const handleDealStock = () => {
    if (gameState.stockDealsRemaining.length === 0) return;
    sfx.playCardFlip();
    setSelectedColIndex(null);
    setSelectedCardIndex(null);

    const nextState = dealFromSpiderStock(gameState);
    setGameState(nextState);

    if (nextState.isWon) {
      handleWin();
    }
  };

  // Clic en una carta o columna
  const handleCardClick = (colIndex: number, cardIndex: number) => {
    const col = gameState.tableau[colIndex];
    const clickedCard = col[cardIndex];

    if (!clickedCard.faceUp) return;

    // Si ya teníamos una selección activa, intentar mover hacia esta columna
    if (selectedColIndex !== null && selectedCardIndex !== null) {
      if (selectedColIndex === colIndex) {
        // Deseleccionar si hace clic en la misma columna
        setSelectedColIndex(null);
        setSelectedCardIndex(null);
        return;
      }
      handleMoveToColumn(colIndex);
      return;
    }

    // Comprobar si el bloque desde cardIndex hasta el final es válido para mover
    const subStack = col.slice(cardIndex);
    if (!isValidMovableSpiderStack(subStack)) {
      sfx.playBrickSnap();
      return;
    }

    sfx.playBrickSnap();
    setSelectedColIndex(colIndex);
    setSelectedCardIndex(cardIndex);
  };

  // Mover cartas a una columna destino
  const handleMoveToColumn = (targetColIndex: number) => {
    if (selectedColIndex === null || selectedCardIndex === null) return;

    const sourceCol = gameState.tableau[selectedColIndex];
    const cardsToMove = sourceCol.slice(selectedCardIndex);
    const targetCol = gameState.tableau[targetColIndex];

    if (!canPlaceOnSpiderColumn(cardsToMove, targetCol)) {
      setSelectedColIndex(null);
      setSelectedCardIndex(null);
      return;
    }

    sfx.playCardFlip();
    const newTableau = gameState.tableau.map((c) => [...c]);

    // Retirar del origen
    const origin = newTableau[selectedColIndex];
    origin.splice(selectedCardIndex);
    if (origin.length > 0) {
      origin[origin.length - 1].faceUp = true;
    }

    // Añadir al destino
    newTableau[targetColIndex].push(...cardsToMove);

    // Comprobar si el destino completó una escalera del 13 al 1
    let completedRuns = gameState.completedRunsCount;
    const check = checkAndRemoveSpiderRun(newTableau[targetColIndex]);
    if (check.removed) {
      sfx.playCoinJingle();
      completedRuns++;
    }

    const isWon = completedRuns === 8;

    setGameState((prev) => ({
      ...prev,
      tableau: newTableau,
      completedRunsCount: completedRuns,
      movesCount: prev.movesCount + 1,
      isWon,
    }));

    setSelectedColIndex(null);
    setSelectedCardIndex(null);

    if (isWon) {
      handleWin();
    }
  };

  const handleWin = () => {
    sfx.playVictoryFanfare();
    confetti({ particleCount: 120, spread: 90 });
    recordResult('spider', true, 250);
    addStuds(250);
    onGameEnd?.(true);
  };

  const handleRestart = () => {
    sfx.playCardFlip();
    setGameState(initSpiderGame(suitsCount));
    setSelectedColIndex(null);
    setSelectedCardIndex(null);
  };

  return (
    <div className="relative w-full min-h-[660px] bg-slate-900 rounded-2xl border-4 border-slate-700 p-4 md:p-6 shadow-2xl overflow-hidden flex flex-col justify-between bg-stud-pattern">
      {/* Barra Superior: Información y Controles */}
      <div className="flex items-center justify-between bg-slate-950/80 border border-slate-700 px-4 py-2 rounded-xl backdrop-blur-md z-20 mb-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">
            Solitario Spider ({suitsCount} {suitsCount === 1 ? 'Palo' : 'Palos'})
          </span>
          <span className="text-xs text-slate-300">
            Movimientos: <strong className="text-white">{gameState.movesCount}</strong>
          </span>
        </div>

        {/* Reserva y Escaleras Completadas */}
        <div className="flex items-center gap-4">
          {/* Mazo de Reserva */}
          <div
            id="spider-stock-pile"
            onClick={handleDealStock}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border-2 cursor-pointer transition-colors ${
              gameState.stockDealsRemaining.length > 0
                ? 'bg-slate-800 border-emerald-500 hover:bg-slate-700 text-white'
                : 'bg-slate-950 border-slate-800 text-slate-600 cursor-not-allowed'
            }`}
          >
            <Layers size={16} />
            <span className="text-xs font-bold">
              Repartir ({gameState.stockDealsRemaining.length} tandas)
            </span>
          </div>

          {/* Contador de Escaleras Completadas */}
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <SuitIcon suit="oros" size={16} />
            <span className="text-xs font-black text-amber-400">
              {gameState.completedRunsCount} / 8
            </span>
          </div>

          <BrickButton variant="dark" size="sm" onClick={handleRestart}>
            <RefreshCw size={14} /> Reiniciar
          </BrickButton>
        </div>
      </div>

      {/* Cartel de Victoria */}
      {gameState.isWon && (
        <div className="mx-auto my-3 z-30 max-w-md bg-gradient-to-r from-emerald-600 to-teal-500 text-slate-950 px-6 py-4 rounded-2xl shadow-2xl text-center font-black animate-bounce flex items-center justify-center gap-3">
          <Trophy size={28} />
          <div>
            <div className="text-lg">¡HAS COMPLETADO LAS 8 ESCALERAS!</div>
            <div className="text-xs opacity-90">+250 Piezas añadidas a tu saldo</div>
          </div>
        </div>
      )}

      {/* Tablero: 10 Columnas */}
      <div className="grid grid-cols-10 gap-1.5 md:gap-2 flex-1 items-start min-h-[380px] z-10">
        {gameState.tableau.map((column, colIdx) => (
          <div
            key={colIdx}
            id={`spider-col-${colIdx}`}
            onClick={() => {
              if (column.length === 0 && selectedColIndex !== null) {
                handleMoveToColumn(colIdx);
              }
            }}
            className="flex flex-col items-center min-h-[260px] rounded-brick border-2 border-dashed border-slate-800/80 bg-slate-950/20 p-1 relative"
          >
            {column.length === 0 ? (
              <div className="text-[9px] font-bold text-slate-600 mt-2 select-none">Vacío</div>
            ) : (
              column.map((card, cardIdx) => {
                const isSelected =
                  selectedColIndex === colIdx &&
                  selectedCardIndex !== null &&
                  selectedCardIndex <= cardIdx;

                return (
                  <div
                    key={card.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(colIdx, cardIdx);
                    }}
                    style={{ marginTop: cardIdx === 0 ? 0 : -80 }}
                    className="w-full transition-transform"
                  >
                    <Card2D
                      card={card}
                      size="sm"
                      isSelected={isSelected}
                      className="w-full shadow-md"
                    />
                  </div>
                );
              })
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
