'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { GameType } from '@/core/types/card';
import { useGameStore } from '@/store/useGameStore';
import { MusTable } from '@/components/games/mus/MusTable';
import { BlackjackTable } from '@/components/games/blackjack/BlackjackTable';
import { KlondikeTable } from '@/components/games/klondike/KlondikeTable';
import { SpiderTable } from '@/components/games/spider/SpiderTable';
import { QuickRulesModal } from '@/components/tutorial/QuickRulesModal';
import { TutorialOverlay } from '@/components/tutorial/TutorialOverlay';
import { StudCounter } from '@/components/ui/StudCounter';
import { ShopModal } from '@/components/ui/ShopModal';
import { BrickButton } from '@/components/ui/BrickButton';
import { sfx } from '@/core/sound/sfx';
import {
  ArrowLeft,
  HelpCircle,
  Sparkles,
  ShoppingBag,
  Volume2,
  VolumeX,
} from 'lucide-react';

export default function PlayGamePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const gameId = (params?.gameId as GameType) || 'mus';
  const tutorialParam = searchParams.get('tutorial');

  const activeConfig = useGameStore((s) => s.activeConfig);
  const selectedTableFelt = useGameStore((s) => s.inventory.selectedTableFelt);
  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);

  const [isRulesModalOpen, setIsRulesModalOpen] = useState<boolean>(
    tutorialParam === 'visual'
  );
  const [isInteractiveTutorialActive, setIsInteractiveTutorialActive] = useState<boolean>(
    tutorialParam === 'interactive'
  );
  const [tutorialStepIndex, setTutorialStepIndex] = useState<number>(0);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);

  // Mapeo del tapete de juego personalizado
  const getFeltStyle = (feltId: string) => {
    switch (feltId) {
      case 'felt_blueprint_blue':
        return 'bg-blue-950 border-blue-800';
      case 'felt_space_arena':
        return 'bg-indigo-950 border-indigo-800';
      case 'felt_lava_cave':
        return 'bg-red-950 border-red-900';
      case 'felt_classic_green':
      default:
        return 'bg-emerald-950 border-emerald-800';
    }
  };

  const getGameTitle = (id: GameType) => {
    switch (id) {
      case 'mus':
        return 'El Gran Mus (Baraja Española)';
      case 'blackjack':
        return 'Blackjack 21 de Bloques';
      case 'klondike':
        return 'Solitario Klondike (52 Cartas)';
      case 'spider':
        return 'Solitario Spider (104 Cartas)';
      default:
        return 'Juego de Cartas';
    }
  };

  return (
    <div
      className={`min-h-screen ${getFeltStyle(
        selectedTableFelt
      )} text-slate-100 flex flex-col justify-between bg-stud-pattern p-2 md:p-4`}
    >
      {/* Barra de Navegación de la Mesa */}
      <header className="bg-slate-900/90 border-2 border-slate-700/80 px-4 py-2.5 rounded-2xl backdrop-blur-md shadow-xl flex items-center justify-between mb-4 z-30">
        <div className="flex items-center gap-3">
          <Link href="/">
            <button
              onClick={() => sfx.playBrickSnap()}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors shadow-brick-sm flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft size={16} /> Hub
            </button>
          </Link>

          <div>
            <h1 className="text-sm md:text-base font-black text-white uppercase tracking-wide">
              {getGameTitle(gameId)}
            </h1>
            <p className="text-[10px] font-bold text-amber-400">
              {gameId === 'mus' && `Modo ${activeConfig.playerCount}P • ${activeConfig.variants.musKings || 4} Reyes`}
              {gameId === 'blackjack' && `Mesa con ${(activeConfig.playerCount || 2) - 1} Bot(s) • ${activeConfig.variants.blackjackDecks || 2} Barajas`}
              {gameId === 'klondike' && `Robar ${activeConfig.variants.klondikeDraw || 1} Carta(s)`}
              {gameId === 'spider' && `${activeConfig.variants.spiderSuits || 1} Palo(s)`}
            </p>
          </div>
        </div>

        {/* Acciones y Herramientas */}
        <div className="flex items-center gap-2 md:gap-3">
          <StudCounter onClick={() => setIsShopOpen(true)} />

          <BrickButton
            variant="ciber"
            size="sm"
            onClick={() => {
              sfx.playBrickSnap();
              setIsRulesModalOpen(true);
            }}
          >
            <HelpCircle size={15} /> Reglas
          </BrickButton>

          <BrickButton
            variant="warning"
            size="sm"
            onClick={() => {
              sfx.playBrickSnap();
              setTutorialStepIndex(0);
              setIsInteractiveTutorialActive(true);
            }}
          >
            <Sparkles size={15} /> Tutorial
          </BrickButton>

          <button
            onClick={() => {
              sfx.playBrickSnap();
              setIsShopOpen(true);
            }}
            title="Tienda"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 transition-colors hidden sm:block"
          >
            <ShoppingBag size={16} />
          </button>

          <button
            onClick={() => {
              toggleSound();
              sfx.playBrickSnap();
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>
        </div>
      </header>

      {/* Mesa de Juego Dinámica */}
      <main className="flex-1 flex flex-col justify-center max-w-7xl mx-auto w-full">
        {gameId === 'mus' && (
          <MusTable
            playerCount={(activeConfig.playerCount as 2 | 4) || 2}
            kingsCount={activeConfig.variants.musKings || 4}
          />
        )}

        {gameId === 'blackjack' && (
          <BlackjackTable
            botCount={Math.max(1, (activeConfig.playerCount || 2) - 1)}
            deckCount={activeConfig.variants.blackjackDecks || 2}
          />
        )}

        {gameId === 'klondike' && (
          <KlondikeTable drawCount={activeConfig.variants.klondikeDraw || 1} />
        )}

        {gameId === 'spider' && (
          <SpiderTable suitsCount={activeConfig.variants.spiderSuits || 1} />
        )}
      </main>

      {/* Modal de Reglas Visuales Rápidas */}
      <QuickRulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
        gameType={gameId}
        onStartInteractiveTutorial={() => {
          setTutorialStepIndex(0);
          setIsInteractiveTutorialActive(true);
        }}
      />

      {/* Overlay de Tutorial Guiado Paso a Paso */}
      {isInteractiveTutorialActive && (
        <TutorialOverlay
          gameType={gameId}
          currentStepIndex={tutorialStepIndex}
          onNextStep={() => setTutorialStepIndex((prev) => prev + 1)}
          onClose={() => setIsInteractiveTutorialActive(false)}
        />
      )}

      {/* Modal de Tienda de Bloques */}
      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </div>
  );
}
