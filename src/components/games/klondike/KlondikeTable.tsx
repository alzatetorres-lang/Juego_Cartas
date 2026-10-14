'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Card2D } from '@/components/cards/Card2D';
import { BrickButton } from '@/components/ui/BrickButton';
import { SuitIcon } from '@/components/cards/SuitIcon';
import {
  KlondikeGameState,
  initKlondikeGame,
  drawFromStock,
  canPlaceOnTableau,
  canPlaceOnFoundation,
  tryAutoMoveToFoundation,
} from '@/core/engines/klondikeEngine';
import { Card, Suit } from '@/core/types/card';
import { sfx } from '@/core/sound/sfx';
import { useGameStore } from '@/store/useGameStore';
import { RefreshCw, RotateCcw, Trophy } from 'lucide-react';

interface KlondikeTableProps {
  drawCount?: 1 | 3;
  onGameEnd?: (won: boolean) => void;
}

type SelectedSource =
  | { type: 'waste' }
  | { type: 'tableau'; colIndex: number; cardIndex: number };

export const KlondikeTable: React.FC<KlondikeTableProps> = ({
  drawCount = 1,
  onGameEnd,
}) => {
  const [gameState, setGameState] = useState<KlondikeGameState>(() =>
    initKlondikeGame(drawCount)
  );
  const [selectedSource, setSelectedSource] = useState<SelectedSource | null>(null);

  const addStuds = useGameStore((s) => s.addStuds);
  const recordResult = useGameStore((s) => s.recordGameResult);

  // Robar carta(s) del mazo de reserva
  const handleDraw = () => {
    sfx.playCardFlip();
    setSelectedSource(null);
    setGameState((prev) => drawFromStock(prev));
  };

  // Selección de carta del descarte (Waste)
  const handleSelectWaste = () => {
    if (gameState.waste.length === 0) return;
    sfx.playBrickSnap();

    // Intentar auto-mover a fundación primero
    const topWaste = gameState.waste[gameState.waste.length - 1];
    const autoResult = tryAutoMoveToFoundation(topWaste, gameState, { type: 'waste' });
    if (autoResult) {
      sfx.playCoinJingle();
      setGameState(autoResult);
      checkVictory(autoResult);
      setSelectedSource(null);
      return;
    }

    if (selectedSource?.type === 'waste') {
      setSelectedSource(null);
    } else {
      setSelectedSource({ type: 'waste' });
    }
  };

  // Selección o clic en una carta de una columna del tablero
  const handleCardClick = (colIndex: number, cardIndex: number) => {
    const col = gameState.tableau[colIndex];
    const clickedCard = col[cardIndex];

    if (!clickedCard.faceUp) return;

    // Si ya teníamos una carta seleccionada, intentar moverla hacia esta columna
    if (selectedSource) {
      handleMoveToTableauColumn(colIndex);
      return;
    }

    sfx.playBrickSnap();

    // Si es la última carta de la columna, probar auto-movimiento a fundación
    if (cardIndex === col.length - 1) {
      const autoResult = tryAutoMoveToFoundation(clickedCard, gameState, {
        type: 'tableau',
        colIndex,
      });
      if (autoResult) {
        sfx.playCoinJingle();
        setGameState(autoResult);
        checkVictory(autoResult);
        setSelectedSource(null);
        return;
      }
    }

    // Seleccionar carta o pila para mover
    setSelectedSource({ type: 'tableau', colIndex, cardIndex });
  };

  // Mover cartas a una columna del tableau
  const handleMoveToTableauColumn = (targetColIndex: number) => {
    if (!selectedSource) return;

    let cardsToMove: Card[] = [];
    if (selectedSource.type === 'waste') {
      cardsToMove = [gameState.waste[gameState.waste.length - 1]];
    } else {
      cardsToMove = gameState.tableau[selectedSource.colIndex].slice(selectedSource.cardIndex);
    }

    const targetCol = gameState.tableau[targetColIndex];

    if (!canPlaceOnTableau(cardsToMove[0], targetCol)) {
      setSelectedSource(null);
      return;
    }

    // Ejecutar movimiento
    sfx.playCardFlip();
    const newTableau = gameState.tableau.map((col) => [...col]);
    let newWaste = [...gameState.waste];

    if (selectedSource.type === 'waste') {
      newWaste.pop();
    } else {
      const originCol = newTableau[selectedSource.colIndex];
      originCol.splice(selectedSource.cardIndex);
      if (originCol.length > 0) {
        originCol[originCol.length - 1].faceUp = true;
      }
    }

    newTableau[targetColIndex].push(...cardsToMove);

    setGameState((prev) => ({
      ...prev,
      tableau: newTableau,
      waste: newWaste,
      movesCount: prev.movesCount + 1,
    }));

    setSelectedSource(null);
  };

  // Mover directamente a una fundación
  const handleMoveToFoundation = (suit: Suit) => {
    if (!selectedSource) return;

    let cardToMove: Card | null = null;
    if (selectedSource.type === 'waste') {
      cardToMove = gameState.waste[gameState.waste.length - 1];
    } else {
      const col = gameState.tableau[selectedSource.colIndex];
      if (selectedSource.cardIndex === col.length - 1) {
        cardToMove = col[selectedSource.cardIndex];
      }
    }

    if (!cardToMove || cardToMove.suit !== suit) {
      setSelectedSource(null);
      return;
    }

    const foundation = gameState.foundations[suit];
    if (!canPlaceOnFoundation(cardToMove, foundation)) {
      setSelectedSource(null);
      return;
    }

    sfx.playCoinJingle();

    const newFoundations = {
      ...gameState.foundations,
      [suit]: [...foundation, { ...cardToMove, faceUp: true }],
    };

    let newWaste = [...gameState.waste];
    const newTableau = gameState.tableau.map((col) => [...col]);

    if (selectedSource.type === 'waste') {
      newWaste.pop();
    } else {
      const col = newTableau[selectedSource.colIndex];
      col.pop();
      if (col.length > 0) {
        col[col.length - 1].faceUp = true;
      }
    }

    const totalInFoundations = Object.values(newFoundations).reduce(
      (acc, pile) => acc + pile.length,
      0
    );
    const isWon = totalInFoundations === 52;

    const nextState = {
      ...gameState,
      foundations: newFoundations,
      waste: newWaste,
      tableau: newTableau,
      movesCount: gameState.movesCount + 1,
      score: gameState.score + 15,
      isWon,
    };

    setGameState(nextState);
    checkVictory(nextState);
    setSelectedSource(null);
  };

  const checkVictory = (state: KlondikeGameState) => {
    if (state.isWon) {
      sfx.playVictoryFanfare();
      confetti({ particleCount: 100, spread: 80 });
      recordResult('klondike', true, 200);
      addStuds(200);
      onGameEnd?.(true);
    }
  };

  const handleRestart = () => {
    sfx.playCardFlip();
    setGameState(initKlondikeGame(drawCount));
    setSelectedSource(null);
  };

  const suits: Suit[] = ['oros', 'copas', 'espadas', 'bastos'];

  return (
    <div className="relative w-full min-h-[640px] bg-slate-900 rounded-2xl border-4 border-slate-700 p-4 md:p-6 shadow-2xl overflow-hidden flex flex-col justify-between bg-stud-pattern">
      {/* Barra de Controles y Estadísticas */}
      <div className="flex items-center justify-between bg-slate-950/80 border border-slate-700 px-4 py-2 rounded-xl backdrop-blur-md z-20 mb-4">
        <div className="flex items-center gap-4">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
            Solitario Klondike
          </span>
          <span className="text-xs text-slate-300">
            Movimientos: <strong className="text-white">{gameState.movesCount}</strong>
          </span>
          <span className="text-xs text-slate-300">
            Puntuación: <strong className="text-amber-300">{gameState.score}</strong>
          </span>
        </div>

        <BrickButton variant="dark" size="sm" onClick={handleRestart}>
          <RefreshCw size={14} /> Reiniciar
        </BrickButton>
      </div>

      {/* Cartel de Victoria */}
      {gameState.isWon && (
        <div className="mx-auto my-3 z-30 max-w-md bg-gradient-to-r from-amber-600 to-yellow-500 text-slate-950 px-6 py-4 rounded-2xl shadow-2xl text-center font-black animate-bounce flex items-center justify-center gap-3">
          <Trophy size={28} />
          <div>
            <div className="text-lg">¡HAS GANADO EL SOLITARIO!</div>
            <div className="text-xs opacity-90">+200 Piezas añadidas a tu saldo</div>
          </div>
        </div>
      )}

      {/* Fila Superior: Mazo/Descarte (Izquierda) y 4 Fundaciones (Derecha) */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 z-10">
        {/* Mazo de Reserva y Pila de Descarte */}
        <div className="flex items-center gap-4">
          {/* Mazo de Reserva */}
          <div
            id="klondike-stock-pile"
            onClick={handleDraw}
            className="w-20 h-28 md:w-24 md:h-36 rounded-brick border-2 border-dashed border-slate-600 flex items-center justify-center cursor-pointer hover:border-amber-400 transition-colors bg-slate-950/50 shadow-inner relative"
          >
            {gameState.stock.length > 0 ? (
              <Card2D
                card={gameState.stock[gameState.stock.length - 1]}
                size="md"
                className="w-full h-full pointer-events-none"
              />
            ) : (
              <div className="flex flex-col items-center text-slate-400 text-xs">
                <RotateCcw size={18} />
                <span className="text-[10px] mt-1 font-bold">Reciclar</span>
              </div>
            )}
            <span className="absolute -bottom-5 text-[10px] font-bold text-slate-400">
              {gameState.stock.length} cartas
            </span>
          </div>

          {/* Descarte (Waste) */}
          <div
            onClick={handleSelectWaste}
            className={`w-20 h-28 md:w-24 md:h-36 rounded-brick border-2 border-dashed border-slate-600 flex items-center justify-center bg-slate-950/50 relative ${
              selectedSource?.type === 'waste' ? 'ring-4 ring-amber-400' : ''
            }`}
          >
            {gameState.waste.length > 0 ? (
              <Card2D
                card={gameState.waste[gameState.waste.length - 1]}
                size="md"
                isSelected={selectedSource?.type === 'waste'}
                className="w-full h-full"
              />
            ) : (
              <span className="text-[10px] text-slate-500 font-bold">Descarte</span>
            )}
          </div>
        </div>

        {/* 4 Fundaciones por Palo (Oros, Copas, Espadas, Bastos) */}
        <div className="flex items-center gap-2 md:gap-3">
          {suits.map((suit) => {
            const foundation = gameState.foundations[suit];
            const topCard = foundation[foundation.length - 1];
            return (
              <div
                key={suit}
                id={`klondike-foundation-${suit}`}
                onClick={() => handleMoveToFoundation(suit)}
                className="w-20 h-28 md:w-24 md:h-36 rounded-brick border-2 border-dashed border-slate-600 flex flex-col items-center justify-center bg-slate-950/40 cursor-pointer hover:border-amber-400 transition-colors relative"
              >
                {topCard ? (
                  <Card2D card={topCard} size="md" className="w-full h-full pointer-events-none" />
                ) : (
                  <div className="flex flex-col items-center opacity-40">
                    <SuitIcon suit={suit} size={24} />
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 mt-1">
                      As
                    </span>
                  </div>
                )}
                <span className="absolute -bottom-5 text-[10px] font-bold text-slate-400">
                  {foundation.length}/13
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fila Inferior: 7 Columnas del Tableau */}
      <div className="grid grid-cols-7 gap-2 md:gap-3 flex-1 items-start min-h-[300px] z-10">
        {gameState.tableau.map((column, colIndex) => (
          <div
            key={colIndex}
            id={`klondike-col-${colIndex}`}
            onClick={() => {
              if (column.length === 0 && selectedSource) {
                handleMoveToTableauColumn(colIndex);
              }
            }}
            className="flex flex-col items-center min-h-[220px] rounded-brick border-2 border-dashed border-slate-800/80 bg-slate-950/20 p-1 relative"
          >
            {column.length === 0 ? (
              <div className="text-[10px] font-bold text-slate-600 mt-3 select-none">
                Vacío (12/13)
              </div>
            ) : (
              column.map((card, cardIndex) => {
                const isSelected =
                  selectedSource?.type === 'tableau' &&
                  selectedSource.colIndex === colIndex &&
                  selectedSource.cardIndex <= cardIndex;

                return (
                  <div
                    key={card.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(colIndex, cardIndex);
                    }}
                    style={{ marginTop: cardIndex === 0 ? 0 : -95 }}
                    className="w-full transition-transform"
                  >
                    <Card2D
                      card={card}
                      size="md"
                      isSelected={isSelected}
                      className="w-full shadow-lg"
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
