import { Card, Rank, Suit } from '../types/card';
import { getMusCardEffectiveValue, getMusGamePoints, createMusDeck, shuffleDeck } from '../deck/deckFactory';

export type MusLance = 'grande' | 'chica' | 'pares' | 'juego';

export type MusSign =
  | 'dos_ases'       // Morder labio inferior
  | 'dos_reyes'      // Guiño de ojo
  | 'medias'         // Sacar punta de la lengua
  | 'duples'         // Torcer la boca
  | 'treinta_y_uno'  // Levantar cejas
  | 'ciego';         // Mirada al cielo / ojos en blanco

export interface MusPlayer {
  id: string;
  name: string;
  isHuman: boolean;
  team: 1 | 2; // 1 = Jugador y Bot Compañero; 2 = Rival 1 y Rival 2
  hand: Card[];
  hasPares: boolean;
  hasJuego: boolean;
  juegoPoints: number;
  lastSign?: MusSign;
}

export type BetAction = 'paso' | 'envido' | 'quiero' | 'no_quiero' | 'ordago';

export interface LanceBetState {
  lance: MusLance;
  currentBet: number; // 0 = no envite, 2 = envido inicial, etc.
  isOrdago: boolean;
  isResolved: boolean;
  acceptedByTeams: { 1?: boolean; 2?: boolean };
  history: { playerId: string; team: 1 | 2; action: BetAction; amount?: number }[];
}

export interface MusGameState {
  players: MusPlayer[];
  kingsCount: 4 | 8;
  currentLance: MusLance;
  scores: { team1: number; team2: number };
  maxPoints: 30;
  activePlayerIndex: number;
  handWinner?: 1 | 2;
  lanceBets: Record<MusLance, LanceBetState>;
  discardPhaseActive: boolean;
  musAnnounced: Record<string, boolean>; // si cada jugador dijo 'mus'
  roundFinished: boolean;
  roundLog: string[];
}

/**
 * Evalúa las cartas de una mano para 'Grande'
 * Devuelve un array ordenado de mayor a menor valor efectivo
 */
export function evaluateGrande(hand: Card[], kingsCount: 4 | 8 = 4): number[] {
  return hand
    .map((c) => getMusCardEffectiveValue(c.rank, kingsCount))
    .sort((a, b) => b - a);
}

/**
 * Evalúa las cartas de una mano para 'Chica'
 * Devuelve un array ordenado de menor a mayor valor efectivo
 */
export function evaluateChica(hand: Card[], kingsCount: 4 | 8 = 4): number[] {
  return hand
    .map((c) => getMusCardEffectiveValue(c.rank, kingsCount))
    .sort((a, b) => a - b);
}

export interface ParesEvaluation {
  type: 'ninguno' | 'par' | 'medias' | 'duples';
  weight: number; // 0: ninguno, 1: par, 2: medias, 3: duples
  ranks: number[]; // valores relevantes ordenados
}

/**
 * Evalúa el tipo y valor de Pares en una mano
 */
export function evaluatePares(hand: Card[], kingsCount: 4 | 8 = 4): ParesEvaluation {
  const values = hand.map((c) => getMusCardEffectiveValue(c.rank, kingsCount));
  const counts: Record<number, number> = {};
  for (const v of values) {
    counts[v] = (counts[v] || 0) + 1;
  }

  const entries = Object.entries(counts).map(([rank, count]) => ({
    rank: Number(rank),
    count,
  }));
  entries.sort((a, b) => b.count - a.count || b.rank - a.rank);

  if (entries[0].count === 4) {
    // 4 iguales se consideran Duples
    return { type: 'duples', weight: 3, ranks: [entries[0].rank, entries[0].rank] };
  }
  if (entries[0].count === 3) {
    return { type: 'medias', weight: 2, ranks: [entries[0].rank] };
  }
  if (entries[0].count === 2 && entries[1]?.count === 2) {
    return { type: 'duples', weight: 3, ranks: [entries[0].rank, entries[1].rank] };
  }
  if (entries[0].count === 2) {
    return { type: 'par', weight: 1, ranks: [entries[0].rank] };
  }

  return { type: 'ninguno', weight: 0, ranks: [] };
}

/**
 * Suma total de puntos para Juego / Punto
 */
export function calculateJuegoPoints(hand: Card[], kingsCount: 4 | 8 = 4): number {
  return hand.reduce((sum, c) => sum + getMusGamePoints(c.rank, kingsCount), 0);
}

/**
 * Jerarquía de Juego: 31 es el mejor, luego 32, 40, 37, 36, 35, 34, 33
 */
