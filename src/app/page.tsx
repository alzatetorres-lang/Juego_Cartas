'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import { GameType, GameConfig } from '@/core/types/card';
import { StudCounter } from '@/components/ui/StudCounter';
import { BrickButton } from '@/components/ui/BrickButton';
import { SuitIcon } from '@/components/cards/SuitIcon';
import { MinifigArt } from '@/components/cards/MinifigArt';
import { ShopModal } from '@/components/ui/ShopModal';
import { Modal } from '@/components/ui/Modal';
import { sfx } from '@/core/sound/sfx';
import {
  Volume2,
  VolumeX,
  ShoppingBag,
  BarChart3,
  Sparkles,
  Gamepad2,
  Play,
  HelpCircle,
  Shield,
  Layers,
  Flame,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const soundEnabled = useGameStore((s) => s.soundEnabled);
  const toggleSound = useGameStore((s) => s.toggleSound);
  const stats = useGameStore((s) => s.stats);
  const setActiveConfig = useGameStore((s) => s.setActiveConfig);

  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [selectedGameForConfig, setSelectedGameForConfig] = useState<GameType | null>(null);

  // Estados de configuración previos al juego
  const [musPlayers, setMusPlayers] = useState<2 | 4>(2);
  const [musKings, setMusKings] = useState<4 | 8>(4);
  const [klondikeDraw, setKlondikeDraw] = useState<1 | 3>(1);
  const [spiderSuits, setSpiderSuits] = useState<1 | 2 | 4>(1);
  const [blackjackBots, setBlackjackBots] = useState<number>(1);
  const [blackjackDecks, setBlackjackDecks] = useState<1 | 2 | 4>(2);
  const [tutorialChoice, setTutorialChoice] = useState<'none' | 'visual' | 'interactive'>('none');

  const gamesList: {
    type: GameType;
    title: string;
    subtitle: string;
    description: string;
    accentColor: string;
    borderCol: string;
    badge: string;
    suits: ('oros' | 'copas' | 'espadas' | 'bastos')[];
  }[] = [
    {
      type: 'mus',
      title: 'El Gran Mus',
      subtitle: 'Baraja Española Tradicional',
      description:
        'El rey de los juegos de cartas españoles. Lances de Grande, Chica, Pares y Juego/Punto, variantes de 4 u 8 Reyes y panel de señas.',
      accentColor: 'from-amber-600 to-yellow-600',
      borderCol: 'border-amber-500',
      badge: '1v1 o 2v2 con Bots IA',
      suits: ['oros', 'copas', 'espadas', 'bastos'],
    },
    {
      type: 'klondike',
      title: 'Solitario Klondike',
      subtitle: '52 Cartas de Bloques',
      description:
        'Construye las 4 fundaciones de palos del As al Comodín alternando columnas con palos cálidos y fríos. Modos robar 1 o 3.',
      accentColor: 'from-blue-600 to-indigo-600',
      borderCol: 'border-blue-500',
      badge: '1 Jugador • Modo Relajante',
      suits: ['oros', 'espadas'],
    },
    {
      type: 'spider',
      title: 'Solitario Spider',
      subtitle: '104 Cartas • 10 Columnas',
      description:
        'Desafío estratégico de doble baraja. Forma 8 escaleras completas del 13 (Comodín) al 1 (As) en dificultades de 1, 2 o 4 palos.',
      accentColor: 'from-emerald-600 to-teal-600',
      borderCol: 'border-emerald-500',
      badge: 'Dificultad Personalizable',
      suits: ['bastos', 'oros'],
    },
    {
      type: 'blackjack',
      title: 'Blackjack 21',
      subtitle: 'Casino de Bloques',
      description:
        'Desafía al Crupier de juguete en la mesa de apuestas. Pide carta, plántate o dobla. Ases blandos/duros y bots acompañantes.',
      accentColor: 'from-red-600 to-rose-700',
      borderCol: 'border-red-500',
      badge: 'Apuestas en Piezas / Studs',
      suits: ['copas', 'espadas'],
    },
  ];

  const handleOpenConfig = (game: GameType) => {
    sfx.playBrickSnap();
    setSelectedGameForConfig(game);
  };

  const handleStartGame = () => {
    if (!selectedGameForConfig) return;
    sfx.playBrickSnap();

    const config: GameConfig = {
      gameType: selectedGameForConfig,
      playerCount:
        selectedGameForConfig === 'mus'
          ? musPlayers
          : selectedGameForConfig === 'blackjack'
          ? blackjackBots + 1
          : 1,
      tutorialMode: tutorialChoice,
      variants: {
        musKings,
        musSignsEnabled: true,
        klondikeDraw,
        spiderSuits,
        blackjackDecks,
      },
    };

    setActiveConfig(config);
    router.push(`/play/${selectedGameForConfig}?tutorial=${tutorialChoice}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between bg-stud-pattern">
      {/* Header Superior Principal */}
      <header className="sticky top-0 z-30 bg-slate-900/90 border-b-4 border-amber-500 px-4 md:px-8 py-3.5 backdrop-blur-md shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo y Marca */}
          <div className="flex items-center gap-3">
            <div className="flex gap-1 items-center">
              <span className="w-4 h-4 rounded-full bg-red-500 shadow-stud border border-red-300" />
              <span className="w-4 h-4 rounded-full bg-amber-400 shadow-stud border border-amber-200" />
              <span className="w-4 h-4 rounded-full bg-emerald-500 shadow-stud border border-emerald-300" />
              <span className="w-4 h-4 rounded-full bg-blue-500 shadow-stud border border-blue-300" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-black tracking-tight text-white flex items-center gap-1.5 drop-shadow">
                BRICKDECK <span className="text-amber-400">2D</span>
              </h1>
              <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest hidden sm:block">
                Baraja Española de Bloques de Construcción
              </p>
            </div>
          </div>

          {/* Controles de Usuario: Studs, Tienda, Estadísticas y Audio */}
          <div className="flex items-center gap-2 md:gap-3">
            <StudCounter onClick={() => setIsShopOpen(true)} />

            <button
              onClick={() => {
                sfx.playBrickSnap();
                setIsShopOpen(true);
              }}
              title="Tienda de Bloques"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 transition-colors shadow-brick-sm"
            >
              <ShoppingBag size={18} />
            </button>

            <button
              onClick={() => {
                sfx.playBrickSnap();
                setIsStatsOpen(true);
              }}
              title="Estadísticas"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-300 border border-slate-700 transition-colors shadow-brick-sm"
            >
              <BarChart3 size={18} />
            </button>

            <button
              onClick={() => {
                toggleSound();
                sfx.playBrickSnap();
              }}
              title={soundEnabled ? 'Silenciar Efectos' : 'Activar Sonido'}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors shadow-brick-sm"
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Banner / Selector de Juegos */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider mb-3">
            <Sparkles size={14} /> 4 Juegos Clásicos con Bots IA en Local
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
            Elige tu Mesa de Juego
          </h2>
          <p className="text-sm md:text-base text-slate-300 mt-2 font-medium">
            Disfruta de la baraja española adaptada a 52 cartas con estética de juguete, tutoriales paso a paso y economía de piezas.
          </p>
        </div>

        {/* Rejilla de Tarjetas de Juegos (Estilo Caja de Juguete) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {gamesList.map((game) => (
            <motion.div
              key={game.type}
              whileHover={{ y: -6, scale: 1.01 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className={`rounded-2xl border-4 ${game.borderCol} bg-slate-900/90 shadow-2xl overflow-hidden flex flex-col justify-between backdrop-blur-md relative brick-bevel`}
            >
              {/* Studs decorativos superiores */}
              <div className="bg-slate-800/80 px-4 py-2 border-b border-slate-700/80 flex items-center justify-between">
                <div className="flex gap-2 opacity-60">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-inner" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-inner" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-400 shadow-inner" />
                </div>
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
                  {game.badge}
                </span>
              </div>

              {/* Contenido Principal de la Tarjeta */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tight">
                        {game.title}
                      </h3>
                      <p className="text-xs font-bold text-amber-400/90 uppercase tracking-wider">
                        {game.subtitle}
                      </p>
                    </div>
                    {/* Iconos de Palos de la modalidad */}
                    <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
                      {game.suits.map((s) => (
                        <SuitIcon key={s} suit={s} size={20} />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs md:text-sm text-slate-300 leading-relaxed mt-3">
                    {game.description}
                  </p>
                </div>

                {/* Botón de Jugar */}
                <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                    <Gamepad2 size={15} className="text-emerald-400" /> Bots IA locales
                  </div>
                  <BrickButton
                    variant="warning"
                    size="md"
                    onClick={() => handleOpenConfig(game.type)}
                  >
                    <Play size={16} fill="currentColor" /> Configurar y Jugar
                  </BrickButton>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Sección de Facciones y Minifiguras (Lore Original) */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full border-t border-slate-800/80 my-4">
        <div className="text-center mb-6">
          <h3 className="text-xl md:text-2xl font-black text-white">
            Las 4 Facciones de Bloques (IP Original)
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Cada palo representa una época de la historia de los juguetes con figuras modulares vectoriales.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Medieval (Oros) */}
          <div className="bg-slate-900/60 p-4 rounded-xl border-2 border-amber-600/60 flex flex-col items-center text-center">
            <SuitIcon suit="oros" size={32} className="mb-2" />
            <h4 className="font-extrabold text-sm text-amber-400">Oros Medievales</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Escudero (10), Caballero (11), Rey Arturo (12) y Dragón Dorado (13).
            </p>
            <div className="mt-3">
              <MinifigArt suit="oros" rank={12} size={70} />
            </div>
          </div>

          {/* Superhéroes (Copas) */}
          <div className="bg-slate-900/60 p-4 rounded-xl border-2 border-red-600/60 flex flex-col items-center text-center">
            <SuitIcon suit="copas" size={32} className="mb-2" />
            <h4 className="font-extrabold text-sm text-red-400">Copas Superhéroes</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Vigilante (10), Velocista (11), Capitán Titán (12) y Guardián Cósmico (13).
            </p>
            <div className="mt-3">
              <MinifigArt suit="copas" rank={12} size={70} />
            </div>
          </div>

          {/* Cavernícolas (Espadas) */}
          <div className="bg-slate-900/60 p-4 rounded-xl border-2 border-slate-600 flex flex-col items-center text-center">
            <SuitIcon suit="espadas" size={32} className="mb-2" />
            <h4 className="font-extrabold text-sm text-slate-300">Espadas Cavernícolas</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Cazador (10), Jinete Raptor (11), Jefe Mamut (12) y Chamán Primigenio (13).
            </p>
            <div className="mt-3">
              <MinifigArt suit="espadas" rank={12} size={70} />
            </div>
          </div>

          {/* Futuristas (Bastos) */}
          <div className="bg-slate-900/60 p-4 rounded-xl border-2 border-emerald-600/60 flex flex-col items-center text-center">
            <SuitIcon suit="bastos" size={32} className="mb-2" />
            <h4 className="font-extrabold text-sm text-emerald-400">Bastos Ciber</h4>
            <p className="text-[11px] text-slate-400 mt-1">
              Androide (10), Mecha (11), Emperador Ciber (12) e IA Suprema (13).
            </p>
            <div className="mt-3">
              <MinifigArt suit="bastos" rank={12} size={70} />
            </div>
          </div>
        </div>
      </section>

      {/* Pie de Página */}
      <footer className="border-t-2 border-slate-800 bg-slate-950 px-4 py-6 text-center text-xs text-slate-500">
        <p className="font-bold text-slate-400">BrickDeck 2D • Motor Modular de Cartas Españolas</p>
        <p className="text-[11px] mt-1 opacity-70">
          Diseño vectorial 100% libre de derechos de autor con personajes originales. Next.js, Tailwind CSS y Zustand.
        </p>
      </footer>

      {/* Modal de Configuración Pre-Partida */}
      {selectedGameForConfig && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedGameForConfig(null)}
          title={`Configurar Partida: ${
            gamesList.find((g) => g.type === selectedGameForConfig)?.title
          }`}
          maxWidth="md"
        >
          <div className="space-y-4">
            {/* Opciones Específicas por Juego */}
            {selectedGameForConfig === 'mus' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Número de Jugadores (Asientos):
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMusPlayers(2)}
                      className={`p-2 rounded-lg font-bold text-xs border ${
                        musPlayers === 2
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      1 vs 1 (Mano a Mano)
                    </button>
                    <button
                      onClick={() => setMusPlayers(4)}
                      className={`p-2 rounded-lg font-bold text-xs border ${
                        musPlayers === 4
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      2 vs 2 (Con Compañero IA)
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Variante de Reyes:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setMusKings(4)}
                      className={`p-2 rounded-lg font-bold text-xs border ${
                        musKings === 4
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      4 Reyes (Estándar)
                    </button>
                    <button
                      onClick={() => setMusKings(8)}
                      className={`p-2 rounded-lg font-bold text-xs border ${
                        musKings === 8
                          ? 'bg-amber-500 text-slate-950 border-amber-400'
                          : 'bg-slate-800 text-slate-300 border-slate-700'
                      }`}
                    >
                      8 Reyes (3s=Reyes, 2s=Ases)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedGameForConfig === 'klondike' && (
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Modo de Robo del Mazo:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setKlondikeDraw(1)}
                    className={`p-2 rounded-lg font-bold text-xs border ${
                      klondikeDraw === 1
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Robar 1 Carta (Fácil)
                  </button>
                  <button
                    onClick={() => setKlondikeDraw(3)}
                    className={`p-2 rounded-lg font-bold text-xs border ${
                      klondikeDraw === 3
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    Robar 3 Cartas (Desafío)
                  </button>
                </div>
              </div>
            )}

            {selectedGameForConfig === 'spider' && (
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                  Dificultad de Palos:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => setSpiderSuits(1)}
                    className={`p-2 rounded-lg font-bold text-xs border ${
                      spiderSuits === 1
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    1 Palo (Fácil)
                  </button>
                  <button
                    onClick={() => setSpiderSuits(2)}
                    className={`p-2 rounded-lg font-bold text-xs border ${
                      spiderSuits === 2
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    2 Palos (Medio)
                  </button>
                  <button
                    onClick={() => setSpiderSuits(4)}
                    className={`p-2 rounded-lg font-bold text-xs border ${
                      spiderSuits === 4
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    4 Palos (Experto)
                  </button>
                </div>
              </div>
            )}

            {selectedGameForConfig === 'blackjack' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Bots Acompañantes en la Mesa:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 3].map((num) => (
                      <button
                        key={num}
                        onClick={() => setBlackjackBots(num)}
                        className={`p-2 rounded-lg font-bold text-xs border ${
                          blackjackBots === num
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {num} {num === 1 ? 'Bot' : 'Bots'}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase block mb-1">
                    Barajas en el Sabot:
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[1, 2, 4].map((decks) => (
                      <button
                        key={decks}
                        onClick={() => setBlackjackDecks(decks as 1 | 2 | 4)}
                        className={`p-2 rounded-lg font-bold text-xs border ${
                          blackjackDecks === decks
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        {decks} {decks === 1 ? 'Baraja (52)' : `Barajas (${decks * 52})`}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Selector de Modo Tutorial */}
            <div className="pt-2 border-t border-slate-800">
              <label className="text-xs font-bold text-amber-400 uppercase block mb-1.5 flex items-center gap-1.5">
                <HelpCircle size={14} /> Modo de Tutorial Pre-Partida:
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="tutorialChoice"
                    checked={tutorialChoice === 'none'}
                    onChange={() => setTutorialChoice('none')}
                    className="accent-amber-400"
                  />
                  <div>
                    <div className="text-xs font-bold text-white">Partida Libre Directa</div>
                    <div className="text-[10px] text-slate-400">
                      Inicia a jugar directamente sin pantallas explicativas.
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="tutorialChoice"
                    checked={tutorialChoice === 'visual'}
                    onChange={() => setTutorialChoice('visual')}
                    className="accent-amber-400"
                  />
                  <div>
                    <div className="text-xs font-bold text-amber-300">
                      Guía Visual Rápida (Infografía)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Abre una ventana con el resumen de reglas antes de empezar.
                    </div>
                  </div>
                </label>

                <label className="flex items-center gap-2 p-2 rounded-lg bg-slate-850 hover:bg-slate-800 border border-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="tutorialChoice"
                    checked={tutorialChoice === 'interactive'}
                    onChange={() => setTutorialChoice('interactive')}
                    className="accent-amber-400"
                  />
                  <div>
                    <div className="text-xs font-bold text-emerald-400">
                      Tutorial Guiado Paso a Paso (Interactivo)
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Escenario preconfigurado con spotlight que resalta cada acción exacta.
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* Botón de Iniciar */}
            <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
              <BrickButton
                variant="dark"
                size="sm"
                onClick={() => setSelectedGameForConfig(null)}
              >
                Cancelar
              </BrickButton>
              <BrickButton variant="success" size="md" onClick={handleStartGame}>
                ¡Comenzar Partida!
              </BrickButton>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Estadísticas del Jugador */}
      <Modal
        isOpen={isStatsOpen}
        onClose={() => setIsStatsOpen(false)}
        title="Estadísticas de Juego"
        maxWidth="md"
      >
        <div className="space-y-3">
          {Object.entries(stats).map(([gameKey, gameStat]) => (
            <div
              key={gameKey}
              className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between"
            >
              <div>
                <h4 className="font-extrabold text-sm text-amber-300 uppercase">
                  {gameKey}
                </h4>
                <div className="text-xs text-slate-400">
                  Partidas: <strong className="text-white">{gameStat.played}</strong> | Ganadas:{' '}
                  <strong className="text-emerald-400">{gameStat.won}</strong> | Derrotas:{' '}
                  <strong className="text-red-400">{gameStat.lost}</strong>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-amber-400">
                  +{gameStat.studsEarned}
                </div>
                <div className="text-[10px] text-slate-400 uppercase">Piezas Ganadas</div>
              </div>
            </div>
          ))}
          <div className="pt-2 flex justify-end">
            <BrickButton variant="primary" size="sm" onClick={() => setIsStatsOpen(false)}>
              Cerrar
            </BrickButton>
          </div>
        </div>
      </Modal>

      {/* Modal de Tienda de Bloques */}
      <ShopModal isOpen={isShopOpen} onClose={() => setIsShopOpen(false)} />
    </div>
  );
}
