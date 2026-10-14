'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Card2D } from '@/components/cards/Card2D';
import { BrickButton } from '@/components/ui/BrickButton';
import {
  BlackjackGameState,
  initBlackjackGame,
  dealInitialBlackjackCards,
  evaluateBlackjackHand,
  getBlackjackBotAction,
} from '@/core/engines/blackjackEngine';
import { sfx } from '@/core/sound/sfx';
import { useGameStore } from '@/store/useGameStore';
import { Sparkles, RefreshCw, Plus, Minus } from 'lucide-react';

interface BlackjackTableProps {
  botCount?: number;
  deckCount?: 1 | 2 | 4;
  onGameEnd?: (won: boolean) => void;
}

export const BlackjackTable: React.FC<BlackjackTableProps> = ({
  botCount = 1,
  deckCount = 2,
  onGameEnd,
}) => {
  const [gameState, setGameState] = useState<BlackjackGameState>(() =>
    dealInitialBlackjackCards(initBlackjackGame(botCount, deckCount))
  );
  const [betAmount, setBetAmount] = useState<number>(50);
  const [gameResult, setGameResult] = useState<string | null>(null);

  const studs = useGameStore((s) => s.studs);
  const addStuds = useGameStore((s) => s.addStuds);
  const deductStuds = useGameStore((s) => s.deductStuds);
  const recordResult = useGameStore((s) => s.recordGameResult);

  const human = gameState.players[0];
  const humanHand = human.hands[0];
  const humanEval = evaluateBlackjackHand(humanHand.cards);
  const dealerEval = evaluateBlackjackHand(gameState.dealer.hands[0].cards);

  // Pedir Carta (Hit)
  const handleHit = () => {
    sfx.playCardFlip();
    const shoe = [...gameState.shoe];
    const newCard = shoe.pop()!;
    newCard.faceUp = true;

    const newCards = [...humanHand.cards, newCard];
    const newEval = evaluateBlackjackHand(newCards);

    const updatedPlayers = [...gameState.players];
    updatedPlayers[0].hands[0].cards = newCards;

    if (newEval.isBust) {
      updatedPlayers[0].hands[0].isBusted = true;
      updatedPlayers[0].hands[0].isStood = true;
      setGameState((prev) => ({
        ...prev,
        shoe,
        players: updatedPlayers,
        logs: [...prev.logs, 'Te has pasado de 21. Mano finalizada.'],
      }));
      finishRound(updatedPlayers, gameState.dealer, shoe);
    } else {
      setGameState((prev) => ({
        ...prev,
        shoe,
        players: updatedPlayers,
      }));
    }
  };

  // Doblar Apuesta (Double)
  const handleDouble = () => {
    if (studs < betAmount) return;
    deductStuds(betAmount);
    sfx.playCardFlip();

    const shoe = [...gameState.shoe];
    const newCard = shoe.pop()!;
    newCard.faceUp = true;

    const newCards = [...humanHand.cards, newCard];
    const updatedPlayers = [...gameState.players];
    updatedPlayers[0].hands[0].cards = newCards;
    updatedPlayers[0].hands[0].bet *= 2;
    updatedPlayers[0].hands[0].isStood = true;

    setGameState((prev) => ({
      ...prev,
      shoe,
      players: updatedPlayers,
      logs: [...prev.logs, 'Doblaste la apuesta. Recibes 1 carta final.'],
    }));

    finishRound(updatedPlayers, gameState.dealer, shoe);
  };

  // Plantarse (Stand)
  const handleStand = () => {
    sfx.playBrickSnap();
    const updatedPlayers = [...gameState.players];
    updatedPlayers[0].hands[0].isStood = true;

    setGameState((prev) => ({
      ...prev,
      players: updatedPlayers,
      logs: [...prev.logs, `Te plantas con ${humanEval.value} puntos.`],
    }));

    // Ejecutar turnos de los bots antes del dealer
    executeBotTurnsAndDealer(updatedPlayers, gameState.shoe);
  };

  // Turnos automáticos de bots y desenlace del crupier
  const executeBotTurnsAndDealer = (players: typeof gameState.players, currentShoe: typeof gameState.shoe) => {
    const shoe = [...currentShoe];
    const updatedPlayers = players.map((p) => ({ ...p }));
    const dealerUpCard = gameState.dealer.hands[0].cards[0];

    // Bots juegan según estrategia básica
    for (let i = 1; i < updatedPlayers.length; i++) {
      let botCards = [...updatedPlayers[i].hands[0].cards];
      let botAction = getBlackjackBotAction(botCards, dealerUpCard);

      while (botAction === 'hit') {
        const card = shoe.pop()!;
        card.faceUp = true;
        botCards.push(card);
        botAction = getBlackjackBotAction(botCards, dealerUpCard);
      }
      updatedPlayers[i].hands[0].cards = botCards;
      updatedPlayers[i].hands[0].isStood = true;
    }

    // Turno del Crupier: Destapar carta oculta y pedir hasta tener >= 17
    const dealerCards = gameState.dealer.hands[0].cards.map((c) => ({ ...c, faceUp: true }));
    let dEval = evaluateBlackjackHand(dealerCards);

    while (dEval.value < 17) {
      const c = shoe.pop()!;
      c.faceUp = true;
      dealerCards.push(c);
      dEval = evaluateBlackjackHand(dealerCards);
    }

    const updatedDealer = {
      ...gameState.dealer,
      hands: [{ ...gameState.dealer.hands[0], cards: dealerCards }],
    };

    finishRound(updatedPlayers, updatedDealer, shoe);
  };

  // Resolución y pagos
  const finishRound = (
    players: typeof gameState.players,
    dealer: typeof gameState.dealer,
    shoe: typeof gameState.shoe
  ) => {
    const pHand = players[0].hands[0];
    const pEval = evaluateBlackjackHand(pHand.cards);
    const dEval = evaluateBlackjackHand(dealer.hands[0].cards);

    let resultMsg = '';
    let won = false;

    if (pEval.isBust) {
      resultMsg = 'Te has pasado de 21. La casa gana tu apuesta.';
      recordResult('blackjack', false, 0);
    } else if (dEval.isBust) {
      resultMsg = '¡El Crupier se ha pasado de 21! ¡Ganas!';
      won = true;
      const prize = pHand.bet * 2;
      addStuds(prize);
      recordResult('blackjack', true, prize);
    } else if (pEval.isBlackjack && !dEval.isBlackjack) {
      resultMsg = '¡BLACKJACK NATURAL! Pago especial 3:2.';
      won = true;
      const prize = Math.floor(pHand.bet * 2.5);
      addStuds(prize);
      recordResult('blackjack', true, prize);
    } else if (pEval.value > dEval.value) {
      resultMsg = `¡Ganas con ${pEval.value} frente a los ${dEval.value} del Crupier!`;
      won = true;
      const prize = pHand.bet * 2;
      addStuds(prize);
      recordResult('blackjack', true, prize);
    } else if (pEval.value === dEval.value) {
      resultMsg = `Empate a ${pEval.value}. Recuperas tu apuesta.`;
      addStuds(pHand.bet);
    } else {
      resultMsg = `El Crupier gana con ${dEval.value} puntos.`;
      recordResult('blackjack', false, 0);
    }

    setGameResult(resultMsg);

    if (won) {
      sfx.playVictoryFanfare();
      confetti({ particleCount: 70, spread: 60 });
    }

    setGameState((prev) => ({
      ...prev,
      shoe,
      players,
      dealer,
      phase: 'payout',
    }));

    onGameEnd?.(won);
  };

  // Nueva Ronda
  const handleNewRound = () => {
    if (studs < betAmount) {
      alert('¡No tienes suficientes Piezas para esta apuesta!');
      return;
    }
    deductStuds(betAmount);
    sfx.playCardFlip();
    const newGame = dealInitialBlackjackCards(initBlackjackGame(botCount, deckCount));
    newGame.players[0].hands[0].bet = betAmount;
    setGameState(newGame);
    setGameResult(null);
  };

  return (
    <div className="relative w-full min-h-[600px] bg-slate-900 rounded-2xl border-4 border-blue-600/70 p-4 md:p-6 shadow-2xl overflow-hidden flex flex-col justify-between bg-stud-pattern">
      {/* Barra Superior: Información de Sabot y Apuesta */}
      <div className="flex items-center justify-between bg-slate-950/80 border border-slate-700 px-4 py-2 rounded-xl backdrop-blur-md z-20">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-blue-400 uppercase tracking-wider">
            Mesa de Blackjack
          </span>
          <span className="text-xs text-slate-400">
            ({gameState.deckCount * 52} cartas en sabot)
          </span>
        </div>

        {/* Ajuste de Apuesta */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-amber-400">Apuesta:</span>
          <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setBetAmount(Math.max(25, betAmount - 25))}
              disabled={gameState.phase !== 'payout'}
              className="text-slate-400 hover:text-white disabled:opacity-30"
            >
              <Minus size={14} />
            </button>
            <span className="font-extrabold text-amber-300 text-sm px-1.5">
              {betAmount}
            </span>
            <button
              onClick={() => setBetAmount(betAmount + 25)}
              disabled={gameState.phase !== 'payout'}
              className="text-slate-400 hover:text-white disabled:opacity-30"
            >
              <Plus size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Zona Superior: Crupier */}
      <div className="flex flex-col items-center justify-center my-2 z-10">
        <div className="bg-slate-950/90 px-3 py-1 rounded-full border border-blue-500/60 text-xs font-black text-blue-300 mb-2 flex items-center gap-2">
          <span>{gameState.dealer.name}</span>
          <span className="text-amber-400 font-bold">
            {gameState.phase === 'payout'
              ? `(${dealerEval.value} pts)`
              : gameState.dealer.hands[0].cards[0]?.rank >= 10
              ? '(10 pts visibles)'
              : `(${gameState.dealer.hands[0].cards[0]?.rank || 0} pts visibles)`}
          </span>
        </div>
        <div className="flex gap-2">
          {gameState.dealer.hands[0].cards.map((card) => (
            <Card2D key={card.id} card={card} size="md" />
          ))}
        </div>
      </div>

      {/* Cartel Flotante de Resultado de la Ronda */}
      {gameResult && (
        <div className="mx-auto my-2 z-30 max-w-md bg-slate-950/95 border-2 border-amber-400 text-amber-300 px-6 py-3 rounded-2xl shadow-2xl text-center text-sm md:text-base font-black animate-bounce">
          {gameResult}
        </div>
      )}

      {/* Zona de Jugadores: Bots y Jugador Principal */}
      <div className="flex flex-wrap items-end justify-center gap-6 my-2 z-10">
        {/* Bots Acompañantes en la Mesa */}
        {gameState.players.slice(1).map((bot) => {
          const bEval = evaluateBlackjackHand(bot.hands[0].cards);
          return (
            <div key={bot.id} className="flex flex-col items-center">
              <div className="bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-700 text-[10px] font-bold text-slate-300 mb-1">
                {bot.name} ({bEval.value} pts)
              </div>
              <div className="flex gap-1">
                {bot.hands[0].cards.map((card) => (
                  <Card2D key={card.id} card={card} size="sm" />
                ))}
              </div>
            </div>
          );
        })}

        {/* Jugador Principal (Tú) */}
        <div className="flex flex-col items-center">
          <div className="bg-slate-950/90 px-4 py-1 rounded-full border-2 border-amber-400 text-xs md:text-sm font-black text-amber-300 mb-2 flex items-center gap-2">
            <Sparkles size={14} />
            <span>Tu Mano:</span>
            <span className="text-white text-base">
              {humanEval.value} {humanEval.isBlackjack ? '¡BLACKJACK!' : 'pts'}
            </span>
          </div>
          <div className="flex gap-2">
            {humanHand.cards.map((card) => (
              <Card2D key={card.id} card={card} size="md" />
            ))}
          </div>
        </div>
      </div>

      {/* Barra de Acciones de Blackjack */}
      <div className="flex items-center justify-center gap-3 bg-slate-950/90 border-2 border-slate-700 p-3 rounded-2xl shadow-2xl backdrop-blur-md z-20">
        {gameState.phase !== 'payout' ? (
          <>
            <BrickButton
              id="btn-blackjack-hit"
              variant="success"
              size="md"
              onClick={handleHit}
              disabled={humanHand.isStood || humanEval.isBust}
            >
              Pedir (Hit)
            </BrickButton>
            <BrickButton
              id="btn-blackjack-stand"
              variant="danger"
              size="md"
              onClick={handleStand}
              disabled={humanHand.isStood || humanEval.isBust}
            >
              Plantarse (Stand)
            </BrickButton>
            <BrickButton
              id="btn-blackjack-double"
              variant="warning"
              size="md"
              onClick={handleDouble}
              disabled={
                humanHand.cards.length !== 2 || humanHand.isStood || studs < betAmount
              }
            >
              Doblar (Double)
            </BrickButton>
          </>
        ) : (
          <BrickButton variant="primary" size="md" onClick={handleNewRound}>
            <RefreshCw size={16} /> Nueva Ronda
          </BrickButton>
        )}
      </div>
    </div>
  );
};
