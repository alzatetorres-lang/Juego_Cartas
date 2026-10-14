'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Card2D } from '@/components/cards/Card2D';
import { BrickButton } from '@/components/ui/BrickButton';
import {
  MusGameState,
  initMusGame,
  MusLance,
  MusSign,
  compareGrande,
  compareChica,
  comparePares,
  compareJuego,
  evaluatePares,
  calculateJuegoPoints,
  getMusBotDecision,
} from '@/core/engines/musEngine';
import { sfx } from '@/core/sound/sfx';
import { useGameStore } from '@/store/useGameStore';
import { Shield, Sparkles, Smile, RefreshCw, MessageSquare } from 'lucide-react';

interface MusTableProps {
  playerCount?: 2 | 4;
  kingsCount?: 4 | 8;
  onGameEnd?: (won: boolean) => void;
}

export const MusTable: React.FC<MusTableProps> = ({
  playerCount = 2,
  kingsCount = 4,
  onGameEnd,
}) => {
  const [gameState, setGameState] = useState<MusGameState>(() =>
    initMusGame(playerCount, kingsCount)
  );
  const [showSignsPanel, setShowSignsPanel] = useState<boolean>(false);
  const [lastPartnerReaction, setLastPartnerReaction] = useState<string | null>(null);
  const [activeLanceIndex, setActiveLanceIndex] = useState<number>(0);
  const lances: MusLance[] = ['grande', 'chica', 'pares', 'juego'];

  const recordResult = useGameStore((s) => s.recordGameResult);
  const addStuds = useGameStore((s) => s.addStuds);

  const human = gameState.players[0];
  const currentLance = lances[activeLanceIndex];

  // Acción de Descarte: Pedir Mus o Cortar
  const handleMusAction = (wantsMus: boolean) => {
    sfx.playBrickSnap();
    if (wantsMus) {
      setGameState((prev) => ({
        ...prev,
        discardPhaseActive: false,
        roundLog: [
          ...prev.roundLog,
          'Pediste Mus. Los rivales deciden no dar Mus y se inicia el lance de Grande.',
        ],
      }));
    } else {
      setGameState((prev) => ({
        ...prev,
        discardPhaseActive: false,
        roundLog: [...prev.roundLog, 'Cortaste el Mus. ¡Comienzan los envites a Grande!'],
      }));
    }
  };

  // Manejador de Envites en el lance actual
  const handlePlayerBet = (action: 'paso' | 'envido' | 'ordago' | 'quiero' | 'no_quiero') => {
    sfx.playBrickSnap();

    setGameState((prev) => {
      const currentBetState = prev.lanceBets[currentLance];
      let newLog = [...prev.roundLog];
      let newBet = currentBetState.currentBet;
      let isOrdago = currentBetState.isOrdago;
      let team1Score = prev.scores.team1;
      let team2Score = prev.scores.team2;

      if (action === 'envido') {
        newBet += 2;
        newLog.push(`Tú has lanzado un ENVIDO (+2 piedras) en ${currentLance.toUpperCase()}.`);

        // Respuesta del Bot Rival
        const bot = prev.players[1];
        const botResponse = getMusBotDecision(bot, currentLance, newBet, isOrdago, prev.kingsCount);
        if (botResponse === 'quiero') {
          newLog.push(`${bot.name} dice: ¡QUIERO! El lance queda aceptado.`);
        } else if (botResponse === 'no_quiero') {
          newLog.push(`${bot.name} dice: NO QUIERO. Ganas 1 piedra de renuncio.`);
          team1Score += 1;
        } else if (botResponse === 'ordago') {
          isOrdago = true;
          newLog.push(`${bot.name} responde: ¡ÓRDAGO! Se juega la partida.`);
        }
      } else if (action === 'ordago') {
        isOrdago = true;
        newLog.push(`¡Has lanzado un ÓRDAGO en ${currentLance.toUpperCase()}!`);
        const bot = prev.players[1];
        const botResponse = getMusBotDecision(bot, currentLance, 0, true, prev.kingsCount);
        if (botResponse === 'quiero') {
          newLog.push(`${bot.name} dice: ¡QUIERO EL ÓRDAGO!`);
        } else {
          newLog.push(`${bot.name} se retira del órdago. Ganas el tanteo.`);
          team1Score += 2;
        }
      } else if (action === 'paso') {
        newLog.push(`Te has dado PASO en ${currentLance.toUpperCase()}.`);
        const bot = prev.players[1];
        const botResponse = getMusBotDecision(bot, currentLance, 0, false, prev.kingsCount);
        if (botResponse === 'envido') {
          newBet = 2;
          newLog.push(`${bot.name} te echa un ENVIDO (+2 piedras). ¿Quieres?`);
        } else {
          newLog.push(`${bot.name} también dice PASO. El lance queda en paso.`);
        }
      }

      // Avanzar al siguiente lance si se resuelve
      return {
        ...prev,
        scores: { team1: team1Score, team2: team2Score },
        lanceBets: {
          ...prev.lanceBets,
          [currentLance]: {
            ...currentBetState,
            currentBet: newBet,
            isOrdago,
            isResolved: true,
          },
        },
        roundLog: newLog,
      };
    });
  };

  // Pasar al siguiente lance
  const handleNextLance = () => {
    sfx.playCardFlip();
    if (activeLanceIndex < lances.length - 1) {
      setActiveLanceIndex((prev) => prev + 1);
    } else {
      resolveMusRound();
    }
  };

  // Resolución final de la mano (conteo de piedras de todos los lances)
  const resolveMusRound = () => {
    const rival = gameState.players[1];
    let t1Points = 0;
    let t2Points = 0;

    // Grande
    const winGrande = compareGrande(human.hand, rival.hand, gameState.kingsCount);
    if (winGrande === 1) t1Points += 1;
    else if (winGrande === 2) t2Points += 1;

    // Chica
    const winChica = compareChica(human.hand, rival.hand, gameState.kingsCount);
    if (winChica === 1) t1Points += 1;
    else if (winChica === 2) t2Points += 1;

    // Pares
    const p1 = evaluatePares(human.hand, gameState.kingsCount);
    const p2 = evaluatePares(rival.hand, gameState.kingsCount);
    const winPares = comparePares(p1, p2);
    if (winPares === 1) t1Points += p1.weight;
    else if (winPares === 2) t2Points += p2.weight;

    // Juego / Punto
    const j1 = calculateJuegoPoints(human.hand, gameState.kingsCount);
    const j2 = calculateJuegoPoints(rival.hand, gameState.kingsCount);
    const winJuego = compareJuego(j1, j2);
    if (winJuego === 1) t1Points += j1 >= 31 ? (j1 === 31 ? 3 : 2) : 1;
    else if (winJuego === 2) t2Points += j2 >= 31 ? (j2 === 31 ? 3 : 2) : 1;

    const newTeam1Total = gameState.scores.team1 + t1Points;
    const newTeam2Total = gameState.scores.team2 + t2Points;
    const isFinished = newTeam1Total >= 30 || newTeam2Total >= 30;
    const won = newTeam1Total >= newTeam2Total;

    // Revelar cartas del rival
    const revealedPlayers = gameState.players.map((p) => ({
      ...p,
      hand: p.hand.map((c) => ({ ...c, faceUp: true })),
    }));

    setGameState((prev) => ({
      ...prev,
      players: revealedPlayers,
      scores: { team1: newTeam1Total, team2: newTeam2Total },
      roundFinished: true,
      roundLog: [
        ...prev.roundLog,
        `Mano finalizada. Equipo 1 suma +${t1Points} piedras, Equipo 2 suma +${t2Points} piedras.`,
        isFinished
          ? won
            ? '¡VICTORIA EN EL MUS! Has alcanzado las piedras necesarias.'
            : 'Los rivales han ganado la partida de Mus.'
          : 'Pulsa "Nueva Mano" para continuar el tanteo.',
      ],
    }));

    if (won) {
      sfx.playVictoryFanfare();
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      recordResult('mus', true, 150);
      addStuds(150);
    } else {
      recordResult('mus', false, 0);
    }

    onGameEnd?.(won);
  };

  // Envío de seña al compañero
  const handleSendSign = (sign: MusSign) => {
    sfx.playBrickSnap();
    const signNames: Record<MusSign, string> = {
      dos_ases: 'Mordiste tu labio inferior (Seña: 2 Ases)',
      dos_reyes: 'Hiciste un guiño de ojo (Seña: 2 Reyes)',
      medias: 'Sacaste la punta de la lengua (Seña: Medias)',
      duples: 'Torciste la boca lateralmente (Seña: Duples)',
      treinta_y_uno: 'Levantaste ambas cejas (Seña: 31 al Juego)',
      ciego: 'Miraste hacia arriba (Seña: Ciego)',
    };

    setLastPartnerReaction(`Tu compañero ha captado la seña: "${signNames[sign]}".`);
    setShowSignsPanel(false);
  };

  // Reiniciar mano de Mus
  const handleRestart = () => {
    sfx.playCardFlip();
    setGameState(initMusGame(playerCount, kingsCount));
    setActiveLanceIndex(0);
    setLastPartnerReaction(null);
  };

  return (
    <div className="relative w-full min-h-[600px] bg-emerald-950/80 rounded-2xl border-4 border-emerald-700/80 p-4 md:p-6 shadow-2xl overflow-hidden flex flex-col justify-between bg-stud-pattern">
      {/* Marcador Superior de Piedras / Tanteo */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/90 border-2 border-emerald-600 px-4 py-2 rounded-xl backdrop-blur-md shadow-lg z-20">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-500 shadow-stud" />
            <span className="text-xs md:text-sm font-extrabold text-white">
              Tú / Equipo 1: <strong className="text-amber-400 text-base">{gameState.scores.team1}</strong> / 30
            </span>
          </div>
          <div className="text-slate-500 font-black">VS</div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500 shadow-stud" />
            <span className="text-xs md:text-sm font-extrabold text-white">
              Rivales IA: <strong className="text-amber-400 text-base">{gameState.scores.team2}</strong> / 30
            </span>
          </div>
        </div>

        {/* Indicador de Lance Activo */}
        <div className="flex items-center gap-1 bg-slate-800 px-3 py-1 rounded-lg border border-slate-700">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Lance:
          </span>
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider">
            {currentLance} ({activeLanceIndex + 1}/4)
          </span>
        </div>

        {/* Botón de Señas en 2v2 */}
        {playerCount === 4 && (
          <BrickButton
            id="panel-signs-toggle"
            variant="warning"
            size="sm"
            onClick={() => setShowSignsPanel(!showSignsPanel)}
          >
            <Smile size={14} /> Señas
          </BrickButton>
        )}
      </div>

      {/* Compañero Superior en 2v2 */}
      {playerCount === 4 && (
        <div className="flex flex-col items-center justify-center my-1 z-10">
          <div className="bg-slate-900/80 px-3 py-1 rounded-full border border-blue-500/50 text-xs font-bold text-blue-300 mb-1 flex items-center gap-1.5">
            <Shield size={12} /> {gameState.players[2].name} (Tu Compañero)
          </div>
          <div className="flex gap-2">
            {gameState.players[2].hand.map((card) => (
              <Card2D key={card.id} card={card} size="sm" />
            ))}
          </div>
        </div>
      )}

      {/* Zona Central de la Mesa: Rivales y Registros */}
      <div className="flex items-center justify-between gap-4 my-2 z-10">
        {/* Rival Izquierda (o Rival único en 1v1) */}
        <div className="flex flex-col items-center">
          <div className="bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-red-500/50 text-[11px] font-bold text-red-300 mb-1">
            {gameState.players[1].name}
          </div>
          <div className="flex gap-1.5">
            {gameState.players[1].hand.map((card) => (
              <Card2D key={card.id} card={card} size="sm" />
            ))}
          </div>
        </div>

        {/* Registro Central de Envites y Jugadas */}
        <div className="flex-1 max-w-md bg-slate-950/80 border border-slate-700/80 rounded-xl p-3 h-28 overflow-y-auto text-xs text-slate-300 flex flex-col justify-end backdrop-blur-sm">
          {lastPartnerReaction && (
            <div className="text-emerald-400 font-bold mb-1 flex items-center gap-1">
              <MessageSquare size={12} /> {lastPartnerReaction}
            </div>
          )}
          {gameState.roundLog.slice(-3).map((log, idx) => (
            <div key={idx} className="leading-snug py-0.5 opacity-90">
              • {log}
            </div>
          ))}
        </div>

        {/* Rival Derecha en 2v2 */}
        {playerCount === 4 && (
          <div className="flex flex-col items-center">
            <div className="bg-slate-900/80 px-2.5 py-0.5 rounded-full border border-red-500/50 text-[11px] font-bold text-red-300 mb-1">
              {gameState.players[3].name}
            </div>
            <div className="flex gap-1.5">
              {gameState.players[3].hand.map((card) => (
                <Card2D key={card.id} card={card} size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Zona Inferior: Mano del Jugador y Panel de Acciones */}
      <div className="flex flex-col items-center gap-3 mt-2 z-20">
        {/* Mano del Jugador */}
        <div className="flex flex-col items-center">
          <div className="bg-slate-900/90 px-3 py-1 rounded-full border border-amber-500/60 text-xs font-black text-amber-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles size={13} /> Tu Mano ({gameState.kingsCount} Reyes)
          </div>
          <div className="flex gap-3">
            {human.hand.map((card) => (
              <Card2D key={card.id} card={card} size="md" />
            ))}
          </div>
        </div>

        {/* Barra de Acciones y Envites */}
        <div className="flex flex-wrap items-center justify-center gap-2 bg-slate-900/90 border-2 border-slate-700 p-2.5 rounded-2xl shadow-xl backdrop-blur-md">
          {gameState.discardPhaseActive ? (
            <>
              <BrickButton
                id="btn-mus-action"
                variant="primary"
                size="sm"
                onClick={() => handleMusAction(true)}
              >
                Pedir Mus
              </BrickButton>
              <BrickButton variant="danger" size="sm" onClick={() => handleMusAction(false)}>
                No Hay Mus (Cortar)
              </BrickButton>
            </>
          ) : !gameState.roundFinished ? (
            <>
              <BrickButton variant="dark" size="sm" onClick={() => handlePlayerBet('paso')}>
                Paso
              </BrickButton>
              <BrickButton
                id="btn-envido"
                variant="warning"
                size="sm"
                onClick={() => handlePlayerBet('envido')}
              >
                Envido (+2)
              </BrickButton>
              <BrickButton
                variant="danger"
                size="sm"
                onClick={() => handlePlayerBet('ordago')}
              >
                ¡Órdago!
              </BrickButton>
              <BrickButton
                variant="ciber"
                size="sm"
                onClick={handleNextLance}
                className="ml-2"
              >
                {activeLanceIndex < lances.length - 1 ? 'Siguiente Lance' : 'Contar Piedras'}
              </BrickButton>
            </>
          ) : (
            <BrickButton variant="success" size="sm" onClick={handleRestart}>
              <RefreshCw size={14} /> Nueva Mano
            </BrickButton>
          )}
        </div>
      </div>

      {/* Modal / Menú Desplegable de Señas para 2v2 */}
      {showSignsPanel && (
        <div className="absolute top-16 right-4 z-40 bg-slate-900 border-2 border-amber-400 p-3 rounded-xl shadow-2xl max-w-xs space-y-2">
          <div className="text-xs font-black text-amber-400 uppercase tracking-wide border-b border-slate-700 pb-1">
            Emitir Seña al Compañero
          </div>
          <div className="grid grid-cols-2 gap-1.5 text-[11px]">
            <button
              onClick={() => handleSendSign('dos_reyes')}
              className="p-1.5 bg-slate-800 hover:bg-amber-600 rounded text-left text-white"
            >
              😉 Guiño (2 Reyes)
            </button>
            <button
              onClick={() => handleSendSign('dos_ases')}
              className="p-1.5 bg-slate-800 hover:bg-amber-600 rounded text-left text-white"
            >
              👄 Morder labio (2 Ases)
            </button>
            <button
              onClick={() => handleSendSign('medias')}
              className="p-1.5 bg-slate-800 hover:bg-amber-600 rounded text-left text-white"
            >
              👅 Sacar lengua (Medias)
            </button>
            <button
              onClick={() => handleSendSign('duples')}
              className="p-1.5 bg-slate-800 hover:bg-amber-600 rounded text-left text-white"
            >
              😏 Torcer boca (Duples)
            </button>
            <button
              onClick={() => handleSendSign('treinta_y_uno')}
              className="p-1.5 bg-slate-800 hover:bg-amber-600 rounded text-left text-white"
            >
              🤨 Levantar cejas (31)
            </button>
            <button
              onClick={() => handleSendSign('ciego')}
              className="p-1.5 bg-slate-800 hover:bg-amber-600 rounded text-left text-white"
            >
              🙄 Ojos en blanco (Ciego)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