export function getJuegoRanking(points: number): number {
  if (points === 31) return 8;
  if (points === 32) return 7;
  if (points === 40) return 6;
  if (points === 37) return 5;
  if (points === 36) return 4;
  if (points === 35) return 3;
  if (points === 34) return 2;
  if (points === 33) return 1;
  return 0; // No tiene juego (< 31)
}

/**
 * Compara dos manos en Grande: devuelve 1 si gana hand1, 2 si hand2, 0 si empate
 */
export function compareGrande(hand1: Card[], hand2: Card[], kingsCount: 4 | 8 = 4): 0 | 1 | 2 {
  const g1 = evaluateGrande(hand1, kingsCount);
  const g2 = evaluateGrande(hand2, kingsCount);
  for (let i = 0; i < 4; i++) {
    if (g1[i] > g2[i]) return 1;
    if (g1[i] < g2[i]) return 2;
  }
  return 0;
}

/**
 * Compara dos manos en Chica: devuelve 1 si gana hand1, 2 si hand2, 0 si empate
 */
export function compareChica(hand1: Card[], hand2: Card[], kingsCount: 4 | 8 = 4): 0 | 1 | 2 {
  const c1 = evaluateChica(hand1, kingsCount);
  const c2 = evaluateChica(hand2, kingsCount);
  for (let i = 0; i < 4; i++) {
    if (c1[i] < c2[i]) return 1;
    if (c1[i] > c2[i]) return 2;
  }
  return 0;
}

/**
 * Compara dos evaluaciones de Pares
 */
export function comparePares(p1: ParesEvaluation, p2: ParesEvaluation): 0 | 1 | 2 {
  if (p1.weight > p2.weight) return 1;
  if (p1.weight < p2.weight) return 2;
  // Mismo tipo (ej. ambos duples o ambos par)
  for (let i = 0; i < Math.max(p1.ranks.length, p2.ranks.length); i++) {
    const r1 = p1.ranks[i] || 0;
    const r2 = p2.ranks[i] || 0;
    if (r1 > r2) return 1;
    if (r1 < r2) return 2;
  }
  return 0;
}

/**
 * Compara Juego o Punto
 */
export function compareJuego(pts1: number, pts2: number): 0 | 1 | 2 {
  const hasJuego1 = pts1 >= 31;
  const hasJuego2 = pts2 >= 31;

  if (hasJuego1 && !hasJuego2) return 1;
  if (!hasJuego1 && hasJuego2) return 2;

  if (hasJuego1 && hasJuego2) {
    const rank1 = getJuegoRanking(pts1);
    const rank2 = getJuegoRanking(pts2);
    if (rank1 > rank2) return 1;
    if (rank1 < rank2) return 2;
    return 0;
  }

  // Ambos tienen Punto (menor a 31): gana el más cercano a 30 (30 > 29 > 28...)
  if (pts1 > pts2) return 1;
  if (pts1 < pts2) return 2;
  return 0;
}

/**
 * Calcula la seña de Mus correspondiente a una mano
 */
export function detectMusSign(hand: Card[], kingsCount: 4 | 8 = 4): MusSign {
  const values = hand.map((c) => getMusCardEffectiveValue(c.rank, kingsCount));
  const aces = values.filter((v) => v === 1).length;
  const kings = values.filter((v) => v === 12).length;
  const pares = evaluatePares(hand, kingsCount);
  const pts = calculateJuegoPoints(hand, kingsCount);

  if (pts === 31) return 'treinta_y_uno';
  if (kings >= 2) return 'dos_reyes';
  if (aces >= 2) return 'dos_ases';
  if (pares.type === 'duples') return 'duples';
  if (pares.type === 'medias') return 'medias';
  return 'ciego';
}

/**
 * IA Local para toma de decisiones en envites de Mus
 */
