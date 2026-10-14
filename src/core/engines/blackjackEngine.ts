import { Card, Rank } from '../types/card';
import { createBlackjackShoe } from '../deck/deckFactory';

export interface BlackjackHand {
  cards: Card[];
  bet: number;
  isStood: boolean;
  isBusted: boolean;
  isDouble: boolean;
  isSplit: boolean;
}

export interface BlackjackPlayer {
  id: string;
  name: string;
  isHuman: boolean;
  isDealer?: boolean;
  hands: BlackjackHand[];
  activeHandIndex: number;
  totalChips: number;
}

export interface HandEvaluation {
  value: number;
  isSoft: boolean;
  isBust: boolean;
  isBlackjack: boolean;
}

export type BlackjackPhase = 'betting' | 'dealing' | 'player_turns' | 'dealer_turn' | 'payout';

export interface BlackjackGameState {
  shoe: Card[];
  players: BlackjackPlayer[];
  dealer: BlackjackPlayer;
  phase: BlackjackPhase;
  activePlayerIndex: number;
  deckCount: number;
  logs: string[];
}

/**
 * Calcula el valor de una mano de Blackjack considerando el As como 1 u 11
 */
export function evaluateBlackjackHand(cards: Card[]): HandEvaluation {
  let total = 0;
  let aceCount = 0;

  for (const card of cards) {
    if (card.rank === 1) {
      aceCount++;
      total += 11;
    } else if (card.rank >= 10) {
      total += 10; // 10, 11 (Caballo), 12 (Rey), 13 (Comodín) valen 10
    } else {
      total += card.rank;
    }
  }

  // Reducir Ases de 11 a 1 si nos pasamos de 21
  let isSoft = aceCount > 0;
  while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
  }

  isSoft = aceCount > 0 && total <= 21;
  const isBust = total > 21;
  const isBlackjack = cards.length === 2 && total === 21;

  return { value: total, isSoft, isBust, isBlackjack };
}

/**
 * Decisión de estrategia básica para bots de Blackjack
 */
export function getBlackjackBotAction(
  hand: Card[],
  dealerUpCard: Card | undefined
): 'hit' | 'stand' | 'double' {
  const evalHand = evaluateBlackjackHand(hand);
  const dealerValue = dealerUpCard
    ? dealerUpCard.rank === 1
      ? 11
      : dealerUpCard.rank >= 10
      ? 10
      : dealerUpCard.rank
    : 7;

  if (evalHand.isBust) return 'stand';

  // Si puede doblar (2 cartas) y la suma es 10 u 11
  if (hand.length === 2 && (evalHand.value === 10 || evalHand.value === 11) && dealerValue < 10) {
    return 'double';
  }

  // Mano suave (con As valor 11)
  if (evalHand.isSoft) {
    if (evalHand.value <= 17) return 'hit';
    if (evalHand.value === 18 && dealerValue >= 9) return 'hit';
    return 'stand';
  }

  // Mano dura
  if (evalHand.value <= 11) return 'hit';
  if (evalHand.value === 12 && (dealerValue <= 3 || dealerValue >= 7)) return 'hit';
  if (evalHand.value >= 13 && evalHand.value <= 16 && dealerValue >= 7) return 'hit';

  return 'stand';
}

/**
 * Inicializador de mesa de Blackjack
 */
export function initBlackjackGame(botCount: number = 1, deckCount: 1 | 2 | 4 = 2): BlackjackGameState {
  const shoe = createBlackjackShoe(deckCount);

  const dealer: BlackjackPlayer = {
    id: 'dealer',
    name: 'Crupier Bloque',
    isHuman: false,
    isDealer: true,
    hands: [{ cards: [], bet: 0, isStood: false, isBusted: false, isDouble: false, isSplit: false }],
    activeHandIndex: 0,
    totalChips: 99999,
  };

  const players: BlackjackPlayer[] = [
    {
      id: 'human-p1',
      name: 'Tú',
      isHuman: true,
      hands: [{ cards: [], bet: 50, isStood: false, isBusted: false, isDouble: false, isSplit: false }],
      activeHandIndex: 0,
      totalChips: 1000,
    },
  ];

  for (let i = 1; i <= botCount; i++) {
    players.push({
      id: `bot-p${i}`,
      name: `Bot Constructor #${i}`,
      isHuman: false,
      hands: [{ cards: [], bet: 50, isStood: false, isBusted: false, isDouble: false, isSplit: false }],
      activeHandIndex: 0,
      totalChips: 1000,
    });
  }

  return {
    shoe,
    players,
    dealer,
    phase: 'dealing',
    activePlayerIndex: 0,
    deckCount,
    logs: ['Mesa de Blackjack lista con ' + (botCount + 1) + ' jugadores.'],
  };
}

/**
 * Reparte las cartas iniciales: 2 a cada jugador y 2 al Crupier (una oculta)
 */
export function dealInitialBlackjackCards(state: BlackjackGameState): BlackjackGameState {
  const shoe = [...state.shoe];

  // Repartir 2 cartas a cada jugador
  for (const player of state.players) {
    const c1 = shoe.pop()!;
    c1.faceUp = true;
    const c2 = shoe.pop()!;
    c2.faceUp = true;
    player.hands[0].cards = [c1, c2];
    player.hands[0].isStood = false;
    player.hands[0].isBusted = false;
  }

  // Repartir 2 al Crupier (primera boca arriba, segunda oculta)
  const d1 = shoe.pop()!;
  d1.faceUp = true;
  const d2 = shoe.pop()!;
  d2.faceUp = false;
  state.dealer.hands[0].cards = [d1, d2];
  state.dealer.hands[0].isStood = false;
  state.dealer.hands[0].isBusted = false;

  return {
    ...state,
    shoe,
    phase: 'player_turns',
    activePlayerIndex: 0,
  };
}