export function getMusBotDecision(
  player: MusPlayer,
  lance: MusLance,
  currentBet: number,
  isOrdago: boolean,
  kingsCount: 4 | 8 = 4
): BetAction {
  let strength = 0; // escala 0 a 10

  if (lance === 'grande') {
    const vals = evaluateGrande(player.hand, kingsCount);
    if (vals[0] === 12 && vals[1] === 12) strength += 6;
    if (vals[2] === 12) strength += 2;
    if (vals[0] === 12) strength += 2;
  } else if (lance === 'chica') {
    const vals = evaluateChica(player.hand, kingsCount);
    if (vals[0] === 1 && vals[1] === 1) strength += 6;
    if (vals[2] === 1) strength += 2;
  } else if (lance === 'pares') {
    const p = evaluatePares(player.hand, kingsCount);
    if (p.type === 'duples') strength = 9;
    else if (p.type === 'medias') strength = 7;
    else if (p.type === 'par') strength = p.ranks[0] >= 11 ? 5 : 3;
    else return 'paso'; // no tiene pares
  } else if (lance === 'juego') {
    if (player.hasJuego) {
      if (player.juegoPoints === 31) strength = 10;
      else if (player.juegoPoints === 32) strength = 8;
      else strength = 6;
    } else {
      // Punto
      if (player.juegoPoints === 30) strength = 7;
      else if (player.juegoPoints >= 28) strength = 5;
      else strength = 2;
    }
  }

  // Si ya hay un órdago lanzado
  if (isOrdago) {
    return strength >= 8 ? 'quiero' : 'no_quiero';
  }

  // Si hay un envite activo
  if (currentBet > 0) {
    if (strength >= 8 && Math.random() > 0.4) return 'ordago';
    if (strength >= 5) return 'quiero';
    if (strength >= 3 && Math.random() > 0.6) return 'quiero'; // farol o defensa
    return 'no_quiero';
  }

  // No hay envite (está a paso)
  if (strength >= 7) return 'envido';
  if (strength >= 4 && Math.random() > 0.5) return 'envido';
  return 'paso';
}

/**
 * Inicializador de partida de Mus
 */
export function initMusGame(playerCount: 2 | 4 = 2, kingsCount: 4 | 8 = 4): MusGameState {
  const deck = shuffleDeck(createMusDeck(0, false));

  const players: MusPlayer[] = [];
  const is4P = playerCount === 4;

  if (is4P) {
    // 2v2: Jugador (T1), Rival 1 (T2), Compañero IA (T1), Rival 2 (T2)
    players.push({ id: 'p0', name: 'Tú', isHuman: true, team: 1, hand: [], hasPares: false, hasJuego: false, juegoPoints: 0 });
    players.push({ id: 'p1', name: 'Rival Izquierda (IA)', isHuman: false, team: 2, hand: [], hasPares: false, hasJuego: false, juegoPoints: 0 });
    players.push({ id: 'p2', name: 'Compañero (IA)', isHuman: false, team: 1, hand: [], hasPares: false, hasJuego: false, juegoPoints: 0 });
    players.push({ id: 'p3', name: 'Rival Derecha (IA)', isHuman: false, team: 2, hand: [], hasPares: false, hasJuego: false, juegoPoints: 0 });
  } else {
    // 1v1: Jugador (T1) vs Rival (T2)
    players.push({ id: 'p0', name: 'Tú', isHuman: true, team: 1, hand: [], hasPares: false, hasJuego: false, juegoPoints: 0 });
    players.push({ id: 'p1', name: 'Rival IA', isHuman: false, team: 2, hand: [], hasPares: false, hasJuego: false, juegoPoints: 0 });
  }

  // Repartir 4 cartas a cada uno
  for (let c = 0; c < 4; c++) {
    for (const p of players) {
      const card = deck.pop()!;
      card.faceUp = p.isHuman;
      p.hand.push(card);
    }
  }

  // Calcular pares y juego iniciales
  for (const p of players) {
    p.hasPares = evaluatePares(p.hand, kingsCount).type !== 'ninguno';
    p.juegoPoints = calculateJuegoPoints(p.hand, kingsCount);
    p.hasJuego = p.juegoPoints >= 31;
    p.lastSign = detectMusSign(p.hand, kingsCount);
  }

  const initialLanceBets: Record<MusLance, LanceBetState> = {
    grande: { lance: 'grande', currentBet: 0, isOrdago: false, isResolved: false, acceptedByTeams: {}, history: [] },
    chica: { lance: 'chica', currentBet: 0, isOrdago: false, isResolved: false, acceptedByTeams: {}, history: [] },
    pares: { lance: 'pares', currentBet: 0, isOrdago: false, isResolved: false, acceptedByTeams: {}, history: [] },
    juego: { lance: 'juego', currentBet: 0, isOrdago: false, isResolved: false, acceptedByTeams: {}, history: [] },
  };

  return {
    players,
    kingsCount,
    currentLance: 'grande',
    scores: { team1: 0, team2: 0 },
    maxPoints: 30,
    activePlayerIndex: 0,
    lanceBets: initialLanceBets,
    discardPhaseActive: true,
    musAnnounced: {},
    roundFinished: false,
    roundLog: ['Partida de Mus iniciada. Repartidas 4 cartas a cada jugador.'],
  };
}
